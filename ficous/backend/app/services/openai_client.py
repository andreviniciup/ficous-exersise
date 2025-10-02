"""
Cliente OpenAI para chamadas simples
"""
import os
import httpx
from typing import Optional


def call_openai_api_simple(system_prompt: str, user_prompt: str, model: str = "gpt-4o-mini") -> str:
    """Função helper para chamadas simples da OpenAI API"""
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return "API key não configurada"
    
    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        "temperature": 0.2
    }
    headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
    
    try:
        with httpx.Client(timeout=30) as client:
            resp = client.post("https://api.openai.com/v1/chat/completions", json=payload, headers=headers)
            resp.raise_for_status()
            data = resp.json()
            return data["choices"][0]["message"]["content"]
    except Exception as e:
        return f"Erro na API OpenAI: {e}"
