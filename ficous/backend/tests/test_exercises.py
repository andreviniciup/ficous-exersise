"""
Testes para sistema de Exercícios
"""
import pytest
from unittest.mock import patch, MagicMock


def test_create_exercise_manual(client, sample_discipline):
    """Testa criação manual de exercício"""
    response = client.post("/ficous/exercises/", json={
        "discipline_id": str(sample_discipline.id),
        "title": "Exercício de POO",
        "meta_json": {"difficulty": "medium"},
        "items": [
            {
                "question": "O que é encapsulamento?",
                "kind": "open",
                "answer_json": {"expected": "Ocultação de dados internos"}
            },
            {
                "question": "Qual linguagem é orientada a objetos?",
                "kind": "mcq",
                "options_json": ["Python", "C", "Assembly"],
                "answer_json": {"correct": 0}
            }
        ]
    })
    
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Exercício de POO"


def test_generate_exercise_from_note(client, sample_note):
    """Testa geração de exercício via Sage a partir de nota"""
    with patch("ficous.backend.app.routers.exercises._call_openai_answer") as mock:
        mock.return_value = MagicMock(
            payload={
                "slides": [
                    {
                        "title": "Questões",
                        "bullets": [
                            "Explique polimorfismo",
                            "Dê exemplo de herança",
                            "O que é abstração?"
                        ]
                    }
                ]
            }
        )
        
        response = client.post("/ficous/exercises/generate", json={
            "note_id": str(sample_note.id),
            "qty": 3,
            "kind": "open"
        })
        
        assert response.status_code == 200
        data = response.json()
        assert "id" in data


def test_generate_exercise_from_raw_context(client):
    """Testa geração de exercício de contexto livre"""
    with patch("ficous.backend.app.routers.exercises._call_openai_answer") as mock:
        mock.return_value = MagicMock(
            payload={
                "slides": [
                    {"title": "Q", "bullets": ["Pergunta 1?", "Pergunta 2?"]}
                ]
            }
        )
        
        response = client.post("/ficous/exercises/generate", json={
            "raw_context": "Arrays são estruturas de dados...",
            "qty": 2,
            "kind": "mix"
        })
        
        assert response.status_code == 200


def test_generate_exercise_mcq_type(client, sample_note):
    """Testa geração de exercício tipo múltipla escolha"""
    with patch("ficous.backend.app.routers.exercises._call_openai_answer") as mock:
        mock.return_value = MagicMock(
            payload={
                "slides": [
                    {"title": "Q", "bullets": ["Questão MCQ?"]}
                ]
            }
        )
        
        response = client.post("/ficous/exercises/generate", json={
            "note_id": str(sample_note.id),
            "qty": 5,
            "kind": "mcq",
            "output_language": "pt-BR"
        })
        
        assert response.status_code == 200


def test_submit_exercise(client, db_session, default_user_id, sample_discipline):
    """Testa submissão de respostas de exercício"""
    from ficous.backend.app import models
    
    # Criar exercício
    exercise = models.Exercise(
        user_id=default_user_id,
        discipline_id=sample_discipline.id,
        title="Teste",
        meta_json={}
    )
    db_session.add(exercise)
    db_session.commit()
    db_session.refresh(exercise)
    
    response = client.post(f"/ficous/exercises/{exercise.id}/submit", json={
        "answers_json": {
            "1": "Minha resposta para questão 1",
            "2": "Minha resposta para questão 2"
        }
    })
    
    assert response.status_code == 200


def test_submit_nonexistent_exercise(client):
    """Testa submissão de exercício inexistente"""
    fake_id = "00000000-0000-0000-0000-000000000001"
    response = client.post(f"/ficous/exercises/{fake_id}/submit", json={
        "answers_json": {}
    })
    
    assert response.status_code == 404


def test_generate_exercise_without_context(client):
    """Testa erro quando falta contexto"""
    response = client.post("/ficous/exercises/generate", json={
        "qty": 5,
        "kind": "open"
    })
    
    assert response.status_code == 400


def test_generate_exercise_with_language(client, sample_note):
    """Testa geração em idioma específico"""
    with patch("ficous.backend.app.routers.exercises._call_openai_answer") as mock:
        mock.return_value = MagicMock(
            payload={"slides": [{"title": "Q", "bullets": ["Question?"]}]}
        )
        
        response = client.post("/ficous/exercises/generate", json={
            "note_id": str(sample_note.id),
            "qty": 3,
            "kind": "open",
            "output_language": "en"
        })
        
        assert response.status_code == 200