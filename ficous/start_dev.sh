#!/bin/bash

echo "========================================"
echo "   FICOUS - SISTEMA DE DESENVOLVIMENTO"
echo "========================================"
echo

echo "[1/3] Iniciando Backend Ficous..."
cd backend
cp env.example .env
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

echo "[2/3] Aguardando backend inicializar..."
sleep 5

echo "[3/3] Iniciando Frontend Ficous..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo
echo "✅ Sistema iniciado com sucesso!"
echo
echo "📍 Backend:  http://localhost:8000"
echo "📍 Frontend: http://localhost:5173"
echo "📍 Docs:     http://localhost:8000/docs"
echo
echo "Pressione Ctrl+C para parar todos os serviços..."

# Função para limpar processos ao sair
cleanup() {
    echo "Parando serviços..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Capturar Ctrl+C
trap cleanup SIGINT

# Manter script rodando
wait
