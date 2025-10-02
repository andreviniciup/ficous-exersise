from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List

from ..database import get_db
from ..security import get_current_user_id
from .. import models, schemas
from .sage import _call_openai_answer
from .library import upload_source  # referência para contexto de source (somente uso de modelo de dados)
from ..utils import extract_text_from_pdf_bytes
from ..models import Source
from ..services.embeddings import _get_embedding
from sklearn.metrics.pairwise import cosine_similarity
import json


router = APIRouter(prefix="/ficous/exercises", tags=["ficous-exercises"])


@router.post("/", response_model=schemas.ExerciseOut)
def create_exercise(
    payload: schemas.ExerciseCreate,
    db: Session = Depends(get_db),
    user_id: UUID = Depends(get_current_user_id)
):
    ex = models.Exercise(
        user_id=user_id,
        discipline_id=payload.discipline_id,
        note_id=payload.note_id,
        title=payload.title,
        meta_json=payload.meta_json
    )
    db.add(ex)
    db.commit()
    db.refresh(ex)

    for it in payload.items:
        item = models.ExerciseItem(
            exercise_id=ex.id,
            question=it.question,
            kind=it.kind,
            options_json=it.options_json,
            answer_json=it.answer_json
        )
        db.add(item)
    db.commit()
    return ex


@router.get("/", response_model=List[schemas.ExerciseOut])
def list_exercises(
    kind: str | None = Query(default=None, description="mcq|open|mix"),
    difficulty: str | None = Query(default=None, description="easy|medium|hard"),
    tag: str | None = None,
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),
    user_id: UUID = Depends(get_current_user_id)
):
    q = db.query(models.Exercise).filter(models.Exercise.user_id == user_id)
    # filtros via meta_json (best-effort)
    if kind:
        q = q.filter(models.Exercise.meta_json["kind"].astext == kind)
    if difficulty:
        q = q.filter(models.Exercise.meta_json["difficulty"].astext == difficulty)
    if tag:
        q = q.filter(models.Exercise.meta_json["tags"].astext.contains(tag))
    q = q.order_by(models.Exercise.created_at.desc()).limit(limit).offset(offset)
    return q.all()


@router.get("/{exercise_id}", response_model=schemas.ExerciseDetailOut)
def get_exercise_detail(
    exercise_id: UUID,
    db: Session = Depends(get_db),
    user_id: UUID = Depends(get_current_user_id)
):
    ex = db.query(models.Exercise).filter(models.Exercise.id == exercise_id, models.Exercise.user_id == user_id).first()
    if not ex:
        raise HTTPException(status_code=404, detail="Exercício não encontrado")
    items = db.query(models.ExerciseItem).filter(models.ExerciseItem.exercise_id == exercise_id).order_by(models.ExerciseItem.created_at.asc()).all()
    # Montar manualmente o schema de detalhe
    data = schemas.ExerciseDetailOut(
        id=ex.id,
        discipline_id=ex.discipline_id,
        note_id=ex.note_id,
        title=ex.title,
        meta_json=ex.meta_json,
        items=[schemas.ExerciseItemOut.from_orm(it) for it in items]
    )
    return data

