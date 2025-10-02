from pydantic import BaseModel, Field
from typing import Optional, List, Any
from uuid import UUID


class DisciplineCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)


class DisciplineUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=100)


class DisciplineOut(BaseModel):
    id: UUID
    name: str

    class Config:
        from_attributes = True


class NoteCreate(BaseModel):
    discipline_id: Optional[UUID] = None
    title: Optional[str] = Field(default=None, max_length=200)
    content: str = Field(min_length=1)


class NoteUpdate(BaseModel):
    discipline_id: Optional[UUID] = None
    title: Optional[str] = Field(default=None, max_length=200)
    content: Optional[str] = None
    summary: Optional[str] = None
    questions_json: Optional[List[str]] = None
    tags_json: Optional[List[str]] = None
    concepts_json: Optional[List[str]] = None


class NoteOut(BaseModel):
    id: UUID
    discipline_id: Optional[UUID]
    title: Optional[str]
    content: str
    summary: Optional[str]
    questions_json: Optional[Any]
    tags_json: Optional[Any]
    concepts_json: Optional[Any]

    class Config:
        from_attributes = True


# -----------------
# Flashcards
# -----------------

class FlashcardCreate(BaseModel):
    discipline_id: Optional[UUID] = None
    note_id: Optional[UUID] = None
    question: str = Field(min_length=1)
    answer: str = Field(min_length=1)


class FlashcardOut(BaseModel):
    id: UUID
    discipline_id: Optional[UUID]
    note_id: Optional[UUID]
    question: str
    answer: str
    ease: Optional[str] = None
    reps: Optional[str] = None
    interval_days: Optional[str] = None
    next_review_at: Optional[Any] = None

    class Config:
        from_attributes = True


class FlashcardGenerateIn(BaseModel):
    note_id: Optional[UUID] = None
    raw_context: Optional[str] = Field(default=None, min_length=1)
    qty: int = Field(default=5, ge=1, le=10)
    normalize: bool = True
    output_language: Optional[str] = "pt-BR"


class FlashcardGradeIn(BaseModel):
    grade: str = Field(pattern=r"^(easy|medium|hard)$")


# -----------------
# Exercícios
# -----------------

class ExerciseItemIn(BaseModel):
    question: str
    kind: str = Field(pattern=r"^(mcq|open)$")
    options_json: Optional[Any] = None
    answer_json: Optional[Any] = None


class ExerciseCreate(BaseModel):
    discipline_id: Optional[UUID] = None
    note_id: Optional[UUID] = None
    title: Optional[str] = None
    meta_json: Optional[Any] = None
    items: List[ExerciseItemIn]


class ExerciseOut(BaseModel):
    id: UUID
    discipline_id: Optional[UUID]
    note_id: Optional[UUID]
    title: Optional[str]
    meta_json: Optional[Any]

    class Config:
        from_attributes = True


class ExerciseItemOut(BaseModel):
    id: UUID
    question: str
    kind: str
    options_json: Optional[Any] = None
    answer_json: Optional[Any] = None

    class Config:
        from_attributes = True


class ExerciseDetailOut(ExerciseOut):
    items: List[ExerciseItemOut] = []


class ExerciseGenerateIn(BaseModel):
    note_id: Optional[UUID] = None
    raw_context: Optional[str] = Field(default=None, min_length=1)
    source_id: Optional[UUID] = None
    qty: int = Field(default=5, ge=1, le=20)
    kind: str = Field(default="mix")
    difficulty: Optional[str] = Field(default="medium", pattern=r"^(easy|medium|hard)$")
    subject: Optional[str] = None
    style: Optional[str] = None
    normalize: bool = True
    output_language: Optional[str] = "pt-BR"


class ExerciseSubmitIn(BaseModel):
    answers_json: Any


class ExerciseEvaluateIn(BaseModel):
    item_id: UUID
    answer_text: str
    difficulty: Optional[str] = Field(default="medium", pattern=r"^(easy|medium|hard)$")


class ExerciseEvaluateOut(BaseModel):
    similarity: float
    score: int
    feedback: str
    missing_concepts: List[str] = []


class ExerciseGradeIn(BaseModel):
    answers_json: Any


class ItemResult(BaseModel):
    item_id: UUID
    correct: Optional[bool] = None
    explanation: Optional[str] = None
    similarity: Optional[float] = None
    score: Optional[int] = None
    feedback: Optional[str] = None


class ExerciseGradeOut(BaseModel):
    exercise_id: UUID
    score: Any
    items_results: List[ItemResult]


# -----------------
# Library
# -----------------

class SourceOut(BaseModel):
    id: UUID
    discipline_id: Optional[UUID]
    note_id: Optional[UUID]
    filename: str
    mime_type: Optional[str]
    size_bytes: Optional[str]
    content_excerpt: Optional[str]

    class Config:
        from_attributes = True


