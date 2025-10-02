"""
Testes para Upload de PDFs
"""
import pytest
import io
from unittest.mock import patch


def test_upload_pdf_basic(client, sample_pdf_bytes):
    """Testa upload básico de PDF"""
    with patch("ficous.backend.app.routers.upload.extract_text_from_pdf_bytes") as mock:
        mock.return_value = "Texto extraído do PDF"
        
        files = {"file": ("test.pdf", io.BytesIO(sample_pdf_bytes), "application/pdf")}
        response = client.post("/ficous/notes/upload", files=files)
        
        assert response.status_code == 200
        data = response.json()
        assert "content_extracted" in data
        assert data["content_extracted"] == "Texto extraído do PDF"


def test_upload_pdf_with_clean(client, sample_pdf_bytes):
    """Testa upload com limpeza de texto"""
    with patch("ficous.backend.app.routers.upload.extract_text_from_pdf_bytes") as mock:
        mock.return_value = "Texto limpo"
        
        files = {"file": ("test.pdf", io.BytesIO(sample_pdf_bytes), "application/pdf")}
        response = client.post("/ficous/notes/upload?clean=true", files=files)
        
        assert response.status_code == 200
        mock.assert_called_once()
        # Verificar que clean=True foi passado
        assert mock.call_args[1]["clean"] is True


def test_upload_pdf_full_extraction(client, sample_pdf_bytes):
    """Testa extração completa sem limites"""
    with patch("ficous.backend.app.routers.upload.extract_text_from_pdf_bytes") as mock:
        mock.return_value = "Texto completo"
        
        files = {"file": ("test.pdf", io.BytesIO(sample_pdf_bytes), "application/pdf")}
        response = client.post("/ficous/notes/upload?full=true", files=files)
        
        assert response.status_code == 200


def test_upload_pdf_with_ocr(client, sample_pdf_bytes):
    """Testa upload com OCR"""
    with patch("ficous.backend.app.routers.upload.extract_text_from_pdf_bytes") as mock:
        mock.return_value = "Texto via OCR"
        
        files = {"file": ("test.pdf", io.BytesIO(sample_pdf_bytes), "application/pdf")}
        response = client.post("/ficous/notes/upload?ocr=true", files=files)
        
        assert response.status_code == 200


def test_upload_pdf_specific_pages(client, sample_pdf_bytes):
    """Testa extração de páginas específicas"""
    with patch("ficous.backend.app.routers.upload.extract_text_from_pdf_bytes") as mock:
        mock.return_value = "Texto páginas 1-3"
        
        files = {"file": ("test.pdf", io.BytesIO(sample_pdf_bytes), "application/pdf")}
        response = client.post("/ficous/notes/upload?pages=1-3", files=files)
        
        assert response.status_code == 200
        mock.assert_called_once()
        assert mock.call_args[1]["pages"] == "1-3"


def test_upload_pdf_compressed_response(client, sample_pdf_bytes, monkeypatch):
    """Testa resposta comprimida"""
    monkeypatch.setenv("ALLOW_GZIP_RESPONSE", "true")
    
    with patch("ficous.backend.app.routers.upload.extract_text_from_pdf_bytes") as mock:
        mock.return_value = "A" * 10000  # Texto grande
        
        files = {"file": ("test.pdf", io.BytesIO(sample_pdf_bytes), "application/pdf")}
        response = client.post("/ficous/notes/upload?compress=true", files=files)
        
        assert response.status_code == 200
        # Resposta deve ser comprimida
        assert response.headers.get("content-encoding") == "gzip" or response.headers.get("Content-Encoding") == "gzip"


def test_upload_non_pdf_file(client):
    """Testa rejeição de arquivo não-PDF"""
    files = {"file": ("test.txt", io.BytesIO(b"texto"), "text/plain")}
    response = client.post("/ficous/notes/upload", files=files)
    
    assert response.status_code == 400
    data = response.json()
    assert "PDF" in data["detail"]


def test_upload_pdf_too_large(client, monkeypatch):
    """Testa rejeição de PDF muito grande"""
    monkeypatch.setenv("MAX_UPLOAD_MB", "1")
    
    # Criar PDF maior que o limite
    large_pdf = b"PDF" * 500000  # ~1.5MB
    
    files = {"file": ("large.pdf", io.BytesIO(large_pdf), "application/pdf")}
    response = client.post("/ficous/notes/upload", files=files)
    
    assert response.status_code == 413


def test_upload_pdf_extraction_error(client, sample_pdf_bytes):
    """Testa tratamento de erro na extração"""
    with patch("ficous.backend.app.routers.upload.extract_text_from_pdf_bytes") as mock:
        mock.side_effect = RuntimeError("Erro ao extrair PDF")
        
        files = {"file": ("test.pdf", io.BytesIO(sample_pdf_bytes), "application/pdf")}
        response = client.post("/ficous/notes/upload", files=files)
        
        assert response.status_code == 500


def test_extract_text_from_pdf_bytes():
    """Testa função de extração de texto"""
    from ficous.backend.app.utils import extract_text_from_pdf_bytes
    
    # PDF mínimo válido
    pdf_bytes = b"%PDF-1.4\n%EOF"
    
    with patch("pdfplumber.open") as mock_pdf:
        mock_page = type('MockPage', (), {
            'extract_text': lambda self: "Texto extraído"
        })()
        mock_pdf.return_value.__enter__.return_value.pages = [mock_page]
        
        text = extract_text_from_pdf_bytes(pdf_bytes, clean=False)
        
        assert text == "Texto extraído"


def test_clean_text():
    """Testa limpeza de texto"""
    from ficous.backend.app.utils import _clean_text
    
    dirty_text = "Texto   com\n\n\nespaços    extras-\nquebrados"
    clean = _clean_text(dirty_text)
    
    # Verifica normalização
    assert "  " not in clean  # Sem espaços duplos
    assert "\n\n\n" not in clean  # Sem quebras excessivas