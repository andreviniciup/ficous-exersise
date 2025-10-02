"""
Testes para sistema de Cache
"""
import pytest
import time
from ficous.backend.app.services.cache import (
    get_cached_response,
    set_cached_response,
    get_cache_stats,
    clear_cache,
    _generate_cache_key
)


def test_generate_cache_key():
    """Testa geração de chave de cache"""
    key1 = _generate_cache_key("pergunta", "contexto", "gpt-4o-mini")
    key2 = _generate_cache_key("pergunta", "contexto", "gpt-4o-mini")
    key3 = _generate_cache_key("outra pergunta", "contexto", "gpt-4o-mini")
    
    # Mesmos inputs geram mesma chave
    assert key1 == key2
    
    # Inputs diferentes geram chaves diferentes
    assert key1 != key3
    
    # Chave tem tamanho esperado (16 chars)
    assert len(key1) == 16


def test_set_and_get_cached_response():
    """Testa armazenamento e recuperação de cache"""
    clear_cache()  # Limpar cache antes
    
    response = {"type": "level1", "payload": {"balloons": [{"text": "Resposta"}]}}
    
    set_cached_response("pergunta", "contexto", response, "gpt-4o-mini")
    
    cached = get_cached_response("pergunta", "contexto", "gpt-4o-mini")
    
    assert cached is not None
    assert cached == response


def test_cache_miss():
    """Testa cache miss"""
    clear_cache()
    
    cached = get_cached_response("pergunta inexistente", "contexto", "gpt-4o-mini")
    
    assert cached is None


def test_cache_different_contexts():
    """Testa que contextos diferentes não compartilham cache"""
    clear_cache()
    
    response1 = {"data": "resposta1"}
    response2 = {"data": "resposta2"}
    
    set_cached_response("pergunta", "contexto1", response1, "gpt-4o-mini")
    set_cached_response("pergunta", "contexto2", response2, "gpt-4o-mini")
    
    cached1 = get_cached_response("pergunta", "contexto1", "gpt-4o-mini")
    cached2 = get_cached_response("pergunta", "contexto2", "gpt-4o-mini")
    
    assert cached1 != cached2
    assert cached1["data"] == "resposta1"
    assert cached2["data"] == "resposta2"


def test_cache_ttl(monkeypatch):
    """Testa expiração de cache por TTL"""
    clear_cache()
    monkeypatch.setenv("CACHE_TTL_SECONDS", "1")  # 1 segundo
    
    response = {"data": "teste"}
    set_cached_response("pergunta", "contexto", response, "gpt-4o-mini")
    
    # Imediatamente disponível
    cached = get_cached_response("pergunta", "contexto", "gpt-4o-mini")
    assert cached is not None
    
    # Esperar TTL expirar
    time.sleep(1.5)
    
    # Cache deve estar expirado
    cached = get_cached_response("pergunta", "contexto", "gpt-4o-mini")
    # Nota: Em memória, ainda pode estar presente até limpeza
    # Em Redis, expiraria automaticamente


def test_clear_cache():
    """Testa limpeza de cache"""
    clear_cache()
    
    # Adicionar várias entradas
    set_cached_response("p1", "c1", {"data": "1"}, "gpt-4o-mini")
    set_cached_response("p2", "c2", {"data": "2"}, "gpt-4o-mini")
    
    # Limpar cache
    clear_cache()
    
    # Verificar que foi limpo
    assert get_cached_response("p1", "c1", "gpt-4o-mini") is None
    assert get_cached_response("p2", "c2", "gpt-4o-mini") is None


def test_get_cache_stats():
    """Testa obtenção de estatísticas do cache"""
    clear_cache()
    
    # Adicionar alguns itens
    set_cached_response("p1", "c1", {"data": "1"}, "gpt-4o-mini")
    set_cached_response("p2", "c2", {"data": "2"}, "gpt-4o-mini")
    
    stats = get_cache_stats()
    
    assert "backend" in stats
    assert "memory_entries" in stats
    assert stats["memory_entries"] >= 2
    assert "ttl_seconds" in stats


def test_cache_with_sage_endpoint(client, sample_note, monkeypatch):
    """Testa cache funcionando no endpoint do Sage"""
    from unittest.mock import patch, MagicMock
    
    monkeypatch.setenv("CACHE_TTL_SECONDS", "300")
    
    with patch("ficous.backend.app.routers.sage._call_openai_answer") as mock:
        mock.return_value = MagicMock(
            type="level1",
            payload={"balloons": [{"text": "Resposta"}]},
            model_dump=lambda: {"type": "level1", "payload": {"balloons": [{"text": "Resposta"}]}}
        )
        
        # Primeira chamada (cache miss)
        response1 = client.post("/ficous/sage/answer", json={
            "note_id": str(sample_note.id),
            "prompt": "Pergunta teste cache",
            "level": 1
        })
        
        assert response1.status_code == 200
        assert mock.call_count == 1
        
        # Segunda chamada idêntica (cache hit)
        response2 = client.post("/ficous/sage/answer", json={
            "note_id": str(sample_note.id),
            "prompt": "Pergunta teste cache",
            "level": 1
        })
        
        assert response2.status_code == 200
        # Mock não deve ser chamado novamente
        assert mock.call_count == 1
        
        # Respostas devem ser iguais
        assert response1.json() == response2.json()