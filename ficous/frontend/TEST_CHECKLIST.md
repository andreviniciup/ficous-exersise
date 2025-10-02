# Checklist de Testes - Wizard de Exercícios

## 🧪 **Testes de Funcionalidade**

### **1. Landing Page (ExerciseLandingPage)**
- [ ] **Botão "Gerar Exercícios"** → Navega para wizard
- [ ] **Botão "Ver Bancos Existentes"** → Navega para lista
- [ ] **Cards de Ação** → Hover effects funcionando
- [ ] **Responsividade** → Layout em mobile/tablet/desktop

### **2. Wizard - Etapa 1: Fonte (ExerciseWizard)**
- [ ] **Seleção de Fonte**:
  - [ ] **Texto Livre** → Card fica azul quando selecionado
  - [ ] **Upload Arquivo** → Card fica azul quando selecionado  
  - [ ] **Prompt Direto** → Card fica azul quando selecionado
- [ ] **Inputs de Conteúdo**:
  - [ ] **Textarea (Texto/Prompt)** → Aceita texto, placeholder funciona
  - [ ] **Upload de Arquivo** → Input file funciona, mostra nome do arquivo
- [ ] **Validação** → Botão "Próximo" só ativa com conteúdo
- [ ] **Navegação** → Botão "Anterior" desabilitado na primeira etapa

### **3. Wizard - Etapa 2: Configuração**
- [ ] **Inputs de Configuração**:
  - [ ] **Quantidade** → Number input (5-50), aceita valores
  - [ ] **Dificuldade** → Select com 3 opções (Fácil/Médio/Difícil)
  - [ ] **Tipo** → Select com 3 opções (Mistas/Abertas/Fechadas)
  - [ ] **Assunto** → Text input opcional
- [ ] **Validação** → Todos os campos obrigatórios preenchidos
- [ ] **Navegação** → Botões Anterior/Próximo funcionando

### **4. Wizard - Etapa 3: Preview**
- [ ] **Resumo das Configurações**:
  - [ ] **Fonte** → Mostra tipo selecionado
  - [ ] **Quantidade** → Mostra número correto
  - [ ] **Dificuldade** → Mostra nível correto
  - [ ] **Tipo** → Mostra tipo correto
  - [ ] **Assunto** → Mostra se preenchido
- [ ] **Botão "Gerar Exercícios"** → Inicia processo de geração
- [ ] **Botão "Anterior"** → Volta para configuração

### **5. Wizard - Etapa 4: Gerando**
- [ ] **Loading State**:
  - [ ] **Spinner** → Animação funcionando
  - [ ] **Texto** → "Gerando exercícios..."
  - [ ] **Duração** → 3 segundos (simulação)
- [ ] **Navegação** → Botões desabilitados durante geração

### **6. Wizard - Etapa 5: Concluído**
- [ ] **Sucesso Visual**:
  - [ ] **Ícone** → CheckCircle verde
  - [ ] **Título** → "Exercícios gerados com sucesso!"
  - [ ] **Contador** → "Foram criados X exercícios"
- [ ] **Preview dos Exercícios**:
  - [ ] **Grid** → Layout responsivo (1/2/3 colunas)
  - [ ] **Cards** → Mostram informações corretas
  - [ ] **Tipos** → Cores diferentes para MCQ/Aberta
- [ ] **Botão "Finalizar"** → Navega para página de resultados

### **7. Página de Resultados (ExerciseResults)**
- [ ] **Header**:
  - [ ] **Título** → "Exercícios Gerados"
  - [ ] **Contador** → "X exercícios criados com sucesso"
  - [ ] **Botão "Voltar"** → Navega para landing
- [ ] **Estatísticas**:
  - [ ] **Total** → Número correto
  - [ ] **Múltipla Escolha** → Contador correto
  - [ ] **Abertas** → Contador correto
  - [ ] **Selecionados** → Atualiza em tempo real
