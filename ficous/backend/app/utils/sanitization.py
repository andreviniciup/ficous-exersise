"""
Utilitários de sanitização para inputs do Sage
"""
import re
import os
from typing import Optional
from ..config import SAGE_MAX_CONTEXT_CHARS, SAGE_MAX_INPUT_CHARS


def sanitize_prompt(prompt: str, max_len: int = 2000) -> str:
    """
    Sanitiza prompt removendo caracteres perigosos e limitando tamanho
    """
    if not prompt:
        return ""
    
    # Remover caracteres de controle e caracteres especiais perigosos
    prompt = re.sub(r'[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]', '', prompt)
    
    # Remover tags HTML/XML básicas
    prompt = re.sub(r'<[^>]+>', '', prompt)
    
    # Remover caracteres especiais excessivos (manter pontuação normal)
    prompt = re.sub(r'[^\w\s\-.,?!:;()áàâãéêíóôõúçÁÀÂÃÉÊÍÓÔÕÚÇ]', '', prompt, flags=re.IGNORECASE)
    
    # Limitar tamanho
    prompt = prompt[:max_len].strip()
    
    # Garantir que não está vazio após sanitização
    if not prompt:
        return "Pergunta inválida após sanitização"
    
    return prompt


def sanitize_context(context: str, max_len: Optional[int] = None) -> str:
    """
    Sanitiza contexto mantendo estrutura mas removendo conteúdo perigoso
    """
    if not context:
        return ""
    
    if max_len is None:
        max_len = SAGE_MAX_CONTEXT_CHARS
    
    # Remover caracteres de controle
    context = re.sub(r'[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]', '', context)
    
    # Limitar quebras de linha excessivas
    context = re.sub(r'\n{3,}', '\n\n', context)
    
    # Limitar espaços em branco excessivos
    context = re.sub(r' {3,}', ' ', context)
    
    # Limitar tamanho
    context = context[:max_len].strip()
    
    return context


def validate_sage_input(prompt: str, context: Optional[str] = None) -> tuple[bool, str]:
    """
    Valida inputs do Sage retornando (is_valid, error_message)
    """
    # Validar prompt
    if not prompt or len(prompt.strip()) < 3:
        return False, "Prompt muito curto (mínimo 3 caracteres)"
    
    if len(prompt) > 2000:
        return False, "Prompt muito longo (máximo 2000 caracteres)"
    
    # Verificar se prompt não é apenas caracteres especiais
    if not re.search(r'[a-zA-ZáàâãéêíóôõúçÁÀÂÃÉÊÍÓÔÕÚÇ]', prompt):
        return False, "Prompt deve conter pelo menos uma letra"
    
    # Validar contexto se fornecido
    if context and len(context) > SAGE_MAX_CONTEXT_CHARS:
        return False, f"Contexto muito longo (máximo {SAGE_MAX_CONTEXT_CHARS} caracteres)"
    
    return True, ""


def truncate_text_smart(text: str, max_len: int, preserve_sentences: bool = True) -> str:
    """
    Trunca texto de forma inteligente, tentando preservar sentenças completas
    """
    if len(text) <= max_len:
        return text
    
    if not preserve_sentences:
        return text[:max_len]
    
    # Tentar truncar no final de uma sentença
    truncated = text[:max_len]
    
    # Procurar último ponto, exclamação ou interrogação
    for punct in ['.', '!', '?']:
        last_punct = truncated.rfind(punct)
        if last_punct > max_len * 0.7:  # Pelo menos 70% do texto
            return truncated[:last_punct + 1]
    
    # Se não encontrar pontuação adequada, truncar normalmente
    return truncated


def clean_ai_response(response: str) -> str:
    """
    Limpa resposta da IA removendo artefatos comuns
    """
    if not response:
        return ""
    
    # Remover prefixos comuns de IA
    prefixes_to_remove = [
        "Como um assistente de IA,",
        "Como assistente,",
        "Baseado no contexto fornecido,",
        "Com base nas informações,",
    ]
    
    for prefix in prefixes_to_remove:
        if response.startswith(prefix):
            response = response[len(prefix):].strip()
    
    # Remover caracteres de controle
    response = re.sub(r'[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]', '', response)
    
    # Limitar quebras de linha excessivas
    response = re.sub(r'\n{3,}', '\n\n', response)
    
    return response.strip()
