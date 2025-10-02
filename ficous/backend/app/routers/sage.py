import os
from typing import List, Optional, Any
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from uuid import UUID

from ..database import get_db
from ..security import get_current_user_id
from .. import models
from ..utils import _clean_text
from ..services.embeddings import retrieve_relevant_chunks, update_concept_strength
from ..services.cache import get_cached_response, set_cached_response
from ..services.summaries import update_global_summary, update_discipline_summary
from ..services.circuit_breaker import call_openai_with_retry
from ..utils.sanitization import sanitize_prompt, sanitize_context, validate_sage_input
from ..middleware.rate_limiting import sage_rate_limit, SAGE_ANSWER_LIMITS


router = APIRouter(prefix="/ficous/sage", tags=["ficous-sage"])


class SageProcessIn(BaseModel):
    note_id: Optional[UUID] = None
    raw_content: Optional[str] = Field(default=None, min_length=1)
    normalize: bool = Field(default=False, description="Se true, normaliza/limpa o texto antes de processar")
    output_language: Optional[str] = Field(default="pt-BR", description="Idioma de saída desejado (ex.: pt-BR, en, es)")


class SageProcessOut(BaseModel):
    summary: str
    questions: List[str]


def _call_openai_summarize_and_questions(text: str, output_language: str = "pt-BR") -> SageProcessOut:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        # Fallback simples se falta API key
        summary = (text[:200] + "...") if len(text) > 200 else text
        questions = [
            "Quais são as ideias principais?",
            "Como você aplicaria este conteúdo?",
            "Quais termos precisam de definição?"
        ]
        return SageProcessOut(summary=summary, questions=questions)

    import httpx
    system_prompt = (
        "Você é um assistente que escreve no idioma solicitado. "
        f"Idioma de saída: {output_language}. "
        "Resuma o texto em 2-3 frases e gere 3-5 perguntas objetivas de revisão. "
        "Responda em JSON: {summary: string, questions: string[]}"
    )
    user_prompt = text[:8000]
    payload = {
        "model": "gpt-4o-mini",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        "temperature": 0.2
    }
    headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
    try:
        with httpx.Client(timeout=30) as client:
            resp = client.post("https://api.openai.com/v1/chat/completions", json=payload, headers=headers)
            resp.raise_for_status()
            data = resp.json()
            content = data["choices"][0]["message"]["content"]
    except Exception as e:
        # Fallback mínimo
        summary = (text[:200] + "...") if len(text) > 200 else text
        questions = ["Quais são os tópicos-chave?", "Quais exemplos suportam o conteúdo?"]
        return SageProcessOut(summary=summary, questions=questions)


def _extract_concepts_and_tags(text: str, output_language: str = "pt-BR") -> tuple[list[str], list[str]]:
    """Extrai listas de conceitos e tags via OpenAI; fallback heurístico simples.
    Retorna (concepts, tags).
    """
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        # Fallback heurístico
        import re
        tokens = re.findall(r"[A-Za-zÀ-ÖØ-öø-ÿ0-9_-]{4,}", text, flags=re.UNICODE)
        uniq = []
        seen = set()
        for t in tokens:
            k = t.lower()
            if k not in seen:
                seen.add(k)
                uniq.append(t)
            if len(uniq) >= 10:
                break
        concepts = uniq[:5]
        tags = [u.lower() for u in uniq[:8]]
        return concepts, tags

    import httpx, json
    system_prompt = (
        "Você é um assistente que escreve no idioma solicitado. "
        f"Idioma de saída: {output_language}. "
        "Extraia até 5 conceitos principais e até 8 tags curtas do texto. "
        "Responda em JSON: {concepts: string[], tags: string[]}"
    )
    user_prompt = text[:8000]
    payload = {
        "model": "gpt-4o-mini",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        "temperature": 0.2
    }
    headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
    try:
        with httpx.Client(timeout=30) as client:
            resp = client.post("https://api.openai.com/v1/chat/completions", json=payload, headers=headers)
            resp.raise_for_status()
            data = resp.json()
            content = data["choices"][0]["message"]["content"]
        parsed = json.loads(content)
        concepts = parsed.get("concepts") or []
        tags = parsed.get("tags") or []
        if not isinstance(concepts, list):
            concepts = [str(concepts)]
        if not isinstance(tags, list):
            tags = [str(tags)]
        return [str(c) for c in concepts][:5], [str(t) for t in tags][:8]
    except Exception:
        import re
        tokens = re.findall(r"[A-Za-zÀ-ÖØ-öø-ÿ0-9_-]{4,}", text, flags=re.UNICODE)
        uniq = []
        seen = set()
        for t in tokens:
            k = t.lower()
            if k not in seen:
                seen.add(k)
                uniq.append(t)
            if len(uniq) >= 10:
                break
        return uniq[:5], [u.lower() for u in uniq[:8]]