@router.post("/evaluate", response_model=schemas.ExerciseEvaluateOut)
def evaluate_open_answer(
    payload: schemas.ExerciseEvaluateIn,
    db: Session = Depends(get_db),
    user_id: UUID = Depends(get_current_user_id)
):
    item = db.query(models.ExerciseItem).join(models.Exercise, models.ExerciseItem.exercise_id == models.Exercise.id).filter(
        models.ExerciseItem.id == payload.item_id,
        models.Exercise.user_id == user_id
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item não encontrado")
    if item.kind != "open":
        raise HTTPException(status_code=400, detail="Avaliação semântica é apenas para questões abertas")

    # Extrair resposta modelo e conceitos
    model_answer = None
    key_concepts: List[str] = []
    try:
        ans = item.answer_json or {}
        if isinstance(ans, str):
            ans = json.loads(ans)
        model_answer = ans.get("model_answer") or ""
        key_concepts = ans.get("key_concepts") or []
    except Exception:
        model_answer = ""
        key_concepts = []

    # Embeddings e similaridade
    ref_text = model_answer if model_answer else item.question
    vec_ref = _get_embedding(ref_text)
    vec_ans = _get_embedding(payload.answer_text)
    sim = float(cosine_similarity([vec_ans], [vec_ref])[0][0])

    # Threshold por dificuldade
    thresholds = {"easy": 0.65, "medium": 0.70, "hard": 0.75}
    th = thresholds.get(payload.difficulty or "medium", 0.70)

    # Heurística simples de score 0-10
    score = max(0, min(10, int(round((sim - th + 0.3) / 0.3 * 10))))  # janela de 0.3 acima do threshold

    # Feedback básico baseado em conceitos ausentes
    missing = []
    for concept in key_concepts:
        if concept.lower() not in (payload.answer_text or "").lower():
            missing.append(concept)
    feedback = "Boa resposta." if not missing else f"Faltou abordar: {', '.join(missing)}"

    return schemas.ExerciseEvaluateOut(
        similarity=sim,
        score=score,
        feedback=feedback,
        missing_concepts=missing
    )


@router.post("/{exercise_id}/grade", response_model=schemas.ExerciseGradeOut)
def grade_exercise(
    exercise_id: UUID,
    payload: schemas.ExerciseGradeIn,
    db: Session = Depends(get_db),
    user_id: UUID = Depends(get_current_user_id)
):
    ex = db.query(models.Exercise).filter(models.Exercise.id == exercise_id, models.Exercise.user_id == user_id).first()
    if not ex:
        raise HTTPException(status_code=404, detail="Exercício não encontrado")

    items = db.query(models.ExerciseItem).filter(models.ExerciseItem.exercise_id == exercise_id).all()
    id_to_item = {str(it.id): it for it in items}

    results: List[schemas.ItemResult] = []
    total = 0
    got = 0
    answers = payload.answers_json or []
    for ans in answers:
        item_id = str(ans.get("item_id"))
        item = id_to_item.get(item_id)
        if not item:
            continue
        if item.kind == "mcq":
            # validar
            try:
                ref = item.answer_json or {}
                if isinstance(ref, str):
                    ref = json.loads(ref)
                correct_index = ref.get("correct_index")
                explanation = ref.get("explanation")
            except Exception:
                correct_index = None
                explanation = None
            user_idx = ans.get("answer_index")
            is_correct = (correct_index is not None and user_idx == correct_index)
            results.append(schemas.ItemResult(item_id=item.id, correct=is_correct, explanation=explanation))
            total += 1
            if is_correct:
                got += 1
        else:
            # open
            user_text = ans.get("answer_text") or ""
            # dificuldade por item (meta) opcional
            difficulty = None
            try:
                meta = (item.answer_json or {}).get("meta") if isinstance(item.answer_json, dict) else None
                if isinstance(meta, dict):
                    difficulty = meta.get("difficulty")
            except Exception:
                difficulty = None
            eval_out = evaluate_open_answer(
                schemas.ExerciseEvaluateIn(item_id=item.id, answer_text=user_text, difficulty=difficulty or "medium"),
                db=db, user_id=user_id
            )
            results.append(schemas.ItemResult(item_id=item.id, similarity=eval_out.similarity, score=eval_out.score, feedback=eval_out.feedback))
            total += 1
            got += eval_out.score / 10

    percent = 0.0 if total == 0 else float(got) / float(total)
    score_obj = {"raw": got, "max": total, "percent": percent}

    return schemas.ExerciseGradeOut(exercise_id=exercise_id, score=score_obj, items_results=results)

@router.post("/generate", response_model=schemas.ExerciseOut)
def generate_exercise(
    payload: schemas.ExerciseGenerateIn,
    db: Session = Depends(get_db),
    user_id: UUID = Depends(get_current_user_id)
):
    context = None
    if payload.note_id:
        note = db.query(models.Note).filter(models.Note.id == payload.note_id, models.Note.user_id == user_id).first()
        if not note:
            raise HTTPException(status_code=404, detail="Nota não encontrada")
        context = note.content or ""
    elif payload.source_id:
        src = db.query(Source).filter(Source.id == payload.source_id, Source.user_id == user_id).first()
        if not src:
            raise HTTPException(status_code=404, detail="Fonte não encontrada")
        context = (src.content_excerpt or "").strip()
        if not context:
            # fallback leve: sem carregar arquivo todo; usamos excerpt já salvo no upload
            raise HTTPException(status_code=400, detail="Fonte sem conteúdo extraído. Refaça upload com PDF válido.")
    elif payload.raw_context:
        context = payload.raw_context
    else:
        raise HTTPException(status_code=400, detail="Forneça note_id, raw_context ou source_id")

    lang = (payload.output_language or "pt-BR").strip()
    qty = payload.qty
    kind = payload.kind
    difficulty = payload.difficulty or "medium"

    # Pedir ao Sage itens de exercício estruturados em JSON
    style_part = f" estilo {payload.style}." if payload.style else ""
    subject_part = f" assunto {payload.subject}." if payload.subject else ""
    # Parâmetros inteligentes
    pattern_mode = payload.pattern_mode or "auto"
    closed_format = payload.closed_format or "auto"
    fallback_mode = payload.fallback or "open"

    prompt = (
        f"Gere {qty} questões (kind={kind}, difficulty={difficulty}, pattern_mode={pattern_mode}, closed_format={closed_format})"
        f"{subject_part}{style_part} em JSON estrito: "
        "{items: [ {question: string, kind: 'mcq'|'open'|'vf'|'multi', options?: string[], answer?: string, "
        "mcq?: {correct_index?: 0..9, correct_indices?: number[], explanation?: string}, "
        "vf?: {correct_vf: boolean, explanation?: string}, "
        "open?: {model_answer: string, key_concepts: string[]} } ]}. "
        "Se pattern_mode='strict' e closed_format='mcq', gere MCQ com 4 opções e 1 correta. "
        "Se pattern_mode='auto', detecte padrões do contexto; se não houver padrão, gere 'open' com key_concepts (mín. 2)."
    )
    result = _call_openai_answer(context, prompt, level=2, lang=lang)

    ex = models.Exercise(user_id=user_id, title="Exercícios gerados", meta_json={"qty": qty, "kind": kind, "difficulty": difficulty, "subject": payload.subject, "style": payload.style, "status": "ready"})
    db.add(ex)
    db.commit()
    db.refresh(ex)

    try:
        data = result.payload or {}
        raw_items = data.get("items") or []
        # Compatibilidade: alguns modelos retornam 'slides/bullets'
        if not raw_items and data.get("slides"):
            raw_items = []
            for sl in (data.get("slides") or []):
                for b in (sl.get("bullets") or []):
                    raw_items.append({"question": str(b), "kind": "open"})

        created = 0
        valid_closed = 0
        for r in raw_items:
            q = (r.get("question") or "").strip()
            k = (r.get("kind") or "open").strip()
            if not q:
                continue
            if kind == "closed":
                k = "mcq"
            elif kind == "open":
                k = "open"

            if k == "mcq":
                options = r.get("options") or r.get("options_json") or []
                # Em modo strict: exigir 4 opções e 1 correta
                if pattern_mode == "strict":
                    if not isinstance(options, list) or len(options) != 4:
                        continue
                # Em modo auto: aceitar 2..6 opções
                if not isinstance(options, list) or len(options) < 2:
                    continue
                if len(options) > 6:
                    options = options[:6]
                mcq = r.get("mcq") or {}
                if isinstance(mcq, str):
                    try:
                        mcq = json.loads(mcq)
                    except Exception:
                        mcq = {}
                correct_index = mcq.get("correct_index")
                correct_indices = mcq.get("correct_indices")
                explanation = mcq.get("explanation") or r.get("explanation")
                if pattern_mode == "strict":
                    if not isinstance(correct_index, int) or correct_index < 0 or correct_index > 3:
                        continue
                    ans = {"correct_index": correct_index, "explanation": explanation or ""}
                else:
                    if correct_index is not None and isinstance(correct_index, int):
                        ans = {"correct_index": correct_index, "explanation": explanation or ""}
                    elif isinstance(correct_indices, list) and len(correct_indices) >= 1:
                        ans = {"correct_indices": correct_indices, "explanation": explanation or ""}
                    else:
                        # sem gabarito claro, tratar como aberta orientada
                        open_ans = {"model_answer": r.get("answer") or "", "key_concepts": []}
                        db.add(models.ExerciseItem(exercise_id=ex.id, question=q, kind="open", answer_json=open_ans))
                        created += 1
                        continue
                db.add(models.ExerciseItem(exercise_id=ex.id, question=q, kind="mcq", options_json=options, answer_json=ans))
                created += 1
                valid_closed += 1
            else:
                # open
                open_data = r.get("open") or {}
                if isinstance(open_data, str):
                    try:
                        open_data = json.loads(open_data)
                    except Exception:
                        open_data = {}
                model_answer = open_data.get("model_answer") or r.get("answer") or ""
                key_concepts = open_data.get("key_concepts") or []
                if not key_concepts or len(key_concepts) < 2:
                    # pequena heurística: extrair 2 palavras-chave do enunciado se faltar
                    words = [w for w in q.split() if len(w) > 4][:2]
                    if words:
                        key_concepts = words
                ans = {"model_answer": model_answer, "key_concepts": key_concepts}
                db.add(models.ExerciseItem(exercise_id=ex.id, question=q, kind="open", answer_json=ans))
                created += 1

            if created >= qty:
                break

        # Fallback se poucos closed válidos em modo auto
        if pattern_mode == "auto" and kind in ("closed", "mix") and valid_closed < max(1, int(0.6 * qty)):
            # Completar com abertas ou tópicos
            missing = qty - created
            if missing > 0:
                for _ in range(missing):
                    if fallback_mode == "topics":
                        # tópico orientativo a partir de subject/style ou palavras do contexto
                        topic_q = f"Estude os tópicos principais de {payload.subject or 'conteúdo'}"
                        ans = {"key_concepts": []}
                        db.add(models.ExerciseItem(exercise_id=ex.id, question=topic_q, kind="open", answer_json=ans))
                    else:
                        db.add(models.ExerciseItem(exercise_id=ex.id, question="Explique o conceito principal.", kind="open", answer_json={"model_answer": "", "key_concepts": []}))
                created = qty

        if created == 0:
            db.add(models.ExerciseItem(exercise_id=ex.id, question="Explique o conceito principal.", kind="open", answer_json={"model_answer": "", "key_concepts": []}))
        db.commit()
    except Exception:
        db.add(models.ExerciseItem(exercise_id=ex.id, question="Explique o conceito principal.", kind="open"))
        db.commit()

    return ex


@router.post("/{exercise_id}/submit", response_model=schemas.ExerciseOut)
def submit_exercise(
    exercise_id: UUID,
    payload: schemas.ExerciseSubmitIn,
    db: Session = Depends(get_db),
    user_id: UUID = Depends(get_current_user_id)
):
    ex = db.query(models.Exercise).filter(models.Exercise.id == exercise_id, models.Exercise.user_id == user_id).first()
    if not ex:
        raise HTTPException(status_code=404, detail="Exercício não encontrado")

    attempt = models.ExerciseAttempt(exercise_id=exercise_id, user_id=user_id, answers_json=payload.answers_json)
    db.add(attempt)
    db.commit()
    db.refresh(ex)
    return ex


