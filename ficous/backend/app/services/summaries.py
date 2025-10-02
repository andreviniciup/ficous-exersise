"""
Serviço de rolling summaries para megacontexto
"""
import os
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from .. import models
from .embeddings import _get_embedding
from .openai_client import call_openai_api_simple


def _should_update_summary(
    summary: models.Summary, 
    new_content_count: int, 
    time_threshold_hours: int = 24
) -> bool:
    """Decide se um summary deve ser atualizado"""
    if not summary:
        return True
    
    time_since_update = datetime.utcnow() - summary.updated_at
    return (
        time_since_update.total_seconds() > time_threshold_hours * 3600 or
        new_content_count > 5  # Muitas notas novas
    )


def update_global_summary(user_id: str, db: Session) -> Optional[models.Summary]:
    """Atualiza resumo global do usuário"""
    # Buscar resumo existente
    global_summary = db.query(models.Summary).filter(
        models.Summary.user_id == user_id,
        models.Summary.scope == "global"
    ).first()
    
    # Contar notas recentes
    recent_notes = db.query(models.Note).filter(
        models.Note.user_id == user_id,
        models.Note.created_at > datetime.utcnow() - timedelta(days=7)
    ).count()
    
    if not _should_update_summary(global_summary, recent_notes):
        return global_summary
    
    # Buscar conteúdo para resumir
    recent_notes = db.query(models.Note).filter(
        models.Note.user_id == user_id
    ).order_by(models.Note.created_at.desc()).limit(10).all()
    
    if not recent_notes:
        return None
    
    # Montar contexto
    content_parts = []
    for note in recent_notes:
        if note.summary:
            content_parts.append(f"Nota '{note.title}': {note.summary}")
        else:
            content_parts.append(f"Nota '{note.title}': {note.content[:200]}...")
    
    context = "\n\n".join(content_parts)
    
    # Gerar resumo via IA
    try:
        system_prompt = (
            "Crie um resumo global do conhecimento do usuário baseado nas notas fornecidas. "
            "Destaque os principais tópicos, conceitos e áreas de interesse. "
            "Máximo 3 parágrafos, foco nos pontos mais importantes."
        )
        
        summary_text = call_openai_api_simple(system_prompt, context[:4000])
        
        if global_summary:
            global_summary.text = summary_text
        else:
            global_summary = models.Summary(
                user_id=user_id,
                scope="global",
                text=summary_text
            )
            db.add(global_summary)
        
        db.commit()
        return global_summary
        
    except Exception:
        return global_summary


def update_discipline_summary(discipline_id: str, user_id: str, db: Session) -> Optional[models.Summary]:
    """Atualiza resumo de uma disciplina específica"""
    discipline = db.query(models.Discipline).filter(
        models.Discipline.id == discipline_id,
        models.Discipline.user_id == user_id
    ).first()
    
    if not discipline:
        return None
    
    # Buscar resumo existente
    discipline_summary = db.query(models.Summary).filter(
        models.Summary.user_id == user_id,
        models.Summary.scope == "discipline",
        models.Summary.scope_id == discipline_id
    ).first()
    
    # Contar notas da disciplina
    notes_count = db.query(models.Note).filter(
        models.Note.discipline_id == discipline_id,
        models.Note.user_id == user_id
    ).count()
    
    if not _should_update_summary(discipline_summary, notes_count):
        return discipline_summary
    
    # Buscar notas da disciplina
    notes = db.query(models.Note).filter(
        models.Note.discipline_id == discipline_id,
        models.Note.user_id == user_id
    ).order_by(models.Note.created_at.desc()).limit(8).all()
    
    if not notes:
        return None
    
    # Montar contexto
    content_parts = [f"Disciplina: {discipline.name}"]
    for note in notes:
        if note.summary:
            content_parts.append(f"Nota '{note.title}': {note.summary}")
        else:
            content_parts.append(f"Nota '{note.title}': {note.content[:200]}...")
    
    context = "\n\n".join(content_parts)
    
    # Gerar resumo via IA
    try:
        system_prompt = (
            f"Crie um resumo específico da disciplina '{discipline.name}' baseado nas notas fornecidas. "
            "Destaque os principais conceitos, tópicos e progresso do usuário nesta disciplina. "
            "Máximo 2 parágrafos, foco nos pontos mais importantes."
        )
        
        summary_text = call_openai_api_simple(system_prompt, context[:3000])
        
        if discipline_summary:
            discipline_summary.text = summary_text
        else:
            discipline_summary = models.Summary(
                user_id=user_id,
                scope="discipline",
                scope_id=discipline_id,
                text=summary_text
            )
            db.add(discipline_summary)
        
        db.commit()
        return discipline_summary
        
    except Exception:
        return discipline_summary


def trigger_summary_updates(user_id: str, db: Session) -> Dict[str, Any]:
    """Dispara atualizações de summaries baseado em triggers"""
    results = {
        "global_updated": False,
        "disciplines_updated": 0,
        "errors": []
    }
    
    try:
        # Atualizar resumo global
        global_summary = update_global_summary(user_id, db)
        if global_summary:
            results["global_updated"] = True
    except Exception as e:
        results["errors"].append(f"Erro no resumo global: {e}")
    
    try:
        # Atualizar resumos de disciplinas
        disciplines = db.query(models.Discipline).filter(
            models.Discipline.user_id == user_id
        ).all()
        
        for discipline in disciplines:
            try:
                discipline_summary = update_discipline_summary(discipline.id, user_id, db)
                if discipline_summary:
                    results["disciplines_updated"] += 1
            except Exception as e:
                results["errors"].append(f"Erro no resumo da disciplina {discipline.name}: {e}")
    
    except Exception as e:
        results["errors"].append(f"Erro geral: {e}")
    
    return results
