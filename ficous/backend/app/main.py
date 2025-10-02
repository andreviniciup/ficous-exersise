from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from .database import engine, Base, get_db_driver_info
from .config import CORS_ORIGINS
from .routers import health
from .routers import disciplines, notes, upload, sage
from .routers import flashcards, exercises, progress, library
from .routers import admin


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    # Log simples do driver do banco para diagnóstico
    try:
        driver = get_db_driver_info()
        print(f"[Ficous] Database driver: {driver}")
    except Exception:
        pass
    yield


# Configurar rate limiter
limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="Ficous API",
    description="""
    API do caderno digital Ficous
    
    ## Features Principais
    
    * **Sage**: Assistente IA com 3 níveis de resposta
    * **Exercises**: Geração inteligente de questões (MCQ + Open)
    * **Flashcards**: Sistema de repetição espaçada (SM-2)
    * **RAG**: Busca semântica personalizada
    
    ## Exercises - Pipeline
    
    O sistema de Exercises usa um pipeline em 3 etapas:
    1. **Pré-processamento**: Limpeza, extração de tópicos, validação
    2. **Geração via IA**: OpenAI GPT-4o-mini com prompts otimizados
    3. **Pós-processamento**: Validação, embeddings para abertas, thresholds adaptativos
    
    Avaliação semântica usa similaridade de cosseno (threshold: 0.65-0.75)
    """,
    version="0.2.0",  # Atualizar versão
    lifespan=lifespan,
    contact={
        "name": "Ficous Team",
        "email": "contato@ficous.com"
    },
    license_info={
        "name": "MIT"
    }
)

# Adicionar rate limiter à app
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


cors_origins = CORS_ORIGINS.split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Middleware simples de logging
@app.middleware("http")
async def log_requests(request: Request, call_next):
    try:
        response = await call_next(request)
        return response
    except Exception as exc:
        # Deixamos o handler global formatar a resposta
        raise exc


app.include_router(health.router, prefix="/ficous")
app.include_router(disciplines.router)
app.include_router(notes.router)
app.include_router(upload.router)
app.include_router(sage.router)
app.include_router(flashcards.router)
app.include_router(exercises.router)
app.include_router(progress.router)
app.include_router(library.router)
app.include_router(admin.router)


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": "Erro interno do servidor",
            "error": str(exc)
        }
    )


@app.get("/")
async def root():
    return {
        "message": "Ficous API",
        "version": "0.2.0",
        "docs": "/docs"
    }


