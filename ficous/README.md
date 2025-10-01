FICOUS — Módulo

Este diretório contém o módulo/página `ficous`, composto por um backend (FastAPI) e um frontend (Vite + React + TypeScript).

Requisitos
- Node.js 18+
- Python 3.10+

Backend
Estrutura: `ficous/backend/app`

Instalação
```
# criar e ativar venv (opcional)
python -m venv .venv
# Windows PowerShell
. .venv/Scripts/Activate.ps1
# Unix-like
# source .venv/bin/activate

pip install -r ficous/backend/requirements.txt  # se existir
```

Caso não exista `requirements.txt` específico do `ficous`, utilize o do projeto correspondente ou instale FastAPI e Uvicorn manualmente:

```
pip install fastapi uvicorn[standard]
```

Execução (desenvolvimento)
```
uvicorn ficous.backend.app.main:app --reload --host 0.0.0.0 --port 8002
```
O endpoint de saúde deve responder em `GET /health`.

Frontend
Estrutura: `ficous/frontend`

Instalação
```
cd ficous/frontend
npm install
```

Execução (desenvolvimento)
```
npm run dev
```
Por padrão, o Vite sobe em `http://localhost:3000`.

Convenções de Commit
Adotar Conventional Commits em português. Exemplos:
- feat(ficous): adicionar botão de ação rápido
- fix(ficous): corrigir erro de foco no menu flutuante
- docs(ficous): atualizar instruções de execução
- refactor(ficous): simplificar componente TextSelectionMenu

Boas práticas
- Manter nomes claros e consistentes em componentes e pastas
- Evitar renomeações que quebrem imports sem atualização em cadeia
- Antes de commitar, rodar o app localmente e validar principais fluxos

