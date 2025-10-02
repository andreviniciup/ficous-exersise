"""
Testes de Integração End-to-End
"""
import pytest
from unittest.mock import patch, MagicMock


def test_full_note_lifecycle(client, sample_discipline):
    """Testa ciclo completo: criar nota -> processar -> consultar Sage"""
    
    # 1. Criar nota
    with patch("ficous.backend.app.routers.notes._call_openai_summarize_and_questions") as mock_process:
        mock_process.return_value = MagicMock(
            summary="Resumo de arrays",
            questions=["O que é array?", "Como acessar elementos?"]
        )
        with patch("ficous.backend.app.routers.notes._extract_concepts_and_tags") as mock_extract:
            mock_extract.return_value = (["array", "estrutura"], ["dados"])
            
            response = client.post("/ficous/notes/", json={
                "discipline_id": str(sample_discipline.id),
                "title": "Arrays em Python",
                "content": "Arrays são estruturas que armazenam múltiplos valores do mesmo tipo."
            })
            
            assert response.status_code == 200
            note_id = response.json()["id"]
    
    # 2. Consultar Sage sobre a nota (nível 1)
    with patch("ficous.backend.app.routers.sage._call_openai_answer") as mock_sage:
        mock_sage.return_value = MagicMock(
            type="level1",
            payload={"balloons": [{"text": "Arrays armazenam múltiplos valores"}]},
            model_dump=lambda: {"type": "level1", "payload": {"balloons": [{"text": "Resposta"}]}}
        )
        
        response = client.post("/ficous/sage/answer", json={
            "note_id": note_id,
            "prompt": "O que é array?",
            "level": 1
        })
        
        assert response.status_code == 200
        assert response.json()["type"] == "level1"
    
    # 3. Gerar flashcards da nota
    with patch("ficous.backend.app.routers.flashcards._call_openai_answer") as mock_cards:
        mock_cards.return_value = MagicMock(
            payload={"slides": [{"title": "Q", "bullets": ["O que é array?"]}]}
        )
        
        response = client.post("/ficous/flashcards/generate", json={
            "note_id": note_id,
            "qty": 3
        })
        
        assert response.status_code == 200
        assert len(response.json()) >= 1


def test_rag_with_multiple_notes(client, sample_discipline):
    """Testa RAG com múltiplas notas indexadas"""
    
    # Criar múltiplas notas
    notes = []
    for i in range(3):
        with patch("ficous.backend.app.routers.notes._call_openai_summarize_and_questions"):
            with patch("ficous.backend.app.routers.notes._extract_concepts_and_tags"):
                with patch("ficous.backend.app.services.embeddings.index_note_content"):
                    response = client.post("/ficous/notes/", json={
                        "discipline_id": str(sample_discipline.id),
                        "title": f"Nota {i}",
                        "content": f"Conteúdo sobre conceito {i}"
                    })
                    notes.append(response.json()["id"])
    
    # Consultar Sage (deve usar RAG para buscar em todas as notas)
    with patch("ficous.backend.app.routers.sage.retrieve_relevant_chunks") as mock_rag:
        mock_rag.return_value = [
            {"chunk_text": "Chunk relevante", "similarity": 0.9, "perso_score": 0.85}
        ]
        with patch("ficous.backend.app.routers.sage._call_openai_answer") as mock_sage:
            mock_sage.return_value = MagicMock(
                type="level2",
                payload={"slides": [{"title": "Conceito", "bullets": ["Info"]}]},
                model_dump=lambda: {"type": "level2", "payload": {"slides": []}}
            )
            
            response = client.post("/ficous/sage/answer", json={
                "discipline_id": str(sample_discipline.id),
                "prompt": "Explica os conceitos",
                "level": 2
            })
            
            assert response.status_code == 200
            mock_rag.assert_called_once()


