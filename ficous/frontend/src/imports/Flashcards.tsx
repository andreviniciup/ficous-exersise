import svgPaths from "./svg-mysutuazev";

function ButtonSidebarPesquisa() {
  return (
    <div className="bg-[#ededed] box-border content-stretch flex gap-[10px] items-center px-[10px] py-[5px] relative rounded-[5px] shrink-0 w-[200px]" data-name="button-sidebar-pesquisa">
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

function ButtonSidebarPaginaInicial() {
  return (
    <div className="relative shrink-0 w-full" data-name="button-sidebar-paginaInicial">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[10px] items-center px-[10px] py-[5px] relative w-full">
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

function HeaderSidebar() {
  return (
    <div className="content-stretch flex flex-col gap-[5px] items-start relative shrink-0 w-full" data-name="header-sidebar">
      <ButtonSidebarPaginaInicial />
    </div>
  );
}

function Frame350() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full">
      <ButtonSidebarPesquisa />
      <HeaderSidebar />
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

function ButtonSidebarDisciplinasAdd() {
  return (
    <div className="box-border content-stretch flex gap-[93px] items-center px-[10px] py-[5px] relative shrink-0 w-[200px]" data-name="button-sidebar-disciplinas-add">
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

function Frame99() {
  return (
    <div className="content-stretch flex gap-[10px] items-center justify-center relative shrink-0">
      <p className="capitalize font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] relative shrink-0 text-[#585858] text-[12px] text-nowrap whitespace-pre">projeto de programação</p>
    </div>
  );
}

function ButtonSidebarDisciplinas01() {
  return (
    <div className="relative shrink-0 w-full" data-name="button-sidebar-disciplinas-01">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[5px] items-center px-[10px] py-[5px] relative w-full">
          <div className="bg-[#c89558] rounded-[2px] shrink-0 size-[10px]" />
          <Frame99 />
        </div>
      </div>
    </div>
  );
}

function Frame100() {
  return (
    <div className="content-stretch flex gap-[10px] items-center justify-center relative shrink-0">
      <p className="capitalize font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] relative shrink-0 text-[#585858] text-[12px] text-nowrap whitespace-pre">redes de computadores</p>
    </div>
  );
}

function ButtonSidebarDisciplinas02() {
  return (
    <div className="relative shrink-0 w-full" data-name="button-sidebar-disciplinas-02">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[5px] items-center px-[10px] py-[5px] relative w-full">
          <div className="bg-[#9cbe7a] rounded-[2px] shrink-0 size-[10px]" />
          <Frame100 />
        </div>
      </div>
    </div>
  );
}

function Frame102() {
  return (
    <div className="content-stretch flex gap-[10px] items-center justify-center relative shrink-0">
      <p className="capitalize font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] relative shrink-0 text-[#585858] text-[12px] text-nowrap whitespace-pre">cálculo 1</p>
    </div>
  );
}

function ButtonSidebarDisciplinas03() {
  return (
    <div className="relative shrink-0 w-full" data-name="button-sidebar-disciplinas-03">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[5px] items-center px-[10px] py-[5px] relative w-full">
          <div className="bg-[#91acc5] rounded-[2px] shrink-0 size-[10px]" />
          <Frame102 />
        </div>
      </div>
    </div>
  );
}

function Frame103() {
  return (
    <div className="content-stretch flex gap-[10px] items-center justify-center relative shrink-0">
      <p className="capitalize font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] relative shrink-0 text-[#585858] text-[12px] text-nowrap whitespace-pre">engenharia de software</p>
    </div>
  );
}

function ButtonSidebarDisciplinas04() {
  return (
    <div className="relative shrink-0 w-full" data-name="button-sidebar-disciplinas-04">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[5px] items-center px-[10px] py-[5px] relative w-full">
          <div className="bg-[#ab2c32] rounded-[2px] shrink-0 size-[10px]" />
          <Frame103 />
        </div>
      </div>
    </div>
  );
}

function DisciplinasSidebar() {
  return (
    <div className="content-stretch flex flex-col gap-[5px] items-start relative shrink-0 w-full" data-name="disciplinas- sidebar">
      <ButtonSidebarDisciplinasAdd />
      <ButtonSidebarDisciplinas01 />
      <ButtonSidebarDisciplinas02 />
      <ButtonSidebarDisciplinas03 />
      <ButtonSidebarDisciplinas04 />
    </div>
  );
}

function ButtonSidebarTrabalhos() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-center px-[10px] py-[5px] relative shrink-0 w-[200px]" data-name="button-sidebar-trabalhos">
      <div className="h-[14px] relative shrink-0 w-[11.667px]" data-name="Vector">
        <div className="absolute inset-[-6.25%_-7.5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 16">
            <path d={svgPaths.pda2fb80} id="Vector" stroke="var(--stroke-0, #585858)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
          </svg>
        </div>
      </div>
      <p className="font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] relative shrink-0 text-[#585858] text-[14px] text-nowrap whitespace-pre">Trabalhos</p>
    </div>
  );
}

function ButtonSidebarNotas() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-center px-[10px] py-[5px] relative shrink-0 w-[200px]" data-name="button-sidebar-notas">
      <div className="h-[13px] relative shrink-0 w-[16px]" data-name="Vector">
        <div className="absolute inset-[-7.69%_-6.25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 15">
            <path d={svgPaths.p2d7e100} id="Vector" stroke="var(--stroke-0, #585858)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <p className="font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] relative shrink-0 text-[#585858] text-[14px] text-nowrap whitespace-pre">Flashcards</p>
    </div>
  );
}

function ButtonSidebarFaltas() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-center px-[10px] py-[5px] relative shrink-0 w-[200px]" data-name="button-sidebar-faltas">
      <div className="h-[13px] relative shrink-0 w-[16px]" data-name="Vector">
        <div className="absolute inset-[-7.69%_-6.25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 15">
            <path d={svgPaths.p2d7e100} id="Vector" stroke="var(--stroke-0, #585858)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <p className="font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] relative shrink-0 text-[#585858] text-[14px] text-nowrap whitespace-pre">Exercícios</p>
    </div>
  );
}

