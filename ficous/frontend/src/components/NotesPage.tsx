import { useState } from 'react';
import svgPaths from "../imports/svg-6wbjskmyj6";
import { NotionStyleEditor } from "./NotionStyleEditor";

interface NotesPageProps {
  disciplineName: string;
  disciplineColor: string;
  onNoteClick: (noteId: number, noteTitle: string) => void;
}

export function NotesPage({ disciplineName, disciplineColor, onNoteClick }: NotesPageProps) {
  const [notes, setNotes] = useState([
    {
      id: 1,
      title: "Tratamento de exceções",
      date: "20 de junho",
      tag: "UP01",
      content: "No Java, o tratamento de exceções é uma prática essencial..."
    }
  ]);

  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [selectedNote, setSelectedNote] = useState<number | null>(null);

  function Group113() {
    return (
      <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative">
        <div className="[grid-area:1_/_1] flex h-[66px] items-center justify-center ml-0 mt-0 relative w-[13.703px]">
          <div className="flex-none rotate-[270deg]">
            <p className="font-['Alexandria:Regular',_sans-serif] font-normal h-[13.714px] leading-[normal] relative text-[#5b4807] text-[10px] w-[66px]">20 de junho</p>
          </div>
        </div>
        <div className="[grid-area:1_/_1] flex h-[28.594px] items-center justify-center ml-0 mt-[179.3px] relative w-[13.703px]">
          <div className="flex-none rotate-[270deg]">
            <p className="font-['Alexandria:Regular',_sans-serif] font-normal h-[13.714px] leading-[normal] relative text-[#5b4807] text-[10px] w-[28.6px]">UP01</p>
          </div>
        </div>
      </div>
    );
  }

  function Frame430() {
    return (
      <div className="bg-[#c8a939] box-border content-stretch flex flex-col gap-[10px] h-[20px] items-center justify-center px-[5px] py-[2px] relative rounded-tl-[10px] rounded-tr-[10px] shrink-0 w-[220px]">
        <div className="flex h-[13.688px] items-center justify-center leading-[0] relative shrink-0 w-[207.875px]">
          <div className="flex-none rotate-[90deg]">
            <Group113 />
          </div>
        </div>
      </div>
    );
  }

  function Frame432() {
    return (
      <div className="box-border content-stretch flex gap-[10px] items-center justify-center pl-[10px] pr-[5px] py-0 relative shrink-0">
        <p className="font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] relative shrink-0 text-[#5b4807] text-[16px] text-nowrap whitespace-pre">Tratamento de exceções</p>
      </div>
    );
  }

  function ExistingNoteCard() {
    return (
      <div 
        className="absolute cursor-pointer hover:scale-105 transition-transform duration-200" 
        style={{ top: "calc(25% + 62.5px)", left: "calc(20% + 38.8px)" }}
        onClick={() => onNoteClick(1, "Tratamento de exceções")}
      >
        <div className="bg-[#dbbe54] box-border content-stretch flex flex-col h-[160px] items-start justify-between pb-[10px] pt-0 px-0 rounded-[12px] w-[220px]">
          <Frame430 />
          <Frame432 />
        </div>
      </div>
    );
  }

  function CreateNewNoteArea() {
    return (
      <div className="absolute content-stretch flex flex-col gap-[5px] items-center left-[118px] w-[106px]" style={{ top: "calc(25% + 122.5px)" }}>
        <div className="relative shrink-0 size-[18px]" data-name="Vector">
          <div className="absolute inset-[-5.556%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
              <path d={svgPaths.p2fd04a70} id="Vector" stroke="var(--stroke-0, #D9D9D9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </div>
        </div>
        <button 
          className="font-['Alexandria:Regular',_sans-serif] font-normal leading-[normal] min-w-full relative shrink-0 text-[#d9d9d9] text-[14px] hover:text-[#b0b0b0] transition-colors cursor-pointer"
          style={{ width: "min-content" }}
          onClick={() => setIsCreatingNote(true)}
        >
          Criar nova nota
        </button>
      </div>
    );
  }

  function NewNotePlaceholder() {
    return (
      <div className="absolute flex h-[160px] items-center justify-center left-[61px] w-[220px]" style={{ top: "calc(25% + 62.5px)" }}>
        <div className="flex-none rotate-[180deg] scale-y-[-100%]">
          <div className="bg-[rgba(243,243,243,0.45)] h-[160px] relative rounded-[12px] w-[220px] cursor-pointer hover:bg-[rgba(243,243,243,0.6)] transition-colors"
               onClick={() => setIsCreatingNote(true)}>
            <div aria-hidden="true" className="absolute border border-[rgba(217,217,217,0.8)] border-dashed inset-[-0.5px] pointer-events-none rounded-[12.5px]" />
          </div>
        </div>
      </div>
    );
  }

  const handleSaveNote = (title: string, content: string) => {
    if (title.trim()) {
      setNotes(prev => [...prev, {
        id: Date.now(),
        title: title,
        date: new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' }),
        tag: "NEW",
        content: content
      }]);
      setNewNoteTitle("");
      setIsCreatingNote(false);
    }
  };

  const handleCancelNote = () => {
    setNewNoteTitle("");
    setIsCreatingNote(false);
  };

  return (
    <div className="absolute h-[982px] left-[241px] overflow-clip top-0 w-[1271px]">
      {/* Header Rectangle */}
      <div 
        className="absolute h-[110px] left-[60px] rounded-[11px] top-[48px] w-[1151px]" 
        style={{ backgroundColor: disciplineColor }}
      />
      
      <p className="absolute font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] left-[61px] text-[36px] text-black text-nowrap top-[193px] whitespace-pre capitalize">
        {disciplineName}
      </p>
      <p className="absolute font-['Alexandria:Regular',_sans-serif] font-normal leading-[normal] left-[61px] text-[20px] text-black text-nowrap whitespace-pre" style={{ top: "calc(25% + 30.5px)" }}>
        Notas
      </p>
      
      <ExistingNoteCard />
      <NewNotePlaceholder />
      <CreateNewNoteArea />
      
      {isCreatingNote && (
        <NotionStyleEditor
          initialTitle=""
          initialContent=""
          disciplineColor={disciplineColor}
          onSave={handleSaveNote}
          onCancel={handleCancelNote}
        />
      )}
    </div>
  );
}