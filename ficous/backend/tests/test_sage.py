"""
Testes para o núcleo do Sage (3 níveis de explicação)
"""
import pytest
from unittest.mock import patch, MagicMock


@pytest.fixture
def mock_openai_call():
    """Mock para chamadas OpenAI"""
    def _mock(level):
        if level == 1:
            return MagicMock(
                type="level1",
                payload={"balloons": [{"text": "Resposta curta"}]},
                model_dump=lambda: {
                    "type": "level1",
                    "payload": {"balloons": [{"text": "Resposta curta"}]}
                }
            )
        elif level == 2:
            return MagicMock(
                type="level2",
                payload={"slides": [{"title": "Conceito", "bullets": ["P1", "P2"]}]},
                model_dump=lambda: {
                    "type": "level2",
                    "payload": {"slides": [{"title": "Conceito", "bullets": ["P1"]}]}
                }
            )
        else:
            return MagicMock(
                type="level3",
                payload={"sections": [{"title": "Intro", "content": "Texto..."}]},
                model_dump=lambda: {
                    "type": "level3",
                    "payload": {"sections": [{"title": "Intro", "content": "Texto"}]}
                }
            )
    return _mock


def test_sage_answer_level1_with_note(client, sample_note, mock_openai_call):
    """Testa resposta Sage nível 1 com contexto de nota"""
    with patch("ficous.backend.app.routers.sage._call_openai_answer") as mock:
        mock.return_value = mock_openai_call(1)
        
        response = client.post("/ficous/sage/answer", json={
            "note_id": str(sample_note.id),
            "prompt": "O que é polimorfismo?",
            "level": 1
        })
        
        assert response.status_code == 200
        data = response.json()
        assert data["type"] == "level1"
        assert "balloons" in data["payload"]


def test_sage_answer_level2_with_discipline(client, sample_discipline, mock_openai_call):
    """Testa resposta Sage nível 2 com contexto de disciplina"""
    with patch("ficous.backend.app.routers.sage._call_openai_answer") as mock:
        mock.return_value = mock_openai_call(2)
        
        response = client.post("/ficous/sage/answer", json={
            "discipline_id": str(sample_discipline.id),
            "prompt": "Explica herança",
            "level": 2
        })
        
        assert response.status_code == 200
        data = response.json()
        assert data["type"] == "level2"
        assert "slides" in data["payload"]


def test_sage_answer_level3_with_raw_context(client, mock_openai_call):
    """Testa resposta Sage nível 3 com contexto livre"""
    with patch("ficous.backend.app.routers.sage._call_openai_answer") as mock:
        mock.return_value = mock_openai_call(3)
        
        response = client.post("/ficous/sage/answer", json={
            "raw_context": "Programação orientada a objetos é um paradigma...",
            "prompt": "Explica polimorfismo em detalhes",
            "level": 3
        })
        
        assert response.status_code == 200
        data = response.json()
        assert data["type"] == "level3"
        assert "sections" in data["payload"]


def test_sage_answer_with_normalization(client, sample_note, mock_openai_call):
    """Testa normalização de texto"""
    with patch("ficous.backend.app.routers.sage._call_openai_answer") as mock:
        mock.return_value = mock_openai_call(1)
        
        response = client.post("/ficous/sage/answer", json={
            "note_id": str(sample_note.id),
            "prompt": "Explica",
            "level": 1,
            "normalize": True
        })
        
        assert response.status_code == 200


def test_sage_answer_with_language(client, sample_note, mock_openai_call):
    """Testa resposta em idioma específico"""
    with patch("ficous.backend.app.routers.sage._call_openai_answer") as mock:
        mock.return_value = mock_openai_call(2)
        
        response = client.post("/ficous/sage/answer", json={
            "note_id": str(sample_note.id),
            "prompt": "Explain polymorphism",
            "level": 2,
            "output_language": "en"
        })
        
        assert response.status_code == 200


def test_sage_answer_without_context(client):
    """Testa erro quando falta contexto"""
    response = client.post("/ficous/sage/answer", json={
        "prompt": "Explica algo",
        "level": 1
    })
    assert response.status_code == 400


def test_sage_answer_invalid_level(client, sample_note):
    """Testa validação de nível inválido"""
    response = client.post("/ficous/sage/answer", json={
        "note_id": str(sample_note.id),
        "prompt": "Explica",
        "level": 5
    })
    assert response.status_code == 422


def test_sage_process_note(client, sample_note):
    """Testa processamento de nota pelo Sage"""
    with patch("ficous.backend.app.routers.sage._call_openai_summarize_and_questions") as mock:
        mock.return_value = MagicMock(
            summary="Resumo gerado",
            questions=["Q1?", "Q2?"]
        )
        
        response = client.post("/ficous/sage/process", json={
            "note_id": str(sample_note.id),
            "output_language": "pt-BR"
        })
        
        assert response.status_code == 200
        data = response.json()
        assert data["summary"] == "Resumo gerado"
        assert len(data["questions"]) == 2


def test_sage_process_raw_content(client):
    """Testa processamento de conteúdo livre"""
    with patch("ficous.backend.app.routers.sage._call_openai_summarize_and_questions") as mock:
        mock.return_value = MagicMock(
            summary="Resumo",
            questions=["Q1?"]
        )
        
        response = client.post("/ficous/sage/process", json={
            "raw_content": "Texto para processar",
            "normalize": True
        })
        
        assert response.status_code == 200


def test_sage_megacontext_with_rag(client, sample_note, sample_embedding):
    """Testa construção de megacontexto com RAG"""
    with patch("ficous.backend.app.routers.sage.retrieve_relevant_chunks") as mock_rag:
        mock_rag.return_value = [
            {
                "chunk_text": "Chunk relevante",
                "similarity": 0.9,
                "perso_score": 0.85
            }
        ]
        
        with patch("ficous.backend.app.routers.sage._call_openai_answer") as mock_answer:
            mock_answer.return_value = MagicMock(
                type="level1",
                payload={"balloons": [{"text": "Resposta"}]},
                model_dump=lambda: {"type": "level1", "payload": {"balloons": []}}
            )
            
            response = client.post("/ficous/sage/answer", json={
                "note_id": str(sample_note.id),
                "prompt": "Pergunta",
                "level": 1
            })
            
            assert response.status_code == 200
            mock_rag.assert_called_once()


def test_sage_with_weak_concepts(client, sample_note, db_session, default_user_id):
    """Testa inclusão de conceitos fracos no megacontexto"""
    from ficous.backend.app import models
    
    # Criar conceito fraco
    weak = models.UserConceptStat(
        user_id=default_user_id,
        concept="herança",
        strength=0.2
    )
    db_session.add(weak)
    db_session.commit()
    
    with patch("ficous.backend.app.routers.sage._call_openai_answer") as mock:
        mock.return_value = MagicMock(
            type="level1",
            payload={"balloons": [{"text": "Resposta"}]},
            model_dump=lambda: {"type": "level1", "payload": {"balloons": []}}
        )
        
        response = client.post("/ficous/sage/answer", json={
            "note_id": str(sample_note.id),
            "prompt": "Explica herança",
            "level": 1
        })
        
        assert response.status_code == 200