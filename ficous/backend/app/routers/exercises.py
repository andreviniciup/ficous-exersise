from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List

from ..database import get_db
from ..security import get_current_user_id
from .. import models, schemas
from .sage import _call_openai_answer


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
    elif payload.raw_context:
        context = payload.raw_context
    else:
        raise HTTPException(status_code=400, detail="Forneça note_id ou raw_context")

    lang = (payload.output_language or "pt-BR").strip()
    qty = payload.qty
    kind = payload.kind

    # Pedir ao Sage itens de exercício estruturados em JSON
    prompt = f"Gere {qty} questões do tipo {kind} (mcq=open-ended se 'mix'), com JSON: {{items: [{{question, kind, options?: string[], answer?: string}}]}}."
    result = _call_openai_answer(context, prompt, level=2, lang=lang)

    ex = models.Exercise(user_id=user_id, title="Exercícios gerados", meta_json={"qty": qty, "kind": kind})
    db.add(ex)
    db.commit()
    db.refresh(ex)

    try:
        items = (result.payload or {}).get("slides") or []
        # Interpretar slides->bullets como perguntas; fallback: um item
        count = 0
        for sl in items:
            bullets = sl.get("bullets") or []
            for b in bullets:
                q = str(b)
                k = "open"
                if "?" in q:
                    k = "open"
                it = models.ExerciseItem(exercise_id=ex.id, question=q, kind=k)
                db.add(it)
                count += 1
                if count >= qty:
                    break
            if count >= qty:
                break
        if count == 0:
            db.add(models.ExerciseItem(exercise_id=ex.id, question="Explique o conceito principal.", kind="open"))
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


