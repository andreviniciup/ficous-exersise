from sqlalchemy import Column, String, DateTime, ForeignKey, Text, Float
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
try:
    from sqlalchemy import JSON
except Exception:
    from sqlalchemy.types import JSON  # fallback

from .database import Base

from sqlalchemy.types import TypeDecorator, CHAR


class GUID(TypeDecorator):
    """Plataforma-agnóstico GUID type.

    Usa PG UUID quando disponível; caso contrário, CHAR(36) com strings.
    """

    impl = CHAR
    cache_ok = True

    def load_dialect_impl(self, dialect):
        if dialect.name == 'postgresql':
            return dialect.type_descriptor(PG_UUID(as_uuid=True))
        else:
            return dialect.type_descriptor(CHAR(36))

    def process_bind_param(self, value, dialect):
        if value is None:
            return value
        if dialect.name == 'postgresql':
            if isinstance(value, uuid.UUID):
                return value
            return uuid.UUID(str(value))
        else:
            if isinstance(value, uuid.UUID):
                return str(value)
            return str(uuid.UUID(str(value)))

    def process_result_value(self, value, dialect):
        if value is None:
            return value
        if dialect.name == 'postgresql':
            return value
        return uuid.UUID(value)


class Discipline(Base):
    __tablename__ = "ficous_disciplines"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(GUID(), nullable=False, index=True)
    name = Column(String(100), nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    notes = relationship("Note", back_populates="discipline", cascade="all, delete-orphan")


class Note(Base):
    __tablename__ = "ficous_notes"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(GUID(), nullable=False, index=True)
    discipline_id = Column(GUID(), ForeignKey("ficous_disciplines.id", ondelete="SET NULL"), nullable=True)
    title = Column(String(200), nullable=True)
    content = Column(Text, nullable=False)
    summary = Column(Text, nullable=True)
    questions_json = Column(JSON, nullable=True)
    tags_json = Column(JSON, nullable=True)
    concepts_json = Column(JSON, nullable=True)
    source_pdf_meta = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    discipline = relationship("Discipline", back_populates="notes")


# -----------------
# Flashcards (SM-2)
# -----------------

class Flashcard(Base):
    __tablename__ = "ficous_flashcards"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(GUID(), nullable=False, index=True)
    discipline_id = Column(GUID(), ForeignKey("ficous_disciplines.id", ondelete="SET NULL"), nullable=True)
    note_id = Column(GUID(), ForeignKey("ficous_notes.id", ondelete="SET NULL"), nullable=True)

    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=False)

    ease = Column(String(10), nullable=True)  # easy|medium|hard (histórico recente opcional)
    reps = Column(String(20), nullable=True)  # contador textual simples ou pode ser inteiro em outra versão
    interval_days = Column(String(20), nullable=True)  # próximo intervalo em dias (string para flexibilidade)
    next_review_at = Column(DateTime(timezone=True), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


# --------------
# Exercícios
# --------------

class Exercise(Base):
    __tablename__ = "ficous_exercises"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(GUID(), nullable=False, index=True)
    discipline_id = Column(GUID(), ForeignKey("ficous_disciplines.id", ondelete="SET NULL"), nullable=True)
    note_id = Column(GUID(), ForeignKey("ficous_notes.id", ondelete="SET NULL"), nullable=True)

    title = Column(String(200), nullable=True)
    meta_json = Column(JSON, nullable=True)  # configurações, tipo (mcq/open/mix), etc.

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


# --------------
# Library (fontes)
# --------------

class Source(Base):
    __tablename__ = "ficous_sources"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(GUID(), nullable=False, index=True)
    discipline_id = Column(GUID(), ForeignKey("ficous_disciplines.id", ondelete="SET NULL"), nullable=True)
    note_id = Column(GUID(), ForeignKey("ficous_notes.id", ondelete="SET NULL"), nullable=True)

    filename = Column(String(255), nullable=False)
    mime_type = Column(String(100), nullable=True)
    size_bytes = Column(String(50), nullable=True)
    content_excerpt = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


# -----------------
# Personalização Fase 1
# -----------------

class Interaction(Base):
    __tablename__ = "ficous_interactions"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(GUID(), nullable=False, index=True)
    discipline_id = Column(GUID(), ForeignKey("ficous_disciplines.id", ondelete="SET NULL"), nullable=True)
    note_id = Column(GUID(), ForeignKey("ficous_notes.id", ondelete="SET NULL"), nullable=True)

    prompt = Column(Text, nullable=False)
    response_meta = Column(JSON, nullable=True)
    tokens_used = Column(String(50), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Summary(Base):
    __tablename__ = "ficous_summaries"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(GUID(), nullable=False, index=True)
    scope = Column(String(20), nullable=False)  # global|discipline|note|rolling
    discipline_id = Column(GUID(), ForeignKey("ficous_disciplines.id", ondelete="SET NULL"), nullable=True)
    note_id = Column(GUID(), ForeignKey("ficous_notes.id", ondelete="SET NULL"), nullable=True)
    text = Column(Text, nullable=False)
    last_refresh_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class UserConceptStat(Base):
    __tablename__ = "ficous_user_concept_stats"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(GUID(), nullable=False, index=True)
    concept = Column(String(120), nullable=False, index=True)
    strength = Column(Float, nullable=True)  # 0.0 fraco -> 1.0 forte
    attempts = Column(String(20), nullable=True)
    success_rate = Column(String(20), nullable=True)
    last_seen_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class UserDisciplineStat(Base):
    __tablename__ = "ficous_user_discipline_stats"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(GUID(), nullable=False, index=True)
    discipline_id = Column(GUID(), ForeignKey("ficous_disciplines.id", ondelete="CASCADE"), nullable=False)
    affinity = Column(Float, nullable=True)  # 0..1
    last_activity_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


# -----------------
# Embeddings (RAG)
# -----------------

class Embedding(Base):
    __tablename__ = "ficous_embeddings"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(GUID(), nullable=False, index=True)
    owner_type = Column(String(20), nullable=False)  # note|source|summary|concept
    owner_id = Column(GUID(), nullable=True, index=True)
    chunk_text = Column(Text, nullable=False)
    vector = Column(Text, nullable=True)  # JSON array de floats (1536d para OpenAI)
    meta = Column(JSON, nullable=True)  # {concept_tags, strength, recency, tokens}
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class ExerciseItem(Base):
    __tablename__ = "ficous_exercise_items"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4, index=True)
    exercise_id = Column(GUID(), ForeignKey("ficous_exercises.id", ondelete="CASCADE"), nullable=False)

    question = Column(Text, nullable=False)
    kind = Column(String(20), nullable=False)  # mcq|open
    options_json = Column(JSON, nullable=True)  # para mcq
    answer_json = Column(JSON, nullable=True)   # gabarito ou exemplo de resposta

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class ExerciseAttempt(Base):
    __tablename__ = "ficous_exercise_attempts"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4, index=True)
    exercise_id = Column(GUID(), ForeignKey("ficous_exercises.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(GUID(), nullable=False, index=True)

    answers_json = Column(JSON, nullable=True)
    score = Column(String(20), nullable=True)  # percentual ou nota textual
    feedback = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


