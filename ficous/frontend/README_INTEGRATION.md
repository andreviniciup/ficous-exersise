# Ficous Frontend - Integração com Backend

Este documento explica como executar o frontend Ficous integrado com o backend.

## 🚀 Configuração e Execução

### 1. Instalar Dependências

```bash
cd ficous/frontend
npm install
```

### 2. Configurar Variáveis de Ambiente

Copie o arquivo de exemplo:
```bash
cp env.example .env
```

Edite o arquivo `.env`:
```env
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=Ficous
VITE_APP_VERSION=0.1.0
```

### 3. Executar o Backend

Em um terminal separado, execute o backend:
```bash
cd ficous/backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 4. Executar o Frontend

```bash
npm run dev
```

O frontend estará disponível em `http://localhost:5173`

## 🎯 Funcionalidades Implementadas

### ✅ Completas
- **Serviço de API**: Comunicação completa com o backend
- **Contextos**: Autenticação e gerenciamento de dados
- **Gerenciamento de Notas**: CRUD completo
- **Integração Sage**: Interface para IA com 3 níveis de resposta
- **Navegação**: Sistema de navegação entre views
- **Componentes UI**: Interface moderna com Radix UI

### 🔄 Em Desenvolvimento
- **Upload de PDFs**: Interface para upload e processamento
- **Flashcards**: Sistema de revisão espaçada
- **Exercícios**: Geração e correção automática
- **Dashboard**: Visualização de progresso
- **Biblioteca**: Gerenciamento de fontes

## 🏗️ Arquitetura

### Estrutura de Pastas
```
src/
├── components/          # Componentes React
│   ├── ui/             # Componentes base (Radix UI)
│   ├── NotesManager.tsx
│   ├── SageIntegration.tsx
│   └── ...
├── contexts/           # Contextos React
│   ├── AuthContext.tsx
│   └── DataContext.tsx
├── services/           # Serviços
│   └── api.ts         # Cliente da API
└── App.tsx            # Componente principal
```

### Fluxo de Dados
1. **AuthContext**: Gerencia autenticação e token
2. **DataContext**: Gerencia estado global (notas, disciplinas, etc.)
3. **API Service**: Comunicação com backend via HTTP
4. **Components**: Interface do usuário

## 🔧 Configurações

### Backend
- **URL**: `http://localhost:8000`
- **Endpoints**: Todos os endpoints do Ficous disponíveis
- **Autenticação**: JWT token (simulado para desenvolvimento)

### Frontend
- **Framework**: React + Vite
- **UI**: Radix UI + Tailwind CSS
- **Estado**: React Context API
- **HTTP**: Fetch API nativo

## 🐛 Troubleshooting

### Problemas Comuns

1. **Erro de CORS**
   - Verifique se o backend está rodando na porta 8000
   - Confirme as configurações CORS no backend

2. **Erro de Conexão**
   - Verifique se a URL da API está correta no `.env`
   - Teste a conectividade: `curl http://localhost:8000/`

3. **Erro de Autenticação**
   - O sistema usa autenticação simulada
   - Token é armazenado no localStorage

### Logs de Debug

Para debug detalhado, abra o DevTools do navegador e verifique:
- **Console**: Erros JavaScript
- **Network**: Requisições HTTP
- **Application**: LocalStorage e SessionStorage

## 📚 Próximos Passos

1. **Implementar Upload de PDFs**
2. **Criar interface para Flashcards**
3. **Desenvolver sistema de Exercícios**
4. **Adicionar Dashboard de Progresso**
5. **Implementar Biblioteca de Fontes**
6. **Adicionar testes unitários**
7. **Otimizar performance**

## 🤝 Contribuição

Para contribuir com o desenvolvimento:

1. Faça fork do repositório
2. Crie uma branch para sua feature
3. Implemente as mudanças
4. Teste localmente
5. Abra um Pull Request

## 📞 Suporte

Para dúvidas ou problemas:
- Abra uma issue no repositório
- Consulte a documentação do backend
- Verifique os logs de erro
