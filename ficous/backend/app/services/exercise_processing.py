"""
Pipeline de processamento para feature Exercises
"""
import re
import json
from typing import List, Dict, Any, Tuple
from sqlalchemy.orm import Session
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

from .embeddings import _get_embedding
from .openai_client import call_openai_api_simple
from ..utils import _clean_text


# ============= PRÉ-PROCESSAMENTO =============

def preprocess_exercise_content(
    content: str,
    content_type: str = "text"  # text|pdf|image
) -> Dict[str, Any]:
    """
    Pré-processa conteúdo antes de enviar para IA
    Retorna: {clean_text, topics, entities, validation}
    """
    # 1. Limpeza e normalização
    clean_text = _clean_text(content)
    
    # 2. Validação de entrada
    word_count = len(clean_text.split())
    if word_count < 50:
        return {
            "clean_text": clean_text,
            "topics": [],
            "entities": [],
            "validation": {
                "valid": False,
                "reason": "Conteúdo muito curto (mínimo 50 palavras)"
            }
        }
    
    # 3. Extração de tópicos-chave (heurística simples)
    topics = extract_key_topics(clean_text)
    
    # 4. Detecção de entidades (conceitos principais)
    entities = extract_entities(clean_text)
    
    return {
        "clean_text": clean_text,
        "topics": topics,
        "entities": entities,
        "validation": {
            "valid": True,
            "word_count": word_count,
            "estimated_questions": min(20, max(5, word_count // 100))
        }
    }


def extract_key_topics(text: str, max_topics: int = 5) -> List[str]:
    """Extrai tópicos-chave usando embeddings locais ou heurística"""
    # Heurística simples: palavras com 5+ caracteres que aparecem mais
    words = re.findall(r'\b[A-Za-zÀ-ÖØ-öø-ÿ]{5,}\b', text, flags=re.IGNORECASE)
    word_freq = {}
    for word in words:
        word_lower = word.lower()
        word_freq[word_lower] = word_freq.get(word_lower, 0) + 1
    
    # Pegar top palavras
    sorted_words = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)
    return [w[0] for w in sorted_words[:max_topics]]


def extract_entities(text: str, max_entities: int = 8) -> List[str]:
    """Extrai entidades/conceitos principais"""
    # Regex para capturar padrões comuns de conceitos
    patterns = [
        r'conceito de ([A-Za-zÀ-ÖØ-öø-ÿ\s]+)',
        r'teoria de ([A-Za-zÀ-ÖØ-öø-ÿ\s]+)',
        r'teorema de ([A-Za-zÀ-ÖØ-öø-ÿ\s]+)',
        r'princípio de ([A-Za-zÀ-ÖØ-öø-ÿ\s]+)',
    ]
    
    entities = []
    for pattern in patterns:
        matches = re.findall(pattern, text, flags=re.IGNORECASE)
        entities.extend([m.strip() for m in matches])
    
    # Limitar e remover duplicatas
    return list(set(entities))[:max_entities]


# ============= PÓS-PROCESSAMENTO =============

def postprocess_mcq_questions(
    raw_questions: List[Dict[str, Any]],
    pattern_mode: str = "auto",
    difficulty: str = "medium"
) -> List[Dict[str, Any]]:
    """
    Valida e refina questões de múltipla escolha
    """
    validated = []
    
    for q in raw_questions:
        # Validação de estrutura
        if not q.get("question") or not isinstance(q.get("options"), list):
            continue
        
        options = q["options"]
        
        # Validação por modo
        if pattern_mode == "strict":
            # Modo strict: exigir exatamente 4 opções e 1 correta
            if len(options) != 4:
                continue
            
            mcq_data = q.get("mcq", {})
            correct_index = mcq_data.get("correct_index")
            
            if not isinstance(correct_index, int) or correct_index < 0 or correct_index > 3:
                continue
        else:
            # Modo auto: aceitar 2-6 opções
            if len(options) < 2 or len(options) > 6:
                continue
            
            mcq_data = q.get("mcq", {})
            correct_index = mcq_data.get("correct_index")
            
            if correct_index is None or not isinstance(correct_index, int):
                # Tentar inferir resposta correta via heurística
                continue
        
        # Adicionar metadados
        q["meta"] = {
            "difficulty": difficulty,
            "validated": True,
            "options_count": len(options)
        }
        
        validated.append(q)
    
    return validated


def postprocess_open_questions(
    raw_questions: List[Dict[str, Any]],
    difficulty: str = "medium"
) -> List[Dict[str, Any]]:
    """
    Processa questões abertas gerando embeddings e critérios de avaliação
    """
    processed = []
    
    for q in raw_questions:
        if not q.get("question"):
            continue
        
        open_data = q.get("open", {})
        model_answer = open_data.get("model_answer", "")
        key_concepts = open_data.get("key_concepts", [])
        
        # Garantir conceitos mínimos
        if len(key_concepts) < 2:
            # Extrair do enunciado
            question_words = extract_key_topics(q["question"], max_topics=3)
            key_concepts.extend(question_words)
            key_concepts = list(set(key_concepts))[:5]
        
        # Gerar embedding da resposta modelo para avaliação semântica
        reference_text = model_answer if model_answer else q["question"]
        embedding = _get_embedding(reference_text)
        
        # Definir threshold por dificuldade
        thresholds = {
            "easy": 0.65,
            "medium": 0.70,
            "hard": 0.75
        }
        
        q["answer_json"] = {
            "model_answer": model_answer,
            "key_concepts": key_concepts,
            "reference_embedding": json.dumps(embedding),
            "similarity_threshold": thresholds.get(difficulty, 0.70),
            "meta": {
                "difficulty": difficulty,
                "min_concepts": max(2, len(key_concepts) // 2)
            }
        }
        
        processed.append(q)
    
    return processed


def evaluate_open_answer_semantic(
    student_answer: str,
    reference_embedding: List[float],
    key_concepts: List[str],
    similarity_threshold: float = 0.70
) -> Dict[str, Any]:
    """
    Avalia resposta aberta usando similaridade semântica
    """
    # Gerar embedding da resposta do aluno
    student_embedding = _get_embedding(student_answer)
    
    # Calcular similaridade
    similarity = float(cosine_similarity(
        [student_embedding], 
        [reference_embedding]
    )[0][0])
    
    # Verificar conceitos ausentes
    missing_concepts = []
    for concept in key_concepts:
        if concept.lower() not in student_answer.lower():
            missing_concepts.append(concept)
    
    # Calcular score (0-10)
    # Fórmula: baseado em similaridade e conceitos cobertos
    concept_coverage = 1.0 - (len(missing_concepts) / max(1, len(key_concepts)))
    
    # Score = 70% similaridade + 30% conceitos
    raw_score = (0.7 * similarity + 0.3 * concept_coverage)
    
    # Ajustar pelo threshold
    if raw_score >= similarity_threshold:
        score = int(round(raw_score * 10))
    else:
        # Penalizar se abaixo do threshold
        score = int(round(raw_score * 10 * 0.7))
    
    score = max(0, min(10, score))
    
    # Gerar feedback
    if similarity >= similarity_threshold and not missing_concepts:
        feedback = "Excelente resposta! Você cobriu os principais conceitos."
    elif similarity >= similarity_threshold:
        feedback = f"Boa resposta, mas considere mencionar: {', '.join(missing_concepts)}"
    elif missing_concepts:
        feedback = f"Sua resposta está no caminho certo, mas faltou abordar: {', '.join(missing_concepts)}"
    else:
        feedback = "Revise o conteúdo e tente novamente focando nos conceitos principais."
    
    return {
        "similarity": similarity,
        "score": score,
        "concept_coverage": concept_coverage,
        "missing_concepts": missing_concepts,
        "feedback": feedback,
        "passed": similarity >= similarity_threshold
    }


# ============= DETECÇÃO DE PADRÕES =============

def detect_question_patterns(content: str) -> Dict[str, Any]:
    """
    Detecta padrões de questões no conteúdo (para pattern_mode='auto')
    """
    # Detectar se há questões de múltipla escolha no conteúdo
    mcq_patterns = [
        r'\([A-E]\)',  # (A) (B) (C)...
        r'[a-e]\)',    # a) b) c)...
        r'\d+\.\s*[A-E]\.', # 1. A. B. C.
    ]
    
    mcq_count = 0
    for pattern in mcq_patterns:
        mcq_count += len(re.findall(pattern, content))
    
    # Detectar questões V/F
    vf_patterns = [
        r'\b(verdadeiro|falso)\b',
        r'\b(true|false)\b',
        r'\b(V|F)\b'
    ]
    
    vf_count = 0
    for pattern in vf_patterns:
        vf_count += len(re.findall(pattern, content, flags=re.IGNORECASE))
    
    # Detectar questões dissertativas
    open_patterns = [
        r'explique',
        r'descreva',
        r'discuta',
        r'analise',
        r'compare'
    ]
    
    open_count = 0
    for pattern in open_patterns:
        open_count += len(re.findall(pattern, content, flags=re.IGNORECASE))
    
    # Determinar padrão dominante
    total = mcq_count + vf_count + open_count
    
    if total == 0:
        return {
            "detected_pattern": "none",
            "recommended_format": "open",
            "confidence": 0.0
        }
    
    max_count = max(mcq_count, vf_count, open_count)
    confidence = max_count / total if total > 0 else 0.0
    
    if max_count == mcq_count:
        return {
            "detected_pattern": "mcq",
            "recommended_format": "mcq",
            "confidence": confidence,
            "mcq_count": mcq_count
        }
    elif max_count == vf_count:
        return {
            "detected_pattern": "vf",
            "recommended_format": "vf",
            "confidence": confidence,
            "vf_count": vf_count
        }
    else:
        return {
            "detected_pattern": "open",
            "recommended_format": "open",
            "confidence": confidence,
            "open_count": open_count
        }
