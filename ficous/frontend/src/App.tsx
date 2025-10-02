import { useState } from 'react';
import { SettingsPage } from "./components/SettingsPage";
import { ExerciseLandingPage } from "./components/ExerciseLandingPage";
import { ExerciseWizard } from "./components/ExerciseWizard";
import { ExerciseResults } from "./components/ExerciseResults";
import { ExercisesPage } from "./components/ExercisesPage";
import { ExerciseGeneratePage } from "./components/ExerciseGeneratePage";
import { ExerciseDetailPage } from "./components/ExerciseDetailPage";
import { ExerciseQuizPage } from "./components/ExerciseQuizPage";
import { FEATURES } from "./config/features";

type Page = 'landing' | 'wizard' | 'results' | 'exercises' | 'settings' | 'exercise-generate' | 'exercise-detail' | 'exercise-quiz';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [currentExerciseId, setCurrentExerciseId] = useState<string | null>(null);
  const [generatedExercises, setGeneratedExercises] = useState<any[]>([]);

  const handlePageChange = (page: Page) => {
    setCurrentPage(page);
  };

  return (
    <div className="bg-white relative size-full min-h-screen" data-name="exercises-app">
      {currentPage === 'landing' && (
        <ExerciseLandingPage 
          onGenerateNew={() => setCurrentPage('wizard')}
          onViewExisting={() => setCurrentPage('exercises')}
        />
      )}
      
      {currentPage === 'wizard' && (
        <ExerciseWizard 
          onBack={() => setCurrentPage('landing')}
          onComplete={(exercises) => {
            setGeneratedExercises(exercises);
            setCurrentPage('results');
          }}
        />
      )}
      
      {currentPage === 'results' && (
        <ExerciseResults 
          exercises={generatedExercises}
          onBack={() => setCurrentPage('landing')}
          onStartQuiz={(exercises) => {
            console.log('Iniciando quiz com exercícios:', exercises);
            // Implementar navegação para quiz
          }}
        />
      )}
      
      {currentPage === 'exercises' && (
        <ExercisesPage 
          onGenerateNew={() => setCurrentPage('exercise-generate')}
          onViewExercise={(exerciseId) => {
            setCurrentExerciseId(exerciseId);
            setCurrentPage('exercise-detail');
          }}
          onHome={() => setCurrentPage('landing')}
        />
      )}
      
      {currentPage === 'exercise-generate' && (
        <ExerciseGeneratePage 
          onBack={() => setCurrentPage('landing')}
          onExerciseCreated={(exercise) => {
            console.log('Exercício criado:', exercise);
            setCurrentPage('exercises');
          }}
        />
      )}
      
      {currentPage === 'exercise-detail' && currentExerciseId && (
        <ExerciseDetailPage 
          exerciseId={currentExerciseId}
          onBack={() => {
            setCurrentExerciseId(null);
            setCurrentPage('landing');
          }}
          onStartQuiz={(exerciseId) => {
            setCurrentExerciseId(exerciseId);
            setCurrentPage('exercise-quiz');
          }}
        />
      )}
      
      {currentPage === 'exercise-quiz' && currentExerciseId && (
        <ExerciseQuizPage 
          exerciseId={currentExerciseId}
          onBack={() => {
            setCurrentExerciseId(null);
            setCurrentPage('exercise-detail');
          }}
          onFinish={(results) => {
            console.log('Quiz finalizado:', results);
            // Pode navegar para uma página de resultados ou voltar
          }}
        />
      )}
      
      {currentPage === 'settings' && <SettingsPage />}
    </div>
  );
}