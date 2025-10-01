import { useState } from 'react';

interface SageResponseBoxProps {
  question: string;
  selectedText: string;
  onClose: () => void;
  position: { x: number; y: number };
}

export function SageResponseBox({ question, selectedText, onClose, position }: SageResponseBoxProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div 
      className="absolute flex items-center justify-center z-50"
      style={{
        left: `${position.x}px`,
        top: `${position.y + 20}px`,
        transform: 'translateX(-50%)'
      }}
    >
      <div className="flex-none rotate-[90deg]">
        <div className="bg-neutral-100 box-border content-stretch flex gap-[10px] items-center justify-center p-[8px] relative rounded-[15px]">
          <div aria-hidden="true" className="absolute border border-[#eaeaea] border-solid inset-0 pointer-events-none rounded-[15px] shadow-[0px_0px_10px_0px_rgba(148,165,168,0.45)]" />
          
          <div className="flex h-[389px] items-center justify-center relative shrink-0 w-[200.797px]">
            <div className="flex-none rotate-[270deg]">
              <div className="bg-white box-border content-stretch flex flex-col gap-[15px] items-start justify-center px-[20px] py-[15px] relative rounded-[10px]">
                {/* Question Title */}
                <p className="font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] relative shrink-0 text-[#91acc5] text-[16px] text-nowrap whitespace-pre">O que é exceções personalizadas em Java?</p>
                
                {/* Response Text */}
                <p className="font-['Alexandria:Regular',_sans-serif] font-normal leading-[normal] relative shrink-0 text-[#313131] text-[14px] text-justify w-[349px]">Exceções personalizadas em Java são classes criadas pelo próprio programador para representar erros específicos da lógica do seu programa, ao invés de usar apenas as exceções padrão do Java como NullPointerException, IOException, ArithmeticException, etc.</p>
                
                {/* PDF Reference */}
                <div className="bg-[rgba(145,172,197,0.35)] box-border content-stretch flex gap-[10px] items-center justify-center px-[10px] py-[4px] relative rounded-[8px] shrink-0">
                  <p className="font-['Alexandria:Regular',_sans-serif] font-normal leading-[normal] relative shrink-0 text-[#678097] text-[12px] text-nowrap whitespace-pre">1.Estrutura do Try-Catch-Finally.pdf</p>
                </div>

                {/* Close button (invisible but functional) */}
                <button
                  onClick={handleClose}
                  className="absolute top-[5px] right-[5px] w-[20px] h-[20px] bg-transparent hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}