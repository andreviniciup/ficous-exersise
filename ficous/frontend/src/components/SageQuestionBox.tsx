import { useState, useRef, useEffect } from 'react';
import { SageResponseBox } from './SageResponseBox';

interface SageQuestionBoxProps {
  selectedText: string;
  onClose: () => void;
  position: { x: number; y: number };
}

export function SageQuestionBox({ selectedText, onClose, position }: SageQuestionBoxProps) {
  const [question, setQuestion] = useState('Me explique essa parte, eu fiquei com duvida nessa parte. pq não consigo entender nada');
  const [showResponse, setShowResponse] = useState(false);
  const [showQuestion, setShowQuestion] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = () => {
    console.log('Pergunta enviada para Sage:', question);
    console.log('Texto selecionado:', selectedText);
    setShowQuestion(false);
    setShowResponse(true);
    // Aqui você implementaria a lógica para enviar a pergunta para o Sage
  };

  const handleCloseResponse = () => {
    setShowResponse(false);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <>
      {showQuestion && (
        <div 
          className="absolute flex items-center justify-center z-50"
          style={{
            left: `${position.x + 200}px`,
            top: `${position.y + 100}px`,
          }}
        >
          <div className="flex-none rotate-[90deg]">
            <div className="bg-neutral-100 box-border content-stretch flex gap-[10px] items-center p-[5px] relative rounded-[15px]">
              <div aria-hidden="true" className="absolute border border-[#eaeaea] border-solid inset-0 pointer-events-none rounded-[15px] shadow-[0px_0px_6px_0px_rgba(148,165,168,0.15)]" />
              
              <div className="flex h-[373px] items-center justify-center relative shrink-0 w-[51.188px]">
                <div className="flex-none rotate-[270deg]">
                  <div className="bg-white box-border content-stretch flex gap-[10px] items-start justify-center p-[12px] relative rounded-[10px] w-[349px]">
                    <input
                      ref={inputRef}
                      type="text"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Pergunte alguma coisa ao sage"
                      className="font-['Alexandria:Regular',_sans-serif] font-normal leading-[normal] relative shrink-0 text-[#313131] text-[12px] w-full bg-transparent border-none outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showResponse && (
        <SageResponseBox
          question={question}
          selectedText={selectedText}
          onClose={handleCloseResponse}
          position={position}
        />
      )}
    </>
  );
}