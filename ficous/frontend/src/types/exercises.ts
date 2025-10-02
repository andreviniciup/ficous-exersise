/**
 * Tipos específicos para a feature de exercises
 */

export interface Exercise {
  id: string;
  user_id: string;
  discipline_id?: string;
  note_id?: string;
  title: string;
  meta_json: {
    qty: number;
    kind: string;
    difficulty: string;
    subject?: string;
    style?: string;
    status: string;
    tags?: string[];
  };
  created_at: string;
  updated_at: string;
}

export interface ExerciseItem {
  id: string;
  exercise_id: string;
  question: string;
  kind: string;
  options_json?: string[];
  answer_json?: {
    correct_index?: number;
    correct_indices?: number[];
    correct_vf?: boolean;
    explanation?: string;
    model_answer?: string;
    key_concepts?: string[];
    rubric?: {
      criteria: string[];
      weights?: number[];
    };
    meta?: {
      difficulty?: string;
      tags?: string[];
    };
  };
  created_at: string;
  updated_at: string;
}

export interface ExerciseDetailOut extends Exercise {
  items: ExerciseItem[];
}

export interface ExerciseGenerateIn {
  note_id?: string;
  raw_context?: string;
  source_id?: string;
  qty: number;
  kind: string;
  difficulty?: string;
  subject?: string;
  style?: string;
  pattern_mode?: string;
  closed_format?: string;
  fallback?: string;
  normalize?: boolean;
  output_language?: string;
}

export interface ExerciseEvaluateIn {
  item_id: string;
  answer_text: string;
  difficulty?: string;
}

export interface ExerciseEvaluateOut {
  similarity: number;
  score: number;
  feedback: string;
  missing_concepts: string[];
}

export interface ExerciseGradeIn {
  answers_json: Array<{
    item_id: string;
    kind: string;
    answer_index?: number;
    answer_text?: string;
  }>;
}

export interface ItemResult {
  item_id: string;
  correct?: boolean;
  explanation?: string;
  similarity?: number;
  score?: number;
  feedback?: string;
}

export interface ExerciseGradeOut {
  exercise_id: string;
  score: {
    raw: number;
    max: number;
    percent: number;
  };
  items_results: ItemResult[];
}

export interface ExerciseFilters {
  kind?: string;
  difficulty?: string;
  tag?: string;
  limit?: number;
  offset?: number;
}
