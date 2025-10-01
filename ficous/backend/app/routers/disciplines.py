from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from ..database import get_db
from ..security import get_current_user_id
from .. import models, schemas


router = APIRouter(prefix="/ficous/disciplines", tags=["ficous-disciplines"])


@router.get("/", response_model=List[schemas.DisciplineOut])
def list_disciplines(
    db: Session = Depends(get_db),
    user_id: UUID = Depends(get_current_user_id)
):
    items = db.query(models.Discipline).filter(models.Discipline.user_id == user_id).order_by(models.Discipline.created_at.desc()).all()
    return items


@router.post("/", response_model=schemas.DisciplineOut)
def create_discipline(
    payload: schemas.DisciplineCreate,
    db: Session = Depends(get_db),
    user_id: UUID = Depends(get_current_user_id)
):
    item = models.Discipline(user_id=user_id, name=payload.name)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.put("/{discipline_id}", response_model=schemas.DisciplineOut)
def update_discipline(
    discipline_id: UUID,
    payload: schemas.DisciplineUpdate,
    db: Session = Depends(get_db),
    user_id: UUID = Depends(get_current_user_id)
):
    item = db.query(models.Discipline).filter(models.Discipline.id == discipline_id, models.Discipline.user_id == user_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Disciplina não encontrada")
    if payload.name is not None:
        item.name = payload.name
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{discipline_id}", status_code=204)
def delete_discipline(
    discipline_id: UUID,
    db: Session = Depends(get_db),
    user_id: UUID = Depends(get_current_user_id)
):
    item = db.query(models.Discipline).filter(models.Discipline.id == discipline_id, models.Discipline.user_id == user_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Disciplina não encontrada")
    db.delete(item)
    db.commit()
    return


