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
    from ..services.exercise_processing import evaluate_open_answer_semantic
    
    # Buscar item
    item = db.query(models.ExerciseItem).join(
        models.Exercise, 
        models.ExerciseItem.exercise_id == models.Exercise.id
    ).filter(
        models.ExerciseItem.id == payload.item_id,
        models.Exercise.user_id == user_id
    ).first()
    
    if not item:
        raise HTTPException(status_code=404, detail="Item não encontrado")
    
    if item.kind != "open":
        raise HTTPException(
            status_code=400, 
            detail="Avaliação semântica é apenas para questões abertas"
        )
    
    # Extrair dados da resposta modelo
    try:
        ans = item.answer_json or {}
        if isinstance(ans, str):
            ans = json.loads(ans)
        
        reference_embedding_json = ans.get("reference_embedding")
        if not reference_embedding_json:
            # Fallback: gerar embedding agora
            model_answer = ans.get("model_answer", "")
            reference_text = model_answer if model_answer else item.question
            from ..services.embeddings import _get_embedding
            reference_embedding = _get_embedding(reference_text)
        else:
            reference_embedding = json.loads(reference_embedding_json)
        
        key_concepts = ans.get("key_concepts", [])
        similarity_threshold = ans.get("similarity_threshold", 0.70)
        
    except Exception:
        raise HTTPException(
            status_code=500, 
            detail="Erro ao processar resposta modelo"
        )
    
    # Avaliar usando pipeline de pós-processamento
    evaluation = evaluate_open_answer_semantic(
        student_answer=payload.answer_text,
        reference_embedding=reference_embedding,
        key_concepts=key_concepts,
        similarity_threshold=similarity_threshold
    )
    
    return schemas.ExerciseEvaluateOut(
        similarity=evaluation["similarity"],
        score=evaluation["score"],
        feedback=evaluation["feedback"],
        missing_concepts=evaluation["missing_concepts"]
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
    # 1. OBTER CONTEXTO
    context = None
    if payload.note_id:
        note = db.query(models.Note).filter(
            models.Note.id == payload.note_id, 
            models.Note.user_id == user_id
        ).first()
        if not note:
            raise HTTPException(status_code=404, detail="Nota não encontrada")
        context = note.content or ""
    elif payload.source_id:
        src = db.query(models.Source).filter(
            models.Source.id == payload.source_id, 
            models.Source.user_id == user_id
        ).first()
        if not src:
            raise HTTPException(status_code=404, detail="Fonte não encontrada")
        context = (src.content_excerpt or "").strip()
        if not context:
            raise HTTPException(
                status_code=400, 
                detail="Fonte sem conteúdo extraído. Refaça upload com PDF válido."
            )
    elif payload.raw_context:
        context = payload.raw_context
    else:
        raise HTTPException(
            status_code=400, 
            detail="Forneça note_id, raw_context ou source_id"
        )

    # 2. PRÉ-PROCESSAMENTO
    from ..services.exercise_processing import (
        preprocess_exercise_content,
        detect_question_patterns,
        postprocess_mcq_questions,
        postprocess_open_questions
    )
    
    preprocessed = preprocess_exercise_content(context)
    
    if not preprocessed["validation"]["valid"]:
        raise HTTPException(
            status_code=400,
            detail=preprocessed["validation"]["reason"]
        )
    
    clean_context = preprocessed["clean_text"]
    topics = preprocessed["topics"]
    entities = preprocessed["entities"]
    
    # 3. DETECÇÃO DE PADRÕES (se pattern_mode='auto')
    pattern_mode = payload.pattern_mode or "auto"
    if pattern_mode == "auto":
        pattern_info = detect_question_patterns(clean_context)
        # Ajustar closed_format baseado no padrão detectado
        if pattern_info["confidence"] > 0.6:
            payload.closed_format = pattern_info["recommended_format"]
    
    # 4. PREPARAR PROMPT ENRIQUECIDO
    lang = (payload.output_language or "pt-BR").strip()
    qty = payload.qty
    kind = payload.kind
    difficulty = payload.difficulty or "medium"
    
    style_part = f" estilo {payload.style}." if payload.style else ""
    subject_part = f" assunto {payload.subject}." if payload.subject else ""
    
    # Adicionar tópicos extraídos ao prompt
    topics_hint = f" Tópicos identificados: {', '.join(topics)}." if topics else ""
    
    prompt = (
        f"Gere {qty} questões (kind={kind}, difficulty={difficulty}, "
        f"pattern_mode={pattern_mode}, closed_format={payload.closed_format})"
        f"{subject_part}{style_part}{topics_hint} em JSON estrito:\n"
        "{\n"
        '  "items": [\n'
        '    {\n'
        '      "question": "string",\n'
        '      "kind": "mcq|open|vf",\n'
        '      "options": ["opt1", "opt2", ...],  // para mcq/vf\n'
        '      "mcq": {\n'
        '        "correct_index": 0,\n'
        '        "explanation": "string"\n'
        '      },\n'
        '      "open": {\n'
        '        "model_answer": "string",\n'
        '        "key_concepts": ["conceito1", "conceito2"]\n'
        '      }\n'
        '    }\n'
        '  ]\n'
        '}\n\n'
        f"Regras:\n"
        f"- Se pattern_mode='strict' e closed_format='mcq': gere MCQ com exatamente 4 opções e 1 correta\n"
        f"- Se pattern_mode='auto': detecte padrões do contexto; sem padrão claro → gere 'open'\n"
        f"- Para questões 'open': sempre inclua pelo menos 2 key_concepts\n"
        f"- Dificuldade '{difficulty}': ajuste complexidade adequadamente\n"
    )
    
    # 5. CHAMADA À IA
    result = _call_openai_answer(clean_context, prompt, level=2, lang=lang)
    
    # 6. PÓS-PROCESSAMENTO
    try:
        data = result.payload or {}
        raw_items = data.get("items") or []
        
        # Separar por tipo
        mcq_items = [item for item in raw_items if item.get("kind") == "mcq"]
        open_items = [item for item in raw_items if item.get("kind") == "open"]
        
        # Validar MCQs
        validated_mcq = postprocess_mcq_questions(mcq_items, pattern_mode, difficulty)
        
        # Processar questões abertas
        processed_open = postprocess_open_questions(open_items, difficulty)
        
        # Combinar
        final_items = validated_mcq + processed_open
        
        # Fallback se muito poucas questões válidas
        if len(final_items) < max(1, int(0.5 * qty)):
            # Completar com questões abertas genéricas
            missing = qty - len(final_items)
            for topic in topics[:missing]:
                final_items.append({
                    "question": f"Explique o conceito de {topic} e sua aplicação prática.",
                    "kind": "open",
                    "answer_json": {
                        "model_answer": "",
                        "key_concepts": [topic],
                        "meta": {"difficulty": difficulty, "generated_fallback": True}
                    }
                })
        
    except Exception as e:
        # Fallback total em caso de erro
        final_items = [{
            "question": "Explique os conceitos principais do conteúdo fornecido.",
            "kind": "open",
            "answer_json": {
                "model_answer": "",
                "key_concepts": topics[:3] if topics else [],
                "meta": {"difficulty": difficulty, "error_fallback": True}
            }
        }]
    
    # 7. SALVAR NO BANCO
    ex = models.Exercise(
        user_id=user_id,
        discipline_id=payload.discipline_id if hasattr(payload, 'discipline_id') else None,
        note_id=payload.note_id,
        title=f"Exercícios: {payload.subject or 'Geral'}",
        meta_json={
            "qty": qty,
            "kind": kind,
            "difficulty": difficulty,
            "subject": payload.subject,
            "style": payload.style,
            "status": "ready",
            "preprocessing": {
                "topics": topics,
                "entities": entities,
                "word_count": preprocessed["validation"]["word_count"]
            }
        }
    )
    db.add(ex)
    db.commit()
    db.refresh(ex)
    
    # Adicionar items
    for item_data in final_items[:qty]:
        item = models.ExerciseItem(
            exercise_id=ex.id,
            question=item_data["question"],
            kind=item_data["kind"],
            options_json=item_data.get("options"),
            answer_json=item_data.get("answer_json", item_data.get("mcq"))
        )
        db.add(item)
    
    db.commit()
    db.refresh(ex)
    
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


