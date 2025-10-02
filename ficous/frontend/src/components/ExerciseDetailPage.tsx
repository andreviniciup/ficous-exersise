import { useState, useEffect } from 'react';
import { ArrowLeft, Play, Edit, Save, X, Plus, Filter, Target, Clock, BarChart3 } from 'lucide-react';
import { api } from '../services/api';
import type { ExerciseDetailOut, ExerciseItem } from '../types/exercises';

interface ExerciseDetailPageProps {
  exerciseId: string;
  onBack: () => void;
  onStartQuiz: (exerciseId: string) => void;
}

export function ExerciseDetailPage({ exerciseId, onBack, onStartQuiz }: ExerciseDetailPageProps) {
  const [exercise, setExercise] = useState<ExerciseDetailOut | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ExerciseItem>>({});
  const [filterKind, setFilterKind] = useState<string>('all');
  const [showAddItem, setShowAddItem] = useState(false);

  useEffect(() => {
    loadExercise();
  }, [exerciseId]);

  const loadExercise = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getExerciseDetail(exerciseId);
      setExercise(data);
    } catch (err) {
      setError('Erro ao carregar exercício');
      console.error('Erro ao carregar exercício:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditItem = (item: ExerciseItem) => {
    setEditingItem(item.id);
    setEditForm({
      question: item.question,
      kind: item.kind,
      options_json: item.options_json,
      answer_json: item.answer_json
    });
  };

  const handleSaveItem = async () => {
    if (!exercise || !editingItem) return;

    try {
      // Aqui seria a chamada para atualizar o item
      // await api.updateExerciseItem(editingItem, editForm);
      console.log('Salvando item:', editingItem, editForm);
      
      // Atualizar localmente
      setExercise(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          items: prev.items.map(item => 
            item.id === editingItem 
              ? { ...item, ...editForm }
              : item
          )
        };
      });
      
      setEditingItem(null);
      setEditForm({});
    } catch (err) {
      console.error('Erro ao salvar item:', err);
    }
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setEditForm({});
  };

  const filteredItems = exercise?.items.filter(item => 
    filterKind === 'all' || item.kind === filterKind
  ) || [];

  const getKindLabel = (kind: string) => {
    const labels = {
      'mcq': 'Múltipla Escolha',
      'open': 'Aberta',
      'vf': 'Verdadeiro/Falso',
      'multi': 'Múltipla Resposta'
    };
    return labels[kind as keyof typeof labels] || kind;
  };

  const getKindColor = (kind: string) => {
    const colors = {
      'mcq': 'bg-blue-100 text-blue-800',
      'open': 'bg-green-100 text-green-800',
      'vf': 'bg-purple-100 text-purple-800',
      'multi': 'bg-orange-100 text-orange-800'
    };
    return colors[kind as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="font-['Alexandria:Regular',_sans-serif] font-normal text-[16px] text-gray-600">
            Carregando exercício...
          </p>
        </div>
      </div>
    );
  }

  if (error || !exercise) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <X className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="font-['Alexandria:Regular',_sans-serif] font-normal text-[16px] text-red-600 mb-4">
            {error || 'Exercício não encontrado'}
          </p>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="h-[110px] bg-blue-600 flex items-center px-8">
        <div>
          <h1 className="text-white text-2xl font-bold">Detalhes do Banco</h1>
          <p className="text-blue-100">Edite e gerencie suas questões</p>
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
          <div className="flex-1">
            <h2 className="font-['Alexandria:Medium',_sans-serif] font-medium text-[28px] text-[#202020]">
              {exercise.title}
            </h2>
            <p className="font-['Alexandria:Regular',_sans-serif] font-normal text-[16px] text-gray-600">
              {exercise.meta_json.subject || 'Sem assunto específico'}
            </p>
          </div>
          <button
            onClick={() => onStartQuiz(exercise.id)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-['Alexandria:Medium',_sans-serif] font-medium text-[14px]"
          >
            <Play size={16} />
            Iniciar Quiz
          </button>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <Target className="text-blue-600" size={20} />
              <div>
                <p className="text-sm text-gray-600">Total de Questões</p>
                <p className="font-medium text-lg">{exercise.items.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <BarChart3 className="text-green-600" size={20} />
              <div>
                <p className="text-sm text-gray-600">Tipos</p>
                <p className="font-medium text-lg">
                  {new Set(exercise.items.map(item => item.kind)).size}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <Clock className="text-orange-600" size={20} />
              <div>
                <p className="text-sm text-gray-600">Dificuldade</p>
                <p className="font-medium text-lg capitalize">{exercise.meta_json.difficulty}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-blue-600"></div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="font-medium text-lg capitalize">{exercise.meta_json.status}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros e Ações */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-600" />
              <select
                value={filterKind}
                onChange={(e) => setFilterKind(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos os tipos</option>
                <option value="mcq">Múltipla Escolha</option>
                <option value="open">Abertas</option>
                <option value="vf">Verdadeiro/Falso</option>
                <option value="multi">Múltipla Resposta</option>
              </select>
            </div>
          </div>
          
          <button
            onClick={() => setShowAddItem(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-['Alexandria:Medium',_sans-serif] font-medium text-[14px]"
          >
            <Plus size={16} />
            Adicionar Questão
          </button>
        </div>

        {/* Lista de Questões */}
        <div className="space-y-4">
          {filteredItems.map((item, index) => (
            <div key={item.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getKindColor(item.kind)}`}>
                      {getKindLabel(item.kind)}
                    </span>
                  </div>
                  
                  {editingItem === item.id ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Questão
                        </label>
                        <textarea
                          value={editForm.question || ''}
                          onChange={(e) => setEditForm(prev => ({ ...prev, question: e.target.value }))}
                          rows={3}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        />
                      </div>
                      
                      {item.kind === 'mcq' && editForm.options_json && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Opções
                          </label>
                          <div className="space-y-2">
                            {editForm.options_json.map((option, optIndex) => (
                              <div key={optIndex} className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-500 w-6">
                                  {String.fromCharCode(65 + optIndex)}.
                                </span>
                                <input
                                  type="text"
                                  value={option}
                                  onChange={(e) => {
                                    const newOptions = [...(editForm.options_json || [])];
                                    newOptions[optIndex] = e.target.value;
                                    setEditForm(prev => ({ ...prev, options_json: newOptions }));
                                  }}
                                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveItem}
                          className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                        >
                          <Save size={14} />
                          Salvar
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                        >
                          <X size={14} />
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="font-['Alexandria:Regular',_sans-serif] font-normal text-[16px] text-[#202020] mb-3">
                        {item.question}
                      </p>
                      
                      {item.kind === 'mcq' && item.options_json && (
                        <div className="space-y-2 mb-3">
                          {item.options_json.map((option, optIndex) => (
                            <div key={optIndex} className="flex items-center gap-2 text-sm text-gray-600">
                              <span className="font-medium w-6">
                                {String.fromCharCode(65 + optIndex)}.
                              </span>
                              <span>{option}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {item.answer_json?.explanation && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <p className="text-sm text-blue-800">
                            <strong>Explicação:</strong> {item.answer_json.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {editingItem !== item.id && (
                  <button
                    onClick={() => handleEditItem(item)}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    <Edit size={14} />
                    Editar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="font-['Alexandria:Medium',_sans-serif] font-medium text-[18px] text-gray-600 mb-2">
              Nenhuma questão encontrada
            </h3>
            <p className="font-['Alexandria:Regular',_sans-serif] font-normal text-[14px] text-gray-500">
              {filterKind === 'all' 
                ? 'Este exercício não possui questões ainda'
                : `Nenhuma questão do tipo "${getKindLabel(filterKind)}" encontrada`
              }
            </p>
          </div>
        )}

        {/* Modal de adicionar questão (placeholder) */}
        {showAddItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="font-['Alexandria:Medium',_sans-serif] font-medium text-[18px] text-[#202020] mb-4">
                Adicionar Nova Questão
              </h3>
              <p className="text-gray-600 mb-4">
                Esta funcionalidade será implementada em breve.
              </p>
              <button
                onClick={() => setShowAddItem(false)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
