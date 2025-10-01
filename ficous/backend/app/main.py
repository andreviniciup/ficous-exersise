from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager

from .database import engine, Base
from .config import CORS_ORIGINS
from .routers import health
from .routers import disciplines, notes


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="Ficous API",
    description="API do caderno digital Ficous",
    version="0.1.0",
    lifespan=lifespan
)


cors_origins = CORS_ORIGINS.split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(health.router, prefix="/ficous")
app.include_router(disciplines.router)
app.include_router(notes.router)


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
        "version": "0.1.0",
        "docs": "/docs"
    }