function MidSidebar() {
  return (
    <div className="content-stretch flex flex-col gap-[5px] items-start relative shrink-0 w-[200px]" data-name="mid - sidebar">
      <ButtonSidebarTrabalhos />
      <ButtonSidebarNotas />
      <ButtonSidebarFaltas />
    </div>
  );
}

function ButtonSidebarFoco() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-center px-[10px] py-[5px] relative shrink-0 w-[200px]" data-name="button-sidebar-foco">
      <div className="relative shrink-0 size-[14px]" data-name="Vector">
        <div className="absolute inset-[-7.143%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
            <path d={svgPaths.p2feda180} id="Vector" stroke="var(--stroke-0, #585858)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <p className="font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] relative shrink-0 text-[#585858] text-[14px] text-nowrap whitespace-pre">Foco</p>
    </div>
  );
}

function ButtonSidebarDesempenho() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-center px-[10px] py-[5px] relative shrink-0 w-[200px]" data-name="button-sidebar-desempenho">
      <div className="h-[13px] relative shrink-0 w-[16px]" data-name="Vector">
        <div className="absolute inset-[-7.69%_-6.25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 15">
            <path d={svgPaths.p2d7e100} id="Vector" stroke="var(--stroke-0, #585858)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <p className="font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] relative shrink-0 text-[#585858] text-[14px] text-nowrap whitespace-pre">Desempenho</p>
    </div>
  );
}

function ButtonSidebarConfiguaracoes() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-center px-[10px] py-[5px] relative shrink-0 w-[200px]" data-name="button-sidebar-configuarações">
      <div className="relative shrink-0 size-[14px]" data-name="Vector">
        <div className="absolute inset-[-6.25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
            <g id="Vector">
              <path d={svgPaths.p35ac3300} stroke="var(--stroke-0, #585858)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
              <path d={svgPaths.p2348b80} stroke="var(--stroke-0, #585858)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
            </g>
          </svg>
        </div>
      </div>
      <p className="font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] relative shrink-0 text-[#585858] text-[14px] text-nowrap whitespace-pre">Configurações</p>
    </div>
  );
}

function FooterSidebar() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[5px] grow items-start justify-end min-h-px min-w-px relative shrink-0 w-[200px]" data-name="footer - sidebar">
      <ButtonSidebarFoco />
      <ButtonSidebarDesempenho />
      <ButtonSidebarConfiguaracoes />
    </div>
  );
}

function Frame101() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[20px] h-full items-start px-0 py-[70px] relative shrink-0 w-[200px]">
      <Frame350 />
      <SeparadorSidebar />
      <DisciplinasSidebar />
      <SeparadorSidebar />
      <MidSidebar />
      <SeparadorSidebar />
      <FooterSidebar />
    </div>
  );
}