def test_cache_across_requests(client, sample_note):
    """Testa que cache funciona entre requisições"""
    
    with patch("ficous.backend.app.routers.sage._call_openai_answer") as mock_sage:
        mock_sage.return_value = MagicMock(
            type="level1",
            payload={"balloons": [{"text": "Resposta"}]},
            model_dump=lambda: {"type": "level1", "payload": {"balloons": [{"text": "Resposta"}]}}
        )
        
        # Primeira requisição
        response1 = client.post("/ficous/sage/answer", json={
            "note_id": str(sample_note.id),
            "prompt": "Pergunta teste",
            "level": 1
        })
        
        # Segunda requisição idêntica
        response2 = client.post("/ficous/sage/answer", json={
            "note_id": str(sample_note.id),
            "prompt": "Pergunta teste",
            "level": 1
        })
        
        # Apenas uma chamada ao OpenAI (cache hit na segunda)
        assert mock_sage.call_count == 1
        assert response1.json() == response2.json()


def test_complete_study_session(client, sample_discipline):
    """Testa sessão completa de estudo"""
    
    # 1. Criar nota
    with patch("ficous.backend.app.routers.notes._call_openai_summarize_and_questions"):
        with patch("ficous.backend.app.routers.notes._extract_concepts_and_tags"):
            response = client.post("/ficous/notes/", json={
                "discipline_id": str(sample_discipline.id),
                "title": "Polimorfismo",
                "content": "Polimorfismo é a capacidade de objetos responderem de forma diferente."
            })
            note_id = response.json()["id"]
    
    # 2. Consultar Sage (nível 2)
    with patch("ficous.backend.app.routers.sage._call_openai_answer") as mock:
        mock.return_value = MagicMock(
            type="level2",
            payload={"slides": [{"title": "Conceito", "bullets": ["Info"]}]},
            model_dump=lambda: {"type": "level2", "payload": {"slides": []}}
        )
        
        client.post("/ficous/sage/answer", json={
            "note_id": note_id,
            "prompt": "Explica polimorfismo",
            "level": 2
        })
    
    # 3. Gerar flashcards
    with patch("ficous.backend.app.routers.flashcards._call_openai_answer") as mock:
        mock.return_value = MagicMock(
            payload={"slides": [{"title": "Q", "bullets": ["O que é polimorfismo?"]}]}
        )
        
        response = client.post("/ficous/flashcards/generate", json={
            "note_id": note_id,
            "qty": 3
        })
        card_id = response.json()[0]["id"]
    
    # 4. Revisar flashcard
    response = client.post(f"/ficous/flashcards/{card_id}/grade", json={
        "grade": "easy"
    })
    assert response.status_code == 200
    
    # 5. Gerar exercício
    with patch("ficous.backend.app.routers.exercises._call_openai_answer") as mock:
        mock.return_value = MagicMock(
            payload={"slides": [{"title": "Q", "bullets": ["Explique polimorfismo"]}]}
        )
        
        response = client.post("/ficous/exercises/generate", json={
            "note_id": note_id,
            "qty": 2,
            "kind": "open"
        })
        exercise_id = response.json()["id"]
    
    # 6. Submeter exercício
    response = client.post(f"/ficous/exercises/{exercise_id}/submit", json={
        "answers_json": {"1": "Polimorfismo permite objetos responderem diferente"}
    })
    assert response.status_code == 200
    
    # 7. Ver progresso
    response = client.get("/ficous/progress/overview")
    assert response.status_code == 200
    data = response.json()
    assert data["data"]["counts"]["notes"] >= 1
    assert data["data"]["counts"]["flashcards"] >= 1


def test_admin_workflow(client, sample_note, sample_embedding):
    """Testa workflow administrativo completo"""
    
    # 1. Health check
    response = client.get("/ficous/admin/health")
    assert response.status_code == 200
    
    # 2. Reindexar conteúdo
    with patch("ficous.backend.app.routers.admin.index_note_content"):
        response = client.post("/ficous/admin/index-content?content_type=notes")
        assert response.status_code == 200
    
    # 3. Rebuild summaries
    with patch("ficous.backend.app.routers.admin.trigger_summary_updates") as mock:
        mock.return_value = {"global_updated": True, "disciplines_updated": 1, "errors": []}
        response = client.post("/ficous/admin/rebuild-summaries")
        assert response.status_code == 200
    
    # 4. Recomputar stats
    response = client.post("/ficous/admin/recompute-stats")
    assert response.status_code == 200
    
    # 5. Limpar cache
    response = client.post("/ficous/admin/clear-cache")
    assert response.status_code == 200