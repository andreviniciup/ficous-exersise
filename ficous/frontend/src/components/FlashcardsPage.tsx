import { useState } from 'react';
import svgPaths from "../imports/svg-mysutuazev";

interface Flashcard {
  id: number;
  front: string;
  back: string;
  difficulty: 'easy' | 'medium' | 'hard';
  lastReviewed?: Date;
  nextReview?: Date;
  correctCount: number;
  totalCount: number;
}

interface FlashcardSet {
  id: number;
  name: string;
  description: string;
  cards: Flashcard[];
  subject: string;
  color: string;
  newCards: number;
  learningCards: number;
  reviewCards: number;
  lastStudied?: Date;
}

export function FlashcardsPage() {
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([
    {
      id: 1,
      name: "Tratamento de exceções",
      description: "Conceitos sobre tratamento de exceções em Java",
      subject: "Projeto de Programação",
      color: "#f0d471",
      newCards: 10,
      learningCards: 10,
      reviewCards: 10,
      lastStudied: new Date('2024-05-25'),
      cards: []
    },
    {
      id: 2,
      name: "Algoritmos de Ordenação",
      description: "Bubble sort, merge sort, quick sort e outros",
      subject: "Projeto de Programação", 
      color: "#f0d471",
      newCards: 5,
      learningCards: 8,
      reviewCards: 12,
      cards: []
    },
    {
      id: 3,
      name: "Protocolos de Rede",
      description: "TCP/IP, HTTP, HTTPS e protocolos relacionados",
      subject: "Redes de Computadores",
      color: "#9cbe7a",
      newCards: 15,
      learningCards: 3,
      reviewCards: 8,
      cards: []
    }
  ]);

  const [selectedSet, setSelectedSet] = useState<FlashcardSet | null>(null);
  const [studyMode, setStudyMode] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCreatingSet, setIsCreatingSet] = useState(false);
  const [newSetName, setNewSetName] = useState('');

  const handleStartStudy = (set: FlashcardSet) => {
    setSelectedSet(set);
    setStudyMode(true);
    setCurrentCardIndex(0);
    setShowAnswer(false);
  };

  const handleCreateNew = () => {
    setIsCreatingSet(true);
  };

  const DeckCardInformationNumber = ({ 
    novos, 
    aprender, 
    revisar 
  }: { 
    novos: number; 
    aprender: number; 
    revisar: number; 
  }) => (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="deck-card-information-number">
      <div className="content-stretch flex flex-col font-['Alexandria:Regular',_sans-serif] font-normal items-center justify-center leading-[normal] relative shrink-0 text-[10px]" data-name="novos">
        <p className="capitalize relative shrink-0 text-[#585858] w-full">novos</p>
        <p className="relative shrink-0 text-[#91acc5] text-center w-full">{novos}</p>
      </div>
      <div className="content-stretch flex flex-col font-['Alexandria:Regular',_sans-serif] font-normal items-center leading-[normal] relative shrink-0 text-[10px] w-[47px]" data-name="aprender">
        <p className="capitalize relative shrink-0 text-[#585858] text-nowrap whitespace-pre">aprender</p>
        <p className="min-w-full relative shrink-0 text-[#971919] text-center" style={{ width: "min-content" }}>
          {aprender}
        </p>
      </div>
      <div className="content-stretch flex flex-col font-['Alexandria:Regular',_sans-serif] font-normal items-center leading-[normal] relative shrink-0 text-[10px] w-[37px]" data-name="revisar">
        <p className="capitalize relative shrink-0 text-[#585858] w-full">Revisar</p>
        <p className="relative shrink-0 text-[#496f0c] text-center w-full">{revisar}</p>
      </div>
    </div>
  );

  const FlashcardDeck = ({ 
    set, 
    position 
  }: { 
    set: FlashcardSet; 
    position: { top: number; left: number; }; 
  }) => (
    <div 
      className="absolute cursor-pointer hover:scale-105 transition-transform"
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
      onClick={() => handleStartStudy(set)}
    >
      {/* Date Badge */}
      <div className="absolute flex h-[56.298px] items-center justify-center left-[20.61px] top-[-15px] w-[57.995px] z-10">
        <div className="flex-none rotate-[273.101deg]">
          <p className="font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] relative text-[#f0d471] text-[48px] text-nowrap whitespace-pre">
            {set.lastStudied ? set.lastStudied.getDate() : '25'}
          </p>
        </div>
      </div>
      <div className="absolute flex h-[38.908px] items-center justify-center left-[71.65px] top-[-10px] w-[13.246px] z-10">
        <div className="flex-none rotate-[273.101deg]">
          <p className="font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] relative text-[#f0d471] text-[10px] text-nowrap whitespace-pre">
            {set.lastStudied ? 
              set.lastStudied.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' }) : 
              'maio, 25'
            }
          </p>
        </div>
      </div>

      {/* Main Card */}
      <div className="flex h-[255.877px] items-center justify-center w-[312.543px]">
        <div className="flex-none rotate-[273.101deg]">
          <div className="bg-[#f6f6f6] h-[300px] relative rounded-[25px] w-[240px] border border-gray-200 shadow-sm">
          </div>
        </div>
      </div>

      {/* Card Title */}
      <div className="absolute flex h-[222.401px] items-center justify-center left-[213px] top-[21px] w-[80.543px]">
        <div className="flex-none rotate-[273.101deg]">
          <p className="font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] relative text-[#f0d471] text-[30px] w-[219px] text-center">
            {set.name}
          </p>
        </div>
      </div>

      {/* Subject */}
      <div className="absolute flex h-[130.063px] items-center justify-center left-[203px] top-[94px] w-[13.594px]">
        <div className="flex-none rotate-[273.101deg]">
          <p className="font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] relative text-[#c3ac58] text-[12px] text-nowrap whitespace-pre">
            {set.subject}
          </p>
        </div>
      </div>

      {/* Deck Information */}
      <div className="absolute flex h-[136.344px] items-center justify-center left-[15px] top-[86px] w-[22.391px]">
        <div className="flex-none rotate-[273.101deg]">
          <DeckCardInformationNumber 
            novos={set.newCards}
            aprender={set.learningCards}
            revisar={set.reviewCards}
          />
        </div>
      </div>
    </div>
  );

  // Study Mode - Question
  if (studyMode && selectedSet && !showAnswer) {
    return (
      <div className="absolute h-[982px] left-[241px] overflow-clip top-0 w-[1271px] bg-[#353535]">
        <div className="absolute flex h-[700px] items-center justify-center left-[262px] top-[141px] w-[500px]">
          <div className="flex-none rotate-[270deg]">
            <div className="bg-[#f4f4f4] box-border content-stretch flex flex-col gap-[121px] h-[500px] items-center px-[46px] py-[27px] relative rounded-[40px] w-[700px] border border-[#585858]">
              {/* Header */}
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-[608px]" data-name="header-info">
                <p className="font-['Arial_Rounded_MT_Bold:Regular',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[#5a7691] text-[14px] text-nowrap whitespace-pre">
                  {currentCardIndex + 1}
                </p>
                <div className="content-stretch flex flex-col font-['Arial_Rounded_MT_Bold:Regular',_sans-serif] items-center leading-[normal] not-italic relative shrink-0 w-[103px]" data-name="content-info">
                  <p className="relative shrink-0 text-[#5a7691] text-[14px] w-full">{selectedSet.name}</p>
                  <p className="capitalize relative shrink-0 text-[#91acc5] text-[10px] text-center w-full">{selectedSet.subject.toLowerCase()}</p>
                </div>
              </div>

              {/* Question */}
              <div className="box-border content-stretch flex gap-[10px] items-center justify-center p-[10px] relative shrink-0" data-name="content-principal">
                <p className="font-['Arial_Rounded_MT_Bold:Regular',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[20px] text-black text-center w-[462px]">
                  O que é tratamento de exceções em Java e qual sua importância no desenvolvimento de software robusto?
                </p>
              </div>

              {/* Footer */}
              <div className="content-stretch flex gap-[144px] items-center relative shrink-0" data-name="footer">
                <div 
                  className="bg-[#3b82d6] box-border content-stretch flex gap-[10px] h-[40px] items-center justify-center px-[14px] py-[12px] relative rounded-[10px] shrink-0 w-[150px] cursor-pointer hover:bg-[#2563eb] transition-colors border border-[#16467f]" 
                  data-name="button-mostra-resposta"
                  onClick={() => setShowAnswer(true)}
                >
                  <p className="capitalize font-['Arial_Rounded_MT_Bold:Regular',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-center text-nowrap text-white whitespace-pre">
                    mostrar resposta
                  </p>
                </div>
                <div className="bg-[#c2c2c2] box-border content-stretch flex gap-[10px] h-[30px] items-center justify-center px-[11px] py-[9px] relative rounded-[10px] shrink-0 w-[70px] border border-[#222222]" data-name="frame-faltam-deck-content">
                  <p className="capitalize font-['Arial_Rounded_MT_Bold:Regular',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[#222222] text-[10px] text-nowrap whitespace-pre">
                    faltam {(selectedSet.newCards + selectedSet.learningCards + selectedSet.reviewCards) - currentCardIndex - 1}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Exit button */}
        <button
          onClick={() => {
            setStudyMode(false);
            setSelectedSet(null);
            setShowAnswer(false);
          }}
          className="absolute top-[50px] right-[50px] px-4 py-2 bg-white text-black rounded-lg font-['Alexandria:Medium',_sans-serif] font-medium text-[14px] hover:bg-gray-200 transition-colors z-10"
        >
          Voltar
        </button>
      </div>
    );
  }

  // Study Mode - Answer
  if (studyMode && selectedSet && showAnswer) {
    const handleDifficultyResponse = (difficulty: 'again' | 'hard' | 'good' | 'easy') => {
      // Lógica para processar a resposta
      const nextIndex = currentCardIndex + 1;
      const totalCards = selectedSet.newCards + selectedSet.learningCards + selectedSet.reviewCards;
      
      if (nextIndex < totalCards) {
        setCurrentCardIndex(nextIndex);
        setShowAnswer(false);
      } else {
        // Fim do estudo
        setStudyMode(false);
        setSelectedSet(null);
        setShowAnswer(false);
      }
    };

    return (
      <div className="absolute h-[982px] left-[241px] overflow-clip top-0 w-[1271px] bg-[#353535]">
        <div className="absolute flex h-[700px] items-center justify-center left-[262px] top-[141px] w-[500px]">
          <div className="flex-none rotate-[270deg]">
            <div className="bg-[#f4f4f4] box-border content-stretch flex flex-col gap-[25px] h-[500px] items-center px-[39px] py-[36px] relative rounded-[40px] w-[700px] border border-[#585858]">
              {/* Header */}
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-[608px]" data-name="header-info">
                <p className="font-['Arial_Rounded_MT_Bold:Regular',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[#5a7691] text-[14px] text-nowrap whitespace-pre">
                  {currentCardIndex + 1}
                </p>
                <div className="content-stretch flex flex-col font-['Arial_Rounded_MT_Bold:Regular',_sans-serif] items-center leading-[normal] not-italic relative shrink-0 w-[103px]" data-name="content-info">
                  <p className="relative shrink-0 text-[#5a7691] text-[14px] w-full">{selectedSet.name}</p>
                  <p className="capitalize relative shrink-0 text-[#91acc5] text-[10px] text-center w-full">{selectedSet.subject.toLowerCase()}</p>
                </div>
              </div>

              {/* Question (smaller) */}
              <div className="box-border content-stretch flex gap-[10px] items-center justify-center p-[10px] relative shrink-0" data-name="text-pergunta">
                <p className="font-['Arial_Rounded_MT_Bold:Regular',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[#585858] text-[14px] text-center w-[462px]">
                  O que é tratamento de exceções em Java e qual sua importância no desenvolvimento de software robusto?
                </p>
              </div>

              {/* Divider */}
              <div className="h-[20px] relative shrink-0 w-[380px]" data-name="divisor-line">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 380 20">
                  <line stroke="#D9D9D9" x1="10" x2="370" y1="9.5" y2="9.5" />
                </svg>
              </div>

              {/* Answer */}
              <div className="box-border content-stretch flex gap-[10px] items-center justify-center p-[10px] relative shrink-0" data-name="text-resposta">
                <p className="font-['Arial_Rounded_MT_Bold:Regular',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[15px] text-black text-center w-[462px]">
                  O tratamento de exceções em Java é um mecanismo que permite capturar e lidar com erros durante a execução do programa usando try-catch-finally. É fundamental para criar aplicações robustas que podem se recuperar de erros inesperados, fornecendo feedback adequado ao usuário e evitando que o programa termine abruptamente.
                </p>
              </div>

              {/* Difficulty Buttons */}
              <div className="content-stretch flex gap-[26px] items-center relative shrink-0" data-name="button-nivel-de-dificuldade">
                <div 
                  className="bg-[#c93a4b] box-border content-stretch flex gap-[10px] h-[30px] items-center justify-center px-[14px] py-[9px] relative rounded-[10px] shrink-0 w-[70px] cursor-pointer hover:bg-[#b91c32] transition-colors border-2 border-[#971919]" 
                  onClick={() => handleDifficultyResponse('again')}
                >
                  <p className="capitalize font-['Arial_Rounded_MT_Bold:Regular',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[10px] text-nowrap text-white whitespace-pre">de novo</p>
                </div>
                <div 
                  className="bg-[#73a7ae] box-border content-stretch flex gap-[10px] h-[30px] items-center justify-center px-[21px] py-[9px] relative rounded-[10px] shrink-0 w-[70px] cursor-pointer hover:bg-[#5d8990] transition-colors border-2 border-[#45858e]" 
                  onClick={() => handleDifficultyResponse('hard')}
                >
                  <p className="capitalize font-['Arial_Rounded_MT_Bold:Regular',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[10px] text-nowrap text-white whitespace-pre">Difícil</p>
                </div>
                <div 
                  className="bg-[#9cbe7a] box-border content-stretch flex gap-[10px] h-[30px] items-center justify-center px-[23px] py-[9px] relative rounded-[10px] shrink-0 w-[70px] cursor-pointer hover:bg-[#8aab68] transition-colors border-2 border-[#637746]" 
                  onClick={() => handleDifficultyResponse('good')}
                >
                  <p className="capitalize font-['Arial_Rounded_MT_Bold:Regular',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[10px] text-nowrap text-white whitespace-pre">Bom</p>
                </div>
                <div 
                  className="bg-[#f0d471] box-border content-stretch flex gap-[10px] h-[30px] items-center justify-center px-[23px] py-[9px] relative rounded-[10px] shrink-0 w-[70px] cursor-pointer hover:bg-[#edcd5f] transition-colors border-2 border-[#d7bb58]" 
                  onClick={() => handleDifficultyResponse('easy')}
                >
                  <p className="capitalize font-['Arial_Rounded_MT_Bold:Regular',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[10px] text-nowrap text-white whitespace-pre">Fácil</p>
                </div>
              </div>

              {/* Edit Button */}
              <div className="absolute bg-[#c2c2c2] box-border content-stretch flex gap-[10px] h-[30px] items-center justify-center left-[46px] px-[20px] py-[9px] rounded-[10px] top-[429px] w-[70px] cursor-pointer hover:bg-[#b0b0b0] transition-colors border border-[#222222]" data-name="button-editar">
                <p className="capitalize font-['Arial_Rounded_MT_Bold:Regular',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[#222222] text-[10px] text-nowrap whitespace-pre">editar</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Exit button */}
        <button
          onClick={() => {
            setStudyMode(false);
            setSelectedSet(null);
            setShowAnswer(false);
          }}
          className="absolute top-[50px] right-[50px] px-4 py-2 bg-white text-black rounded-lg font-['Alexandria:Medium',_sans-serif] font-medium text-[14px] hover:bg-gray-200 transition-colors z-10"
        >
          Voltar
        </button>
      </div>
    );
  }

  // Main View
  return (
    <div className="absolute h-[982px] left-[241px] overflow-clip top-0 w-[1271px] bg-[#f9f9f9]">
      {/* Title */}
      <div className="absolute flex h-[297.906px] items-center justify-center left-[116px] top-[50px] w-[46.391px]">
        <div className="flex-none rotate-[270deg]">
          <p className="capitalize font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] relative text-[40px] text-black text-nowrap whitespace-pre">
            Seus flashcards
          </p>
        </div>
      </div>

      {/* Create New Button */}
      <div className="absolute flex h-[160px] items-center justify-center left-[116px] top-[67px] w-[49px]">
        <div className="flex-none rotate-[270deg]">
          <div 
            className="bg-neutral-50 h-[49px] relative rounded-[999px] w-[160px] border border-[#ededed] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.1)] cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={handleCreateNew}
          />
        </div>
      </div>
      <div className="absolute content-stretch flex flex-col gap-[5px] items-center left-[131px] top-[98px] w-[20px]">
        <div className="flex items-center justify-center relative shrink-0 w-full" style={{ "--transform-inner-width": "20", "--transform-inner-height": "20", height: "calc(1px * ((var(--transform-inner-width) * 1) + (var(--transform-inner-height) * 0)))" } as React.CSSProperties}>
          <div className="flex-none rotate-[270deg] w-full">
            <p className="capitalize font-['Alexandria:Regular',_sans-serif] font-normal h-[20px] leading-[normal] relative text-[#585858] text-[16px] w-full">criar novo</p>
          </div>
        </div>
        <div className="flex h-[11px] items-center justify-center relative shrink-0 w-[11px]">
          <div className="flex-none rotate-[270deg]">
            <div className="relative size-[11px]" data-name="Vector">
              <div className="absolute inset-[-9.091%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 13">
                  <path d="M6.5 1V12M1 6.5H12" stroke="#585858" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Flashcard Decks */}
      {flashcardSets.map((set, index) => (
        <FlashcardDeck 
          key={set.id} 
          set={set} 
          position={{
            top: 139 + (index * 326),
            left: 217
          }}
        />
      ))}

      {/* Create Modal */}
      {isCreatingSet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-[16px] p-8 w-[500px]">
            <h3 className="font-['Alexandria:Medium',_sans-serif] font-medium text-[24px] text-[#202020] mb-6">
              Novo Conjunto de Flashcards
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block font-['Alexandria:Medium',_sans-serif] font-medium text-[14px] text-[#202020] mb-2">
                  Nome do Conjunto
                </label>
                <input
                  type="text"
                  value={newSetName}
                  onChange={(e) => setNewSetName(e.target.value)}
                  placeholder="Ex: Conceitos de Programação"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg font-['Alexandria:Regular',_sans-serif] font-normal text-[16px] focus:border-[#6366f1] focus:outline-none"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setIsCreatingSet(false);
                  setNewSetName('');
                }}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-['Alexandria:Medium',_sans-serif] font-medium text-[14px] hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (newSetName.trim()) {
                    const newSet: FlashcardSet = {
                      id: Date.now(),
                      name: newSetName.trim(),
                      description: '',
                      subject: 'Geral',
                      color: '#f0d471',
                      newCards: 0,
                      learningCards: 0,
                      reviewCards: 0,
                      cards: []
                    };
                    setFlashcardSets(prev => [...prev, newSet]);
                  }
                  setIsCreatingSet(false);
                  setNewSetName('');
                }}
                disabled={!newSetName.trim()}
                className="px-6 py-2 bg-[#6366f1] text-white rounded-lg font-['Alexandria:Medium',_sans-serif] font-medium text-[14px] hover:bg-[#5855eb] transition-colors disabled:opacity-50"
              >
                Criar Conjunto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}