function Sidebar() {
  return (
    <div className="bg-[#f9f9f9] box-border content-stretch flex gap-[10px] h-[1023px] items-center justify-center px-0 py-[30px] relative w-[261px]" data-name="sidebar">
      <Frame101 />
    </div>
  );
}

function Group112() {
  return (
    <div className="absolute contents left-[234.61px] top-[788.63px]">
      <div className="absolute flex h-[56.298px] items-center justify-center left-[234.61px] top-[788.63px] w-[57.995px]">
        <div className="flex-none rotate-[273.101deg]">
          <p className="font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] relative text-[#f0d471] text-[48px] text-nowrap whitespace-pre">31</p>
        </div>
      </div>
      <div className="absolute flex h-[38.908px] items-center justify-center left-[285.65px] top-[793.39px] w-[13.246px]">
        <div className="flex-none rotate-[273.101deg]">
          <p className="font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] relative text-[#f0d471] text-[10px] text-nowrap whitespace-pre">maio, 25</p>
        </div>
      </div>
    </div>
  );
}

function Group115() {
  return (
    <div className="absolute contents left-[214px] top-[773.06px]">
      <div className="absolute flex h-[255.877px] items-center justify-center left-[214px] top-[773.06px] w-[312.543px]">
        <div className="flex-none rotate-[273.101deg]">
          <div className="bg-[#f6f6f6] h-[300px] relative rounded-[25px] w-[240px]">
            <div aria-hidden="true" className="absolute border border-neutral-200 border-solid inset-[-1px] pointer-events-none rounded-[26px]" />
          </div>
        </div>
      </div>
      <div className="absolute flex h-[222.401px] items-center justify-center left-[427.28px] top-[794.57px] w-[80.543px]">
        <div className="flex-none rotate-[273.101deg]">
          <p className="font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] relative text-[#f0d471] text-[30px] w-[219px]">Tratamento de exceções</p>
        </div>
      </div>
      <Group112 />
    </div>
  );
}

function Novos() {
  return (
    <div className="content-stretch flex flex-col font-['Alexandria:Regular',_sans-serif] font-normal items-center justify-center leading-[normal] relative shrink-0 text-[10px]" data-name="novos">
      <p className="capitalize relative shrink-0 text-[#585858] w-full">novos</p>
      <p className="relative shrink-0 text-[#91acc5] text-center w-full">10</p>
    </div>
  );
}

function Aprender() {
  return (
    <div className="content-stretch flex flex-col font-['Alexandria:Regular',_sans-serif] font-normal items-center leading-[normal] relative shrink-0 text-[10px] w-[47px]" data-name="aprender">
      <p className="capitalize relative shrink-0 text-[#585858] text-nowrap whitespace-pre">aprender</p>
      <p className="min-w-full relative shrink-0 text-[#971919] text-center" style={{ width: "min-content" }}>
        10
      </p>
    </div>
  );
}

function Revisar() {
  return (
    <div className="content-stretch flex flex-col font-['Alexandria:Regular',_sans-serif] font-normal items-center leading-[normal] relative shrink-0 text-[10px] w-[37px]" data-name="revisar">
      <p className="capitalize relative shrink-0 text-[#585858] w-full">Revisar</p>
      <p className="relative shrink-0 text-[#496f0c] text-center w-full">10</p>
    </div>
  );
}

function DeckCardInformationNumber() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="deck-card-information-number">
      <Novos />
      <Aprender />
      <Revisar />
    </div>
  );
}

function DeckCardInformationFrame() {
  return (
    <div className="content-stretch flex gap-[38px] items-center relative" data-name="deck-card-information-frame">
      <DeckCardInformationNumber />
    </div>
  );
}

function Group113() {
  return (
    <div className="absolute contents left-[237.88px] top-[154.63px]">
      <div className="absolute flex h-[56.298px] items-center justify-center left-[237.88px] top-[154.63px] w-[57.995px]">
        <div className="flex-none rotate-[273.101deg]">
          <p className="font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] relative text-[#f0d471] text-[48px] text-nowrap whitespace-pre">31</p>
        </div>
      </div>
      <div className="absolute flex h-[38.908px] items-center justify-center left-[288.92px] top-[159.39px] w-[13.246px]">
        <div className="flex-none rotate-[273.101deg]">
          <p className="font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] relative text-[#f0d471] text-[10px] text-nowrap whitespace-pre">maio, 25</p>
        </div>
      </div>
    </div>
  );
}

