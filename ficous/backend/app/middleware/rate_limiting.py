"""
Rate limiting middleware para endpoints Sage
"""
import os
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse

# Configurações de rate limiting
SAGE_RATE_LIMIT = os.getenv("SAGE_RATE_LIMIT", "10/minute")
SAGE_RATE_LIMIT_BURST = os.getenv("SAGE_RATE_LIMIT_BURST", "20/minute")

# Limiter global
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=[SAGE_RATE_LIMIT]
)

# Rate limits específicos por endpoint
SAGE_ANSWER_LIMITS = [SAGE_RATE_LIMIT, SAGE_RATE_LIMIT_BURST]
SAGE_PROCESS_LIMITS = ["5/minute"]
SAGE_ADMIN_LIMITS = ["2/minute"]


def get_user_rate_limit_key(request: Request) -> str:
    """Gera chave de rate limiting baseada no usuário autenticado"""
    # Tentar pegar user_id do token JWT
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        try:
            from ..security import verify_token
            token = auth_header.split(" ")[1]
            payload = verify_token(token)
            if payload and "sub" in payload:
                return f"user:{payload['sub']}"
        except Exception:
            pass
    
    # Fallback para IP
    return get_remote_address(request)


def rate_limit_exceeded_handler(request: Request, exc: RateLimitExceeded):
    """Handler customizado para rate limit exceeded"""
    return JSONResponse(
        status_code=429,
        content={
            "success": False,
            "message": "Muitas requisições. Tente novamente em alguns minutos.",
            "retry_after": exc.retry_after,
            "detail": "Rate limit exceeded"
        }
    )


# Decorator para aplicar rate limiting
def sage_rate_limit(limits: list[str]):
    """Decorator para aplicar rate limiting em endpoints Sage"""
    def decorator(func):
        return limiter.limit(limits, key_func=get_user_rate_limit_key)(func)
    return decorator
