"""
Logging e monitoramento para feature Exercises
"""
import logging
import time
from functools import wraps
from typing import Callable, Any

logger = logging.getLogger("ficous.exercises")


def log_exercise_generation(func: Callable) -> Callable:
    """Decorator para logar geração de exercícios"""
    @wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.time()
        user_id = kwargs.get("user_id", "unknown")
        
        try:
            result = func(*args, **kwargs)
            duration = time.time() - start_time
            
            logger.info(
                f"Exercise generation success | user={user_id} | "
                f"duration={duration:.2f}s | questions={len(result.items) if hasattr(result, 'items') else 0}"
            )
            
            return result
        except Exception as e:
            duration = time.time() - start_time
            logger.error(
                f"Exercise generation failed | user={user_id} | "
                f"duration={duration:.2f}s | error={str(e)}"
            )
            raise
    
    return wrapper
