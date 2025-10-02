"""
Testes para endpoints Admin
"""
import pytest
from unittest.mock import patch


def test_rebuild_summaries(client, sample_note):
    """Testa rebuild de summaries"""
    with patch("ficous.backend.app.routers.admin.trigger_summary_updates") as mock:
        mock.return_value = {
            "global_updated": True,
            "disciplines_updated": 1,
            "errors": []
        }
        
        response = client.post("/ficous/admin/rebuild-summaries")
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "results" in data


def test_recompute_stats(client, sample_note, db_session):
    """Testa recomputação de estatísticas"""
    from ficous.backend.app import models
    
    # Criar algumas interações
    interaction = models.Interaction(
        user_id=sample_note.user_id,
        note_id=sample_note.id,
        discipline_id=sample_note.discipline_id,
        prompt="Teste",
        response_meta={}
    )
    db_session.add(interaction)
    db_session.commit()
    
    response = client.post("/ficous/admin/recompute-stats")
    
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["concepts_updated"] >= 0


def test_index_content_notes(client, sample_note):
    """Testa indexação de notas"""
    with patch("ficous.backend.app.routers.admin.index_note_content") as mock:
        mock.return_value = 3  # 3 chunks
        
        response = client.post("/ficous/admin/index-content?content_type=notes")
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "indexed_chunks" in data


def test_index_content_all(client, sample_note, db_session):
    """Testa indexação de todo conteúdo"""
    from ficous.backend.app import models
    
    # Criar uma source
    source = models.Source(
        user_id=sample_note.user_id,
        filename="test.pdf",
        content_excerpt="Conteúdo de teste"
    )
    db_session.add(source)
    db_session.commit()
    
    with patch("ficous.backend.app.routers.admin.index_note_content") as mock_note:
        mock_note.return_value = 2
        with patch("ficous.backend.app.routers.admin.index_source_content") as mock_source:
            mock_source.return_value = 1
            
            response = client.post("/ficous/admin/index-content?content_type=all")
            
            assert response.status_code == 200
            data = response.json()
            assert data["indexed_chunks"] >= 3


def test_dry_run_rag(client, sample_embedding):
    """Testa dry-run do RAG"""
    with patch("ficous.backend.app.routers.admin.retrieve_relevant_chunks") as mock:
        mock.return_value = [
            {
                "chunk_text": "Texto relevante sobre polimorfismo...",
                "similarity": 0.92,
                "perso_score": 0.85,
                "owner_type": "note"
            }
        ]
        
        response = client.get("/ficous/admin/dry-run?query=polimorfismo")
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["chunks_found"] >= 1
        assert "chunks" in data


def test_cache_stats(client):
    """Testa obtenção de stats do cache"""
    response = client.get("/ficous/admin/cache-stats")
    
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "cache_stats" in data


def test_clear_cache(client):
    """Testa limpeza do cache"""
    response = client.post("/ficous/admin/clear-cache")
    
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True


def test_health_check(client, sample_note, sample_embedding):
    """Testa health check do sistema"""
    response = client.get("/ficous/admin/health")
    
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "health" in data
    assert data["health"]["notes"] >= 1
    assert data["health"]["embeddings"] >= 1


def test_admin_endpoints_disabled(client, monkeypatch):
    """Testa que endpoints admin podem ser desabilitados"""
    monkeypatch.setenv("ADMIN_ENABLED", "false")
    
    # Recarregar módulo para aplicar variável de ambiente
    import importlib
    from ficous.backend.app.routers import admin
    importlib.reload(admin)
    
    response = client.post("/ficous/admin/rebuild-summaries")
    assert response.status_code == 403


def test_index_content_invalid_type(client):
    """Testa validação de tipo de conteúdo inválido"""
    response = client.post("/ficous/admin/index-content?content_type=invalid")
    
    # Deve aceitar (mas não fazer nada) ou retornar erro
    assert response.status_code in [200, 400]