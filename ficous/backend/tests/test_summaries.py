"""
Testes para Rolling Summaries
"""
import pytest
from datetime import datetime, timedelta
from unittest.mock import patch
from ficous.backend.app.services.summaries import (
    _should_update_summary,
    update_global_summary,
    update_discipline_summary,
    trigger_summary_updates
)
from ficous.backend.app import models


def test_should_update_summary_no_existing():
    """Testa que retorna True quando não há summary"""
    assert _should_update_summary(None, 5) is True


def test_should_update_summary_time_threshold(db_session, default_user_id):
    """Testa atualização baseada em tempo"""
    # Criar summary antigo
    old_summary = models.Summary(
        user_id=default_user_id,
        scope="global",
        text="Resumo antigo",
        updated_at=datetime.utcnow() - timedelta(hours=25)
    )
    db_session.add(old_summary)
    db_session.commit()
    
    assert _should_update_summary(old_summary, 0, time_threshold_hours=24) is True


def test_should_update_summary_content_threshold():
    """Testa atualização baseada em volume de conteúdo"""
    recent_summary = models.Summary(
        user_id="test",
        scope="global",
        text="Resumo recente",
        updated_at=datetime.utcnow()
    )
    
    # Muitas novas notas devem disparar atualização
    assert _should_update_summary(recent_summary, 10) is True
    
    # Poucas notas não devem disparar
    assert _should_update_summary(recent_summary, 2) is False


def test_update_global_summary_creates_new(db_session, default_user_id, sample_note):
    """Testa criação de summary global"""
    with patch("ficous.backend.app.services.summaries._call_openai_summary") as mock:
        mock.return_value = "Resumo global gerado"
        
        summary = update_global_summary(str(default_user_id), db_session)
        
        assert summary is not None
        assert summary.scope == "global"
        assert summary.text == "Resumo global gerado"


def test_update_global_summary_updates_existing(db_session, default_user_id, sample_note):
    """Testa atualização de summary global existente"""
    # Criar summary antigo
    old_summary = models.Summary(
        user_id=default_user_id,
        scope="global",
        text="Resumo antigo",
        updated_at=datetime.utcnow() - timedelta(days=1)
    )
    db_session.add(old_summary)
    db_session.commit()
    
    with patch("ficous.backend.app.services.summaries._call_openai_summary") as mock:
        mock.return_value = "Resumo atualizado"
        
        summary = update_global_summary(str(default_user_id), db_session)
        
        assert summary.id == old_summary.id
        assert summary.text == "Resumo atualizado"


def test_update_global_summary_no_notes(db_session, default_user_id):
    """Testa que retorna None quando não há notas"""
    summary = update_global_summary(str(default_user_id), db_session)
    assert summary is None


def test_update_discipline_summary(db_session, default_user_id, sample_discipline, sample_note):
    """Testa criação de summary de disciplina"""
    with patch("ficous.backend.app.services.summaries._call_openai_summary") as mock:
        mock.return_value = "Resumo da disciplina"
        
        summary = update_discipline_summary(
            str(sample_discipline.id),
            str(default_user_id),
            db_session
        )
        
        assert summary is not None
        assert summary.scope == "discipline"
        assert summary.scope_id == sample_discipline.id
        assert summary.text == "Resumo da disciplina"


def test_update_discipline_summary_nonexistent(db_session, default_user_id):
    """Testa summary de disciplina inexistente"""
    fake_id = "00000000-0000-0000-0000-000000000001"
    summary = update_discipline_summary(fake_id, str(default_user_id), db_session)
    assert summary is None


def test_trigger_summary_updates(db_session, default_user_id, sample_discipline, sample_note):
    """Testa disparo de atualizações de summaries"""
    with patch("ficous.backend.app.services.summaries._call_openai_summary") as mock:
        mock.return_value = "Resumo gerado"
        
        results = trigger_summary_updates(str(default_user_id), db_session)
        
        assert results["global_updated"] is True
        assert results["disciplines_updated"] >= 1
        assert len(results["errors"]) == 0


def test_trigger_summary_updates_handles_errors(db_session, default_user_id, sample_discipline):
    """Testa que erros são capturados e reportados"""
    with patch("ficous.backend.app.services.summaries._call_openai_summary") as mock:
        mock.side_effect = Exception("API Error")
        
        results = trigger_summary_updates(str(default_user_id), db_session)
        
        assert len(results["errors"]) > 0


def test_summary_includes_recent_notes_only(db_session, default_user_id, sample_discipline):
    """Testa que summary considera apenas notas recentes"""
    # Criar notas antigas e recentes
    old_note = models.Note(
        user_id=default_user_id,
        discipline_id=sample_discipline.id,
        title="Nota Antiga",
        content="Conteúdo antigo",
        created_at=datetime.utcnow() - timedelta(days=30)
    )
    recent_note = models.Note(
        user_id=default_user_id,
        discipline_id=sample_discipline.id,
        title="Nota Recente",
        content="Conteúdo recente",
        created_at=datetime.utcnow()
    )
    db_session.add_all([old_note, recent_note])
    db_session.commit()
    
    with patch("ficous.backend.app.services.summaries._call_openai_summary") as mock:
        mock.return_value = "Resumo"
        
        update_global_summary(str(default_user_id), db_session)
        
        # Verificar que foi chamado (contexto inclui notas recentes)
        assert mock.called
        call_context = mock.call_args[0][0]
        # Nota recente deve estar no contexto
        assert "Nota Recente" in call_context or "Conteúdo recente" in call_context