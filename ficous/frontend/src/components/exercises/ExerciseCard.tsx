import { Play, Edit, Target, Clock, BarChart3 } from 'lucide-react';
import type { Exercise } from '../../types/exercises';

interface ExerciseCardProps {
  exercise: Exercise;
  onStart: (exercise: Exercise) => void;
  onEdit: (exercise: Exercise) => void;
}

export function ExerciseCard({ exercise, onStart, onEdit }: ExerciseCardProps) {
  const difficultyColors = {
    easy: '#10b981',
    medium: '#f59e0b',
    hard: '#ef4444'
  };

  const difficultyLabels = {
    easy: 'Fácil',
    medium: 'Médio',
    hard: 'Difícil'
  };

  const getKindLabel = (kind: string) => {
    const labels = {
      'mix': 'Mistas',
      'open': 'Abertas',
      'closed': 'Fechadas'
    };
    return labels[kind as keyof typeof labels] || kind;
  };

  return (
    <div className="bg-white rounded-[12px] border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-['Alexandria:Medium',_sans-serif] font-medium text-[18px] text-[#202020]">
              {exercise.title}
            </h3>
            <span 
              className="px-2 py-1 rounded-full text-xs font-medium"
              style={{ 
                backgroundColor: difficultyColors[exercise.meta_json.difficulty as keyof typeof difficultyColors] + '20',
                color: difficultyColors[exercise.meta_json.difficulty as keyof typeof difficultyColors]
              }}
            >
              {difficultyLabels[exercise.meta_json.difficulty as keyof typeof difficultyLabels]}
            </span>
          </div>
          
          <p className="font-['Alexandria:Regular',_sans-serif] font-normal text-[14px] text-gray-600 mb-3">
            {exercise.meta_json.subject || 'Sem assunto específico'}
          </p>
          
          <div className="flex items-center gap-4 text-[12px] text-gray-500 mb-4">
            <div className="flex items-center gap-1">
              <Target size={14} />
              <span>{exercise.meta_json.qty} questões</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{getKindLabel(exercise.meta_json.kind)}</span>
            </div>
            {exercise.meta_json.tags && exercise.meta_json.tags.length > 0 && (
              <div className="flex items-center gap-1">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {exercise.meta_json.tags[0]}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={() => onStart(exercise)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-['Alexandria:Medium',_sans-serif] font-medium text-[14px]"
        >
          <Play size={16} />
          Iniciar
        </button>
        <button
          onClick={() => onEdit(exercise)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-['Alexandria:Medium',_sans-serif] font-medium text-[14px]"
        >
          <Edit size={16} />
          Editar
        </button>
      </div>
    </div>
  );
}
