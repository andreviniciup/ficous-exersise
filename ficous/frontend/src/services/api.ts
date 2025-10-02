/**
 * Serviço de API para comunicação com o backend Ficous
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Tipos para as entidades
export interface Discipline {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
}

export interface Note {
  id: string;
  user_id: string;
  discipline_id?: string;
  title: string;
  content: string;
  summary?: string;
  questions_json?: string[];
  concepts_json?: string[];
  tags_json?: string[];
  source_pdf_meta?: any;
  created_at: string;
  updated_at: string;
}

export interface SageProcessOut {
  summary: string;
  questions: string[];
  concepts: string[];
  tags: string[];
}

export interface SageAnswerOut {
  type: string;
  payload: any;
}

export interface Flashcard {
  id: string;
  user_id: string;
  discipline_id?: string;
  note_id?: string;
  question: string;
  answer: string;
  ease_factor: number;
  repetitions: number;
  interval_days: number;
  next_review_at: string;
  last_reviewed_at?: string;
  created_at: string;
}

// Importar tipos atualizados
import type { 
  Exercise, 
  ExerciseItem, 
  ExerciseDetailOut,
  ExerciseGenerateIn,
  ExerciseEvaluateIn,
  ExerciseEvaluateOut,
  ExerciseGradeIn,
  ExerciseGradeOut,
  ExerciseFilters
} from '../types/exercises';

export interface Source {
  id: string;
  user_id: string;
  discipline_id?: string;
  note_id?: string;
  title: string;
  source_type: string;
  url?: string;
  excerpt?: string;
  created_at: string;
}

// Classe principal da API
class FicousAPI {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('ficous_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Autenticação
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('ficous_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('ficous_token');
  }

  // Disciplinas
  async getDisciplines(): Promise<Discipline[]> {
    return this.request<Discipline[]>('/ficous/disciplines/');
  }

  async createDiscipline(name: string): Promise<Discipline> {
    return this.request<Discipline>('/ficous/disciplines/', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  }

  async updateDiscipline(id: string, name: string): Promise<Discipline> {
    return this.request<Discipline>(`/ficous/disciplines/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name }),
    });
  }

  async deleteDiscipline(id: string): Promise<void> {
    return this.request<void>(`/ficous/disciplines/${id}`, {
      method: 'DELETE',
    });
  }

  // Notas
  async getNotes(): Promise<Note[]> {
    return this.request<Note[]>('/ficous/notes/');
  }

  async getNote(id: string): Promise<Note> {
    return this.request<Note>(`/ficous/notes/${id}`);
  }

  async createNote(data: {
    discipline_id?: string;
    title: string;
    content: string;
  }): Promise<Note> {
    return this.request<Note>('/ficous/notes/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateNote(id: string, data: Partial<{
    discipline_id?: string;
    title?: string;
    content?: string;
    summary?: string;
    questions_json?: string[];
    concepts_json?: string[];
    tags_json?: string[];
  }>): Promise<Note> {
    return this.request<Note>(`/ficous/notes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteNote(id: string): Promise<void> {
    return this.request<void>(`/ficous/notes/${id}`, {
      method: 'DELETE',
    });
  }

  // Sage (IA)
  async processNote(data: {
    note_id?: string;
    raw_content?: string;
    normalize?: boolean;
    output_language?: string;
  }): Promise<SageProcessOut> {
    return this.request<SageProcessOut>('/ficous/sage/process', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async askSage(data: {
    note_id?: string;
    discipline_id?: string;
    raw_context?: string;
    prompt: string;
    level?: number;
    normalize?: boolean;
    output_language?: string;
  }): Promise<SageAnswerOut> {
    return this.request<SageAnswerOut>('/ficous/sage/answer', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Upload
  async uploadPDF(file: File, options: {
    clean?: boolean;
    layout?: string;
    pages?: string;
    ocr?: boolean;
  } = {}): Promise<{ text: string; metadata: any }> {
    const formData = new FormData();
    formData.append('file', file);
    
    const params = new URLSearchParams();
    if (options.clean) params.append('clean', 'true');
    if (options.layout) params.append('layout', options.layout);
    if (options.pages) params.append('pages', options.pages);
    if (options.ocr) params.append('ocr', 'true');

    const url = `/ficous/upload/pdf?${params.toString()}`;
    
    const response = await fetch(`${this.baseURL}${url}`, {
      method: 'POST',
      headers: {
        Authorization: this.token ? `Bearer ${this.token}` : '',
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Erro no upload' }));
      throw new Error(error.message || 'Erro no upload');
    }

    return response.json();
  }

  // Flashcards
  async getFlashcards(): Promise<Flashcard[]> {
    return this.request<Flashcard[]>('/ficous/flashcards/');
  }

  async createFlashcard(data: {
    discipline_id?: string;
    note_id?: string;
    question: string;
    answer: string;
  }): Promise<Flashcard> {
    return this.request<Flashcard>('/ficous/flashcards/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async generateFlashcards(data: {
    note_id?: string;
    discipline_id?: string;
    raw_context?: string;
    count?: number;
    language?: string;
  }): Promise<Flashcard[]> {
    return this.request<Flashcard[]>('/ficous/flashcards/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getReviewFlashcards(): Promise<Flashcard[]> {
    return this.request<Flashcard[]>('/ficous/flashcards/review');
  }

  async gradeFlashcard(id: string, grade: number): Promise<Flashcard> {
    return this.request<Flashcard>(`/ficous/flashcards/${id}/grade`, {
      method: 'POST',
      body: JSON.stringify({ grade }),
    });
  }

  // Exercícios - API completa
  async getExercises(filters?: ExerciseFilters): Promise<Exercise[]> {
    const params = new URLSearchParams();
    if (filters?.kind) params.append('kind', filters.kind);
    if (filters?.difficulty) params.append('difficulty', filters.difficulty);
    if (filters?.tag) params.append('tag', filters.tag);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());
    
    const query = params.toString();
    return this.request<Exercise[]>(`/ficous/exercises/${query ? `?${query}` : ''}`);
  }

  async getExerciseDetail(id: string): Promise<ExerciseDetailOut> {
    return this.request<ExerciseDetailOut>(`/ficous/exercises/${id}`);
  }

  async createExercise(data: {
    discipline_id?: string;
    note_id?: string;
    title: string;
    meta_json?: any;
    items: Array<{
      question: string;
      kind: string;
      options_json?: any;
      answer_json?: any;
    }>;
  }): Promise<Exercise> {
    return this.request<Exercise>('/ficous/exercises/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async generateExercise(data: ExerciseGenerateIn): Promise<Exercise> {
    return this.request<Exercise>('/ficous/exercises/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async evaluateExercise(data: ExerciseEvaluateIn): Promise<ExerciseEvaluateOut> {
    return this.request<ExerciseEvaluateOut>('/ficous/exercises/evaluate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async gradeExercise(id: string, data: ExerciseGradeIn): Promise<ExerciseGradeOut> {
    return this.request<ExerciseGradeOut>(`/ficous/exercises/${id}/grade`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async submitExercise(id: string, answers: any[]): Promise<Exercise> {
    return this.request<Exercise>(`/ficous/exercises/${id}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers_json: answers }),
    });
  }

  // Progresso
  async getProgressOverview(): Promise<any> {
    return this.request<any>('/ficous/progress/overview');
  }

  async getProgressInsights(): Promise<any> {
    return this.request<any>('/ficous/progress/insights');
  }

  // Biblioteca
  async getSources(): Promise<Source[]> {
    return this.request<Source[]>('/ficous/library/');
  }

  async uploadSource(data: {
    discipline_id?: string;
    note_id?: string;
    title: string;
    source_type: string;
    url?: string;
    excerpt?: string;
  }): Promise<Source> {
    return this.request<Source>('/ficous/library/upload', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteSource(id: string): Promise<void> {
    return this.request<void>(`/ficous/library/${id}`, {
      method: 'DELETE',
    });
  }

  // Admin
  async rebuildSummaries(): Promise<any> {
    return this.request<any>('/ficous/admin/rebuild-summaries', {
      method: 'POST',
    });
  }

  async getCacheStats(): Promise<any> {
    return this.request<any>('/ficous/admin/cache-stats');
  }

  async clearCache(): Promise<any> {
    return this.request<any>('/ficous/admin/clear-cache', {
      method: 'POST',
    });
  }
}

// Instância singleton da API
export const api = new FicousAPI();

// Hook para usar a API em componentes React
export const useAPI = () => api;
