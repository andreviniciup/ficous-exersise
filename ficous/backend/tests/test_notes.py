"""
Testes para CRUD de Notas e Processamento
"""
import pytest
from unittest.mock import patch, MagicMock


def test_create_note(client, sample_discipline):
    """Testa criação de nota"""
    response = client.post("/ficous/notes/", json={
        "discipline_id": str(sample_discipline.id),
        "title": "Arrays em Python",
        "content": "Arrays são estruturas de dados que armazenam múltiplos valores."
    })
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Arrays em Python"
    assert data["content"] is not None
    assert "id" in data


def test_create_note_with_auto_processing(client, sample_discipline, monkeypatch):
    """Testa criação de nota com processamento automático"""
    import os
    monkeypatch.setenv("SAGE_AUTO_PROCESS", "true")
    
    with patch("ficous.backend.app.routers.notes._call_openai_summarize_and_questions") as mock_sage:
        mock_sage.return_value = MagicMock(
            summary="Resumo automático",
            questions=["Q1?", "Q2?"]
        )
        
        with patch("ficous.backend.app.routers.notes._extract_concepts_and_tags") as mock_extract:
            mock_extract.return_value = (["array", "python"], ["estrutura-dados"])
            
            response = client.post("/ficous/notes/", json={
                "discipline_id": str(sample_discipline.id),
                "title": "Arrays",
                "content": "Conteúdo sobre arrays"
            })
            
            assert response.status_code == 200
            data = response.json()
            assert data["summary"] == "Resumo automático"
            assert len(data["questions_json"]) == 2
            assert "array" in data["concepts_json"]


def test_list_notes(client, sample_note):
    """Testa listagem de notas"""
    response = client.get("/ficous/notes/")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1


def test_get_note(client, sample_note):
    """Testa obtenção de nota específica"""
    response = client.get(f"/ficous/notes/{sample_note.id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == str(sample_note.id)
    assert data["title"] == sample_note.title


def test_update_note(client, sample_note):
    """Testa atualização de nota"""
    response = client.put(f"/ficous/notes/{sample_note.id}", json={
        "title": "Polimorfismo Atualizado",
        "content": "Conteúdo atualizado"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Polimorfismo Atualizado"


def test_delete_note(client, sample_note):
    """Testa exclusão de nota"""
    response = client.delete(f"/ficous/notes/{sample_note.id}")
    assert response.status_code == 204


def test_create_note_without_discipline(client):
    """Testa criação de nota sem disciplina"""
    response = client.post("/ficous/notes/", json={
        "title": "Nota Solta",
        "content": "Conteúdo"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["discipline_id"] is None


def test_update_note_concepts_and_tags(client, sample_note):
    """Testa atualização de conceitos e tags"""
    response = client.put(f"/ficous/notes/{sample_note.id}", json={
        "concepts_json": ["novo_conceito", "outro_conceito"],
        "tags_json": ["nova_tag"]
    })
    assert response.status_code == 200
    data = response.json()
    assert "novo_conceito" in data["concepts_json"]
    assert "nova_tag" in data["tags_json"]