import { useState } from 'react';
import { ArrowLeft, ArrowRight, Upload, FileText, Brain, CheckCircle, X } from 'lucide-react';

interface ExerciseWizardProps {
  onBack: () => void;
  onComplete: (exercises: any[]) => void;
}

type WizardStep = 'source' | 'config' | 'preview' | 'generating' | 'complete';

export function ExerciseWizard({ onBack, onComplete }: ExerciseWizardProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>('source');
  const [sourceType, setSourceType] = useState<'text' | 'file' | 'prompt'>('text');
  const [sourceContent, setSourceContent] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [config, setConfig] = useState({
    qty: 10,
    difficulty: 'medium',
    kind: 'mix',
    subject: '',
    style: ''
  });
  const [generatedExercises, setGeneratedExercises] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const steps = [
    { id: 'source', title: 'Fonte', description: 'Escolha a origem do conteúdo' },
    { id: 'config', title: 'Configuração', description: 'Defina os parâmetros' },
    { id: 'preview', title: 'Preview', description: 'Revise as configurações' },
    { id: 'generating', title: 'Gerando', description: 'Criando exercícios...' },
    { id: 'complete', title: 'Concluído', description: 'Exercícios prontos!' }
  ];

  const handleNext = () => {
    const stepOrder: WizardStep[] = ['source', 'config', 'preview', 'generating', 'complete'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    const stepOrder: WizardStep[] = ['source', 'config', 'preview', 'generating', 'complete'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setCurrentStep('generating');
    
    // Simular geração (substituir por chamada real da API)
    setTimeout(() => {
      const mockExercises = Array.from({ length: config.qty }, (_, i) => ({
        id: `exercise-${i + 1}`,
        question: `Questão ${i + 1}: ${sourceContent.substring(0, 50)}...`,
        kind: i % 2 === 0 ? 'mcq' : 'open',
        options: i % 2 === 0 ? ['Opção A', 'Opção B', 'Opção C', 'Opção D'] : null,
        difficulty: config.difficulty,
        subject: config.subject || 'Geral'
      }));
      
      setGeneratedExercises(mockExercises);
      setIsGenerating(false);
      setCurrentStep('complete');
    }, 3000);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'source':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Escolha a origem do conteúdo</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setSourceType('text')}
                className={`p-6 border-2 rounded-lg transition-colors ${
                  sourceType === 'text' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <FileText className="w-8 h-8 mx-auto mb-3 text-gray-600" />
                <h4 className="font-medium mb-2">Texto Livre</h4>
                <p className="text-sm text-gray-600">Cole o conteúdo diretamente</p>
              </button>
              
              <button
                onClick={() => setSourceType('file')}
                className={`p-6 border-2 rounded-lg transition-colors ${
                  sourceType === 'file' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Upload className="w-8 h-8 mx-auto mb-3 text-gray-600" />
                <h4 className="font-medium mb-2">Upload Arquivo</h4>
                <p className="text-sm text-gray-600">PDF, DOC, TXT</p>
              </button>
              
              <button
                onClick={() => setSourceType('prompt')}
                className={`p-6 border-2 rounded-lg transition-colors ${
                  sourceType === 'prompt' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Brain className="w-8 h-8 mx-auto mb-3 text-gray-600" />
                <h4 className="font-medium mb-2">Prompt Direto</h4>
                <p className="text-sm text-gray-600">Descreva o que quer</p>
              </button>
            </div>

            {sourceType === 'text' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cole seu conteúdo aqui
                </label>
                <textarea
                  value={sourceContent}
                  onChange={(e) => setSourceContent(e.target.value)}
                  rows={8}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Cole aqui o conteúdo que será usado para gerar as questões..."
                />
              </div>
            )}

            {sourceType === 'file' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Faça upload do arquivo
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 mb-2">Arraste o arquivo aqui ou clique para selecionar</p>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setUploadedFile(file);
                        setSourceContent(`Arquivo: ${file.name}`);
                      }
                    }}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                  >
                    Selecionar Arquivo
                  </label>
                  {uploadedFile && (
                    <p className="mt-2 text-sm text-green-600">
                      ✓ {uploadedFile.name} selecionado
                    </p>
                  )}
                </div>
              </div>
            )}

            {sourceType === 'prompt' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descreva o que você quer
                </label>
                <textarea
                  value={sourceContent}
                  onChange={(e) => setSourceContent(e.target.value)}
                  rows={6}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Ex: 'Gere exercícios sobre cálculo diferencial para estudantes de engenharia'"
                />
              </div>
            )}
          </div>
        );

      case 'config':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Configure a geração</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantidade de questões
                </label>
                <input
                  type="number"
                  min="5"
                  max="50"
                  value={config.qty}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (!isNaN(value) && value >= 5 && value <= 50) {
                      setConfig(prev => ({ ...prev, qty: value }));
                    }
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dificuldade
                </label>
                <select
                  value={config.difficulty}
                  onChange={(e) => setConfig(prev => ({ ...prev, difficulty: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="easy">Fácil</option>
                  <option value="medium">Médio</option>
                  <option value="hard">Difícil</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de questões
                </label>
                <select
                  value={config.kind}
                  onChange={(e) => setConfig(prev => ({ ...prev, kind: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="mix">Mistas</option>
                  <option value="open">Abertas</option>
                  <option value="closed">Fechadas</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assunto (opcional)
                </label>
                <input
                  type="text"
                  value={config.subject}
                  onChange={(e) => setConfig(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Ex: Matemática, Física..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        );

      case 'preview':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Revise as configurações</h3>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-medium mb-4">Resumo da geração:</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Fonte:</span>
                  <span className="ml-2 font-medium">
                    {sourceType === 'text' ? 'Texto livre' : 
                     sourceType === 'file' ? `Arquivo: ${uploadedFile?.name}` : 'Prompt direto'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Quantidade:</span>
                  <span className="ml-2 font-medium">{config.qty} questões</span>
                </div>
                <div>
                  <span className="text-gray-600">Dificuldade:</span>
                  <span className="ml-2 font-medium capitalize">{config.difficulty}</span>
                </div>
                <div>
                  <span className="text-gray-600">Tipo:</span>
                  <span className="ml-2 font-medium capitalize">{config.kind}</span>
                </div>
                {config.subject && (
                  <div className="col-span-2">
                    <span className="text-gray-600">Assunto:</span>
                    <span className="ml-2 font-medium">{config.subject}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'generating':
        return (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold mb-2">Gerando exercícios...</h3>
            <p className="text-gray-600">Isso pode levar alguns minutos</p>
          </div>
        );

      case 'complete':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Exercícios gerados com sucesso!</h3>
              <p className="text-gray-600">Foram criados {generatedExercises.length} exercícios</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {generatedExercises.map((exercise, index) => (
                <div key={exercise.id} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      exercise.kind === 'mcq' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {exercise.kind === 'mcq' ? 'Múltipla Escolha' : 'Aberta'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-800 mb-2">{exercise.question}</p>
                  {exercise.options && (
                    <div className="text-xs text-gray-600">
                      {exercise.options.length} opções
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'source':
        return (sourceType === 'text' && sourceContent.trim().length > 0) ||
               (sourceType === 'file' && uploadedFile !== null) ||
               (sourceType === 'prompt' && sourceContent.trim().length > 0);
      case 'config':
        return config.qty >= 5 && config.qty <= 50;
      case 'preview':
        return true;
      case 'generating':
        return false;
      case 'complete':
        return false;
      default:
        return false;
    }
  };

  const getStepIndex = () => {
    return steps.findIndex(step => step.id === currentStep);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gerador de Exercícios</h1>
              <p className="text-gray-600">Crie exercícios personalizados em etapas</p>
            </div>
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft size={20} />
              Voltar
            </button>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const isActive = step.id === currentStep;
              const isCompleted = getStepIndex() > index;
              const isClickable = index <= getStepIndex() + 1;

              return (
                <div
                  key={step.id}
                  className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}
                >
                  <div
                    className={`flex items-center gap-3 ${
                      isClickable ? 'cursor-pointer' : 'cursor-not-allowed'
                    }`}
                    onClick={() => isClickable && setCurrentStep(step.id as WizardStep)}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        isCompleted
                          ? 'bg-green-600 text-white'
                          : isActive
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {isCompleted ? <CheckCircle size={16} /> : index + 1}
                    </div>
                    <div className="hidden md:block">
                      <p className={`text-sm font-medium ${
                        isActive ? 'text-blue-600' : 'text-gray-600'
                      }`}>
                        {step.title}
                      </p>
                      <p className="text-xs text-gray-500">{step.description}</p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="flex-1 h-px bg-gray-200 mx-4" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {renderStepContent()}
        </div>
      </div>

      {/* Footer Actions */}
      {currentStep !== 'generating' && (
        <div className="bg-white border-t">
          <div className="container mx-auto px-8 py-6">
            <div className="flex items-center justify-between">
              <button
                onClick={handlePrevious}
                disabled={getStepIndex() === 0}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowLeft size={16} />
                Anterior
              </button>

              <div className="flex gap-3">
                {currentStep === 'complete' ? (
                  <button
                    onClick={() => onComplete(generatedExercises)}
                    className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle size={16} />
                    Finalizar
                  </button>
                ) : (
                  <button
                    onClick={currentStep === 'preview' ? handleGenerate : handleNext}
                    disabled={!canProceed()}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {currentStep === 'preview' ? 'Gerar Exercícios' : 'Próximo'}
                    <ArrowRight size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