- [ ] **Controles de Seleção**:
  - [ ] **"Selecionar Todos"** → Marca todos os exercícios
  - [ ] **"Desmarcar Todos"** → Desmarca todos
  - [ ] **Contador** → "X de Y selecionados"
- [ ] **Grid de Exercícios**:
  - [ ] **Layout Responsivo** → 1/2/3 colunas conforme tela
  - [ ] **Cards Clicáveis** → Selecionam/deselecionam ao clicar
  - [ ] **Informações por Card**:
    - [ ] **Número** → #1, #2, etc.
    - [ ] **Tipo** → Badge colorido (MCQ/Aberta)
    - [ ] **Questão** → Texto truncado
    - [ ] **Dificuldade** → Cor correspondente
    - [ ] **Assunto** → Se disponível
    - [ ] **Preview Opções** → Para MCQ
- [ ] **Botões de Ação**:
  - [ ] **"Iniciar Quiz"** → Desabilitado se nenhum selecionado
  - [ ] **"Gerar Novos"** → Volta para landing
- [ ] **Ações Inferiores**:
  - [ ] **Contador de Selecionados** → Atualiza em tempo real
  - [ ] **"Iniciar Quiz"** → Com exercícios selecionados

## 🎨 **Testes de Design**

### **Responsividade**
- [ ] **Mobile (< 768px)** → Layout em 1 coluna
- [ ] **Tablet (768px - 1024px)** → Layout em 2 colunas  
- [ ] **Desktop (> 1024px)** → Layout em 3 colunas
- [ ] **Headers** → Adaptam ao tamanho da tela
- [ ] **Botões** → Tamanho adequado para touch

### **Estados Visuais**
- [ ] **Hover Effects** → Cards e botões
- [ ] **Active States** → Botões pressionados
- [ ] **Disabled States** → Botões desabilitados
- [ ] **Loading States** → Spinners e feedback
- [ ] **Success States** → Checkmarks e cores verdes

### **Cores e Tipografia**
- [ ] **Cores Temáticas** → Azul (wizard), Verde (resultados)
- [ ] **Contraste** → Texto legível em todos os fundos
- [ ] **Fontes** → Alexandria carregando corretamente
- [ ] **Ícones** → Lucide React funcionando

## 🔧 **Testes Técnicos**

### **Performance**
- [ ] **Carregamento** → Páginas carregam rapidamente
- [ ] **Navegação** → Transições suaves entre páginas
- [ ] **Animações** → Spinners e hover effects fluidos
- [ ] **Memory** → Sem vazamentos de memória

### **Acessibilidade**
- [ ] **Keyboard Navigation** → Tab funciona em todos os elementos
- [ ] **Screen Reader** → Labels e alt texts apropriados
- [ ] **Focus States** → Indicadores visuais claros
- [ ] **ARIA** → Atributos apropriados

## 🐛 **Bugs Conhecidos**

### **Nenhum bug identificado até agora**

## ✅ **Status dos Testes**

- [ ] **Landing Page** → Testado
- [ ] **Wizard Etapa 1** → Testado  
- [ ] **Wizard Etapa 2** → Testado
- [ ] **Wizard Etapa 3** → Testado
- [ ] **Wizard Etapa 4** → Testado
- [ ] **Wizard Etapa 5** → Testado
- [ ] **Página de Resultados** → Testado
- [ ] **Navegação Geral** → Testado
- [ ] **Responsividade** → Testado
- [ ] **Performance** → Testado

## 📝 **Notas de Teste**

### **Como Testar:**
1. Acesse `http://localhost:3000`
2. Clique em "Gerar Exercícios"
3. Complete o wizard em 5 etapas
4. Teste a página de resultados
5. Verifique responsividade em diferentes tamanhos

### **Pontos de Atenção:**
- Validação de inputs em cada etapa
- Estados de loading durante geração
- Seleção múltipla na página de resultados
- Navegação entre páginas
- Layout responsivo
