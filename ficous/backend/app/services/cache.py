"""
Sistema de cache para respostas do Sage
"""
import os
import json
import hashlib
import time
from typing import Optional, Any, Dict
import redis
from ..config import CORS_ORIGINS

# Configuração Redis (opcional)
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
CACHE_TTL = int(os.getenv("CACHE_TTL_SECONDS", "300"))  # 5 min default

# Fallback in-memory se Redis não disponível
_memory_cache: Dict[str, Dict[str, Any]] = {}


def _get_redis_client() -> Optional[redis.Redis]:
    """Conecta ao Redis ou retorna None para fallback"""
    try:
        return redis.from_url(REDIS_URL, decode_responses=True)
    except Exception:
        return None


def _generate_cache_key(prompt: str, context: str, model: str = "gpt-4o-mini") -> str:
    """Gera chave de cache baseada em hash do conteúdo"""
    content = f"{prompt}|{context}|{model}"
    return hashlib.sha256(content.encode()).hexdigest()[:16]


def get_cached_response(prompt: str, context: str, model: str = "gpt-4o-mini") -> Optional[Dict[str, Any]]:
    """Recupera resposta do cache se disponível"""
    key = _generate_cache_key(prompt, context, model)
    
    # Tentar Redis primeiro
    redis_client = _get_redis_client()
    if redis_client:
        try:
            cached = redis_client.get(f"sage_response:{key}")
            if cached:
                return json.loads(cached)
        except Exception:
            pass
    
    # Fallback: cache em memória
    if key in _memory_cache:
        entry = _memory_cache[key]
        if time.time() - entry["timestamp"] < CACHE_TTL:
            return entry["data"]
        else:
            del _memory_cache[key]
    
    return None


def set_cached_response(
    prompt: str, 
    context: str, 
    response: Dict[str, Any], 
    model: str = "gpt-4o-mini"
) -> None:
    """Armazena resposta no cache"""
    key = _generate_cache_key(prompt, context, model)
    data = {
        "data": response,
        "timestamp": time.time()
    }
    
    # Tentar Redis primeiro
    redis_client = _get_redis_client()
    if redis_client:
        try:
            redis_client.setex(f"sage_response:{key}", CACHE_TTL, json.dumps(response))
            return
        except Exception:
            pass
    
    # Fallback: cache em memória
    _memory_cache[key] = data
    
    # Limpeza periódica do cache em memória
    if len(_memory_cache) > 1000:
        current_time = time.time()
        expired_keys = [
            k for k, v in _memory_cache.items() 
            if current_time - v["timestamp"] > CACHE_TTL
        ]
        for k in expired_keys:
            del _memory_cache[k]


def get_cache_stats() -> Dict[str, Any]:
    """Retorna estatísticas do cache"""
    redis_client = _get_redis_client()
    
    stats = {
        "backend": "redis" if redis_client else "memory",
        "memory_entries": len(_memory_cache),
        "ttl_seconds": CACHE_TTL
    }
    
    if redis_client:
        try:
            info = redis_client.info()
            stats.update({
                "redis_used_memory": info.get("used_memory_human"),
                "redis_connected_clients": info.get("connected_clients")
            })
        except Exception:
            pass
    
    return stats


def clear_cache() -> None:
    """Limpa todo o cache"""
    redis_client = _get_redis_client()
    if redis_client:
        try:
            redis_client.flushdb()
        except Exception:
            pass
    
    _memory_cache.clear()
