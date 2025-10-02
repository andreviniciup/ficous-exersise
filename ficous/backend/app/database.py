import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.engine import URL
from .config import DATABASE_URL
import logging

logger = logging.getLogger(__name__)

# Variáveis globais para serem sobrescritas em testes
engine = None
SessionLocal = None
Base = declarative_base()

def _build_engine():
    """Constroi o engine do SQLAlchemy de forma robusta.

    Prioriza variáveis separadas (DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME)
    para evitar problemas de encoding em senhas/usuários. Caso não existam,
    usa DATABASE_URL diretamente.
    """
    db_user = os.getenv("DB_USER")
    db_password = os.getenv("DB_PASSWORD")
    db_host = os.getenv("DB_HOST")
    db_port = os.getenv("DB_PORT")
    db_name = os.getenv("DB_NAME")

    # Se variáveis separadas estiverem presentes, constroi com URL.create
    if db_user and db_password and db_host and db_name:
        drivername = os.getenv("DB_DRIVER", "postgresql+psycopg2")
        port = int(db_port) if db_port and db_port.isdigit() else 5432
        url = URL.create(
            drivername,
            username=db_user,
            password=db_password,
            host=db_host,
            port=port,
            database=db_name,
        )
        logger.info(f"Building engine with separate DB variables for {drivername} on {db_host}:{port}/{db_name}")
        return create_engine(url)
    else:
        # Caso contrário, usa DATABASE_URL diretamente
        logger.info(f"Building engine with DATABASE_URL: {DATABASE_URL}")
        return create_engine(DATABASE_URL)

def initialize_db():
    global engine, SessionLocal
    if engine is None:
        engine = _build_engine()
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        logger.info("Database engine and session initialized.")

# Inicializa o banco de dados na importação
initialize_db()


engine = _build_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_db_driver_info() -> str:
    try:
        return engine.url.drivername
    except Exception:
        return "unknown"