# --------------------
# Answer (níveis 1/2/3)
# --------------------

class SageAnswerIn(BaseModel):
    # contexto
    note_id: Optional[UUID] = None
    discipline_id: Optional[UUID] = None  # ADICIONADO: campo discipline_id
    raw_context: Optional[str] = Field(default=None, min_length=1)
    # pergunta/comando
    prompt: str = Field(min_length=1, max_length=2000)
    # nível: 1 (balões), 2 (mini-aula), 3 (imersivo)
    level: int = Field(ge=1, le=3, default=1)
    normalize: bool = Field(default=True)
    output_language: Optional[str] = Field(default="pt-BR")


class SageAnswerOut(BaseModel):
    type: str  # level1|level2|level3
    payload: Any


def _build_level_system_prompt(level: int, lang: str) -> str:
    if level == 1:
        return (
            "Você é um assistente que responde no idioma solicitado. "
            f"Idioma de saída: {lang}. "
            "Responda em JSON com balões curtos (2-5 itens), focados e diretos. "
            "Formato: {type: 'level1', payload: {balloons: [{text: string}]}}"
        )
    if level == 2:
        return (
            "Você é um assistente que responde no idioma solicitado. "
            f"Idioma de saída: {lang}. "
            "Crie uma mini-aula com 2-4 slides, cada um com título e 3-5 bullets curtos. "
            "Formato: {type: 'level2', payload: {slides: [{title: string, bullets: string[]}]}}"
        )
    # nível 3
    return (
        "Você é um assistente que responde no idioma solicitado. "
        f"Idioma de saída: {lang}. "
        "Crie uma explicação estruturada com 3-6 seções (Introdução, Conceito, Exemplos, Conexões, Resumo). "
        "Cada seção tem título e conteúdo em parágrafos; quando útil, inclua opcionalmente {code, image_hint}. "
        "Formato: {type: 'level3', payload: {sections: [{title: string, content: string, code?: string, image_hint?: string}]}}"
    )


def _call_openai_answer(context: str, prompt: str, level: int, lang: str) -> SageAnswerOut:
    api_key = os.getenv("OPENAI_API_KEY")
    # Fallback simples sem API: devolve estrutura mínima
    if not api_key:
        if level == 1:
            return SageAnswerOut(type="level1", payload={"balloons": [
                {"text": prompt[:140]}
            ]})
        if level == 2:
            return SageAnswerOut(type="level2", payload={"slides": [
                {"title": "Resumo", "bullets": [prompt[:100]]}
            ]})
        return SageAnswerOut(type="level3", payload={"sections": [
            {"title": "Resumo", "content": prompt[:400]}
        ]})

    import httpx, json
    system_prompt = _build_level_system_prompt(level, lang)
    user_prompt = (
        "Contexto:\n" + context[:6000] + "\n\n" +
        "Solicitação:\n" + prompt[:1500]
    )
    payload = {
        "model": "gpt-4o-mini",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        "temperature": 0.2
    }
    headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
    try:
        with httpx.Client(timeout=40) as client:
            resp = client.post("https://api.openai.com/v1/chat/completions", json=payload, headers=headers)
            resp.raise_for_status()
            data = resp.json()
            content = data["choices"][0]["message"]["content"]
        parsed = json.loads(content)
        # Validação mínima
        t = parsed.get("type") or (f"level{level}")
        pl = parsed.get("payload") or {}
        return SageAnswerOut(type=str(t), payload=pl)
    except Exception:
        # Fallback consistente por nível
        if level == 1:
            return SageAnswerOut(type="level1", payload={"balloons": [
                {"text": "Não foi possível formatar a resposta; aqui vai um resumo curto."}
            ]})
        if level == 2:
            return SageAnswerOut(type="level2", payload={"slides": [
                {"title": "Resumo", "bullets": ["Conteúdo indisponível no momento."]}
            ]})
        return SageAnswerOut(type="level3", payload={"sections": [
            {"title": "Resumo", "content": "Conteúdo indisponível no momento."}
        ]})


