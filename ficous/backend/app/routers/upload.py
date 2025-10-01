from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import Response
from ..utils import extract_text_from_pdf_bytes
from ..config import MAX_UPLOAD_MB, ALLOW_GZIP_RESPONSE
import gzip
import io


router = APIRouter(prefix="/ficous/notes", tags=["ficous-upload"])


@router.post("/upload")
async def upload_pdf(
    file: UploadFile = File(...),
    full: bool = False,
    compress: bool = False,
    clean: bool = True,
    layout: str = "flow",
    pages: str | None = None,
    ocr: bool = False
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Apenas arquivos PDF são suportados")
    data = await file.read()
    max_bytes = MAX_UPLOAD_MB * 1024 * 1024
    if len(data) > max_bytes:
        raise HTTPException(status_code=413, detail=f"Arquivo excede {MAX_UPLOAD_MB}MB")
    try:
        text = extract_text_from_pdf_bytes(
            data,
            max_pages=None if full else None,
            max_chars=None if full else None,
            clean=clean,
            layout=layout,
            pages=pages,
            ocr=ocr
        )
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))
    payload = {"content_extracted": text, "meta": {"filename": file.filename, "full": bool(full)}}
    if compress and ALLOW_GZIP_RESPONSE:
        buf = io.BytesIO()
        with gzip.GzipFile(fileobj=buf, mode='wb') as gz:
            gz.write(text.encode('utf-8', errors='ignore'))
        return Response(content=buf.getvalue(), media_type='application/gzip', headers={'Content-Encoding':'gzip','Content-Disposition':f"inline; filename=\"{file.filename}.txt.gz\""})
    return payload


