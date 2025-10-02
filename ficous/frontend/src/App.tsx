import { useRef, useState } from 'react';
import svgPaths from "./imports/svg-cjhbniuoxi";
import { FloatingMenu } from "./components/FloatingMenu";
import { TextSelectionMenu } from "./components/TextSelectionMenu";
import { NotesPage } from "./components/NotesPage";
import { NoteDetailPage } from "./components/NoteDetailPage";
import { FocusPage } from "./components/FocusPage";
import { PerformancePage } from "./components/PerformancePage";
import { SettingsPage } from "./components/SettingsPage";
import { FlashcardsPage } from "./components/FlashcardsPage";
import { ExercisesPage } from "./components/ExercisesPage";
import { SearchModal } from "./components/SearchModal";
import { CreateSubjectModal } from "./components/CreateSubjectModal";

type Page = 'home' | 'subject' | 'note' | 'focus' | 'performance' | 'settings' | 'flashcards' | 'exercises';

interface Subject {
  id: string;
  name: string;
  color: string;
  description?: string;
  semester?: string;
  professor?: string;
  credits?: number;
}

interface Note {
  id: number;
  title: string;
  subject: Subject;
}

function ContentCabecalho() {
  return (
    <div className="content-stretch flex gap-[30px] items-end relative" data-name="content-cabeçalho">
      <div className="flex h-[449.813px] items-center justify-center relative shrink-0 w-[46.391px]">
        <div className="flex-none rotate-[270deg]">
          <p className="capitalize font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] relative text-[#202020] text-[40px] text-nowrap whitespace-pre">tratamento de exceções</p>
        </div>
      </div>
    </div>
  );
}

function ButtonSidebarPesquisa({ onClick }: { onClick: () => void }) {
  return (
    <div 
      className="bg-[#ededed] box-border content-stretch flex gap-[10px] items-center px-[10px] py-[5px] relative rounded-[5px] shrink-0 w-[200px] cursor-pointer hover:bg-[#e0e0e0] transition-colors" 
      data-name="button-sidebar-pesquisa"
      onClick={onClick}
    >
      <div aria-hidden="true" className="absolute border border-[#898989] border-solid inset-[-0.5px] pointer-events-none rounded-[5.5px]" />
      <div className="relative shrink-0 size-[14px]" data-name="Vector">
        <div className="absolute inset-[-7.143%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
            <path d={svgPaths.p1a6fe300} id="Vector" stroke="var(--stroke-0, #898989)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <p className="font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] relative shrink-0 text-[#898989] text-[14px] text-nowrap whitespace-pre">pesquisa</p>
    </div>
  );
}

