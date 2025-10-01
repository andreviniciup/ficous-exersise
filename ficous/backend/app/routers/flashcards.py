from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from datetime import datetime, timedelta, timezone
from typing import List

from ..database import get_db
from ..security import get_current_user_id
from .. import models, schemas
from .sage import _call_openai_answer


router = APIRouter(prefix="/ficous/flashcards", tags=["ficous-flashcards"])


@router.get("/", response_model=List[schemas.FlashcardOut])
def list_flashcards(
    db: Session = Depends(get_db),
    user_id: UUID = Depends(get_current_user_id)
):
    items = db.query(models.Flashcard).filter(models.Flashcard.user_id == user_id).order_by(models.Flashcard.created_at.desc()).all()
    return items


@router.post("/", response_model=schemas.FlashcardOut)
def create_flashcard(
    payload: schemas.FlashcardCreate,
    db: Session = Depends(get_db),
    user_id: UUID = Depends(get_current_user_id)
):
    item = models.Flashcard(
        user_id=user_id,
        discipline_id=payload.discipline_id,
        note_id=payload.note_id,
        question=payload.question,
        answer=payload.answer
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.post("/generate", response_model=List[schemas.FlashcardOut])
def generate_flashcards(
    payload: schemas.FlashcardGenerateIn,
    db: Session = Depends(get_db),
    user_id: UUID = Depends(get_current_user_id)
):
    # montar contexto
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

    # usar answer level2 para gerar conteúdo estruturado e derivar flashcards simples
    lang = (payload.output_language or "pt-BR").strip()
    result = _call_openai_answer(context, f"Gere {payload.qty} flashcards (pergunta e resposta).", level=2, lang=lang)

    cards: List[models.Flashcard] = []
    # Esperamos slides com bullets ou payload livre; fallback: um card básico
    try:
        data = result.payload
        slides = data.get("slides") or []
        count = 0
        for sl in slides:
            bullets = sl.get("bullets") or []
            for b in bullets:
                if "?" in b and count < payload.qty:
                    q = b.strip()
                    a = ""  # sem resposta fornecida; poderá ser refinada
                    card = models.Flashcard(user_id=user_id, question=q, answer=a)
                    cards.append(card)
                    count += 1
        if not cards:
            # fallback: um card simples
            cards.append(models.Flashcard(user_id=user_id, question="Resumo?", answer=""))
    except Exception:
        cards.append(models.Flashcard(user_id=user_id, question="Resumo?", answer=""))

    for c in cards:
        db.add(c)
    db.commit()
    for c in cards:
        db.refresh(c)
    return cards


@router.get("/review", response_model=List[schemas.FlashcardOut])
def review_list(
    db: Session = Depends(get_db),
    user_id: UUID = Depends(get_current_user_id)
):
    now = datetime.now(timezone.utc)
    items = db.query(models.Flashcard).filter(
        models.Flashcard.user_id == user_id,
        (models.Flashcard.next_review_at == None) | (models.Flashcard.next_review_at <= now)
    ).order_by(models.Flashcard.next_review_at.asc().nullsfirst()).limit(50).all()
    return items


@router.post("/{card_id}/grade", response_model=schemas.FlashcardOut)
def grade_card(
    card_id: UUID,
    payload: schemas.FlashcardGradeIn,
    db: Session = Depends(get_db),
    user_id: UUID = Depends(get_current_user_id)
):
    card = db.query(models.Flashcard).filter(models.Flashcard.id == card_id, models.Flashcard.user_id == user_id).first()
    if not card:
        raise HTTPException(status_code=404, detail="Card não encontrado")

    # SM-2 simplificado
    grade = payload.grade
    card.ease = grade
    now = datetime.now(timezone.utc)

    if grade == "easy":
        card.interval_days = "4"
        card.next_review_at = now + timedelta(days=4)
    elif grade == "medium":
        card.interval_days = "2"
        card.next_review_at = now + timedelta(days=2)
    else:
        card.interval_days = "1"
        card.next_review_at = now + timedelta(days=1)

    db.commit()
    db.refresh(card)
    return card


