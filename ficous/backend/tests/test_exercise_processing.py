"""
Testes para pipeline de processamento de exercises
"""
import pytest
from app.services.exercise_processing import (
    preprocess_exercise_content,
    detect_question_patterns,
    postprocess_mcq_questions,
    evaluate_open_answer_semantic
)

def test_preprocess_rejects_short_content():
    """Deve rejeitar conteúdo muito curto"""
    result = preprocess_exercise_content("Texto curto")
    assert result["validation"]["valid"] == False
    assert "muito curto" in result["validation"]["reason"]

def test_preprocess_accepts_valid_content():
    """Deve aceitar conteúdo válido"""
    content = " ".join(["palavra"] * 60)
    result = preprocess_exercise_content(content)
    assert result["validation"]["valid"] == True
    assert result["validation"]["word_count"] >= 50

def test_detect_mcq_pattern():
    """Deve detectar padrão de MCQ"""
    content = "1. Questão? (A) Opção 1 (B) Opção 2 (C) Opção 3"
    result = detect_question_patterns(content)
    assert result["detected_pattern"] == "mcq"
    assert result["confidence"] > 0.5

def test_postprocess_mcq_strict_mode():
    """Modo strict deve aceitar apenas 4 opções"""
    questions = [
        {
            "question": "Teste?",
            "kind": "mcq",
            "options": ["A", "B", "C"],  # Apenas 3
            "mcq": {"correct_index": 0}
        }
    ]
    result = postprocess_mcq_questions(questions, pattern_mode="strict", difficulty="medium")
    assert len(result) == 0  # Rejeitada

def test_evaluate_semantic_similarity():
    """Deve avaliar similaridade semântica corretamente"""
    # Mock de embedding (na prática, usar embeddings reais)
    reference_emb = [0.5] * 1536
    student_answer = "Resposta do aluno"
    key_concepts = ["conceito1", "conceito2"]
    
    # Nota: Este teste precisa de embeddings reais ou mocks mais sofisticados
    # result = evaluate_open_answer_semantic(student_answer, reference_emb, key_concepts)
    # assert "similarity" in result
    # assert "score" in result
    pass  # Implementar com mocks apropriados
