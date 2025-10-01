"""
Endpoints administrativos para megacontexto
"""
import os
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from uuid import UUID
from datetime import datetime

from ..database import get_db
from ..security import get_current_user_id
from .. import models
from ..services.embeddings import index_note_content, index_source_content, retrieve_relevant_chunks
from ..services.summaries import trigger_summary_updates, update_global_summary, update_discipline_summary
from ..services.cache import get_cache_stats, clear_cache


router = APIRouter(prefix="/ficous/admin", tags=["ficous-admin"])

# Configurações
ADMIN_ENABLED = os.getenv("ADMIN_ENABLED", "true").lower() == "true"


@router.post("/rebuild-summaries")
def rebuild_summaries(
    user_id: UUID = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Rebuild todos os summaries do usuário"""
    if not ADMIN_ENABLED:
        raise HTTPException(status_code=403, detail="Admin endpoints desabilitados")
    
    try:
        results = trigger_summary_updates(str(user_id), db)
        return {
            "success": True,
            "message": "Summaries rebuild iniciado",
            "results": results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao rebuild summaries: {e}")


@router.post("/recompute-stats")
def recompute_stats(
    user_id: UUID = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Recomputa estatísticas de conceitos e disciplinas"""
    if not ADMIN_ENABLED:
        raise HTTPException(status_code=403, detail="Admin endpoints desabilitados")
    
    try:
        # Resetar stats de conceitos
        db.query(models.UserConceptStat).filter(
            models.UserConceptStat.user_id == user_id
        ).delete()
        
        # Resetar stats de disciplinas
        db.query(models.UserDisciplineStat).filter(
            models.UserDisciplineStat.user_id == user_id
        ).delete()
        
        # Recomputar baseado nas interações
        interactions = db.query(models.Interaction).filter(
            models.Interaction.user_id == user_id
        ).order_by(models.Interaction.created_at.desc()).limit(100).all()
        
        concept_counts = {}
        discipline_counts = {}
        
        for interaction in interactions:
            # Contar conceitos das notas
            if interaction.note_id:
                note = db.query(models.Note).filter(models.Note.id == interaction.note_id).first()
                if note and note.concepts_json:
                    for concept in note.concepts_json:
                        concept_counts[concept] = concept_counts.get(concept, 0) + 1
            
            # Contar disciplinas
            if interaction.discipline_id:
                discipline_counts[interaction.discipline_id] = discipline_counts.get(interaction.discipline_id, 0) + 1
        
        # Criar stats de conceitos
        for concept, count in concept_counts.items():
            strength = min(1.0, count / 10.0)  # Normalizar para 0-1
            stat = models.UserConceptStat(
                user_id=user_id,
                concept=concept,
                strength=strength
            )
            db.add(stat)
        
        # Criar stats de disciplinas
        for discipline_id, count in discipline_counts.items():
            affinity = min(1.0, count / 5.0)  # Normalizar para 0-1
            stat = models.UserDisciplineStat(
                user_id=user_id,
                discipline_id=discipline_id,
                affinity=affinity
            )
            db.add(stat)
        
        db.commit()
        
        return {
            "success": True,
            "message": "Stats recomputadas",
            "concepts_updated": len(concept_counts),
            "disciplines_updated": len(discipline_counts)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao recomputar stats: {e}")


@router.post("/index-content")
def index_content(
    content_type: str = Query(..., description="Tipo: 'notes', 'sources', 'all'"),
    user_id: UUID = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Indexa conteúdo para embeddings"""
    if not ADMIN_ENABLED:
        raise HTTPException(status_code=403, detail="Admin endpoints desabilitados")
    
    try:
        indexed = 0
        
        if content_type in ["notes", "all"]:
            notes = db.query(models.Note).filter(models.Note.user_id == user_id).all()
            for note in notes:
                indexed += index_note_content(note, db)
        
        if content_type in ["sources", "all"]:
            sources = db.query(models.Source).filter(models.Source.user_id == user_id).all()
            for source in sources:
                indexed += index_source_content(source, db)
        
        return {
            "success": True,
            "message": f"Conteúdo indexado: {indexed} chunks",
            "indexed_chunks": indexed
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao indexar conteúdo: {e}")


@router.get("/dry-run")
def dry_run_rag(
    query: str = Query(..., description="Query para testar RAG"),
    user_id: UUID = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Testa RAG sem fazer alterações"""
    if not ADMIN_ENABLED:
        raise HTTPException(status_code=403, detail="Admin endpoints desabilitados")
    
    try:
        chunks = retrieve_relevant_chunks(query, str(user_id), db, top_k=5)
        
        return {
            "success": True,
            "query": query,
            "chunks_found": len(chunks),
            "chunks": [
                {
                    "text": chunk["chunk_text"][:200] + "...",
                    "similarity": chunk["similarity"],
                    "perso_score": chunk["perso_score"],
                    "owner_type": chunk["owner_type"]
                }
                for chunk in chunks
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro no dry-run RAG: {e}")


@router.get("/cache-stats")
def get_cache_stats_endpoint():
    """Retorna estatísticas do cache"""
    if not ADMIN_ENABLED:
        raise HTTPException(status_code=403, detail="Admin endpoints desabilitados")
    
    try:
        stats = get_cache_stats()
        return {
            "success": True,
            "cache_stats": stats
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao obter stats do cache: {e}")


@router.post("/clear-cache")
def clear_cache_endpoint():
    """Limpa todo o cache"""
    if not ADMIN_ENABLED:
        raise HTTPException(status_code=403, detail="Admin endpoints desabilitados")
    
    try:
        clear_cache()
        return {
            "success": True,
            "message": "Cache limpo com sucesso"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao limpar cache: {e}")


@router.get("/health")
def admin_health_check(
    user_id: UUID = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Health check do sistema de megacontexto"""
    if not ADMIN_ENABLED:
        raise HTTPException(status_code=403, detail="Admin endpoints desabilitados")
    
    try:
        # Contar entidades
        notes_count = db.query(models.Note).filter(models.Note.user_id == user_id).count()
        embeddings_count = db.query(models.Embedding).filter(models.Embedding.user_id == user_id).count()
        summaries_count = db.query(models.Summary).filter(models.Summary.user_id == user_id).count()
        interactions_count = db.query(models.Interaction).filter(models.Interaction.user_id == user_id).count()
        
        # Stats do cache
        cache_stats = get_cache_stats()
        
        return {
            "success": True,
            "health": {
                "notes": notes_count,
                "embeddings": embeddings_count,
                "summaries": summaries_count,
                "interactions": interactions_count,
                "cache": cache_stats
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro no health check: {e}")
