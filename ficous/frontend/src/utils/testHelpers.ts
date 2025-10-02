/**
 * Funções auxiliares para testes e desenvolvimento
 */

import type { Exercise } from '../types/exercises';

export const createMockExercise = (overrides: Partial<Exercise> = {}): Exercise => ({
  id: 'mock-exercise-1',
  user_id: 'mock-user-1',
  title: 'Exercício de Teste',
  meta_json: {
    qty: 10,
    kind: 'mix',
    difficulty: 'medium',
    subject: 'Matemática',
    style: 'Acadêmico',
    status: 'ready',
    tags: ['teste', 'matemática']
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides
});

export const createMockExercises = (count: number = 3): Exercise[] => {
  return Array.from({ length: count }, (_, index) => 
    createMockExercise({
      id: `mock-exercise-${index + 1}`,
      title: `Exercício ${index + 1}`,
      meta_json: {
        qty: 5 + index * 2,
        kind: ['mix', 'open', 'closed'][index % 3] as any,
        difficulty: ['easy', 'medium', 'hard'][index % 3] as any,
        subject: ['Matemática', 'Física', 'Química'][index % 3],
        style: 'Acadêmico',
        status: 'ready',
        tags: [`tag-${index + 1}`]
      }
    })
  );
};

export const simulateApiDelay = (ms: number = 1000): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const simulateApiError = (message: string = 'Erro simulado'): Promise<never> => {
  return Promise.reject(new Error(message));
};