@router.post("/answer", response_model=SageAnswerOut)
def answer(
    payload: SageAnswerIn,
    request: Request,
    db: Session = Depends(get_db),
    user_id: UUID = Depends(get_current_user_id)
):
    # 1. Montar contexto principal
    context: Optional[str] = None
    note: Optional[models.Note] = None
    discipline: Optional[models.Discipline] = None
    
    if payload.note_id:
        note = db.query(models.Note).filter(models.Note.id == payload.note_id, models.Note.user_id == user_id).first()
        if not note:
            raise HTTPException(status_code=404, detail="Nota não encontrada")
        context = note.content or ""
        if note.discipline_id:
            discipline = db.query(models.Discipline).filter(models.Discipline.id == note.discipline_id).first()
    elif payload.discipline_id:
        discipline = db.query(models.Discipline).filter(models.Discipline.id == payload.discipline_id, models.Discipline.user_id == user_id).first()
        if not discipline:
            raise HTTPException(status_code=404, detail="Disciplina não encontrada")
        # Para disciplina, pegar resumo das notas
        notes = db.query(models.Note).filter(models.Note.discipline_id == discipline.id, models.Note.user_id == user_id).limit(3).all()
        context = " ".join([n.content[:200] for n in notes if n.content])
    elif payload.raw_context:
        context = payload.raw_context
    else:
        raise HTTPException(status_code=400, detail="Forneça note_id, discipline_id ou raw_context")

    # 1.5. Validar e sanitizar inputs
    is_valid, error_msg = validate_sage_input(payload.prompt, context)
    if not is_valid:
        raise HTTPException(status_code=400, detail=error_msg)
    
    # Sanitizar prompt e contexto
    sanitized_prompt = sanitize_prompt(payload.prompt)
    if context:
        context = sanitize_context(context)
    
    # Normalização opcional
    if payload.normalize and isinstance(context, str):
        try:
            context = _clean_text(context)
        except Exception:
            pass
    
    # Idioma
    lang = (payload.output_language or "pt-BR").strip()
    if len(lang) > 10:
        lang = "pt-BR"

    # 2. Construir Megacontexto (RAG + summaries + conceitos)
    megacontext_parts = []

    # RAG: Recuperar chunks relevantes
    try:
        relevant_chunks = retrieve_relevant_chunks(
            query=sanitized_prompt,
            user_id=str(user_id),
            db=db,
            top_k=3,
            discipline_id=str(discipline.id) if discipline else None
        )
        
        if relevant_chunks:
            rag_context = "Conteúdo relacionado encontrado:\n"
            for chunk in relevant_chunks:
                rag_context += f"- {chunk['chunk_text'][:200]}...\n"
            megacontext_parts.append(rag_context)
    except Exception:
        pass

    # Resumo Global do Usuário
    try:
        global_summary = db.query(models.Summary).filter(
            models.Summary.user_id == user_id,
            models.Summary.scope == "global"
        ).order_by(models.Summary.updated_at.desc()).first()
        if global_summary and global_summary.text:
            megacontext_parts.append(f"Resumo geral do seu conhecimento: {global_summary.text}")
    except Exception:
        pass

    # Resumo da Disciplina
    if discipline:
        try:
            discipline_summary = db.query(models.Summary).filter(
                models.Summary.user_id == user_id,
                models.Summary.scope == "discipline",
                models.Summary.scope_id == discipline.id
            ).order_by(models.Summary.updated_at.desc()).first()
            if discipline_summary and discipline_summary.text:
                megacontext_parts.append(f"Resumo da disciplina '{discipline.name}': {discipline_summary.text}")
        except Exception:
            pass
    
    # Conceitos Fracos (top 3)
    try:
        weak_concepts = db.query(models.UserConceptStat).filter(
            models.UserConceptStat.user_id == user_id
        ).order_by(models.UserConceptStat.strength.asc()).limit(3).all()
        if weak_concepts:
            megacontext_parts.append("Conceitos que você tem dificuldade: " + ", ".join([c.concept for c in weak_concepts]))
    except Exception:
        pass

    # Adicionar contexto principal
    if context:
        megacontext_parts.append(f"Conteúdo principal: {context}")

    final_context = "\n\n".join(megacontext_parts)
    
    # Limitar tamanho do contexto
    max_context_len = int(os.getenv("SAGE_MAX_CONTEXT_CHARS", "16000"))
    final_context = final_context[:max_context_len]

    # 3. Verificar cache
    cached_response = get_cached_response(sanitized_prompt, final_context, "gpt-4o-mini")
    if cached_response:
        # Registrar interação do cache
        try:
            interaction = models.Interaction(
                user_id=user_id,
                note_id=payload.note_id,
                discipline_id=payload.discipline_id,
                prompt=payload.prompt,
                response_meta=cached_response,
                tokens_estimated=0  # Cache hit
            )
            db.add(interaction)
            db.commit()
            return SageAnswerOut(type=cached_response.get("type", "level1"), payload=cached_response.get("payload", {}))
        except Exception:
            pass

    # 4. Chamar IA com circuit breaker
    result = _call_openai_answer(final_context, sanitized_prompt, payload.level, lang)
    
    # 5. Armazenar no cache
    try:
        set_cached_response(sanitized_prompt, final_context, result.model_dump(), "gpt-4o-mini")
    except Exception:
        pass

    # 6. Registrar interação
    try:
        interaction = models.Interaction(
            user_id=user_id,
            note_id=payload.note_id,
            discipline_id=payload.discipline_id,
            prompt=sanitized_prompt,
            response_meta=result.model_dump(),
            tokens_estimated=len(final_context.split()) + len(sanitized_prompt.split()) + 500
        )
        db.add(interaction)
        db.commit()
        db.refresh(interaction)
        
        # Atualizar força de conceitos baseado na interação
        try:
            if note and note.concepts_json:
                for concept in note.concepts_json:
                    update_concept_strength(concept, str(user_id), 0.1, db)
        except Exception:
            pass
        
        return result
    except Exception:
        return result

    # Tentar parsear JSON do modelo; se falhar, fallback simples
    try:
        import json
        parsed = json.loads(content)
        summary = parsed.get("summary") or ""
        questions = parsed.get("questions") or []
        if not isinstance(questions, list):
            questions = [str(questions)]
        if not summary:
            summary = (text[:200] + "...") if len(text) > 200 else text
        return SageProcessOut(summary=summary, questions=[str(q) for q in questions][:5])
    except Exception:
        summary = (text[:200] + "...") if len(text) > 200 else text
        questions = ["Quais são os tópicos-chave?", "Quais exemplos suportam o conteúdo?"]
        return SageProcessOut(summary=summary, questions=questions)


