from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from ..database import get_db
from ..security import get_current_user_id
from .. import models, schemas
from .sage import _call_openai_summarize_and_questions, _extract_concepts_and_tags
from ..services.embeddings import index_note_content
import os


router = APIRouter(prefix="/ficous/notes", tags=["ficous-notes"])


@router.get("/", response_model=List[schemas.NoteOut])
def list_notes(
    db: Session = Depends(get_db),
    user_id: UUID = Depends(get_current_user_id)
):
    items = db.query(models.Note).filter(models.Note.user_id == user_id).order_by(models.Note.created_at.desc()).all()
    return items


@router.get("/{note_id}", response_model=schemas.NoteOut)
def get_note(
    note_id: UUID,
    db: Session = Depends(get_db),
    user_id: UUID = Depends(get_current_user_id)
):
    item = db.query(models.Note).filter(models.Note.id == note_id, models.Note.user_id == user_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Nota não encontrada")
    return item


@router.post("/", response_model=schemas.NoteOut)
def create_note(
    payload: schemas.NoteCreate,
    db: Session = Depends(get_db),
    user_id: UUID = Depends(get_current_user_id)
):
    item = models.Note(
        user_id=user_id,
        discipline_id=payload.discipline_id,
        title=payload.title,
        content=payload.content
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    # Auto-processamento (resumo, perguntas, conceitos, tags)
    if os.getenv("SAGE_AUTO_PROCESS", "true").lower() == "true":
        lang = os.getenv("SAGE_DEFAULT_LANG", "pt-BR")
        res = _call_openai_summarize_and_questions(item.content, output_language=lang)
        concepts, tags = _extract_concepts_and_tags(item.content, output_language=lang)
        item.summary = res.summary
        item.questions_json = res.questions
        item.concepts_json = concepts
        item.tags_json = tags
        db.commit()
        db.refresh(item)
        
        # Indexar para embeddings (RAG)
        try:
            index_note_content(item, db)
        except Exception as e:
            print(f"Erro ao indexar nota {item.id} para embeddings: {e}")
    return item


@router.put("/{note_id}", response_model=schemas.NoteOut)
def update_note(
    note_id: UUID,
    payload: schemas.NoteUpdate,
    db: Session = Depends(get_db),
    user_id: UUID = Depends(get_current_user_id)
):
    item = db.query(models.Note).filter(models.Note.id == note_id, models.Note.user_id == user_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Nota não encontrada")
    if payload.discipline_id is not None:
        item.discipline_id = payload.discipline_id
    if payload.title is not None:
        item.title = payload.title
    if payload.content is not None:
        item.content = payload.content
    if payload.summary is not None:
        item.summary = payload.summary
    if payload.questions_json is not None:
        item.questions_json = payload.questions_json
    if payload.tags_json is not None:
        item.tags_json = payload.tags_json
    if payload.concepts_json is not None:
        item.concepts_json = payload.concepts_json
    db.commit()
    db.refresh(item)
    # Auto-processamento se o conteúdo foi alterado
    if payload.content is not None and os.getenv("SAGE_AUTO_PROCESS", "true").lower() == "true":
        lang = os.getenv("SAGE_DEFAULT_LANG", "pt-BR")
        res = _call_openai_summarize_and_questions(item.content, output_language=lang)
        concepts, tags = _extract_concepts_and_tags(item.content, output_language=lang)
        item.summary = res.summary
        item.questions_json = res.questions
        item.concepts_json = concepts
        item.tags_json = tags
        db.commit()
        db.refresh(item)
        
        # Re-indexar para embeddings (RAG)
        try:
            index_note_content(item, db)
        except Exception as e:
            print(f"Erro ao re-indexar nota {item.id} para embeddings: {e}")
    return item


@router.delete("/{note_id}", status_code=204)
def delete_note(
    note_id: UUID,
    db: Session = Depends(get_db),
    user_id: UUID = Depends(get_current_user_id)
):
    item = db.query(models.Note).filter(models.Note.id == note_id, models.Note.user_id == user_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Nota não encontrada")
    db.delete(item)
    db.commit()
    return


