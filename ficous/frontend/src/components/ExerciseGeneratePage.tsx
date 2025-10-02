import { useState } from 'react';
import { ArrowLeft, Loader2, CheckCircle, XCircle, Upload, FileText, BookOpen } from 'lucide-react';
import { api } from '../services/api';
import type { ExerciseGenerateIn } from '../types/exercises';

interface ExerciseGeneratePageProps {
  onBack: () => void;
  onExerciseCreated: (exercise: any) => void;
}

export function ExerciseGeneratePage({ onBack, onExerciseCreated }: ExerciseGeneratePageProps) {
  const [formData, setFormData] = useState<ExerciseGenerateIn>({
    qty: 10,
    kind: 'mix',
    difficulty: 'medium',
    subject: '',
    style: '',
    pattern_mode: 'auto',
    closed_format: 'auto',
    fallback: 'open',
    normalize: true,
    output_language: 'pt-BR'
  });
  
  const [sourceType, setSourceType] = useState<'note' | 'raw' | 'source'>('raw');
  const [rawContext, setRawContext] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<'idle' | 'generating' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (sourceType === 'raw' && !rawContext.trim()) {
      setError('Por favor, forneça o contexto para geração');
      return;
    }

    try {
      setIsGenerating(true);
      setGenerationStatus('generating');
      setError(null);

      const payload: ExerciseGenerateIn = {
        ...formData,
        ...(sourceType === 'raw' && { raw_context: rawContext }),
        // Note: note_id e source_id seriam preenchidos baseado na seleção do usuário
      };

      const exercise = await api.generateExercise(payload);
      setGenerationStatus('success');
      onExerciseCreated(exercise);
      
    } catch (err) {
      setGenerationStatus('error');
      setError('Erro ao gerar exercícios. Tente novamente.');
      console.error('Erro na geração:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInputChange = (field: keyof ExerciseGenerateIn, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="h-[110px] bg-blue-600 flex items-center px-8">
        <div>
          <h1 className="text-white text-2xl font-bold">Gerar Novo Banco</h1>
          <p className="text-blue-100">Configure os parâmetros para geração</p>
        </div>
      </div>
      
      <div className="container mx-auto px-8 py-8">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft size={20} />
            Voltar
          </button>
          <div>
            <h2 className="font-['Alexandria:Medium',_sans-serif] font-medium text-[28px] text-[#202020]">
              Gerar Novo Banco de Exercícios
            </h2>
            <p className="font-['Alexandria:Regular',_sans-serif] font-normal text-[16px] text-gray-600">
              Configure os parâmetros para gerar exercícios personalizados
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Coluna 1: Configurações Básicas */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-['Alexandria:Medium',_sans-serif] font-medium text-[18px] text-[#202020] mb-4">
                  Configurações Básicas
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantidade de Questões
                    </label>
                    <input
                      type="number"
                      min="5"
                      max="50"
                      value={formData.qty}
                      onChange={(e) => handleInputChange('qty', parseInt(e.target.value))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Questões
                    </label>
                    <select
                      value={formData.kind}
                      onChange={(e) => handleInputChange('kind', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="mix">Mistas (Recomendado)</option>
                      <option value="open">Apenas Abertas</option>
                      <option value="closed">Apenas Fechadas</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dificuldade
                    </label>
                    <select
                      value={formData.difficulty}
                      onChange={(e) => handleInputChange('difficulty', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="easy">Fácil</option>
                      <option value="medium">Médio</option>
                      <option value="hard">Difícil</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assunto (Opcional)
                    </label>
                    <input
                      type="text"
                      value={formData.subject || ''}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      placeholder="Ex: Cálculo, Programação, História..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estilo (Opcional)
                    </label>
                    <input
                      type="text"
                      value={formData.style || ''}
                      onChange={(e) => handleInputChange('style', e.target.value)}
                      placeholder="Ex: ENEM, Vestibular, Acadêmico..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Coluna 2: Fonte de Conteúdo */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-['Alexandria:Medium',_sans-serif] font-medium text-[18px] text-[#202020] mb-4">
                  Fonte de Conteúdo
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Escolha a fonte:
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="sourceType"
                          value="raw"
                          checked={sourceType === 'raw'}
                          onChange={(e) => setSourceType(e.target.value as any)}
                          className="mr-3"
                        />
                        <div className="flex items-center gap-3">
                          <FileText size={20} className="text-gray-600" />
                          <div>
                            <div className="font-medium">Texto Livre</div>
                            <div className="text-sm text-gray-500">Cole o conteúdo diretamente</div>
                          </div>
                        </div>
                      </label>

                      <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="sourceType"
                          value="note"
                          checked={sourceType === 'note'}
                          onChange={(e) => setSourceType(e.target.value as any)}
                          className="mr-3"
                        />
                        <div className="flex items-center gap-3">
                          <BookOpen size={20} className="text-gray-600" />
                          <div>
                            <div className="font-medium">Nota Existente</div>
                            <div className="text-sm text-gray-500">Use uma nota salva</div>
                          </div>
                        </div>
                      </label>

                      <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="sourceType"
                          value="source"
                          checked={sourceType === 'source'}
                          onChange={(e) => setSourceType(e.target.value as any)}
                          className="mr-3"
                        />
                        <div className="flex items-center gap-3">
                          <Upload size={20} className="text-gray-600" />
                          <div>
                            <div className="font-medium">Arquivo Upload</div>
                            <div className="text-sm text-gray-500">PDF ou documento</div>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {sourceType === 'raw' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Conteúdo
                      </label>
                      <textarea
                        value={rawContext}
                        onChange={(e) => setRawContext(e.target.value)}
                        placeholder="Cole aqui o conteúdo que será usado para gerar as questões..."
                        rows={8}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Mínimo: 200 caracteres. Recomendado: 500+ caracteres para melhores resultados.
                      </p>
                    </div>
                  )}

                  {sourceType === 'note' && (
                    <div className="text-center py-8 text-gray-500">
                      <BookOpen size={48} className="mx-auto mb-3 text-gray-400" />
                      <p>Seleção de notas será implementada em breve</p>
                    </div>
                  )}

                  {sourceType === 'source' && (
                    <div className="text-center py-8 text-gray-500">
                      <Upload size={48} className="mx-auto mb-3 text-gray-400" />
                      <p>Upload de arquivos será implementado em breve</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Configurações Avançadas */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-['Alexandria:Medium',_sans-serif] font-medium text-[18px] text-[#202020] mb-4">
                  Configurações Avançadas
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Modo de Geração
                    </label>
                    <select
                      value={formData.pattern_mode}
                      onChange={(e) => handleInputChange('pattern_mode', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="auto">Automático (Recomendado)</option>
                      <option value="strict">Rígido (4 opções, 1 correta)</option>
                      <option value="open_only">Apenas Abertas</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Automático detecta padrões no conteúdo e adapta o formato das questões.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fallback para Abertas
                    </label>
                    <select
                      value={formData.fallback}
                      onChange={(e) => handleInputChange('fallback', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="open">Questões Abertas</option>
                      <option value="topics">Tópicos de Estudo</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Status de Geração */}
          {generationStatus === 'generating' && (
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Loader2 className="animate-spin text-blue-600" size={20} />
                <div>
                  <p className="font-medium text-blue-800">Gerando exercícios...</p>
                  <p className="text-sm text-blue-600">Isso pode levar alguns minutos</p>
                </div>
              </div>
            </div>
          )}

          {generationStatus === 'success' && (
            <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-600" size={20} />
                <div>
                  <p className="font-medium text-green-800">Exercícios gerados com sucesso!</p>
                  <p className="text-sm text-green-600">Redirecionando para o banco...</p>
                </div>
              </div>
            </div>
          )}

          {generationStatus === 'error' && (
            <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <XCircle className="text-red-600" size={20} />
                <div>
                  <p className="font-medium text-red-800">Erro na geração</p>
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Botões */}
          <div className="flex gap-4 mt-8">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-['Alexandria:Medium',_sans-serif] font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isGenerating || (sourceType === 'raw' && !rawContext.trim())}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-['Alexandria:Medium',_sans-serif] font-medium"
            >
              {isGenerating ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={16} />
                  Gerando...
                </div>
              ) : (
                'Gerar Exercícios'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
