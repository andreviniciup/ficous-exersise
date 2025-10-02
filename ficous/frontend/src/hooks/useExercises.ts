import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { Exercise, ExerciseFilters } from '../types/exercises';

export function useExercises(filters?: ExerciseFilters) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadExercises = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getExercises(filters);
      setExercises(data);
    } catch (err) {
      setError('Erro ao carregar exercícios');
      console.error('Erro ao carregar exercícios:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshExercises = () => {
    loadExercises();
  };

  useEffect(() => {
    loadExercises();
  }, [filters]);

  return {
    exercises,
    loading,
    error,
    refreshExercises
  };
}