function Group117() {
  return (
    <div className="absolute contents left-[217.27px] top-[139.06px]">
      <div className="absolute flex h-[255.877px] items-center justify-center left-[217.27px] top-[139.06px] w-[312.543px]">
        <div className="flex-none rotate-[273.101deg]">
          <div className="bg-[#f6f6f6] h-[300px] relative rounded-[25px] w-[240px]">
            <div aria-hidden="true" className="absolute border border-neutral-200 border-solid inset-[-1px] pointer-events-none rounded-[26px]" />
          </div>
        </div>
      </div>
      <div className="absolute flex h-[222.401px] items-center justify-center left-[430.55px] top-[160.57px] w-[80.543px]">
        <div className="flex-none rotate-[273.101deg]">
          <p className="font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] relative text-[#f0d471] text-[30px] w-[219px]">Tratamento de exceções</p>
        </div>
      </div>
      <Group113 />
    </div>
  );
}

function Group114() {
  return (
    <div className="absolute contents left-[237.88px] top-[480.63px]">
      <div className="absolute flex h-[56.298px] items-center justify-center left-[237.88px] top-[480.63px] w-[57.995px]">
        <div className="flex-none rotate-[273.101deg]">
          <p className="font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] relative text-[#f0d471] text-[48px] text-nowrap whitespace-pre">31</p>
        </div>
      </div>
      <div className="absolute flex h-[38.908px] items-center justify-center left-[288.92px] top-[485.39px] w-[13.246px]">
        <div className="flex-none rotate-[273.101deg]">
          <p className="font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] relative text-[#f0d471] text-[10px] text-nowrap whitespace-pre">maio, 25</p>
        </div>
      </div>
    </div>
  );
}

function Group116() {
  return (
    <div className="absolute contents left-[217.27px] top-[465.06px]">
      <div className="absolute flex h-[255.877px] items-center justify-center left-[217.27px] top-[465.06px] w-[312.543px]">
        <div className="flex-none rotate-[273.101deg]">
          <div className="bg-[#f6f6f6] h-[300px] relative rounded-[25px] w-[240px]">
            <div aria-hidden="true" className="absolute border border-neutral-200 border-solid inset-[-1px] pointer-events-none rounded-[26px]" />
          </div>
        </div>
      </div>
      <div className="absolute flex h-[222.401px] items-center justify-center left-[430.55px] top-[486.57px] w-[80.543px]">
        <div className="flex-none rotate-[273.101deg]">
          <p className="font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] relative text-[#f0d471] text-[30px] w-[219px]">Tratamento de exceções</p>
        </div>
      </div>
      <Group114 />
    </div>
  );
}

function Frame356() {
  return (
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
                <path d="M6.5 1V12M1 6.5H12" id="Vector" stroke="var(--stroke-0, #585858)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame357() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[5px] items-center left-[131px] top-[278px] w-[20px]">
      <div className="flex items-center justify-center relative shrink-0 w-full" style={{ "--transform-inner-width": "20", "--transform-inner-height": "20", height: "calc(1px * ((var(--transform-inner-width) * 1) + (var(--transform-inner-height) * 0)))" } as React.CSSProperties}>
        <div className="flex-none rotate-[270deg] w-full">
          <p className="capitalize font-['Alexandria:Regular',_sans-serif] font-normal h-[20px] leading-[normal] relative text-[#e2e2e2] text-[16px] w-full">Adicionar</p>
        </div>
      </div>
    </div>
  );
}