function ButtonSidebarPaginaInicial({ onClick, isActive }: { onClick: () => void; isActive: boolean }) {
  return (
    <div className="relative shrink-0 w-full" data-name="button-sidebar-paginaInicial">
      <div className="flex flex-row items-center size-full">
        <div 
          className={`box-border content-stretch flex gap-[10px] items-center px-[10px] py-[5px] relative w-full cursor-pointer rounded transition-colors ${
            isActive ? 'bg-blue-50' : 'hover:bg-gray-50'
          }`}
          onClick={onClick}
        >
          <div className="relative shrink-0 size-[14px]" data-name="Vector">
            <div className="absolute inset-[-6.25%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                <path d={svgPaths.pa4faa00} id="Vector" stroke="var(--stroke-0, #585858)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
              </svg>
            </div>
          </div>
          <p className="font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] relative shrink-0 text-[#585858] text-[14px] text-nowrap whitespace-pre">Pagina inicial</p>
        </div>
      </div>
    </div>
  );
}

function HeaderSidebar({ onHomeClick, currentPage, onSearchClick }: { 
  onHomeClick: () => void; 
  currentPage: Page;
  onSearchClick: () => void;
}) {
  return (
    <div className="content-stretch flex flex-col gap-[5px] items-start relative shrink-0 w-full" data-name="header-sidebar">
      <ButtonSidebarPesquisa onClick={onSearchClick} />
      <ButtonSidebarPaginaInicial onClick={onHomeClick} isActive={currentPage === 'home'} />
    </div>
  );
}

function SeparadorSidebar() {
  return (
    <div className="h-0 relative shrink-0 w-[200px]" data-name="separador - sidebar">
      <div className="absolute bottom-[-0.75px] left-0 right-0 top-[-0.75px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 200 2">
          <g id="separador - sidebar">
            <path d="M5 1H195" id="Line 8" stroke="var(--stroke-0, #D9D9D9)" strokeLinecap="round" strokeOpacity="0.8" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function ButtonSidebarDisciplinasAdd({ onClick }: { onClick: () => void }) {
  return (
    <div 
      className="box-border content-stretch flex gap-[93px] items-center px-[10px] py-[5px] relative shrink-0 w-[200px] cursor-pointer hover:bg-gray-50 rounded transition-colors" 
      data-name="button-sidebar-disciplinas-add"
      onClick={onClick}
    >
      <p className="basis-0 capitalize font-['Alexandria:Medium',_sans-serif] font-medium grow leading-[normal] min-h-px min-w-px relative shrink-0 text-[#bebebe] text-[12px]">disciplinas</p>
      <div className="relative shrink-0 size-[8px]" data-name="Vector">
        <div className="absolute inset-[-10.938%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
            <path d="M5 1V9M1 5H9" id="Vector" stroke="var(--stroke-0, #BEBEBE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function ButtonSidebarDisciplina({ subject, onClick, isActive }: { 
  subject: Subject; 
  onClick: () => void; 
  isActive: boolean; 
}) {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div 
          className={`box-border content-stretch flex gap-[5px] items-center px-[10px] py-[5px] relative w-full cursor-pointer rounded transition-colors ${
            isActive ? 'bg-blue-50' : 'hover:bg-gray-50'
          }`}
          onClick={onClick}
        >
          <div className="rounded-[2px] shrink-0 size-[10px]" style={{ backgroundColor: subject.color }} />
          <div className="content-stretch flex gap-[10px] items-center justify-center relative shrink-0">
            <p className="capitalize font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] relative shrink-0 text-[#585858] text-[12px] text-nowrap whitespace-pre">
              {subject.name}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DisciplinasSidebar({ 
  subjects,
  onSubjectClick, 
  onAddSubjectClick,
  currentSubject 
}: { 
  subjects: Subject[];
  onSubjectClick: (subject: Subject) => void; 
  onAddSubjectClick: () => void;
  currentSubject: Subject | null; 
}) {
  return (
    <div className="content-stretch flex flex-col gap-[5px] items-start relative shrink-0 w-full" data-name="disciplinas- sidebar">
      <ButtonSidebarDisciplinasAdd onClick={onAddSubjectClick} />
      {subjects.map(subject => (
        <ButtonSidebarDisciplina
          key={subject.id}
          subject={subject}
          onClick={() => onSubjectClick(subject)}
          isActive={currentSubject?.id === subject.id}
        />
      ))}
    </div>
  );
}

function ButtonSidebarItem({ icon, label, onClick, isActive }: {
  icon: string;
  label: string;
  onClick: () => void;
  isActive: boolean;
}) {
  return (
    <div 
      className={`box-border content-stretch flex gap-[10px] items-center px-[10px] py-[5px] relative shrink-0 w-[200px] cursor-pointer rounded transition-colors ${
        isActive ? 'bg-blue-50' : 'hover:bg-gray-50'
      }`}
      onClick={onClick}
    >
      <div className="relative shrink-0 size-[14px]" data-name="Vector">
        <div className="absolute inset-[-7.143%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
            <path d={icon} stroke="var(--stroke-0, #585858)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
          </svg>
        </div>
      </div>
      <p className="font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] relative shrink-0 text-[#585858] text-[14px] text-nowrap whitespace-pre">
        {label}
      </p>
    </div>
  );
}

function MidSidebar({ currentPage, onPageChange }: { 
  currentPage: Page; 
  onPageChange: (page: Page) => void; 
}) {
  return (
    <div className="content-stretch flex flex-col gap-[5px] items-start relative shrink-0 w-[200px]" data-name="mid - sidebar">
      <ButtonSidebarItem
        icon={svgPaths.p2d7e100}
        label="Flashcards"
        onClick={() => onPageChange('flashcards')}
        isActive={currentPage === 'flashcards'}
      />
      <ButtonSidebarItem
        icon={svgPaths.p2d7e100}
        label="Exercícios"
        onClick={() => onPageChange('exercises')}
        isActive={currentPage === 'exercises'}
      />
    </div>
  );
}

function FooterSidebar({ currentPage, onPageChange }: { 
  currentPage: Page; 
  onPageChange: (page: Page) => void; 
}) {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[5px] grow items-start justify-end min-h-px min-w-px relative shrink-0 w-[200px]" data-name="footer - sidebar">
      <ButtonSidebarItem
        icon={svgPaths.p2feda180}
        label="Foco"
        onClick={() => onPageChange('focus')}
        isActive={currentPage === 'focus'}
      />
      <ButtonSidebarItem
        icon={svgPaths.p2d7e100}
        label="Desempenho"
        onClick={() => onPageChange('performance')}
        isActive={currentPage === 'performance'}
      />
      <ButtonSidebarItem
        icon={svgPaths.p35ac3300}
        label="Configurações"
        onClick={() => onPageChange('settings')}
        isActive={currentPage === 'settings'}
      />
    </div>
  );
}

function Frame101({ 
  subjects,
  onHomeClick, 
  onSubjectClick, 
  onAddSubjectClick,
  onSearchClick,
  onPageChange,
  currentPage, 
  currentSubject 
}: { 
  subjects: Subject[];
  onHomeClick: () => void; 
  onSubjectClick: (subject: Subject) => void; 
  onAddSubjectClick: () => void;
  onSearchClick: () => void;
  onPageChange: (page: Page) => void;
  currentPage: Page; 
  currentSubject: Subject | null; 
}) {
  return (
    <div className="box-border content-stretch flex flex-col gap-[20px] h-full items-start px-0 py-[61px] relative shrink-0 w-[200px]">
      <HeaderSidebar 
        onHomeClick={onHomeClick} 
        currentPage={currentPage} 
        onSearchClick={onSearchClick}
      />
      <SeparadorSidebar />
      <DisciplinasSidebar 
        subjects={subjects}
        onSubjectClick={onSubjectClick} 
        onAddSubjectClick={onAddSubjectClick}
        currentSubject={currentSubject} 
      />
      <SeparadorSidebar />
      <MidSidebar currentPage={currentPage} onPageChange={onPageChange} />
      <SeparadorSidebar />
      <FooterSidebar currentPage={currentPage} onPageChange={onPageChange} />
    </div>
  );
}

function Sidebar({ 
  subjects,
  onHomeClick, 
  onSubjectClick, 
  onAddSubjectClick,
  onSearchClick,
  onPageChange,
  currentPage, 
  currentSubject 
}: { 
  subjects: Subject[];
  onHomeClick: () => void; 
  onSubjectClick: (subject: Subject) => void; 
  onAddSubjectClick: () => void;
  onSearchClick: () => void;
  onPageChange: (page: Page) => void;
  currentPage: Page; 
  currentSubject: Subject | null; 
}) {
  return (
    <div className="absolute bg-white box-border content-stretch flex h-[980px] items-center justify-center left-0 px-[20px] py-[7px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.1)] top-[2px]" data-name="sidebar">
      <Frame101 
        subjects={subjects}
        onHomeClick={onHomeClick} 
        onSubjectClick={onSubjectClick} 
        onAddSubjectClick={onAddSubjectClick}
        onSearchClick={onSearchClick}
        onPageChange={onPageChange}
        currentPage={currentPage} 
        currentSubject={currentSubject} 
      />
    </div>
  );
}

function HomePage() {
  return (
    <div className="absolute h-[982px] left-[241px] overflow-clip top-0 w-[1271px]">
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h1 className="font-['Alexandria:Medium',_sans-serif] font-medium text-[48px] text-[#202020] mb-4">
            Caderno de Estudos
          </h1>
          <p className="font-['Alexandria:Regular',_sans-serif] font-normal text-[20px] text-[#666666]">
            Selecione uma disciplina na barra lateral para começar
          </p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [currentSubject, setCurrentSubject] = useState<Subject | null>(null);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showCreateSubjectModal, setShowCreateSubjectModal] = useState(false);

  const [subjects, setSubjects] = useState<Subject[]>([
    { id: 'projeto-programacao', name: 'projeto de programação', color: '#c89558' },
    { id: 'redes-computadores', name: 'redes de computadores', color: '#9cbe7a' },
    { id: 'calculo-1', name: 'cálculo 1', color: '#91acc5' },
    { id: 'engenharia-software', name: 'engenharia de software', color: '#ab2c32' }
  ]);

  const handleHomeClick = () => {
    setCurrentPage('home');
    setCurrentSubject(null);
    setCurrentNote(null);
  };

  const handleSubjectClick = (subject: Subject) => {
    setCurrentPage('subject');
    setCurrentSubject(subject);
    setCurrentNote(null);
  };

  const handleNoteClick = (noteId: number, noteTitle: string) => {
    if (currentSubject) {
      const note: Note = {
        id: noteId,
        title: noteTitle,
        subject: currentSubject
      };
      setCurrentNote(note);
      setCurrentPage('note');
    }
  };

  const handlePageChange = (page: Page) => {
    setCurrentPage(page);
    setCurrentSubject(null);
    setCurrentNote(null);
  };

  const handleCreateSubject = (subjectData: { 
    name: string; 
    color: string; 
    description: string; 
    semester: string; 
    professor: string; 
    credits: number; 
  }) => {
    const newSubject: Subject = {
      id: `subject-${Date.now()}`,
      name: subjectData.name.toLowerCase(),
      color: subjectData.color,
      description: subjectData.description,
      semester: subjectData.semester,
      professor: subjectData.professor,
      credits: subjectData.credits
    };
    
    setSubjects(prev => [...prev, newSubject]);
  };

  const handleSearchResult = (result: any) => {
    // Implementar navegação baseada no resultado da pesquisa
    console.log('Search result clicked:', result);
  };

  return (
    <div className="bg-white relative size-full min-h-screen" data-name="notes - inicial">
      {currentPage === 'home' && <HomePage />}
      
      {currentPage === 'subject' && currentSubject && (
        <NotesPage 
          disciplineName={currentSubject.name}
          disciplineColor={currentSubject.color}
          onNoteClick={handleNoteClick}
        />
      )}
      
      {currentPage === 'note' && currentNote && (
        <NoteDetailPage 
          noteTitle={currentNote.title}
          disciplineName={currentNote.subject.name}
          disciplineColor={currentNote.subject.color}
        />
      )}

      {currentPage === 'focus' && <FocusPage />}
      {currentPage === 'performance' && <PerformancePage />}
      {currentPage === 'settings' && <SettingsPage />}
      {currentPage === 'flashcards' && <FlashcardsPage />}
      {currentPage === 'exercises' && <ExercisesPage />}
      
      <FloatingMenu />
      
      <Sidebar 
        subjects={subjects}
        onHomeClick={handleHomeClick}
        onSubjectClick={handleSubjectClick}
        onAddSubjectClick={() => setShowCreateSubjectModal(true)}
        onSearchClick={() => setShowSearchModal(true)}
        onPageChange={handlePageChange}
        currentPage={currentPage}
        currentSubject={currentSubject}
      />

      <SearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        onResultClick={handleSearchResult}
      />

      <CreateSubjectModal
        isOpen={showCreateSubjectModal}
        onClose={() => setShowCreateSubjectModal(false)}
        onCreateSubject={handleCreateSubject}
      />
    </div>
  );
}