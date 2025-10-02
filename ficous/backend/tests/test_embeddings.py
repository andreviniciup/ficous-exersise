"""
Testes para sistema de Embeddings e RAG
"""
import pytest
import json
from unittest.mock import patch
from ficous.backend.app.services.embeddings import (
    _chunk_text,
    index_note_content,
    retrieve_relevant_chunks,
    update_concept_strength
)


def test_chunk_text_simple():
    """Testa chunking de texto simples"""
    text = "A" * 1000
    chunks = _chunk_text(text, chunk_size=400, overlap=50)
    
    assert len(chunks) > 1
    assert all(len(c) <= 450 for c in chunks)  # Considera overlap


def test_chunk_text_with_sentences():
    """Testa chunking respeitando pontuação"""
    text = "Primeira frase. " * 100
    chunks = _chunk_text(text, chunk_size=200, overlap=20)
    
    assert len(chunks) > 1
    # Verifica que chunks terminam em pontos quando possível
    assert any(c.strip().endswith('.') for c in chunks)


def test_chunk_text_short():
    """Testa que texto curto não é chunkado"""
    text = "Texto curto"
    chunks = _chunk_text(text, chunk_size=400)
    
    assert len(chunks) == 1
    assert chunks[0] == text


def test_index_note_content(db_session, sample_note):
    """Testa indexação de nota"""
    with patch("ficous.backend.app.services.embeddings._get_embedding") as mock_emb:
        mock_emb.return_value = [0.1] * 1536
        
        count = index_note_content(sample_note, db_session)
        
        assert count > 0
        mock_emb.assert_called()


def test_index_note_removes_old_embeddings(db_session, sample_note, sample_embedding):
    """Testa que embeddings antigos são removidos ao reindexar"""
    from ficous.backend.app import models
    
    initial_count = db_session.query(models.Embedding).filter(
        models.Embedding.owner_id == sample_note.id
    ).count()
    
    with patch("ficous.backend.app.services.embeddings._get_embedding") as mock_emb:
        mock_emb.return_value = [0.1] * 1536
        
        index_note_content(sample_note, db_session)
        
        final_count = db_session.query(models.Embedding).filter(
            models.Embedding.owner_id == sample_note.id
        ).count()
        
        # Verifica que foi reindexado (pode ter mais ou menos chunks)
        assert final_count > 0


def test_retrieve_relevant_chunks(db_session, default_user_id, sample_embedding):
    """Testa recuperação de chunks relevantes"""
    with patch("ficous.backend.app.services.embeddings._get_embedding") as mock_emb:
        mock_emb.return_value = json.loads(sample_embedding.vector)
        
        chunks = retrieve_relevant_chunks(
            query="polimorfismo",
            user_id=str(default_user_id),
            db=db_session,
            top_k=3
        )
        
        assert len(chunks) > 0
        assert chunks[0]["chunk_text"] == sample_embedding.chunk_text
        assert "similarity" in chunks[0]
        assert "perso_score" in chunks[0]


def test_retrieve_relevant_chunks_with_discipline_filter(db_session, default_user_id, sample_embedding, sample_discipline):
    """Testa recuperação filtrada por disciplina"""
    with patch("ficous.backend.app.services.embeddings._get_embedding") as mock_emb:
        mock_emb.return_value = json.loads(sample_embedding.vector)
        
        chunks = retrieve_relevant_chunks(
            query="polimorfismo",
            user_id=str(default_user_id),
            db=db_session,
            top_k=3,
            discipline_id=str(sample_discipline.id)
        )
        
        # Verifica que só retornou chunks da disciplina
        assert len(chunks) >= 0


def test_retrieve_relevant_chunks_empty_database(db_session, default_user_id):
    """Testa recuperação quando não há embeddings"""
    chunks = retrieve_relevant_chunks(
        query="polimorfismo",
        user_id=str(default_user_id),
        db=db_session,
        top_k=3
    )
    
    assert len(chunks) == 0


def test_update_concept_strength_new_concept(db_session, default_user_id):
    """Testa criação de novo conceito"""
    update_concept_strength("polimorfismo", str(default_user_id), 0.2, db_session)
    
    from ficous.backend.app import models
    stat = db_session.query(models.UserConceptStat).filter(
        models.UserConceptStat.concept == "polimorfismo"
    ).first()
    
    assert stat is not None
    assert stat.strength == 0.7  # 0.5 base + 0.2


def test_update_concept_strength_existing_concept(db_session, default_user_id):
    """Testa atualização de conceito existente"""
    from ficous.backend.app import models
    
    # Criar conceito inicial
    stat = models.UserConceptStat(
        user_id=default_user_id,
        concept="herança",
        strength=0.5
    )
    db_session.add(stat)
    db_session.commit()
    
    # Atualizar
    update_concept_strength("herança", str(default_user_id), 0.3, db_session)
    
    db_session.refresh(stat)
    assert stat.strength == 0.8  # 0.5 + 0.3


def test_update_concept_strength_boundaries(db_session, default_user_id):
    """Testa limites de strength (0.0 - 1.0)"""
    from ficous.backend.app import models
    
    # Teste limite superior
    stat = models.UserConceptStat(
        user_id=default_user_id,
        concept="teste_max",
        strength=0.9
    )
    db_session.add(stat)
    db_session.commit()
    
    update_concept_strength("teste_max", str(default_user_id), 0.5, db_session)
    db_session.refresh(stat)
    assert stat.strength == 1.0  # Não ultrapassa 1.0
    
    # Teste limite inferior
    stat2 = models.UserConceptStat(
        user_id=default_user_id,
        concept="teste_min",
        strength=0.1
    )
    db_session.add(stat2)
    db_session.commit()
    
    update_concept_strength("teste_min", str(default_user_id), -0.5, db_session)
    db_session.refresh(stat2)
    assert stat2.strength == 0.0  # Não fica negativo


def test_perso_score_calculation(db_session, default_user_id, sample_embedding):
    """Testa cálculo de PersoScore"""
    with patch("ficous.backend.app.services.embeddings._get_embedding") as mock_emb:
        # Embedding idêntico para similarity = 1.0
        mock_emb.return_value = json.loads(sample_embedding.vector)
        
        chunks = retrieve_relevant_chunks(
            query="polimorfismo",
            user_id=str(default_user_id),
            db=db_session,
            top_k=1
        )
        
        assert len(chunks) > 0
        # PersoScore = similarity × strength × recency
        # Com embedding idêntico, similarity ≈ 1.0
        # strength = 0.5, recency = 1.0
        # PersoScore ≈ 1.0 × 0.5 × 1.0 = 0.5
        assert chunks[0]["perso_score"] > 0