"""
Circuit breaker para chamadas OpenAI com retry e backoff exponencial
"""
import os
import time
import random
from typing import Optional, Callable, Any
import httpx
from tenacity import (
    retry, 
    stop_after_attempt, 
    wait_exponential, 
    retry_if_exception_type,
    before_sleep_log
)
import logging

logger = logging.getLogger(__name__)

# Configurações do circuit breaker
MAX_RETRIES = int(os.getenv("OPENAI_MAX_RETRIES", "3"))
BASE_DELAY = float(os.getenv("OPENAI_BASE_DELAY", "1.0"))
MAX_DELAY = float(os.getenv("OPENAI_MAX_DELAY", "10.0"))
JITTER = os.getenv("OPENAI_JITTER", "true").lower() == "true"


def _add_jitter(delay: float) -> float:
    """Adiciona jitter aleatório para evitar thundering herd"""
    if JITTER:
        jitter_factor = random.uniform(0.5, 1.5)
        return delay * jitter_factor
    return delay


@retry(
    stop=stop_after_attempt(MAX_RETRIES),
    wait=wait_exponential(multiplier=BASE_DELAY, min=BASE_DELAY, max=MAX_DELAY),
    retry=retry_if_exception_type((httpx.HTTPError, httpx.TimeoutException, httpx.ConnectError)),
    before_sleep=before_sleep_log(logger, logging.WARNING)
)
def call_openai_with_retry(
    system_prompt: str, 
    user_prompt: str, 
    model: str = "gpt-4o-mini",
    temperature: float = 0.2
) -> str:
    """
    Chama OpenAI API com circuit breaker e retry automático
    """
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("OPENAI_API_KEY não configurada")
    
    # Adicionar jitter ao delay
    time.sleep(_add_jitter(0.1))
    
    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        "temperature": temperature
    }
    headers = {
        "Authorization": f"Bearer {api_key}", 
        "Content-Type": "application/json"
    }
    
    timeout = httpx.Timeout(30.0, connect=10.0)
    
    with httpx.Client(timeout=timeout) as client:
        resp = client.post(
            "https://api.openai.com/v1/chat/completions", 
            json=payload, 
            headers=headers
        )
        resp.raise_for_status()
        data = resp.json()
        return data["choices"][0]["message"]["content"]


def call_openai_embeddings_with_retry(text: str, model: str = "text-embedding-3-small") -> list[float]:
    """
    Chama OpenAI Embeddings API com circuit breaker
    """
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("OPENAI_API_KEY não configurada")
    
    time.sleep(_add_jitter(0.1))
    
    payload = {
        "model": model,
        "input": text[:8000]  # Limite OpenAI
    }
    headers = {
        "Authorization": f"Bearer {api_key}", 
        "Content-Type": "application/json"
    }
    
    timeout = httpx.Timeout(30.0, connect=10.0)
    
    with httpx.Client(timeout=timeout) as client:
        resp = client.post(
            "https://api.openai.com/v1/embeddings", 
            json=payload, 
            headers=headers
        )
        resp.raise_for_status()
        data = resp.json()
        return data["data"][0]["embedding"]


class CircuitBreakerState:
    """Estado do circuit breaker"""
    def __init__(self):
        self.failure_count = 0
        self.last_failure_time = 0
        self.state = "CLOSED"  # CLOSED, OPEN, HALF_OPEN
    
    def should_allow_request(self) -> bool:
        """Verifica se deve permitir a requisição"""
        if self.state == "CLOSED":
            return True
        elif self.state == "OPEN":
            # Verificar se deve tentar HALF_OPEN
            if time.time() - self.last_failure_time > 60:  # 1 minuto
                self.state = "HALF_OPEN"
                return True
            return False
        else:  # HALF_OPEN
            return True
    
    def record_success(self):
        """Registra sucesso"""
        self.failure_count = 0
        self.state = "CLOSED"
    
    def record_failure(self):
        """Registra falha"""
        self.failure_count += 1
        self.last_failure_time = time.time()
        
        if self.failure_count >= 5:  # 5 falhas consecutivas
            self.state = "OPEN"


# Instância global do circuit breaker
circuit_breaker = CircuitBreakerState()
