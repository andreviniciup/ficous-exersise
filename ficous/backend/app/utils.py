from typing import Optional, List
from .config import MAX_PDF_PAGES, MAX_EXTRACT_CHARS
import io
import re


def _clean_text(text: str) -> str:
    try:
        from ftfy import fix_text
        text = fix_text(text)
    except Exception:
        pass
    # Normalização simples de hifenização no fim de linha
    text = re.sub(r"-\n\s*", "", text)
    # Unir quebras excessivas
    text = re.sub(r"\n{3,}", "\n\n", text)
    # Espaços quebrados estranhos
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def extract_text_from_pdf_bytes(
    file_bytes: bytes,
    max_pages: Optional[int] = None,
    max_chars: Optional[int] = None,
    clean: bool = False,
    layout: str = "flow",
    pages: Optional[str] = None,
    ocr: bool = False
) -> str:
    """Extrai texto de PDF com pipeline melhorado.

    Ordem: pdfplumber -> PyPDF2 -> (opcional) OCR.
    """
    selected_pages: Optional[List[int]] = None
    if isinstance(pages, str) and pages.strip():
        # formato: "1-3,5,7-8"
        selected_pages = []
        for part in pages.split(','):
            part = part.strip()
            if '-' in part:
                a, b = part.split('-', 1)
                try:
                    a_i = max(1, int(a))
                    b_i = int(b)
                    selected_pages.extend(list(range(a_i, b_i + 1)))
                except Exception:
                    continue
            else:
                try:
                    selected_pages.append(int(part))
                except Exception:
                    continue

    limit = max_pages if isinstance(max_pages, int) and max_pages > 0 else MAX_PDF_PAGES
    mchars = max_chars if isinstance(max_chars, int) and max_chars > 0 else MAX_EXTRACT_CHARS

    buffer = io.BytesIO(file_bytes)

    # 1) Tentar pdfplumber (melhor qualidade de extração)
    text_parts: List[str] = []
    try:
        import pdfplumber  # type: ignore
        with pdfplumber.open(buffer) as pdf:
            num_pages = len(pdf.pages)
            page_indices = range(num_pages)
            if selected_pages:
                # pdfplumber é 0-based; usuário usa 1-based
                zero_based = [p - 1 for p in selected_pages if 1 <= p <= num_pages]
                page_indices = zero_based
            for idx in page_indices:
                if len(text_parts) >= limit:
                    break
                try:
                    page = pdf.pages[idx]
                    if layout == "preserve":
                        txt = page.extract_text(x_tolerance=1, y_tolerance=1) or ""
                    else:
                        txt = page.extract_text() or ""
                    text_parts.append(txt)
                except Exception:
                    continue
        text = "\n".join(text_parts).strip()
        if clean:
            text = _clean_text(text)
        if len(text) > mchars:
            return text[:mchars]
        if text:
            return text
    except Exception:
        pass

    # 2) Fallback: PyPDF2
    try:
        import PyPDF2  # type: ignore
        buffer.seek(0)
        reader = PyPDF2.PdfReader(buffer)
        pages_obj = reader.pages
        indices = range(len(pages_obj))
        if selected_pages:
            zero_based = [p - 1 for p in selected_pages if 1 <= p <= len(pages_obj)]
            indices = zero_based
        text_parts = []
        for i, idx in enumerate(indices):
            if i >= limit:
                break
            try:
                page = pages_obj[idx]
                text_parts.append(page.extract_text() or "")
            except Exception:
                continue
        text = "\n".join(text_parts).strip()
        if clean:
            text = _clean_text(text)
        if len(text) > mchars:
            return text[:mchars]
        if text:
            return text
    except Exception:
        pass

    # 3) OCR opcional como último recurso (para PDFs escaneados)
    if ocr:
        try:
            import pytesseract  # type: ignore
            from PIL import Image  # type: ignore
            try:
                import pdfplumber  # type: ignore
                buffer.seek(0)
                with pdfplumber.open(buffer) as pdf:
                    text_parts = []
                    num_pages = len(pdf.pages)
                    indices = range(num_pages)
                    if selected_pages:
                        zero_based = [p - 1 for p in selected_pages if 1 <= p <= num_pages]
                        indices = zero_based
                    for i, idx in enumerate(indices):
                        if i >= limit:
                            break
                        try:
                            page = pdf.pages[idx]
                            img = page.to_image(resolution=200).original
                            txt = pytesseract.image_to_string(Image.fromarray(img))
                            text_parts.append(txt or "")
                        except Exception:
                            continue
                text = "\n".join(text_parts).strip()
                if clean:
                    text = _clean_text(text)
                if len(text) > mchars:
                    return text[:mchars]
                return text
            except Exception:
                pass
        except Exception:
            pass

    return ""


