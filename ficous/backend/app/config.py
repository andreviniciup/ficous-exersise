import os
from dotenv import load_dotenv

load_dotenv()

AUTH_REQUIRED = os.getenv("AUTH_REQUIRED", "false").lower() == "true"
DEVELOPMENT_MODE = os.getenv("ENVIRONMENT", "development") == "development"
DEFAULT_USER_ID = "00000000-0000-0000-0000-000000000000"

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://usuario:senha@localhost:5432/studyflow_db")
SECRET_KEY = os.getenv("SECRET_KEY", "your-super-secret-key-here-change-in-production")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000")

# Upload configs
MAX_UPLOAD_MB = int(os.getenv("MAX_UPLOAD_MB", "10"))
MAX_EXTRACT_CHARS = int(os.getenv("MAX_EXTRACT_CHARS", "20000"))
MAX_PDF_PAGES = int(os.getenv("MAX_PDF_PAGES", "50"))
ALLOW_GZIP_RESPONSE = os.getenv("ALLOW_GZIP_RESPONSE", "true").lower() == "true"


