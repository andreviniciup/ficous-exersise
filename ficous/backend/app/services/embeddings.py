"""
Serviço de embeddings e RAG para o Ficous
"""
import os
import json
import hashlib
from typing import List, Dict, Any, Optional, Tuple
from sqlalchemy.orm import Session
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

from .. import models
from ..utils import _clean_text


def _get_embedding(text: str) -> List[float]:
    """Gera embedding via OpenAI ou fallback local"""
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        # Fallback: embedding aleatório (para desenvolvimento)
        return np.random.rand(1536).tolist()
    
    import httpx
    payload = {
        "model": "text-embedding-3-small",
        "input": text[:8000]  # limite OpenAI
    }
    headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
    
    try:
        with httpx.Client(timeout=30) as client:
            resp = client.post("https://api.openai.com/v1/embeddings", json=payload, headers=headers)
            resp.raise_for_status()
            data = resp.json()
            return data["data"][0]["embedding"]
    except Exception:
        # Fallback: embedding aleatório
        return np.random.rand(1536).tolist()


def _chunk_text(text: str, chunk_size: int = 400, overlap: int = 50) -> List[str]:
    """Divide texto em chunks com sobreposição"""
    if len(text) <= chunk_size:
        return [text]
    
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end]
        
        # Tentar quebrar em frase/ponto
        if end < len(text):
            last_period = chunk.rfind('.')
            last_newline = chunk.rfind('\n')
            break_point = max(last_period, last_newline)
            if break_point > chunk_size // 2:
                chunk = chunk[:break_point + 1]
                end = start + break_point + 1
        
        chunks.append(chunk.strip())
        start = end - overlap
    
    return [c for c in chunks if c]


def index_note_content(note: models.Note, db: Session) -> int:
    """Indexa conteúdo de uma nota em chunks com embeddings"""
    if not note.content:
        return 0
    
    # Limpar texto
    clean_text = _clean_text(note.content)
    chunks = _chunk_text(clean_text)
    
    # Remover embeddings antigos desta nota
    db.query(models.Embedding).filter(
        models.Embedding.user_id == note.user_id,
        models.Embedding.owner_type == "note",
        models.Embedding.owner_id == note.id
    ).delete()
    
    indexed = 0
    for chunk in chunks:
        embedding = _get_embedding(chunk)
        meta = {
            "concept_tags": note.concepts_json or [],
            "strength": 0.5,  # default
            "recency": 1.0,
            "tokens": len(chunk.split())
        }
        
        emb = models.Embedding(
            user_id=note.user_id,
            owner_type="note",
            owner_id=note.id,
            chunk_text=chunk,
            vector=json.dumps(embedding),
            meta=meta
        )
        db.add(emb)
        indexed += 1
    
    db.commit()
    return indexed


def index_source_content(source: models.Source, db: Session) -> int:
    """Indexa conteúdo de uma fonte (PDF) em chunks com embeddings"""
    if not source.content_excerpt:
        return 0
    
    clean_text = _clean_text(source.content_excerpt)
    chunks = _chunk_text(clean_text)
    
    # Remover embeddings antigos desta fonte
    db.query(models.Embedding).filter(
        models.Embedding.user_id == source.user_id,
        models.Embedding.owner_type == "source",
        models.Embedding.owner_id == source.id
    ).delete()
    
    indexed = 0
    for chunk in chunks:
        embedding = _get_embedding(chunk)
        meta = {
            "concept_tags": [],
            "strength": 0.5,
            "recency": 1.0,
            "tokens": len(chunk.split())
        }
        
        emb = models.Embedding(
            user_id=source.user_id,
            owner_type="source",
            owner_id=source.id,
            chunk_text=chunk,
            vector=json.dumps(embedding),
            meta=meta
        )
        db.add(emb)
        indexed += 1
    
    db.commit()
    return indexed


def retrieve_relevant_chunks(
    query: str, 
    user_id: str, 
    db: Session, 
    top_k: int = 5,
    discipline_id: Optional[str] = None
) -> List[Dict[str, Any]]:
    """Recupera chunks mais relevantes usando RAG + PersoScore"""
    
    # Embedding da query
    query_embedding = _get_embedding(query)
    
    # Buscar embeddings do usuário
    filters = [models.Embedding.user_id == user_id]
    if discipline_id:
        # Filtrar por disciplina se especificado
        filters.append(models.Embedding.owner_id.in_(
            db.query(models.Note.id).filter(models.Note.discipline_id == discipline_id)
        ))
    
    embeddings = db.query(models.Embedding).filter(*filters).all()
    
    if not embeddings:
        return []
    
    # Calcular similaridades
    results = []
    for emb in embeddings:
        try:
            vector = json.loads(emb.vector) if emb.vector else []
            if not vector:
                continue
                
            similarity = cosine_similarity([query_embedding], [vector])[0][0]
            
            # PersoScore: similaridade × strength × recency
            meta = emb.meta or {}
            strength = meta.get("strength", 0.5)
            recency = meta.get("recency", 1.0)
            perso_score = similarity * strength * recency
            
            results.append({
                "chunk_text": emb.chunk_text,
                "similarity": float(similarity),
                "perso_score": float(perso_score),
                "owner_type": emb.owner_type,
                "owner_id": str(emb.owner_id),
                "meta": meta
            })
        except Exception:
            continue
    
    # Ordenar por PersoScore e retornar top-k
    results.sort(key=lambda x: x["perso_score"], reverse=True)
    return results[:top_k]


def update_concept_strength(
    concept: str, 
    user_id: str, 
    strength_delta: float, 
    db: Session
) -> None:
    """Atualiza força de um conceito baseado em interação"""
    stat = db.query(models.UserConceptStat).filter(
        models.UserConceptStat.user_id == user_id,
        models.UserConceptStat.concept == concept
    ).first()
    
    if stat:
        current_strength = stat.strength or 0.5
        new_strength = max(0.0, min(1.0, current_strength + strength_delta))
        stat.strength = new_strength
    else:
        stat = models.UserConceptStat(
            user_id=user_id,
            concept=concept,
            strength=max(0.0, min(1.0, 0.5 + strength_delta))
        )
        db.add(stat)
    
    db.commit()
