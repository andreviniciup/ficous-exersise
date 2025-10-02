/**
 * Constantes da aplicação
 */

export const DIFFICULTY_CONFIG = {
  easy: {
    label: 'Fácil',
    color: '#10b981',
    bgColor: '#10b98120'
  },
  medium: {
    label: 'Médio', 
    color: '#f59e0b',
    bgColor: '#f59e0b20'
  },
  hard: {
    label: 'Difícil',
    color: '#ef4444', 
    bgColor: '#ef444420'
  }
} as const;

export const KIND_CONFIG = {
  open: {
    label: 'Abertas',
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  closed: {
    label: 'Fechadas',
    color: 'text-blue-600', 
    bgColor: 'bg-blue-100'
  },
  mix: {
    label: 'Mistas',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  }
} as const;

export const QUIZ_CONFIG = {
  DEFAULT_TIME_LIMIT: 30 * 60, // 30 minutos em segundos
  WARNING_TIME: 5 * 60, // 5 minutos para aviso
  CRITICAL_TIME: 1 * 60, // 1 minuto crítico
} as const;

export const API_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_QUESTIONS: 50,
  MIN_QUESTIONS: 5,
} as const;
