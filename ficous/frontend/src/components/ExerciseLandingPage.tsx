import { useState } from 'react';
import { Plus, BookOpen, Brain, Target, Zap, FileText, Upload, Play } from 'lucide-react';

interface ExerciseLandingPageProps {
  onGenerateNew: () => void;
  onViewExisting: () => void;
}

export function ExerciseLandingPage({ onGenerateNew, onViewExisting }: ExerciseLandingPageProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const quickActions = [
    {
      id: 'generate-wizard',
      title: 'Gerar Exercícios',
      description: 'Wizard em etapas para criar exercícios personalizados',
      icon: FileText,
      color: 'bg-blue-500',
      action: onGenerateNew
    },
    {
      id: 'generate-note',
      title: 'Gerar da Nota',
      description: 'Use uma nota existente como base',
      icon: BookOpen,
      color: 'bg-green-500',
      action: () => console.log('Gerar da nota - em desenvolvimento')
    },
    {
      id: 'generate-file',
      title: 'Gerar do Arquivo',
      description: 'Upload um PDF ou documento',
      icon: Upload,
      color: 'bg-purple-500',
      action: () => console.log('Upload arquivo - em desenvolvimento')
    },
    {
      id: 'view-existing',
      title: 'Ver Bancos Existentes',
      description: 'Acesse seus bancos de exercícios',
      icon: Target,
      color: 'bg-orange-500',
      action: onViewExisting
    }
  ];

  const features = [
    {
      icon: Brain,
      title: 'IA Inteligente',
      description: 'Gera questões adaptadas ao conteúdo usando IA avançada'
    },
    {
      icon: Zap,
      title: 'Múltiplos Formatos',
      description: 'Questões abertas, múltipla escolha, verdadeiro/falso'
    },
    {
      icon: Target,
      title: 'Avaliação Semântica',
      description: 'Correção automática de respostas abertas'
    },
    {
      icon: Play,
      title: 'Quiz Interativo',
      description: 'Teste seus conhecimentos com timer e feedback'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Ficous</h1>
              <p className="text-gray-600">Geração inteligente de exercícios com IA</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={onViewExisting}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Ver Bancos
              </button>
              <button
                onClick={onGenerateNew}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Gerar Novo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Crie Exercícios Inteligentes
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Transforme qualquer conteúdo em exercícios personalizados usando IA. 
            Gere questões adaptadas, avalie respostas semanticamente e teste seus conhecimentos.
          </p>
          
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {quickActions.map((action) => {
              const IconComponent = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={action.action}
                  className={`p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                    selectedOption === action.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onMouseEnter={() => setSelectedOption(action.id)}
                  onMouseLeave={() => setSelectedOption(null)}
                >
                  <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4 mx-auto`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {action.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {action.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Por que escolher o Ficous?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-blue-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Pronto para começar?
          </h3>
          <p className="text-gray-600 mb-8">
            Escolha uma das opções acima ou explore seus bancos existentes
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onGenerateNew}
              className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
            >
              <Plus className="w-5 h-5 inline mr-2" />
              Gerar Primeiro Banco
            </button>
            <button
              onClick={onViewExisting}
              className="px-8 py-4 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-lg"
            >
              <Target className="w-5 h-5 inline mr-2" />
              Ver Bancos Existentes
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-8 text-center">
          <p className="text-gray-400">
            © 2024 Ficous - Geração inteligente de exercícios com IA
          </p>
        </div>
      </div>
    </div>
  );
}
