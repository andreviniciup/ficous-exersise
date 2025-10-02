/**
 * Contexto para gerenciar dados do Ficous (disciplinas, notas, etc.)
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api, Discipline, Note, Flashcard, Exercise, Source } from '../services/api';

interface DataContextType {
  // Disciplinas
  disciplines: Discipline[];
  disciplinesLoading: boolean;
  refreshDisciplines: () => Promise<void>;
  createDiscipline: (name: string) => Promise<Discipline>;
  updateDiscipline: (id: string, name: string) => Promise<Discipline>;
  deleteDiscipline: (id: string) => Promise<void>;

  // Notas
  notes: Note[];
  notesLoading: boolean;
  refreshNotes: () => Promise<void>;
  createNote: (data: { discipline_id?: string; title: string; content: string }) => Promise<Note>;
  updateNote: (id: string, data: any) => Promise<Note>;
  deleteNote: (id: string) => Promise<void>;

  // Flashcards
  flashcards: Flashcard[];
  flashcardsLoading: boolean;
  refreshFlashcards: () => Promise<void>;
  createFlashcard: (data: any) => Promise<Flashcard>;
  generateFlashcards: (data: any) => Promise<Flashcard[]>;

  // Exercícios
  exercises: Exercise[];
  exercisesLoading: boolean;
  refreshExercises: () => Promise<void>;
  createExercise: (data: any) => Promise<Exercise>;
  generateExercise: (data: any) => Promise<Exercise>;

  // Fontes
  sources: Source[];
  sourcesLoading: boolean;
  refreshSources: () => Promise<void>;
  uploadSource: (data: any) => Promise<Source>;
  deleteSource: (id: string) => Promise<void>;

  // Estado geral
  isLoading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
  children: ReactNode;
}

export function DataProvider({ children }: DataProviderProps) {
  // Estados
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [disciplinesLoading, setDisciplinesLoading] = useState(false);
  
  const [notes, setNotes] = useState<Note[]>([]);
  const [notesLoading, setNotesLoading] = useState(false);
  
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [flashcardsLoading, setFlashcardsLoading] = useState(false);
  
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [exercisesLoading, setExercisesLoading] = useState(false);
  
  const [sources, setSources] = useState<Source[]>([]);
  const [sourcesLoading, setSourcesLoading] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Funções para disciplinas
  const refreshDisciplines = async () => {
    setDisciplinesLoading(true);
    try {
      const data = await api.getDisciplines();
      setDisciplines(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar disciplinas');
    } finally {
      setDisciplinesLoading(false);
    }
  };

  const createDiscipline = async (name: string) => {
    try {
      const newDiscipline = await api.createDiscipline(name);
      setDisciplines(prev => [...prev, newDiscipline]);
      return newDiscipline;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar disciplina');
      throw err;
    }
  };

  const updateDiscipline = async (id: string, name: string) => {
    try {
      const updatedDiscipline = await api.updateDiscipline(id, name);
      setDisciplines(prev => prev.map(d => d.id === id ? updatedDiscipline : d));
      return updatedDiscipline;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar disciplina');
      throw err;
    }
  };

  const deleteDiscipline = async (id: string) => {
    try {
      await api.deleteDiscipline(id);
      setDisciplines(prev => prev.filter(d => d.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar disciplina');
      throw err;
    }
  };

  // Funções para notas
  const refreshNotes = async () => {
    setNotesLoading(true);
    try {
      const data = await api.getNotes();
      setNotes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar notas');
    } finally {
      setNotesLoading(false);
    }
  };

  const createNote = async (data: { discipline_id?: string; title: string; content: string }) => {
    try {
      const newNote = await api.createNote(data);
      setNotes(prev => [newNote, ...prev]);
      return newNote;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar nota');
      throw err;
    }
  };

  const updateNote = async (id: string, data: any) => {
    try {
      const updatedNote = await api.updateNote(id, data);
      setNotes(prev => prev.map(n => n.id === id ? updatedNote : n));
      return updatedNote;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar nota');
      throw err;
    }
  };

  const deleteNote = async (id: string) => {
    try {
      await api.deleteNote(id);
      setNotes(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar nota');
      throw err;
    }
  };

  // Funções para flashcards
  const refreshFlashcards = async () => {
    setFlashcardsLoading(true);
    try {
      const data = await api.getFlashcards();
      setFlashcards(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar flashcards');
    } finally {
      setFlashcardsLoading(false);
    }
  };

  const createFlashcard = async (data: any) => {
    try {
      const newFlashcard = await api.createFlashcard(data);
      setFlashcards(prev => [...prev, newFlashcard]);
      return newFlashcard;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar flashcard');
      throw err;
    }
  };

  const generateFlashcards = async (data: any) => {
    try {
      const newFlashcards = await api.generateFlashcards(data);
      setFlashcards(prev => [...prev, ...newFlashcards]);
      return newFlashcards;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao gerar flashcards');
      throw err;
    }
  };

  // Funções para exercícios
  const refreshExercises = async () => {
    setExercisesLoading(true);
    try {
      const data = await api.getExercises();
      setExercises(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar exercícios');
    } finally {
      setExercisesLoading(false);
    }
  };

  const createExercise = async (data: any) => {
    try {
      const newExercise = await api.createExercise(data);
      setExercises(prev => [...prev, newExercise]);
      return newExercise;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar exercício');
      throw err;
    }
  };

  const generateExercise = async (data: any) => {
    try {
      const newExercise = await api.generateExercise(data);
      setExercises(prev => [...prev, newExercise]);
      return newExercise;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao gerar exercício');
      throw err;
    }
  };

  // Funções para fontes
  const refreshSources = async () => {
    setSourcesLoading(true);
    try {
      const data = await api.getSources();
      setSources(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar fontes');
    } finally {
      setSourcesLoading(false);
    }
  };

  const uploadSource = async (data: any) => {
    try {
      const newSource = await api.uploadSource(data);
      setSources(prev => [...prev, newSource]);
      return newSource;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer upload da fonte');
      throw err;
    }
  };

  const deleteSource = async (id: string) => {
    try {
      await api.deleteSource(id);
      setSources(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar fonte');
      throw err;
    }
  };

  // Carregar dados iniciais
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          refreshDisciplines(),
          refreshNotes(),
          refreshFlashcards(),
          refreshExercises(),
          refreshSources(),
        ]);
      } catch (err) {
        console.error('Erro ao carregar dados iniciais:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const value: DataContextType = {
    // Disciplinas
    disciplines,
    disciplinesLoading,
    refreshDisciplines,
    createDiscipline,
    updateDiscipline,
    deleteDiscipline,

    // Notas
    notes,
    notesLoading,
    refreshNotes,
    createNote,
    updateNote,
    deleteNote,

    // Flashcards
    flashcards,
    flashcardsLoading,
    refreshFlashcards,
    createFlashcard,
    generateFlashcards,

    // Exercícios
    exercises,
    exercisesLoading,
    refreshExercises,
    createExercise,
    generateExercise,

    // Fontes
    sources,
    sourcesLoading,
    refreshSources,
    uploadSource,
    deleteSource,

    // Estado geral
    isLoading,
    error,
    setError,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData deve ser usado dentro de um DataProvider');
  }
  return context;
}
