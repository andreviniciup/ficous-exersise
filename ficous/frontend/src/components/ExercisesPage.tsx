import { useState } from 'react';
import { Plus, Target } from 'lucide-react';
import type { ExerciseFilters } from '../types/exercises';
import { ExerciseCard } from './exercises/ExerciseCard';
import { ExerciseFiltersComponent } from './exercises/ExerciseFilters';
import { ExerciseStats } from './exercises/ExerciseStats';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { ErrorMessage } from './ui/ErrorMessage';
import { PageHeader } from './ui/PageHeader';
import { useExercises } from '../hooks/useExercises';

interface ExercisesPageProps {
  onGenerateNew: () => void;
  onViewExercise: (exerciseId: string) => void;
  onHome: () => void;
}

export function ExercisesPage({ onGenerateNew, onViewExercise, onHome }: ExercisesPageProps) {
  const [filters, setFilters] = useState<ExerciseFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  
  const { exercises, loading, error, refreshExercises } = useExercises(filters);

  const handleStartExercise = (exercise: Exercise) => {
    onViewExercise(exercise.id);
  };

  const handleEditExercise = (exercise: Exercise) => {
    onViewExercise(exercise.id);
  };

  // Usar componente ExerciseCard

  // Usar componente ExerciseFiltersComponent

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Carregando exercícios..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ErrorMessage 
          message={error}
          onRetry={refreshExercises}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader 
        title="Bancos de Exercícios"
        subtitle="Gerencie seus bancos de exercícios"
        onHome={onHome}
      />
      
      <div className="container mx-auto px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-['Alexandria:Medium',_sans-serif] font-medium text-[28px] text-[#202020]">
              Bancos de Exercícios
              </h2>
              <p className="font-['Alexandria:Regular',_sans-serif] font-normal text-[16px] text-gray-600">
              {exercises.length} bancos disponíveis
              </p>
            </div>
            
          <div className="flex gap-3">
            <button
              onClick={onGenerateNew}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-['Alexandria:Medium',_sans-serif] font-medium text-[14px]"
            >
              <Plus size={16} />
              Gerar Novo
            </button>
          </div>
        </div>

        {/* Estatísticas */}
        <ExerciseStats exercises={exercises} />

        {/* Filtros */}
        <ExerciseFiltersComponent 
          filters={filters}
          onFiltersChange={setFilters}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
        />

        {/* Lista de exercícios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exercises.map((exercise) => (
            <ExerciseCard 
              key={exercise.id} 
              exercise={exercise}
              onStart={handleStartExercise}
              onEdit={handleEditExercise}
            />
          ))}
        </div>

        {exercises.length === 0 && (
          <div className="text-center py-12">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="font-['Alexandria:Medium',_sans-serif] font-medium text-[18px] text-gray-600 mb-2">
              Nenhum exercício encontrado
            </h3>
            <p className="font-['Alexandria:Regular',_sans-serif] font-normal text-[14px] text-gray-500 mb-4">
              {Object.keys(filters).length > 0 
                ? 'Tente ajustar os filtros ou limpar a busca'
                : 'Comece criando seu primeiro banco de exercícios'
              }
            </p>
            <button
              onClick={onGenerateNew}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-['Alexandria:Medium',_sans-serif] font-medium text-[14px] mx-auto"
            >
              <Plus size={16} />
              Gerar Primeiro Banco
            </button>
          </div>
        )}
      </div>

    </div>
  );
}