import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Clock, CheckCircle, XCircle, Play, Pause, RotateCcw, Target, BarChart3 } from 'lucide-react';
import { api } from '../services/api';
import type { ExerciseDetailOut, ExerciseItem, ExerciseGradeOut } from '../types/exercises';

interface ExerciseQuizPageProps {
  exerciseId: string;
  onBack: () => void;
  onFinish: (results: ExerciseGradeOut) => void;
}

interface QuizAnswer {
  item_id: string;
  kind: string;
  answer_index?: number;
  answer_text?: string;
}

export function ExerciseQuizPage({ exerciseId, onBack, onFinish }: ExerciseQuizPageProps) {
  const [exercise, setExercise] = useState<ExerciseDetailOut | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [results, setResults] = useState<ExerciseGradeOut | null>(null);
  const [showResults, setShowResults] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const totalTime = 30 * 60; // 30 minutos em segundos

  useEffect(() => {
    loadExercise();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [exerciseId]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            handleFinishQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const loadExercise = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getExerciseDetail(exerciseId);
      setExercise(data);
      setTimeLeft(totalTime);
    } catch (err) {
      setError('Erro ao carregar exercício');
      console.error('Erro ao carregar exercício:', err);
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = () => {
    setIsRunning(true);
  };

  const pauseQuiz = () => {
    setIsRunning(false);
  };

  const resetQuiz = () => {
    setIsRunning(false);
    setTimeLeft(totalTime);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setIsFinished(false);
    setShowResults(false);
    setResults(null);
  };

  const handleAnswerChange = (answer: QuizAnswer) => {
    setAnswers(prev => {
      const existingIndex = prev.findIndex(a => a.item_id === answer.item_id);
      if (existingIndex >= 0) {
        const newAnswers = [...prev];
        newAnswers[existingIndex] = answer;
        return newAnswers;
      } else {
        return [...prev, answer];
      }
    });
  };

  const handleNextQuestion = () => {
    if (exercise && currentQuestionIndex < exercise.items.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleFinishQuiz();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleFinishQuiz = async () => {
    if (!exercise) return;

    try {
      setIsRunning(false);
      setIsFinished(true);
      
      const gradeResult = await api.gradeExercise(exerciseId, {
        answers_json: answers
      });
      
      setResults(gradeResult);
      setShowResults(true);
      onFinish(gradeResult);
    } catch (err) {
      console.error('Erro ao finalizar quiz:', err);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    if (!exercise) return 0;
    return ((currentQuestionIndex + 1) / exercise.items.length) * 100;
  };

  const getCurrentAnswer = (itemId: string) => {
    return answers.find(a => a.item_id === itemId);
  };

  const getKindLabel = (kind: string) => {
    const labels = {
      'mcq': 'Múltipla Escolha',
      'open': 'Aberta',
      'vf': 'Verdadeiro/Falso',
      'multi': 'Múltipla Resposta'
    };
    return labels[kind as keyof typeof labels] || kind;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="font-['Alexandria:Regular',_sans-serif] font-normal text-[16px] text-gray-600">
            Carregando quiz...
          </p>
        </div>
      </div>
    );
  }

  if (error || !exercise) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="font-['Alexandria:Regular',_sans-serif] font-normal text-[16px] text-red-600 mb-4">
            {error || 'Exercício não encontrado'}
          </p>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = exercise.items[currentQuestionIndex];
  const currentAnswer = getCurrentAnswer(currentQuestion.id);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="h-[110px] bg-blue-600 flex items-center px-8">
        <div>
          <h1 className="text-white text-2xl font-bold">Quiz Interativo</h1>
          <p className="text-blue-100">Teste seus conhecimentos</p>
        </div>
      </div>
      
      <div className="container mx-auto px-8 py-8">
        {/* Quiz Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft size={20} />
              Voltar
            </button>
            <div>
              <h2 className="font-['Alexandria:Medium',_sans-serif] font-medium text-[28px] text-[#202020]">
                {exercise.title}
              </h2>
              <p className="font-['Alexandria:Regular',_sans-serif] font-normal text-[16px] text-gray-600">
                Quiz Interativo
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {!isFinished && (
              <div className="flex items-center gap-2">
                <Clock className="text-gray-600" size={20} />
                <span className={`text-lg font-mono ${timeLeft < 300 ? 'text-red-600' : 'text-gray-800'}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            )}
            
            {!isFinished && (
              <button
                onClick={isRunning ? pauseQuiz : startQuiz}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-['Alexandria:Medium',_sans-serif] font-medium text-[14px]"
              >
                {isRunning ? <Pause size={16} /> : <Play size={16} />}
                {isRunning ? 'Pausar' : 'Iniciar'}
              </button>
            )}
            
            <button
              onClick={resetQuiz}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-['Alexandria:Medium',_sans-serif] font-medium text-[14px]"
            >
              <RotateCcw size={16} />
              Reiniciar
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Questão {currentQuestionIndex + 1} de {exercise.items.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(getProgressPercentage())}% concluído
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
        </div>

        {!showResults ? (
          /* Quiz Interface */
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-sm font-medium text-gray-500">#{currentQuestionIndex + 1}</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  {getKindLabel(currentQuestion.kind)}
                </span>
              </div>
              
              <h3 className="font-['Alexandria:Medium',_sans-serif] font-medium text-[20px] text-[#202020] mb-6">
                {currentQuestion.question}
              </h3>
            </div>

            {/* Question Content */}
            <div className="space-y-4">
              {currentQuestion.kind === 'mcq' && currentQuestion.options_json && (
                <div className="space-y-3">
                  {currentQuestion.options_json.map((option, index) => (
                    <label
                      key={index}
                      className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                        currentAnswer?.answer_index === index
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${currentQuestion.id}`}
                        checked={currentAnswer?.answer_index === index}
                        onChange={() => handleAnswerChange({
                          item_id: currentQuestion.id,
                          kind: currentQuestion.kind,
                          answer_index: index
                        })}
                        className="mr-3"
                      />
                      <span className="font-medium text-gray-700 mr-3">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      <span className="text-gray-800">{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {currentQuestion.kind === 'vf' && (
                <div className="space-y-3">
                  <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                    currentAnswer?.answer_index === 0
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}>
                    <input
                      type="radio"
                      name={`question-${currentQuestion.id}`}
                      checked={currentAnswer?.answer_index === 0}
                      onChange={() => handleAnswerChange({
                        item_id: currentQuestion.id,
                        kind: currentQuestion.kind,
                        answer_index: 0
                      })}
                      className="mr-3"
                    />
                    <span className="text-green-800 font-medium">Verdadeiro</span>
                  </label>
                  
                  <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                    currentAnswer?.answer_index === 1
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}>
                    <input
                      type="radio"
                      name={`question-${currentQuestion.id}`}
                      checked={currentAnswer?.answer_index === 1}
                      onChange={() => handleAnswerChange({
                        item_id: currentQuestion.id,
                        kind: currentQuestion.kind,
                        answer_index: 1
                      })}
                      className="mr-3"
                    />
                    <span className="text-red-800 font-medium">Falso</span>
                  </label>
                </div>
              )}

              {currentQuestion.kind === 'open' && (
                <div>
                  <textarea
                    value={currentAnswer?.answer_text || ''}
                    onChange={(e) => handleAnswerChange({
                      item_id: currentQuestion.id,
                      kind: currentQuestion.kind,
                      answer_text: e.target.value
                    })}
                    placeholder="Digite sua resposta aqui..."
                    rows={6}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8">
              <button
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Anterior
              </button>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  {answers.length} de {exercise.items.length} respondidas
                </span>
              </div>
              
              <button
                onClick={currentQuestionIndex === exercise.items.length - 1 ? handleFinishQuiz : handleNextQuestion}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {currentQuestionIndex === exercise.items.length - 1 ? 'Finalizar' : 'Próxima'}
              </button>
            </div>
          </div>
        ) : (
          /* Results */
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                {results && results.score.percent >= 0.7 ? (
                  <CheckCircle className="text-green-600" size={48} />
                ) : (
                  <XCircle className="text-red-600" size={48} />
                )}
              </div>
              
              <h3 className="font-['Alexandria:Medium',_sans-serif] font-medium text-[24px] text-[#202020] mb-2">
                Quiz Finalizado!
              </h3>
              
              <div className="flex items-center justify-center gap-6 mb-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">{results?.score.raw}</p>
                  <p className="text-sm text-gray-600">de {results?.score.max} pontos</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">{Math.round((results?.score.percent || 0) * 100)}%</p>
                  <p className="text-sm text-gray-600">de aproveitamento</p>
                </div>
              </div>
            </div>

            {/* Detailed Results */}
            <div className="space-y-4">
              <h4 className="font-['Alexandria:Medium',_sans-serif] font-medium text-[18px] text-[#202020] mb-4">
                Resultados por Questão
              </h4>
              
              {results?.items_results.map((itemResult, index) => {
                const question = exercise.items.find(item => item.id === itemResult.item_id);
                if (!question) return null;
                
                return (
                  <div key={itemResult.item_id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 mb-1">
                          Questão {index + 1}: {question.question.substring(0, 100)}...
                        </p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          question.kind === 'mcq' 
                            ? (itemResult.correct ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {question.kind === 'mcq' 
                            ? (itemResult.correct ? 'Correta' : 'Incorreta')
                            : `${itemResult.score}/10 pontos`
                          }
                        </span>
                      </div>
                    </div>
                    
                    {itemResult.feedback && (
                      <p className="text-sm text-gray-600 mt-2">{itemResult.feedback}</p>
                    )}
                    
                    {itemResult.explanation && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
                        <p className="text-sm text-blue-800">
                          <strong>Explicação:</strong> {itemResult.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={onBack}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Voltar aos Exercícios
              </button>
              <button
                onClick={resetQuiz}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Tentar Novamente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
