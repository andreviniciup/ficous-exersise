"""
Fixtures globais para testes do Ficous Backend
"""
import os
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
import uuid

# Configurar para modo de teste
os.environ["AUTH_REQUIRED"] = "false"
os.environ["SAGE_AUTO_PROCESS"] = "false"  # Desabilitar para testes unitários
os.environ["ADMIN_ENABLED"] = "true"
os.environ["OPENAI_API_KEY"] = "test-key"
os.environ["DATABASE_URL"] = "sqlite:///:memory:"  # Forçar SQLite

# Database de teste em memória (SQLite)
SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Sobrescrever o engine do database.py
import ficous.backend.app.database as db_module
db_module.engine = engine
db_module.SessionLocal = TestingSessionLocal

from ficous.backend.app.main import app
from ficous.backend.app.database import Base, get_db
from ficous.backend.app import models


@pytest.fixture(scope="function")
def db_session():
    """Cria uma sessão de banco para cada teste"""
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db_session):
    """Cliente de teste com override de dependência do DB"""
    def override_get_db():
        try:
            yield db_session
        finally:
            pass
    
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def default_user_id():
    """User ID padrão para testes"""
    return uuid.UUID("00000000-0000-0000-0000-000000000000")


@pytest.fixture
def sample_discipline(db_session, default_user_id):
    """Cria uma disciplina de exemplo"""
    discipline = models.Discipline(
        id=uuid.uuid4(),
        user_id=default_user_id,
        name="Programação"
    )
    db_session.add(discipline)
    db_session.commit()
    db_session.refresh(discipline)
    return discipline


@pytest.fixture
def sample_note(db_session, default_user_id, sample_discipline):
    """Cria uma nota de exemplo"""
    note = models.Note(
        id=uuid.uuid4(),
        user_id=default_user_id,
        discipline_id=sample_discipline.id,
        title="Polimorfismo em POO",
        content="Polimorfismo é um dos pilares da OOP. Permite que objetos de diferentes classes sejam tratados de forma uniforme.",
        summary="Conceito de polimorfismo em programação orientada a objetos.",
        concepts_json=["polimorfismo", "OOP", "herança"],
        tags_json=["poo", "conceitos"]
    )
    db_session.add(note)
    db_session.commit()
    db_session.refresh(note)
    return note


@pytest.fixture
def sample_flashcard(db_session, default_user_id, sample_discipline):
    """Cria um flashcard de exemplo"""
    card = models.Flashcard(
        id=uuid.uuid4(),
        user_id=default_user_id,
        discipline_id=sample_discipline.id,
        question="O que é polimorfismo?",
        answer="Capacidade de objetos de diferentes classes responderem de forma única ao mesmo método."
    )
    db_session.add(card)
    db_session.commit()
    db_session.refresh(card)
    return card


@pytest.fixture
def sample_embedding(db_session, default_user_id, sample_note):
    """Cria um embedding de exemplo"""
    import json
    import numpy as np
    
    embedding = models.Embedding(
        id=uuid.uuid4(),
        user_id=default_user_id,
        owner_type="note",
        owner_id=sample_note.id,
        chunk_text="Polimorfismo permite que objetos sejam tratados de forma uniforme.",
        vector=json.dumps(np.random.rand(1536).tolist()),
        meta={"concept_tags": ["polimorfismo"], "strength": 0.5, "recency": 1.0}
    )
    db_session.add(embedding)
    db_session.commit()
    db_session.refresh(embedding)
    return embedding


@pytest.fixture
def mock_openai_response():
    """Mock de resposta da OpenAI para testes sem API"""
    return {
        "level1": {
            "type": "level1",
            "payload": {
                "balloons": [
                    {"text": "Resposta curta 1"},
                    {"text": "Resposta curta 2"}
                ]
            }
        },
        "level2": {
            "type": "level2",
            "payload": {
                "slides": [
                    {
                        "title": "Conceito",
                        "bullets": ["Ponto 1", "Ponto 2", "Ponto 3"]
                    }
                ]
            }
        },
        "level3": {
            "type": "level3",
            "payload": {
                "sections": [
                    {
                        "title": "Introdução",
                        "content": "Conteúdo detalhado...",
                        "code": "def exemplo(): pass"
                    }
                ]
            }
        },
        "summary": {
            "summary": "Resumo do conteúdo",
            "questions": ["Pergunta 1?", "Pergunta 2?", "Pergunta 3?"]
        }
    }


@pytest.fixture
def sample_pdf_bytes():
    """Retorna bytes de um PDF de teste simples"""
    # PDF mínimo válido (48 bytes)
    return b"%PDF-1.0\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<<>>>>endobj\nxref\n0 4\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n210\n%%EOF"


# Helper functions para testes
def assert_valid_uuid(value):
    """Valida se um valor é um UUID válido"""
    try:
        uuid.UUID(str(value))
        return True
    except (ValueError, AttributeError):
        return False


def assert_response_success(response, status_code=200):
    """Valida resposta bem-sucedida da API"""
    assert response.status_code == status_code
    data = response.json()
    if isinstance(data, dict):
        assert data.get("success", True) is not False
    return data