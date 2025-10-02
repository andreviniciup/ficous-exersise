import { Target, BarChart3, Clock, CheckCircle } from 'lucide-react';
import type { Exercise } from '../../types/exercises';

interface ExerciseStatsProps {
  exercises: Exercise[];
}

export function ExerciseStats({ exercises }: ExerciseStatsProps) {
  const stats = {
    total: exercises.length,
    byDifficulty: exercises.reduce((acc, ex) => {
      const diff = ex.meta_json.difficulty;
      acc[diff] = (acc[diff] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    byKind: exercises.reduce((acc, ex) => {
      const kind = ex.meta_json.kind;
      acc[kind] = (acc[kind] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    totalQuestions: exercises.reduce((sum, ex) => sum + ex.meta_json.qty, 0)
  };

  const difficultyColors = {
    easy: 'text-green-600',
    medium: 'text-yellow-600', 
    hard: 'text-red-600'
  };

  const difficultyLabels = {
    easy: 'Fácil',
    medium: 'Médio',
    hard: 'Difícil'
  };

  const kindLabels = {
    open: 'Abertas',
    closed: 'Fechadas',
    mix: 'Mistas'
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <Target className="text-blue-600" size={20} />
          <div>
            <p className="text-sm text-gray-600">Total de Bancos</p>
            <p className="font-medium text-lg">{stats.total}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <BarChart3 className="text-green-600" size={20} />
          <div>
            <p className="text-sm text-gray-600">Total de Questões</p>
            <p className="font-medium text-lg">{stats.totalQuestions}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <Clock className="text-orange-600" size={20} />
          <div>
            <p className="text-sm text-gray-600">Por Dificuldade</p>
            <div className="flex gap-2 mt-1">
              {Object.entries(stats.byDifficulty).map(([diff, count]) => (
                <span 
                  key={diff}
                  className={`text-xs px-2 py-1 rounded-full ${difficultyColors[diff as keyof typeof difficultyColors] || 'text-gray-600'} bg-gray-100`}
                >
                  {difficultyLabels[diff as keyof typeof difficultyLabels] || diff}: {count}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <CheckCircle className="text-purple-600" size={20} />
          <div>
            <p className="text-sm text-gray-600">Por Tipo</p>
            <div className="flex gap-2 mt-1">
              {Object.entries(stats.byKind).map(([kind, count]) => (
                <span 
                  key={kind}
                  className="text-xs px-2 py-1 rounded-full text-blue-600 bg-blue-100"
                >
                  {kindLabels[kind as keyof typeof kindLabels] || kind}: {count}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
