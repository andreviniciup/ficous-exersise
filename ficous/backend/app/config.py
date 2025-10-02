import os
from dotenv import load_dotenv

load_dotenv()

AUTH_REQUIRED = os.getenv("AUTH_REQUIRED", "false").lower() == "true"
DEVELOPMENT_MODE = os.getenv("ENVIRONMENT", "development") == "development"
DEFAULT_USER_ID = "00000000-0000-0000-0000-000000000000"

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./ficous_dev.db")
SECRET_KEY = os.getenv("SECRET_KEY", "your-super-secret-key-here-change-in-production")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000")

# Upload configs
MAX_UPLOAD_MB = int(os.getenv("MAX_UPLOAD_MB", "10"))
MAX_EXTRACT_CHARS = int(os.getenv("MAX_EXTRACT_CHARS", "20000"))
MAX_PDF_PAGES = int(os.getenv("MAX_PDF_PAGES", "50"))
ALLOW_GZIP_RESPONSE = os.getenv("ALLOW_GZIP_RESPONSE", "true").lower() == "true"

# Configurações do Sage (IA)
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY") # Chave da API OpenAI
SAGE_AUTO_PROCESS_ON_SAVE = os.getenv("SAGE_AUTO_PROCESS_ON_SAVE", "true").lower() == "true"
SAGE_DEFAULT_LANG = os.getenv("SAGE_DEFAULT_LANG", "pt-BR")
SAGE_MAX_INPUT_CHARS = int(os.getenv("SAGE_MAX_INPUT_CHARS", "12000")) # Limite para prompts/conteúdo enviado à IA
SAGE_MAX_CONTEXT_CHARS = int(os.getenv("SAGE_MAX_CONTEXT_CHARS", "16000")) # Limite para o megacontexto enviado à IA