export default function Flashcards() {
  return (
    <div className="bg-[#f9f9f9] relative size-full" data-name="flashcards">
      <div className="absolute flex h-[261px] items-center justify-center left-px top-[1105px] w-[1023px]">
        <div className="flex-none rotate-[270deg]">
          <Sidebar />
        </div>
      </div>
      <div className="absolute flex h-[297.906px] items-center justify-center left-[116px] top-[742px] w-[46.391px]">
        <div className="flex-none rotate-[270deg]">
          <p className="capitalize font-['Alexandria:Regular',_sans-serif] font-normal leading-[normal] relative text-[40px] text-black text-nowrap whitespace-pre">Seus flashcards</p>
        </div>
      </div>
      <Group115 />
      <div className="absolute flex h-[240px] items-center justify-center left-[216.27px] top-[791px] w-[300px]">
        <div className="flex-none rotate-[270deg]">
          <div className="bg-[#f6f6f6] h-[300px] relative rounded-[25px] w-[240px]">
            <div aria-hidden="true" className="absolute border border-neutral-200 border-solid inset-[-1px] pointer-events-none rounded-[26px]" />
          </div>
        </div>
      </div>
      <div className="absolute flex h-[219px] items-center justify-center left-[429.27px] top-[801px] w-[68.797px]">
        <div className="flex-none rotate-[270deg]">
          <p className="font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] relative text-[#f0d471] text-[30px] w-[219px]">Tratamento de exceções</p>
        </div>
      </div>
      <div className="absolute flex h-[130.063px] items-center justify-center left-[419.27px] top-[874px] w-[13.594px]">
        <div className="flex-none rotate-[270deg]">
          <p className="font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] relative text-[#c3ac58] text-[12px] text-nowrap whitespace-pre">Projeto de Programação</p>
        </div>
      </div>
      <div className="absolute flex h-[136.344px] items-center justify-center left-[229px] top-[866px] w-[22.391px]">
        <div className="flex-none rotate-[270deg]">
          <DeckCardInformationFrame />
        </div>
      </div>
      <Group117 />
      <div className="absolute flex h-[240px] items-center justify-center left-[219.54px] top-[157px] w-[300px]">
        <div className="flex-none rotate-[270deg]">
          <div className="bg-[#f6f6f6] h-[300px] relative rounded-[25px] w-[240px]">
            <div aria-hidden="true" className="absolute border border-neutral-200 border-solid inset-[-1px] pointer-events-none rounded-[26px]" />
          </div>
        </div>
      </div>
      <div className="absolute flex h-[219px] items-center justify-center left-[432.54px] top-[167px] w-[68.797px]">
        <div className="flex-none rotate-[270deg]">
          <p className="font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] relative text-[#f0d471] text-[30px] w-[219px]">Tratamento de exceções</p>
        </div>
      </div>
      <div className="absolute flex h-[130.063px] items-center justify-center left-[422.54px] top-[240px] w-[13.594px]">
        <div className="flex-none rotate-[270deg]">
          <p className="font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] relative text-[#c3ac58] text-[12px] text-nowrap whitespace-pre">Projeto de Programação</p>
        </div>
      </div>
      <div className="absolute flex h-[136.344px] items-center justify-center left-[232.27px] top-[232px] w-[22.391px]">
        <div className="flex-none rotate-[270deg]">
          <DeckCardInformationFrame />
        </div>
      </div>
      <Group116 />
      <div className="absolute flex h-[240px] items-center justify-center left-[219.54px] top-[483px] w-[300px]">
        <div className="flex-none rotate-[270deg]">
          <div className="bg-[#f6f6f6] h-[300px] relative rounded-[25px] w-[240px]">
            <div aria-hidden="true" className="absolute border border-neutral-200 border-solid inset-[-1px] pointer-events-none rounded-[26px]" />
          </div>
        </div>
      </div>
      <div className="absolute flex h-[219px] items-center justify-center left-[432.54px] top-[493px] w-[68.797px]">
        <div className="flex-none rotate-[270deg]">
          <p className="font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] relative text-[#f0d471] text-[30px] w-[219px]">Tratamento de exceções</p>
        </div>
      </div>
      <div className="absolute flex h-[130.063px] items-center justify-center left-[422.54px] top-[566px] w-[13.594px]">
        <div className="flex-none rotate-[270deg]">
          <p className="font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] relative text-[#c3ac58] text-[12px] text-nowrap whitespace-pre">Projeto de Programação</p>
        </div>
      </div>
      <div className="absolute flex h-[136.344px] items-center justify-center left-[232.27px] top-[558px] w-[22.391px]">
        <div className="flex-none rotate-[270deg]">
          <DeckCardInformationFrame />
        </div>
      </div>
      <div className="absolute flex h-[160px] items-center justify-center left-[116px] top-[67px] w-[49px]">
        <div className="flex-none rotate-[270deg]">
          <div className="bg-neutral-50 h-[49px] relative rounded-[999px] w-[160px]">
            <div aria-hidden="true" className="absolute border border-[#ededed] border-solid inset-0 pointer-events-none rounded-[999px] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.1)]" />
          </div>
        </div>
      </div>
      <Frame356 />
      <div className="absolute flex h-[160px] items-center justify-center left-[116px] top-[239px] w-[49px]">
        <div className="flex-none rotate-[270deg]">
          <div className="bg-[#929292] h-[49px] relative rounded-[999px] w-[160px]">
            <div aria-hidden="true" className="absolute border border-[#e2e2e2] border-solid inset-0 pointer-events-none rounded-[999px] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.1)]" />
          </div>
        </div>
      </div>
      <Frame357 />
    </div>
  );
}