import { useState, useEffect, useCallback } from 'react';
import svgPaths from "../imports/svg-2sxllfe2ln";
import { SageQuestionBox } from "./SageQuestionBox";
import { TextHighlight } from "./TextHighlight";

interface TextSelectionMenuProps {
  contentRef: React.RefObject<HTMLElement>;
}

export function TextSelectionMenu({ contentRef }: TextSelectionMenuProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [selectedText, setSelectedText] = useState('');
  const [showSageBox, setShowSageBox] = useState(false);

  const handleTextSelection = useCallback(() => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      // Position the menu above the selected text
      setPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 10
      });
      
      setSelectedText(selection.toString());
      setIsVisible(true);
    } else {
      setIsVisible(false);
      setSelectedText('');
    }
  }, []);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    const selection = window.getSelection();
    if (!selection || selection.toString().trim().length === 0) {
      setIsVisible(false);
    }
  }, []);

  useEffect(() => {
    const contentElement = contentRef.current;
    if (!contentElement) return;

    contentElement.addEventListener('mouseup', handleTextSelection);
    contentElement.addEventListener('keyup', handleTextSelection);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      contentElement.removeEventListener('mouseup', handleTextSelection);
      contentElement.removeEventListener('keyup', handleTextSelection);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleTextSelection, handleClickOutside, contentRef]);

  const handleFormatClick = (format: string) => {
    console.log(`Applied ${format} to:`, selectedText);
    // Here you would implement the actual formatting logic
    setIsVisible(false);
  };

  const handleHighlight = () => {
    console.log('Highlighted text:', selectedText);
    setIsVisible(false);
  };

  const handleComment = () => {
    console.log('Added comment to:', selectedText);
    setIsVisible(false);
  };

  const handleAskSage = () => {
    setShowSageBox(true);
    setIsVisible(false);
  };

  const handleCloseSageBox = () => {
    setShowSageBox(false);
    // Clear selection when closing sage box
    window.getSelection()?.removeAllRanges();
  };

  return (
    <>
      <TextHighlight isVisible={isVisible || showSageBox} />
      
      {isVisible && (
        <div 
          className="absolute bg-white box-border content-stretch flex gap-[10px] items-center rounded-[12px] shadow-[0px_0px_2px_0px_rgba(0,0,0,0.1)] z-50"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            transform: 'translate(-50%, -100%)'
          }}
        >
      <div aria-hidden="true" className="absolute border border-[#efefef] border-solid inset-0 pointer-events-none rounded-[12px]" />
      
      {/* Bold, Italic, Underline, Strikethrough */}
      <div className="flex gap-[10px] items-center px-[15px] py-[8px]">
        <div className="flex gap-[5px] items-center">
          <div className="relative shrink-0 size-[13px] cursor-pointer hover:opacity-70 transition-opacity" onClick={() => handleFormatClick('bold')}>
            <div className="absolute inset-[-8.98%_-1.65%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 63 14">
                <g>
                  <path d={svgPaths.p22cd6f80} stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  <path d={svgPaths.p6ee8000} stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  <path d={svgPaths.p2b50cc60} stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  <path d={svgPaths.pebec700} stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </g>
              </svg>
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="flex h-[20.406px] items-center justify-center w-[0px]">
          <div className="flex-none rotate-[90deg]">
            <div className="h-0 relative w-[20.417px]">
              <div className="absolute bottom-0 left-0 right-0 top-[-1.25px]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21 2">
                  <line stroke="var(--stroke-0, #BEBEBE)" strokeLinecap="round" strokeWidth="1.25" x1="0.625" x2="19.7917" y1="1.375" y2="1.375" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Paragraph */}
        <div className="flex gap-[5px] items-center cursor-pointer hover:opacity-70 transition-opacity" onClick={() => handleFormatClick('paragraph')}>
          <div className="h-[10px] relative shrink-0 w-[9px]">
            <div className="absolute inset-[-8.57%_-9.8%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 14">
                <path d={svgPaths.p3c2a2980} stroke="var(--stroke-0, #585858)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </div>
          </div>
          <p className="capitalize font-['Alexandria:Regular',_sans-serif] font-normal leading-[normal] relative shrink-0 text-[#585858] text-[14px] text-nowrap whitespace-pre">Paragrafo</p>
          <div className="h-[4.375px] relative w-[8.75px]">
            <div className="absolute inset-[-22.86%_-11.43%_-32.32%_-11.43%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 7">
                <path d="M1 1L5.375 5.375L9.75 1" stroke="var(--stroke-0, #585858)" strokeLinecap="round" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="flex h-[20.406px] items-center justify-center w-[0px]">
          <div className="flex-none rotate-[90deg]">
            <div className="h-0 relative w-[20.417px]">
              <div className="absolute bottom-0 left-0 right-0 top-[-1.25px]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21 2">
                  <line stroke="var(--stroke-0, #BEBEBE)" strokeLinecap="round" strokeWidth="1.25" x1="0.625" x2="19.7917" y1="1.375" y2="1.375" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Highlight */}
        <div className="flex gap-[5px] items-center cursor-pointer hover:opacity-70 transition-opacity" onClick={handleHighlight}>
          <div className="bg-[#a7b951] rounded-[3px] size-[14.583px]" />
          <p className="capitalize font-['Alexandria:Regular',_sans-serif] font-normal leading-[normal] relative shrink-0 text-[#585858] text-[14px] text-nowrap whitespace-pre">Grifar</p>
        </div>

        {/* Separator */}
        <div className="flex h-[20.406px] items-center justify-center w-[0px]">
          <div className="flex-none rotate-[90deg]">
            <div className="h-0 relative w-[20.417px]">
              <div className="absolute bottom-0 left-0 right-0 top-[-1.25px]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21 2">
                  <line stroke="var(--stroke-0, #BEBEBE)" strokeLinecap="round" strokeWidth="1.25" x1="0.625" x2="19.7917" y1="1.375" y2="1.375" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Comment */}
        <div className="flex gap-[5px] items-center cursor-pointer hover:opacity-70 transition-opacity" onClick={handleComment}>
          <div className="h-[16px] relative w-[18px]">
            <div className="absolute inset-[-7.62%_-6.86%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 16">
                <path d={svgPaths.p213aaa80} stroke="var(--stroke-0, #585858)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </div>
          </div>
          <p className="capitalize font-['Alexandria:Regular',_sans-serif] font-normal leading-[normal] relative shrink-0 text-[#585858] text-[14px] text-nowrap whitespace-pre">Comentar</p>
        </div>

        {/* Separator */}
        <div className="flex h-[20.406px] items-center justify-center w-[0px]">
          <div className="flex-none rotate-[90deg]">
            <div className="h-0 relative w-[20.417px]">
              <div className="absolute bottom-0 left-0 right-0 top-[-1.25px]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21 2">
                  <line stroke="var(--stroke-0, #BEBEBE)" strokeLinecap="round" strokeWidth="1.25" x1="0.625" x2="19.7917" y1="1.375" y2="1.375" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Ask Sage */}
        <div 
          className="box-border content-stretch flex gap-[10px] items-center justify-center px-[10px] py-[4px] rounded-[999px] cursor-pointer hover:opacity-80 transition-opacity"
          style={{ 
            backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\\\"0 0 122 23\\\" xmlns=\\\"http://www.w3.org/2000/svg\\\" preserveAspectRatio=\\\"none\\\"><rect x=\\\"0\\\" y=\\\"0\\\" height=\\\"100%\\\" width=\\\"100%\\\" fill=\\\"url(%23grad)\\\" opacity=\\\"1\\\"/><defs><radialGradient id=\\\"grad\\\" gradientUnits=\\\"userSpaceOnUse\\\" cx=\\\"0\\\" cy=\\\"0\\\" r=\\\"10\\\" gradientTransform=\\\"matrix(3.7352e-16 1.15 -6.1 7.0417e-17 61 11.5)\\\"><stop stop-color=\\\"rgba(88,133,200,1)\\\" offset=\\\"0\\\"/><stop stop-color=\\\"rgba(88,157,200,1)\\\" offset=\\\"1\\\"/></radialGradient></defs></svg>')" 
          }}
          onClick={handleAskSage}
        >
          <p className="font-['Alexandria:Regular',_sans-serif] font-normal leading-[normal] relative shrink-0 text-[12px] text-nowrap text-white whitespace-pre">Pergunte o sage</p>
        </div>
      </div>
        </div>
      )}

      {showSageBox && (
        <SageQuestionBox
          selectedText={selectedText}
          onClose={handleCloseSageBox}
          position={position}
        />
      )}
    </>
  );
}