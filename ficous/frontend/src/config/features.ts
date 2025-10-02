/**
 * Feature flags para controlar funcionalidades da aplicação
 */

export const FEATURES = {
  // Modo focado em exercises
  EXERCISES_ONLY: true,
  
  // Features específicas
  SHOW_NOTES: false,
  SHOW_FLASHCARDS: false,
  SHOW_FOCUS: false,
  SHOW_PERFORMANCE: false,
  SHOW_SETTINGS: true, // Manter configurações
  
  // Features de exercises
  SHOW_EXERCISE_GENERATION: true,
  SHOW_EXERCISE_QUIZ: true,
  SHOW_EXERCISE_EDITING: true,
  SHOW_EXERCISE_FILTERS: true,
} as const;

export type FeatureKey = keyof typeof FEATURES;
