import svgPaths from "./svg-6wbjskmyj6";

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
    <div className="box-border content-stretch flex flex-col gap-[20px] h-full items-start px-0 py-[61px] relative shrink-0 w-[200px]">
      <Frame350 />
      <SeparadorSidebar />
      <DisciplinasSidebar />
      <SeparadorSidebar />
      <FooterSidebar />
    </div>
  );
}

function Sidebar() {
  return (
    <div className="absolute bg-white box-border content-stretch flex h-[980px] items-center justify-center left-0 px-[20px] py-[7px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.1)] top-[2px]" data-name="sidebar">
      <Frame101 />
    </div>
  );
}

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

function Frame431() {
  return (
    <div className="absolute bg-[#dbbe54] box-border content-stretch flex flex-col h-[160px] items-start justify-between pb-[10px] pt-0 px-0 rounded-[12px] w-[220px]" style={{ top: "calc(25% + 62.5px)", left: "calc(20% + 38.8px)" }}>
      <Frame430 />
      <Frame432 />
    </div>
  );
}

function Frame429() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[5px] items-center left-[118px] w-[106px]" style={{ top: "calc(25% + 122.5px)" }}>
      <div className="relative shrink-0 size-[18px]" data-name="Vector">
        <div className="absolute inset-[-5.556%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
            <path d={svgPaths.p2fd04a70} id="Vector" stroke="var(--stroke-0, #D9D9D9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <p className="font-['Alexandria:Regular',_sans-serif] font-normal leading-[normal] min-w-full relative shrink-0 text-[#d9d9d9] text-[14px]" style={{ width: "min-content" }}>
        Criar nova nota
      </p>
    </div>
  );
}

function Frame428() {
  return (
    <div className="absolute h-[982px] left-[241px] overflow-clip top-0 w-[1271px]">
      <p className="absolute font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] left-[61px] text-[36px] text-black text-nowrap top-[193px] whitespace-pre">Projeto De Programação</p>
      <p className="absolute font-['Alexandria:Regular',_sans-serif] font-normal leading-[normal] left-[61px] text-[20px] text-black text-nowrap whitespace-pre" style={{ top: "calc(25% + 30.5px)" }}>
        Notas
      </p>
      <Frame431 />
      <div className="absolute flex h-[160px] items-center justify-center left-[61px] w-[220px]" style={{ top: "calc(25% + 62.5px)" }}>
        <div className="flex-none rotate-[180deg] scale-y-[-100%]">
          <div className="bg-[rgba(243,243,243,0.45)] h-[160px] relative rounded-[12px] w-[220px]">
            <div aria-hidden="true" className="absolute border border-[rgba(217,217,217,0.8)] border-dashed inset-[-0.5px] pointer-events-none rounded-[12.5px]" />
          </div>
        </div>
      </div>
      <div className="absolute h-[110px] left-[60px] rounded-[11px] top-[48px] w-[1151px]" />
      <Frame429 />
    </div>
  );
}

export default function MacBookPro144() {
  return (
    <div className="bg-white relative size-full" data-name="MacBook Pro 14' - 4">
      <Sidebar />
      <Frame428 />
    </div>
  );
}