@router.post("/process", response_model=SageProcessOut)
def process_note(
    payload: SageProcessIn,
    db: Session = Depends(get_db),
    user_id: UUID = Depends(get_current_user_id)
):
    text: Optional[str] = None
    note: Optional[models.Note] = None
    if payload.note_id:
        note = db.query(models.Note).filter(models.Note.id == payload.note_id, models.Note.user_id == user_id).first()
        if not note:
            raise HTTPException(status_code=404, detail="Nota não encontrada")
        text = note.content
    elif payload.raw_content:
        # limite simples para evitar payloads gigantes
        max_len = int(os.getenv("SAGE_MAX_INPUT_CHARS", "12000"))
        text = payload.raw_content[:max_len]
    else:
        raise HTTPException(status_code=400, detail="Forneça note_id ou raw_content")

    # Normalização opcional antes do processamento
    if payload.normalize and isinstance(text, str):
        try:
            text = _clean_text(text)
        except Exception:
            pass
        # reaplicar limite após limpeza
        max_len = int(os.getenv("SAGE_MAX_INPUT_CHARS", "12000"))
        text = text[:max_len]

    # idioma solicitado (sanitização simples)
    lang = (payload.output_language or "pt-BR").strip()
    if len(lang) > 10:
        lang = "pt-BR"
    result = _call_openai_summarize_and_questions(text, output_language=lang)

    if note:
        note.summary = result.summary
        note.questions_json = result.questions
        db.commit()
        db.refresh(note)

    return result


