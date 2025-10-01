from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from datetime import datetime, timezone

from ..database import get_db
from ..security import get_current_user_id
from .. import models
from .sage import _call_openai_answer


router = APIRouter(prefix="/ficous/progress", tags=["ficous-progress"])


@router.get("/overview")
def overview(
    db: Session = Depends(get_db),
    user_id: UUID = Depends(get_current_user_id)
):
    notes_count = db.query(models.Note).filter(models.Note.user_id == user_id).count()
    flashcards_count = db.query(models.Flashcard).filter(models.Flashcard.user_id == user_id).count()
    exercises_count = db.query(models.Exercise).filter(models.Exercise.user_id == user_id).count()

    now = datetime.now(timezone.utc)
    due_cards = db.query(models.Flashcard).filter(
        models.Flashcard.user_id == user_id,
        (models.Flashcard.next_review_at == None) | (models.Flashcard.next_review_at <= now)
    ).count()

    next_card = db.query(models.Flashcard).filter(models.Flashcard.user_id == user_id, models.Flashcard.next_review_at != None).order_by(models.Flashcard.next_review_at.asc()).first()
    next_review_at = next_card.next_review_at.isoformat() if next_card and next_card.next_review_at else None

    return {
        "success": True,
        "data": {
            "counts": {
                "notes": notes_count,
                "flashcards": flashcards_count,
                "exercises": exercises_count
            },
            "reviews": {
                "due_flashcards": due_cards,
                "next_review_at": next_review_at
            }
        }
    }


@router.get("/insights")
def insights(
    db: Session = Depends(get_db),
    user_id: UUID = Depends(get_current_user_id)
):
    # Montar um contexto curto a partir dos últimos itens do usuário
    latest_notes = db.query(models.Note).filter(models.Note.user_id == user_id).order_by(models.Note.created_at.desc()).limit(3).all()
    ctx_parts = []
    for n in latest_notes:
        if n.summary:
            ctx_parts.append(n.summary)
        elif n.content:
            ctx_parts.append((n.content or "")[:500])
    context = "\n".join(ctx_parts)[:2000] if ctx_parts else ""

    prompt = "Gere 2-3 insights objetivos sobre estudo/progresso e uma sugestão de próxima ação. Responda em JSON: {insights: string[], next_action: string}"
    lang = "pt-BR"

    try:
        result = _call_openai_answer(context, prompt, level=1, lang=lang)
        payload = result.payload or {}
        # Tentar mapear balloons -> insights
        balloons = payload.get("balloons") or []
        insights_list = [b.get("text") for b in balloons if isinstance(b, dict) and b.get("text")]
        if not insights_list:
            insights_list = ["Mantenha consistência nas revisões.", "Priorize tópicos com maior dificuldade."]
        next_action = "Revise seus flashcards vencidos hoje." if insights_list else ""
        return {"success": True, "data": {"insights": insights_list[:3], "next_action": next_action}}
    except Exception:
        return {"success": True, "data": {"insights": ["Continue praticando diariamente.", "Crie flashcards para os conceitos-chave."], "next_action": "Revise 5 flashcards agora."}}


