@echo off
echo ========================================
echo    FICOUS - SISTEMA DE DESENVOLVIMENTO
echo ========================================
echo.

echo [1/3] Iniciando Backend Ficous...
start "Ficous Backend" cmd /k "cd /d D:\dev\studyflow\ficous\backend && copy env.example .env && python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

echo [2/3] Aguardando backend inicializar...
timeout /t 5 /nobreak > nul

echo [3/3] Iniciando Frontend Ficous...
start "Ficous Frontend" cmd /k "cd /d D:\dev\studyflow\ficous\frontend && npm run dev"

echo.
echo ✅ Sistema iniciado com sucesso!
echo.
echo 📍 Backend:  http://localhost:8000
echo 📍 Frontend: http://localhost:5173
echo 📍 Docs:     http://localhost:8000/docs
echo.
echo Pressione qualquer tecla para sair...
pause > nul
