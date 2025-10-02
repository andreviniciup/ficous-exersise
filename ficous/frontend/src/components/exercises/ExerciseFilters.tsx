import { Filter, X } from 'lucide-react';
import type { ExerciseFilters } from '../../types/exercises';

interface ExerciseFiltersProps {
  filters: ExerciseFilters;
  onFiltersChange: (filters: ExerciseFilters) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
}

export function ExerciseFiltersComponent({ 
  filters, 
  onFiltersChange, 
  showFilters, 
  onToggleFilters 
}: ExerciseFiltersProps) {
  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.keys(filters).some(key => 
    filters[key as keyof ExerciseFilters] !== undefined && 
    filters[key as keyof ExerciseFilters] !== ''
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-['Alexandria:Medium',_sans-serif] font-medium text-[16px] text-[#202020]">
          Filtros
        </h3>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-2 py-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X size={12} />
              Limpar
            </button>
          )}
          <button
            onClick={onToggleFilters}
            className="flex items-center gap-2 px-3 py-1 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <Filter size={16} />
            {showFilters ? 'Ocultar' : 'Mostrar'}
          </button>
        </div>
      </div>
      
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
            <select
              value={filters.kind || ''}
              onChange={(e) => onFiltersChange({ ...filters, kind: e.target.value || undefined })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos</option>
              <option value="open">Abertas</option>
              <option value="closed">Fechadas</option>
              <option value="mix">Mistas</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Dificuldade</label>
            <select
              value={filters.difficulty || ''}
              onChange={(e) => onFiltersChange({ ...filters, difficulty: e.target.value || undefined })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todas</option>
              <option value="easy">Fácil</option>
              <option value="medium">Médio</option>
              <option value="hard">Difícil</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tag</label>
            <input
              type="text"
              value={filters.tag || ''}
              onChange={(e) => onFiltersChange({ ...filters, tag: e.target.value || undefined })}
              placeholder="Filtrar por tag..."
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      )}
      
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap gap-2">
          {filters.kind && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
              Tipo: {filters.kind}
              <button
                onClick={() => onFiltersChange({ ...filters, kind: undefined })}
                className="hover:text-blue-600"
              >
                <X size={12} />
              </button>
            </span>
          )}
          {filters.difficulty && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
              Dificuldade: {filters.difficulty}
              <button
                onClick={() => onFiltersChange({ ...filters, difficulty: undefined })}
                className="hover:text-green-600"
              >
                <X size={12} />
              </button>
            </span>
          )}
          {filters.tag && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
              Tag: {filters.tag}
              <button
                onClick={() => onFiltersChange({ ...filters, tag: undefined })}
                className="hover:text-purple-600"
              >
                <X size={12} />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
