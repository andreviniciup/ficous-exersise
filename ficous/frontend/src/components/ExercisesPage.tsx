import { useState } from 'react';
import { Plus, Play, CheckCircle, XCircle, Clock, Target, BarChart3 } from 'lucide-react';

interface Exercise {
  id: number;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number; // em minutos
  questions: Question[];
  subject: string;
  completed: boolean;
  score?: number;
  completedAt?: Date;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([
    {
      id: 1,
      title: "Introdução à Programação",
      description: "Questões básicas sobre conceitos fundamentais de programação",
      difficulty: 'easy',
      estimatedTime: 15,
      subject: "Projeto de Programação",
      completed: true,
      score: 8.5,
      completedAt: new Date('2024-01-15'),
      questions: [
        {
          id: 1,
          question: "O que é uma variável em programação?",
          options: [
            "Um valor que nunca muda",
            "Um espaço na memória para armazenar dados",
            "Um tipo de função",
            "Um comando de loop"
          ],
          correctAnswer: 1,
          explanation: "Uma variável é um espaço reservado na memória para armazenar dados que podem ser modificados durante a execução do programa."
        },
        {
          id: 2,
          question: "Qual é a função do operador == em muitas linguagens?",
          options: [
            "Atribuição",
            "Comparação de igualdade",
            "Soma",
            "Concatenação"
          ],
          correctAnswer: 1,
          explanation: "O operador == é usado para comparar se dois valores são iguais."
        }
      ]
    },
    {
      id: 2,
      title: "Estruturas de Dados",
      description: "Exercícios sobre arrays, listas e estruturas básicas",
      difficulty: 'medium',
      estimatedTime: 25,
      subject: "Projeto de Programação",
      completed: false,
      questions: [
        {
          id: 3,
          question: "Qual é a complexidade de tempo para acessar um elemento em um array?",
          options: [
            "O(n)",
            "O(log n)",
            "O(1)",
            "O(n²)"
          ],
          correctAnswer: 2,
          explanation: "Acessar um elemento em um array por índice tem complexidade O(1) - tempo constante."
        }
      ]
    },
    {
      id: 3,
      title: "Protocolos de Rede",
      description: "Questões sobre HTTP, TCP/IP e outros protocolos",
      difficulty: 'hard',
      estimatedTime: 30,
      subject: "Redes de Computadores",
      completed: false,
      questions: [
        {
          id: 4,
          question: "Qual camada do modelo OSI o protocolo HTTP opera?",
          options: [
            "Camada Física",
            "Camada de Transporte",
            "Camada de Aplicação",
            "Camada de Rede"
          ],
          correctAnswer: 2,
          explanation: "O HTTP opera na Camada de Aplicação (camada 7) do modelo OSI."
        }
      ]
    }
  ]);

  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isCreatingExercise, setIsCreatingExercise] = useState(false);

  const difficultyColors = {
    easy: '#10b981',
    medium: '#f59e0b',
    hard: '#ef4444'
  };

  const difficultyLabels = {
    easy: 'Fácil',
    medium: 'Médio',
    hard: 'Difícil'
  };

  const handleStartExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setShowResults(false);
  };

  const handleAnswerQuestion = (answerIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setUserAnswers(newAnswers);

    if (selectedExercise && currentQuestionIndex < selectedExercise.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Finalizar exercício
      finishExercise(newAnswers);
    }
  };

  const finishExercise = (answers: number[]) => {
    if (!selectedExercise) return;

    const correctAnswers = answers.filter((answer, index) => 
      answer === selectedExercise.questions[index].correctAnswer
    ).length;

    const score = (correctAnswers / selectedExercise.questions.length) * 10;

    const updatedExercises = exercises.map(ex => 
      ex.id === selectedExercise.id 
        ? { ...ex, completed: true, score, completedAt: new Date() }
        : ex
    );

    setExercises(updatedExercises);
    setShowResults(true);
  };

  const getStats = () => {
    const completed = exercises.filter(ex => ex.completed).length;
    const total = exercises.length;
    const averageScore = exercises
      .filter(ex => ex.score !== undefined)
      .reduce((sum, ex) => sum + (ex.score || 0), 0) / (completed || 1);

    return { completed, total, averageScore };
  };

  const stats = getStats();

  const ExerciseCard = ({ exercise }: { exercise: Exercise }) => (
    <div className="bg-white rounded-[12px] border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-['Alexandria:Medium',_sans-serif] font-medium text-[18px] text-[#202020]">
              {exercise.title}
            </h3>
            {exercise.completed && (
              <CheckCircle size={20} className="text-green-500" />
            )}
          </div>
          
          <p className="font-['Alexandria:Regular',_sans-serif] font-normal text-[14px] text-gray-600 mb-3">
            {exercise.description}
          </p>
          
          <div className="flex items-center gap-4 text-[12px] text-gray-500 mb-4">
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{exercise.estimatedTime} min</span>
            </div>
            <div className="flex items-center gap-1">
              <Target size={14} />
              <span>{exercise.questions.length} questões</span>
            </div>
            <div 
              className="px-2 py-1 rounded text-white text-[11px] font-medium"
              style={{ backgroundColor: difficultyColors[exercise.difficulty] }}
            >
              {difficultyLabels[exercise.difficulty]}
            </div>
          </div>
          
          <p className="font-['Alexandria:Regular',_sans-serif] font-normal text-[12px] text-gray-500 mb-4">
            {exercise.subject}
          </p>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        {exercise.completed && exercise.score !== undefined ? (
          <span className="font-['Alexandria:Medium',_sans-serif] font-medium text-[14px] text-green-600">
            Nota: {exercise.score.toFixed(1)}/10
          </span>
        ) : (
          <span />
        )}
        
        <button
          onClick={() => handleStartExercise(exercise)}
          className="px-4 py-2 bg-[#6366f1] text-white rounded-lg font-['Alexandria:Medium',_sans-serif] font-medium text-[14px] hover:bg-[#5855eb] transition-colors flex items-center gap-2"
        >
          <Play size={16} />
          {exercise.completed ? 'Refazer' : 'Iniciar'}
        </button>
      </div>
    </div>
  );

  if (selectedExercise && !showResults) {
    const currentQuestion = selectedExercise.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / selectedExercise.questions.length) * 100;

    return (
      <div className="absolute h-[982px] left-[241px] overflow-clip top-0 w-[1271px]">
        {/* Header */}
        <div className="absolute h-[110px] left-[60px] rounded-[11px] top-[48px] w-[1151px] bg-[#6366f1]" />
        
        <div className="absolute left-[61px] top-[200px] w-[1150px]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-['Alexandria:Medium',_sans-serif] font-medium text-[28px] text-[#202020]">
                {selectedExercise.title}
              </h2>
              <p className="font-['Alexandria:Regular',_sans-serif] font-normal text-[16px] text-gray-600">
                Questão {currentQuestionIndex + 1} de {selectedExercise.questions.length}
              </p>
            </div>
            
            <button
              onClick={() => setSelectedExercise(null)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-['Alexandria:Medium',_sans-serif] font-medium text-[14px] hover:bg-gray-300 transition-colors"
            >
              Sair
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
            <div 
              className="bg-[#6366f1] h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="absolute left-[200px] top-[350px] w-[850px]">
          <div className="bg-white rounded-[16px] border border-gray-200 shadow-lg p-8">
            <h3 className="font-['Alexandria:Medium',_sans-serif] font-medium text-[24px] text-[#202020] mb-8">
              {currentQuestion.question}
            </h3>
            
            <div className="space-y-4">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerQuestion(index)}
                  className="w-full p-4 text-left bg-gray-50 hover:bg-[#6366f1] hover:text-white border border-gray-200 rounded-lg font-['Alexandria:Regular',_sans-serif] font-normal text-[16px] transition-colors"
                >
                  <span className="font-medium mr-3">{String.fromCharCode(65 + index)})</span>
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showResults && selectedExercise) {
    const correctAnswers = userAnswers.filter((answer, index) => 
      answer === selectedExercise.questions[index].correctAnswer
    ).length;
    const score = (correctAnswers / selectedExercise.questions.length) * 10;

    return (
      <div className="absolute h-[982px] left-[241px] overflow-y-auto top-0 w-[1271px]">
        {/* Header */}
        <div className="absolute h-[110px] left-[60px] rounded-[11px] top-[48px] w-[1151px] bg-[#6366f1]" />
        
        <div className="absolute left-[61px] top-[200px] w-[1150px] text-center">
          <h2 className="font-['Alexandria:Medium',_sans-serif] font-medium text-[32px] text-[#202020] mb-4">
            Exercício Concluído!
          </h2>
          
          <div className="bg-white rounded-[16px] border border-gray-200 shadow-lg p-8 mb-8 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-[48px] font-bold text-[#6366f1] mb-2">
                {score.toFixed(1)}
              </div>
              <p className="font-['Alexandria:Regular',_sans-serif] font-normal text-[16px] text-gray-600 mb-4">
                {correctAnswers} de {selectedExercise.questions.length} questões corretas
              </p>
              
              <div className="flex justify-center mb-6">
                {score >= 7 ? (
                  <CheckCircle size={48} className="text-green-500" />
                ) : (
                  <XCircle size={48} className="text-red-500" />
                )}
              </div>
              
              <p className="font-['Alexandria:Medium',_sans-serif] font-medium text-[18px] text-[#202020]">
                {score >= 7 ? 'Parabéns!' : 'Continue estudando!'}
              </p>
            </div>
          </div>
          
          <div className="flex justify-center gap-4">
            <button
              onClick={() => {
                setSelectedExercise(null);
                setShowResults(false);
              }}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-['Alexandria:Medium',_sans-serif] font-medium text-[16px] hover:bg-gray-300 transition-colors"
            >
              Voltar
            </button>
            <button
              onClick={() => handleStartExercise(selectedExercise)}
              className="px-6 py-3 bg-[#6366f1] text-white rounded-lg font-['Alexandria:Medium',_sans-serif] font-medium text-[16px] hover:bg-[#5855eb] transition-colors"
            >
              Refazer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute h-[982px] left-[241px] overflow-clip top-0 w-[1271px]">
      {/* Header Rectangle */}
      <div className="absolute h-[110px] left-[60px] rounded-[11px] top-[48px] w-[1151px] bg-[#6366f1]" />
      
      <p className="absolute font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] left-[61px] text-[36px] text-black text-nowrap top-[193px] whitespace-pre">
        Exercícios
      </p>
      <p className="absolute font-['Alexandria:Regular',_sans-serif] font-normal leading-[normal] left-[61px] text-[20px] text-black text-nowrap whitespace-pre top-[246px]">
        Pratique com questões e exercícios
      </p>

      {/* Stats Cards */}
      <div className="absolute left-[61px] top-[290px] flex gap-6 mb-8">
        <div className="bg-white rounded-[12px] border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <BarChart3 size={24} className="text-[#6366f1]" />
            <div>
              <p className="font-['Alexandria:Medium',_sans-serif] font-medium text-[20px] text-[#202020]">
                {stats.completed}/{stats.total}
              </p>
              <p className="font-['Alexandria:Regular',_sans-serif] font-normal text-[14px] text-gray-600">
                Concluídos
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-[12px] border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <Target size={24} className="text-green-500" />
            <div>
              <p className="font-['Alexandria:Medium',_sans-serif] font-medium text-[20px] text-[#202020]">
                {stats.averageScore.toFixed(1)}
              </p>
              <p className="font-['Alexandria:Regular',_sans-serif] font-normal text-[14px] text-gray-600">
                Média Geral
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Create Exercise Button */}
      <button
        onClick={() => setIsCreatingExercise(true)}
        className="absolute right-[61px] top-[290px] px-4 py-2 bg-[#6366f1] text-white rounded-lg font-['Alexandria:Medium',_sans-serif] font-medium text-[14px] hover:bg-[#5855eb] transition-colors flex items-center gap-2"
      >
        <Plus size={16} />
        Novo Exercício
      </button>

      {/* Exercises Grid */}
      <div className="absolute left-[61px] top-[380px] w-[1150px] grid grid-cols-2 gap-6">
        {exercises.map(exercise => (
          <ExerciseCard key={exercise.id} exercise={exercise} />
        ))}
      </div>
    </div>
  );
}