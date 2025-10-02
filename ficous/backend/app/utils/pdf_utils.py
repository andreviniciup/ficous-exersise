"""
Utilitários para processamento de PDF
"""
import io
import re
from typing import Optional, List
from ..config import MAX_PDF_PAGES, MAX_EXTRACT_CHARS


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

            for i in page_indices[:limit]:
                try:
                    page = pdf.pages[i]
                    if layout == "preserve":
                        text_parts.append(page.extract_text(layout=True) or "")
                    else:
                        text_parts.append(page.extract_text() or "")
                except Exception:
                    continue
    except ImportError:
        pass
    except Exception:
        pass

    # 2) Fallback para PyPDF2 se pdfplumber falhou
    if not text_parts:
        try:
            import PyPDF2  # type: ignore
            buffer.seek(0)
            reader = PyPDF2.PdfReader(buffer)
            num_pages = len(reader.pages)
            page_indices = range(num_pages)
            if selected_pages:
                zero_based = [p - 1 for p in selected_pages if 1 <= p <= num_pages]
                page_indices = zero_based

            for i in page_indices[:limit]:
                try:
                    page = reader.pages[i]
                    text_parts.append(page.extract_text() or "")
                except Exception:
                    continue
        except ImportError:
            raise RuntimeError("PyPDF2 não instalado. Instale PyPDF2 para suportar upload de PDF.")
        except Exception:
            pass

    # 3) OCR se habilitado e texto vazio
    if not text_parts and ocr:
        try:
            from PIL import Image  # type: ignore
            import pytesseract  # type: ignore
            # Implementação básica de OCR seria aqui
            # Por enquanto, placeholder
            text_parts = ["OCR não implementado ainda"]
        except ImportError:
            pass
        except Exception:
            pass

    text = "\n".join(text_parts).strip()

    if clean:
        from .text_utils import _clean_text
        text = _clean_text(text)

    if len(text) > mchars:
        return text[:mchars]
    return text
