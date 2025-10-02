from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List
import mimetypes

from ..database import get_db
from ..security import get_current_user_id
from .. import models, schemas
from ..utils import extract_text_from_pdf_bytes
from ..config import MAX_UPLOAD_MB


router = APIRouter(prefix="/ficous/library", tags=["ficous-library"])


@router.get("/", response_model=List[schemas.SourceOut])
def list_sources(
    db: Session = Depends(get_db),
    user_id: UUID = Depends(get_current_user_id)
):
    items = db.query(models.Source).filter(models.Source.user_id == user_id).order_by(models.Source.created_at.desc()).all()
    return items


@router.post("/upload", response_model=schemas.SourceOut)
async def upload_source(
    file: UploadFile = File(...),
    discipline_id: UUID | None = None,
    note_id: UUID | None = None,
    db: Session = Depends(get_db),
    user_id: UUID = Depends(get_current_user_id)
):
    data = await file.read()
    max_bytes = MAX_UPLOAD_MB * 1024 * 1024
    if len(data) > max_bytes:
        raise HTTPException(status_code=413, detail=f"Arquivo excede {MAX_UPLOAD_MB}MB")

    mime = file.content_type or mimetypes.guess_type(file.filename)[0] or "application/octet-stream"

    excerpt: str | None = None
    
    # Suporte a PDF
    if mime == "application/pdf":
        try:
            excerpt = extract_text_from_pdf_bytes(data, max_pages=5, max_chars=2000, clean=True)
        except Exception:
            excerpt = None
    
    # NOVO: Suporte a imagens
    elif mime.startswith("image/"):
        try:
            from ..utils.pdf_utils import extract_text_from_image
            excerpt = extract_text_from_image(data)[:2000]
        except Exception as e:
            excerpt = f"Erro no OCR: {e}"

    src = models.Source(
        user_id=user_id,
        discipline_id=discipline_id,
        note_id=note_id,
        filename=file.filename,
        mime_type=mime,
        size_bytes=str(len(data)),
        content_excerpt=excerpt
    )
    db.add(src)
    db.commit()
    db.refresh(src)
    return src


@router.delete("/{source_id}", status_code=204)
def delete_source(
    source_id: UUID,
    db: Session = Depends(get_db),
    user_id: UUID = Depends(get_current_user_id)
):
    src = db.query(models.Source).filter(models.Source.id == source_id, models.Source.user_id == user_id).first()
    if not src:
        raise HTTPException(status_code=404, detail="Fonte não encontrada")
    db.delete(src)
    db.commit()
    return


