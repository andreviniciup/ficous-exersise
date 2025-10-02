# Arquivos do Projeto de Exercícios - Ficous

## 📁 **Estrutura Completa do Projeto**

### **Frontend (React/TypeScript)**

#### **🔧 Configuração e Setup**
```
ficous/frontend/
├── package.json                    # Dependências e scripts
├── vite.config.ts                  # Configuração do Vite
├── tsconfig.json                   # Configuração TypeScript
├── tailwind.config.js              # Configuração Tailwind CSS
├── index.html                      # HTML principal
└── src/
```

#### **📱 Componentes Principais**
```
src/
├── App.tsx                         # Componente principal (simplificado)
├── main.tsx                        # Entry point da aplicação
├── index.css                       # Estilos globais
└── components/
    ├── ExerciseLandingPage.tsx      # Página inicial estática
    ├── ExerciseWizard.tsx          # Wizard de 5 etapas
    ├── ExerciseResults.tsx         # Página de resultados em grid
    ├── ExercisesPage.tsx           # Lista de bancos existentes
    ├── ExerciseGeneratePage.tsx    # Geração simples (legado)
    ├── ExerciseDetailPage.tsx     # Edição de questões
    ├── ExerciseQuizPage.tsx       # Quiz interativo
    └── SettingsPage.tsx           # Configurações
```

#### **🎨 Componentes de UI**
```
src/components/
├── ui/
│   ├── LoadingSpinner.tsx          # Componente de loading
│   ├── ErrorMessage.tsx           # Componente de erro
│   └── PageHeader.tsx             # Header reutilizável
└── exercises/
    ├── ExerciseCard.tsx           # Card de exercício
    ├── ExerciseFilters.tsx        # Filtros avançados
    └── ExerciseStats.tsx          # Estatísticas visuais
```

#### **🔗 Serviços e Hooks**
```
src/
├── services/
│   └── api.ts                      # Cliente da API
├── hooks/
│   └── useExercises.ts            # Hook para gerenciar exercícios
├── types/
│   └── exercises.ts               # Tipos TypeScript
└── utils/
    └── testHelpers.ts             # Helpers para testes
```

#### **⚙️ Configuração**
```
src/config/
├── features.ts                     # Feature flags
└── constants.ts                   # Constantes da aplicação
```

#### **📚 Documentação**
```
ficous/frontend/
├── EXERCISES_README.md            # Documentação completa
├── LAYOUT_CHANGES.md              # Mudanças no layout
├── LANDING_PAGE.md                # Documentação da landing page
├── WIZARD_IMPLEMENTATION.md       # Documentação do wizard
├── TEST_CHECKLIST.md              # Checklist de testes
└── TEST_RESULTS.md                # Resultados dos testes
```

### **Backend (Python/FastAPI)**

#### **🏗️ Estrutura Principal**
```
ficous/backend/
├── app/
│   ├── __init__.py
│   ├── main.py                     # Entry point da aplicação
│   ├── database.py                 # Configuração do banco
│   ├── models.py                   # Modelos SQLAlchemy
│   ├── schemas.py                  # Schemas Pydantic
│   └── routers/
│       └── exercises.py           # Endpoints de exercícios
├── requirements.txt                # Dependências Python
└── .env                           # Variáveis de ambiente
```

#### **📊 Modelos de Dados**
```python
# app/models.py
class Exercise(Base):
    id: UUID
    user_id: UUID
    title: str
    meta_json: JSON  # {qty, kind, difficulty, subject, status}
    created_at: datetime
    updated_at: datetime

class ExerciseItem(Base):
    id: UUID
    exercise_id: UUID
    question: str
    kind: str  # 'mcq', 'open', 'vf', 'multi'
    options_json: JSON  # Para MCQ
    answer_json: JSON  # {correct_index, explanation}
    created_at: datetime
    updated_at: datetime
```

#### **🔌 Endpoints da API**
```python
# app/routers/exercises.py
POST   /ficous/exercises/generate    # Gerar exercícios
GET    /ficous/exercises/            # Listar exercícios
GET    /ficous/exercises/{id}        # Detalhes do exercício
POST   /ficous/exercises/evaluate    # Avaliar questão aberta
POST   /ficous/exercises/{id}/grade  # Pontuar quiz completo
```

#### **📋 Schemas Pydantic**
```python
# app/schemas.py
class ExerciseGenerateIn(BaseModel):
    note_id: Optional[UUID] = None
    raw_context: Optional[str] = None
    source_id: Optional[UUID] = None
    qty: int = Field(default=5, ge=1, le=50)
    kind: str = Field(default="mix", pattern=r"^(mix|open|closed)$")
    difficulty: Optional[str] = Field(default="medium")
    subject: Optional[str] = None
    style: Optional[str] = None
    pattern_mode: Optional[str] = Field(default="auto")
    closed_format: Optional[str] = Field(default="auto")
    fallback: Optional[str] = Field(default="open")

class ExerciseEvaluateIn(BaseModel):
    item_id: UUID
    answer_text: str
    difficulty: str

class ExerciseGradeIn(BaseModel):
    answers_json: List[ItemAnswerIn]
```

