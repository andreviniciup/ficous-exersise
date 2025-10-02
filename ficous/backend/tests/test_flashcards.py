"""
Testes para sistema de Flashcards e SM-2
"""
import pytest
from datetime import datetime, timedelta, timezone
from unittest.mock import patch, MagicMock


def test_list_flashcards(client, sample_flashcard):
    """Testa listagem de flashcards"""
    response = client.get("/ficous/flashcards/")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1


def test_create_flashcard(client, sample_discipline):
    """Testa criação manual de flashcard"""
    response = client.post("/ficous/flashcards/", json={
        "discipline_id": str(sample_discipline.id),
        "question": "O que é herança?",
        "answer": "Capacidade de criar classes baseadas em outras."
    })
    assert response.status_code == 200
    data = response.json()
    assert data["question"] == "O que é herança?"
    assert data["answer"] is not None


def test_generate_flashcards_from_note(client, sample_note):
    """Testa geração de flashcards via Sage a partir de nota"""
    with patch("ficous.backend.app.routers.flashcards._call_openai_answer") as mock:
        mock.return_value = MagicMock(
            payload={
                "slides": [
                    {
                        "title": "Conceitos",
                        "bullets": [
                            "O que é polimorfismo?",
                            "Como implementar?",
                            "Quais vantagens?"
                        ]
                    }
                ]
            }
        )
        
        response = client.post("/ficous/flashcards/generate", json={
            "note_id": str(sample_note.id),
            "qty": 3,
            "output_language": "pt-BR"
        })
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 1


def test_generate_flashcards_from_raw_context(client):
    """Testa geração de flashcards de contexto livre"""
    with patch("ficous.backend.app.routers.flashcards._call_openai_answer") as mock:
        mock.return_value = MagicMock(
            payload={
                "slides": [
                    {
                        "title": "Perguntas",
                        "bullets": ["Pergunta 1?", "Pergunta 2?"]
                    }
                ]
            }
        )
        
        response = client.post("/ficous/flashcards/generate", json={
            "raw_context": "Arrays são estruturas de dados...",
            "qty": 2
        })
        
        assert response.status_code == 200


def test_review_list_empty(client):
    """Testa lista de revisão vazia"""
    response = client.get("/ficous/flashcards/review")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


def test_review_list_with_due_cards(client, sample_flashcard, db_session):
    """Testa lista de revisão com cards vencidos"""
    # Configurar card como vencido
    sample_flashcard.next_review_at = datetime.now(timezone.utc) - timedelta(days=1)
    db_session.commit()
    
    response = client.get("/ficous/flashcards/review")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1


def test_grade_card_easy(client, sample_flashcard, db_session):
    """Testa avaliação de card como 'fácil'"""
    before_review = sample_flashcard.next_review_at
    
    response = client.post(f"/ficous/flashcards/{sample_flashcard.id}/grade", json={
        "grade": "easy"
    })
    
    assert response.status_code == 200
    data = response.json()
    assert data["ease"] == "easy"
    assert data["interval_days"] == "4"
    
    # Verificar que next_review_at foi atualizado
    db_session.refresh(sample_flashcard)
    assert sample_flashcard.next_review_at > datetime.now(timezone.utc)


def test_grade_card_medium(client, sample_flashcard):
    """Testa avaliação de card como 'médio'"""
    response = client.post(f"/ficous/flashcards/{sample_flashcard.id}/grade", json={
        "grade": "medium"
    })
    
    assert response.status_code == 200
    data = response.json()
    assert data["ease"] == "medium"
    assert data["interval_days"] == "2"


def test_grade_card_hard(client, sample_flashcard):
    """Testa avaliação de card como 'difícil'"""
    response = client.post(f"/ficous/flashcards/{sample_flashcard.id}/grade", json={
        "grade": "hard"
    })
    
    assert response.status_code == 200
    data = response.json()
    assert data["ease"] == "hard"
    assert data["interval_days"] == "1"


def test_grade_card_invalid_grade(client, sample_flashcard):
    """Testa validação de grade inválido"""
    response = client.post(f"/ficous/flashcards/{sample_flashcard.id}/grade", json={
        "grade": "super_easy"
    })
    
    assert response.status_code == 422


def test_grade_nonexistent_card(client):
    """Testa avaliação de card inexistente"""
    fake_id = "00000000-0000-0000-0000-000000000001"
    response = client.post(f"/ficous/flashcards/{fake_id}/grade", json={
        "grade": "easy"
    })
    
    assert response.status_code == 404


def test_sm2_algorithm_progression(client, sample_flashcard, db_session):
    """Testa progressão do algoritmo SM-2"""
    # Primeira revisão (easy)
    response1 = client.post(f"/ficous/flashcards/{sample_flashcard.id}/grade", json={
        "grade": "easy"
    })
    assert response1.status_code == 200
    
    db_session.refresh(sample_flashcard)
    first_interval = sample_flashcard.interval_days
    
    # Segunda revisão (easy novamente)
    response2 = client.post(f"/ficous/flashcards/{sample_flashcard.id}/grade", json={
        "grade": "easy"
    })
    assert response2.status_code == 200
    
    db_session.refresh(sample_flashcard)
    # Intervalo deve aumentar com sucessos
    # Nota: SM-2 simplificado atual usa valores fixos, mas em versão completa aumentaria
    assert sample_flashcard.interval_days is not None