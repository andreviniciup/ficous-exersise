"""
Utilitários de texto
"""
import re
from typing import Optional, List


def _clean_text(text: str) -> str:
    try:
        from ftfy import fix_text
        text = fix_text(text)
    except Exception:
        pass
    # Normalização simples de hifenização no fim de linha
    text = re.sub(r"-\n\s*", "", text)
    # Unir quebras excessivas
    text = re.sub(r"\n{3,}", "\n\n", text)
    # Espaços quebrados estranhos
    text = re.sub(r"\s+", " ", text)
    return text.strip()