### **🗄️ Banco de Dados**

#### **Tabelas Principais**
```sql
-- Tabela de exercícios
CREATE TABLE exercises (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    title VARCHAR(255),
    meta_json JSONB,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Tabela de itens de exercício
CREATE TABLE exercise_items (
    id UUID PRIMARY KEY,
    exercise_id UUID REFERENCES exercises(id),
    question TEXT NOT NULL,
    kind VARCHAR(20) NOT NULL,
    options_json JSONB,
    answer_json JSONB,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### **🔧 Arquivos de Configuração**

#### **Frontend**
```
ficous/frontend/
├── package.json                    # Dependências Node.js
├── vite.config.ts                  # Configuração Vite
├── tsconfig.json                   # TypeScript config
├── tailwind.config.js              # Tailwind CSS config
├── .gitignore                      # Arquivos ignorados
└── README.md                       # Documentação
```

#### **Backend**
```
ficous/backend/
├── requirements.txt                # Dependências Python
├── .env                           # Variáveis de ambiente
├── .gitignore                     # Arquivos ignorados
├── Dockerfile                     # Container Docker
└── README.md                      # Documentação
```

### **📦 Dependências Principais**

#### **Frontend**
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.263.1",
    "tailwindcss": "^3.3.0",
    "typescript": "^5.0.0",
    "vite": "^4.4.0"
  }
}
```

#### **Backend**
```txt
fastapi==0.104.1
uvicorn==0.24.0
sqlalchemy==2.0.23
psycopg2-binary==2.9.7
pydantic==2.5.0
python-multipart==0.0.6
openai==1.3.0
nltk==3.8.1
spacy==3.7.2
scikit-learn==1.3.2
```

### **🚀 Scripts de Execução**

#### **Frontend**
```bash
# Desenvolvimento
npm start
# ou
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

#### **Backend**
```bash
# Desenvolvimento
uvicorn app.main:app --reload

# Produção
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### **📁 Estrutura de Arquivos por Funcionalidade**

#### **🧙‍♂️ Wizard de Geração**
- `ExerciseWizard.tsx` - Componente principal
- `ExerciseResults.tsx` - Página de resultados
- `ExerciseLandingPage.tsx` - Página inicial

#### **📋 Gerenciamento de Exercícios**
- `ExercisesPage.tsx` - Lista de bancos
- `ExerciseDetailPage.tsx` - Edição de questões
- `ExerciseQuizPage.tsx` - Quiz interativo

#### **🎨 Componentes de UI**
- `LoadingSpinner.tsx` - Loading states
- `ErrorMessage.tsx` - Tratamento de erros
- `PageHeader.tsx` - Header reutilizável
- `ExerciseCard.tsx` - Card de exercício
- `ExerciseFilters.tsx` - Filtros avançados
- `ExerciseStats.tsx` - Estatísticas

#### **🔗 Integração**
- `api.ts` - Cliente da API
- `useExercises.ts` - Hook personalizado
- `types/exercises.ts` - Tipos TypeScript
- `config/features.ts` - Feature flags
- `config/constants.ts` - Constantes

### **📊 Estatísticas do Projeto**

#### **Frontend**
- **Total de Arquivos**: ~25 arquivos
- **Linhas de Código**: ~2,500 linhas
- **Componentes**: 12 componentes
- **Páginas**: 6 páginas principais
- **Hooks**: 1 hook personalizado
- **Tipos**: 15+ interfaces TypeScript

#### **Backend**
- **Total de Arquivos**: ~10 arquivos
- **Linhas de Código**: ~1,200 linhas
- **Endpoints**: 5 endpoints principais
- **Modelos**: 2 modelos principais
- **Schemas**: 10+ schemas Pydantic

### **🎯 Funcionalidades Implementadas**

#### **Frontend**
- ✅ Landing page estática
- ✅ Wizard de 5 etapas
- ✅ Página de resultados em grid
- ✅ Lista de bancos existentes
- ✅ Edição de questões
- ✅ Quiz interativo
- ✅ Componentes reutilizáveis
- ✅ Responsividade completa

#### **Backend**
- ✅ Geração inteligente de exercícios
- ✅ Avaliação semântica
- ✅ Pontuação de quiz
- ✅ CRUD de exercícios
- ✅ Filtros e busca
- ✅ Integração com OpenAI
- ✅ Processamento de arquivos

### **📝 Documentação**
- ✅ README completo
- ✅ Documentação de componentes
- ✅ Guia de testes
- ✅ Checklist de funcionalidades
- ✅ Resultados de testes
- ✅ Mudanças de layout

**Total**: ~35 arquivos entre frontend e backend, implementando um sistema completo de geração e gerenciamento de exercícios com IA! 🚀
