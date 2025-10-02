import { useState } from 'react';
import { ArrowLeft, Play, Edit, CheckCircle, XCircle, Target, Clock, BarChart3 } from 'lucide-react';

interface ExerciseResultsProps {
  exercises: any[];
  onBack: () => void;
  onStartQuiz: (exercises: any[]) => void;
}

export function ExerciseResults({ exercises, onBack, onStartQuiz }: ExerciseResultsProps) {
  const [selectedExercises, setSelectedExercises] = useState<Set<string>>(new Set());

  const toggleExercise = (exerciseId: string) => {
    setSelectedExercises(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(exerciseId)) {
        newSelected.delete(exerciseId);
      } else {
        newSelected.add(exerciseId);
      }
      return newSelected;
    });
  };

  const selectAll = () => {
    setSelectedExercises(new Set(exercises.map(ex => ex.id)));
  };

  const deselectAll = () => {
    setSelectedExercises(new Set());
  };

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

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      'easy': 'text-green-600',
      'medium': 'text-yellow-600',
      'hard': 'text-red-600'
    };
    return colors[difficulty as keyof typeof colors] || 'text-gray-600';
  };

  const stats = {
    total: exercises.length,
    mcq: exercises.filter(ex => ex.kind === 'mcq').length,
    open: exercises.filter(ex => ex.kind === 'open').length,
    selected: selectedExercises.size
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Exercícios Gerados</h1>
              <p className="text-gray-600">{exercises.length} exercícios criados com sucesso</p>
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

      {/* Stats */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-8 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.mcq}</div>
              <div className="text-sm text-gray-600">Múltipla Escolha</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.open}</div>
              <div className="text-sm text-gray-600">Abertas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.selected}</div>
              <div className="text-sm text-gray-600">Selecionados</div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={selectAll}
                className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                Selecionar Todos
              </button>
              <button
                onClick={deselectAll}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Desmarcar Todos
              </button>
              <span className="text-sm text-gray-500">
                {stats.selected} de {stats.total} selecionados
              </span>
            </div>
            
            <button
              onClick={() => {
                const selectedExercisesList = Array.from(selectedExercises)
                  .map(id => exercises.find(ex => ex.id === id))
                  .filter(Boolean);
                onStartQuiz(selectedExercisesList);
              }}
              disabled={selectedExercises.size === 0}
              className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <Play size={16} />
              Iniciar Quiz ({selectedExercises.size})
            </button>
          </div>
        </div>
      </div>

      {/* Exercise Grid */}
      <div className="container mx-auto px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exercises.map((exercise, index) => (
            <div
              key={exercise.id}
              className={`bg-white border-2 rounded-lg p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedExercises.has(exercise.id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => toggleExercise(exercise.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                    {index + 1}
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getKindColor(exercise.kind)}`}>
                    {getKindLabel(exercise.kind)}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  {selectedExercises.has(exercise.id) ? (
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  ) : (
                    <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                  )}
                </div>
              </div>

              <div className="mb-4">
                <h3 className="font-medium text-gray-900 mb-2 overflow-hidden" style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}>
                  {exercise.question}
                </h3>
                
                {exercise.options && (
                  <div className="text-sm text-gray-600 mb-2">
                    {exercise.options.length} opções disponíveis
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Target size={14} className="text-gray-400" />
                    <span className={`font-medium ${getDifficultyColor(exercise.difficulty)}`}>
                      {exercise.difficulty}
                    </span>
                  </div>
                  
                  {exercise.subject && (
                    <div className="flex items-center gap-1">
                      <BarChart3 size={14} className="text-gray-400" />
                      <span className="text-gray-600">{exercise.subject}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Options Preview for MCQ */}
              {exercise.options && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="text-xs text-gray-500 mb-2">Opções:</div>
                  <div className="space-y-1">
                    {exercise.options.slice(0, 2).map((option: string, optIndex: number) => (
                      <div key={optIndex} className="text-sm text-gray-700">
                        {String.fromCharCode(65 + optIndex)}. {option}
                      </div>
                    ))}
                    {exercise.options.length > 2 && (
                      <div className="text-sm text-gray-500">
                        +{exercise.options.length - 2} mais...
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {exercises.length === 0 && (
          <div className="text-center py-12">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              Nenhum exercício encontrado
            </h3>
            <p className="text-gray-500">
              Tente gerar novos exercícios
            </p>
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="bg-white border-t">
        <div className="container mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {stats.selected > 0 && (
                <span>
                  {stats.selected} exercício{stats.selected > 1 ? 's' : ''} selecionado{stats.selected > 1 ? 's' : ''}
                </span>
              )}
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={onBack}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Gerar Novos
              </button>
              
              <button
                onClick={() => {
                  const selectedExercisesList = Array.from(selectedExercises)
                    .map(id => exercises.find(ex => ex.id === id))
                    .filter(Boolean);
                  onStartQuiz(selectedExercisesList);
                }}
                disabled={selectedExercises.size === 0}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Iniciar Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
