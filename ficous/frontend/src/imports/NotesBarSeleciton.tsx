import svgPaths from "./svg-2sxllfe2ln";

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

function Actions() {
  return (
    <div className="box-border content-stretch flex gap-[5px] items-center p-[5px] relative shrink-0" data-name="actions">
      <div className="relative shrink-0 size-[13px]" data-name="Vector">
        <div className="absolute inset-[-5.769%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
            <g id="Vector">
              <path d={svgPaths.p3af86480} stroke="var(--stroke-0, #8D8D8D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              <path d={svgPaths.p9d53580} stroke="var(--stroke-0, #8D8D8D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </g>
          </svg>
        </div>
      </div>
      <p className="capitalize font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] relative shrink-0 text-[#8d8d8d] text-[16px] text-nowrap whitespace-pre">actions</p>
    </div>
  );
}

function Sage() {
  return (
    <div className="box-border content-stretch flex gap-[5px] items-center p-[5px] relative shrink-0" data-name="sage">
      <div className="h-[13px] relative shrink-0 w-[12px]" data-name="Vector">
        <div className="absolute inset-[-5.77%_-6.25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 15">
            <path d={svgPaths.p3884cf00} id="Vector" stroke="var(--stroke-0, #8D8D8D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
      <p className="capitalize font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] relative shrink-0 text-[#8d8d8d] text-[16px] text-nowrap whitespace-pre">Sage</p>
    </div>
  );
}

function Library() {
  return (
    <div className="box-border content-stretch flex gap-[5px] items-center p-[5px] relative shrink-0" data-name="library">
      <div className="h-[13px] relative shrink-0 w-[11px]" data-name="Vector">
        <div className="absolute inset-[-5.77%_-6.82%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 15">
            <path d={svgPaths.pc2ba400} id="Vector" stroke="var(--stroke-0, #8D8D8D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
      <p className="capitalize font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] relative shrink-0 text-[#8d8d8d] text-[16px] text-nowrap whitespace-pre">library</p>
    </div>
  );
}

function Frame378() {
  return (
    <div className="absolute bg-neutral-100 box-border content-stretch flex gap-[10px] items-center left-[738px] px-[19px] py-[9px] rounded-[13px] top-[805px]">
      <div aria-hidden="true" className="absolute border border-[#eaeaea] border-solid inset-0 pointer-events-none rounded-[13px] shadow-[0px_0px_6px_0px_rgba(148,165,168,0.45)]" />
      <Actions />
      <Sage />
      <Library />
    </div>
  );
}

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
    <div className="box-border content-stretch flex flex-col gap-[20px] h-full items-start px-0 py-[61px] relative shrink-0 w-[200px]">
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
    <div className="absolute bg-white box-border content-stretch flex h-[980px] items-center justify-center left-0 px-[20px] py-[7px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.1)] top-[2px]" data-name="sidebar">
      <Frame101 />
    </div>
  );
}

function Group136() {
  return (
    <div className="absolute aspect-[71.4583/13.125] left-[66.14%] right-[29.86%] translate-y-[-50%]" style={{ top: "calc(50% - 321.435px)" }}>
      <div className="absolute inset-[-8.98%_-1.65%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 63 14">
          <g id="Group 136">
            <path d={svgPaths.p22cd6f80} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            <path d={svgPaths.p6ee8000} id="Vector_2" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            <path d={svgPaths.p2b50cc60} id="Vector_3" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            <path d={svgPaths.pebec700} id="Vector_4" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group139() {
  return (
    <div className="absolute contents left-[802.84px] top-[162px]">
      <p className="absolute capitalize font-['Alexandria:Regular',_sans-serif] font-normal leading-[normal] left-[825.42px] text-[#585858] text-[14px] text-nowrap top-[162px] whitespace-pre">Grifar</p>
      <div className="absolute bg-[#a7b951] left-[802.84px] rounded-[3px] size-[14.583px] top-[163.67px]" />
    </div>
  );
}

function Group138() {
  return (
    <div className="absolute contents left-[682.13px] top-[162px]">
      <p className="absolute capitalize font-['Alexandria:Regular',_sans-serif] font-normal leading-[normal] left-[700.33px] text-[#585858] text-[14px] text-nowrap top-[162px] whitespace-pre">Paragrafo</p>
      <div className="absolute aspect-[9/10] left-[45.11%] right-[54.21%] translate-y-[-50%]" data-name="Vector" style={{ top: "calc(50% - 320.042px)" }}>
        <div className="absolute inset-[-8.57%_-9.8%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 14">
            <path d={svgPaths.p3c2a2980} id="Vector" stroke="var(--stroke-0, #585858)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute h-[4.375px] left-[775.33px] top-[170px] w-[8.75px]">
        <div className="absolute inset-[-22.86%_-11.43%_-32.32%_-11.43%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 7">
            <path d="M1 1L5.375 5.375L9.75 1" id="Vector 1" stroke="var(--stroke-0, #585858)" strokeLinecap="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame390() {
  return (
    <div className="absolute box-border content-stretch flex gap-[10px] items-center justify-center left-[1086px] px-[10px] py-[4px] rounded-[999px] top-[158px]" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\\\'0 0 122 23\\\' xmlns=\\\'http://www.w3.org/2000/svg\\\' preserveAspectRatio=\\\'none\\\'><rect x=\\\'0\\\' y=\\\'0\\\' height=\\\'100%\\\' width=\\\'100%\\\' fill=\\\'url(%23grad)\\\' opacity=\\\'1\\\'/><defs><radialGradient id=\\\'grad\\\' gradientUnits=\\\'userSpaceOnUse\\\' cx=\\\'0\\\' cy=\\\'0\\\' r=\\\'10\\\' gradientTransform=\\\'matrix(3.7352e-16 1.15 -6.1 7.0417e-17 61 11.5)\\\'><stop stop-color=\\\'rgba(88,133,200,1)\\\' offset=\\\'0\\\'/><stop stop-color=\\\'rgba(88,157,200,1)\\\' offset=\\\'1\\\'/></radialGradient></defs></svg>')" }}>
      <p className="css-vx7my8 font-['Alexandria:Regular',_sans-serif] font-normal leading-[normal] relative shrink-0 text-[12px] text-nowrap text-white whitespace-pre">Pergunte o sage</p>
    </div>
  );
}

function Group137() {
  return (
    <div className="absolute contents left-[669px] top-[152px]">
      <div className="absolute bg-white h-[35px] left-[669px] rounded-[12px] top-[152px] w-[549px]">
        <div aria-hidden="true" className="absolute border border-[#efefef] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_0px_2px_0px_rgba(0,0,0,0.1)]" />
      </div>
      <p className="absolute capitalize font-['Alexandria:Regular',_sans-serif] font-normal leading-[normal] left-[903.54px] text-[#585858] text-[14px] text-nowrap top-[162px] whitespace-pre">Comentar</p>
      <div className="absolute flex h-[20.406px] items-center justify-center left-[792.54px] top-[159.75px] w-[0px]">
        <div className="flex-none rotate-[90deg]">
          <div className="h-0 relative w-[20.417px]">
            <div className="absolute bottom-0 left-0 right-0 top-[-1.25px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21 2">
                <line id="Line 6" stroke="var(--stroke-0, #BEBEBE)" strokeLinecap="round" strokeWidth="1.25" x1="0.625" x2="19.7917" y1="1.375" y2="1.375" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[20.406px] items-center justify-center left-[871.21px] top-[159.75px] w-[0px]">
        <div className="flex-none rotate-[90deg]">
          <div className="h-0 relative w-[20.417px]">
            <div className="absolute bottom-0 left-0 right-0 top-[-1.25px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21 2">
                <line id="Line 6" stroke="var(--stroke-0, #BEBEBE)" strokeLinecap="round" strokeWidth="1.25" x1="0.625" x2="19.7917" y1="1.375" y2="1.375" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[20.406px] items-center justify-center left-[983.54px] top-[160.75px] w-[0px]">
        <div className="flex-none rotate-[90deg]">
          <div className="h-0 relative w-[20.417px]">
            <div className="absolute bottom-0 left-0 right-0 top-[-1.25px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21 2">
                <line id="Line 6" stroke="var(--stroke-0, #BEBEBE)" strokeLinecap="round" strokeWidth="1.25" x1="0.625" x2="19.7917" y1="1.375" y2="1.375" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[20.406px] items-center justify-center left-[1075.5px] top-[160.75px] w-[0px]">
        <div className="flex-none rotate-[90deg]">
          <div className="h-0 relative w-[20.417px]">
            <div className="absolute bottom-0 left-0 right-0 top-[-1.25px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21 2">
                <line id="Line 6" stroke="var(--stroke-0, #BEBEBE)" strokeLinecap="round" strokeWidth="1.25" x1="0.625" x2="19.7917" y1="1.375" y2="1.375" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <Group136 />
      <Group139 />
      <Group138 />
      <div className="absolute aspect-[18.014/16.0211] left-[58.27%] right-[40.77%] translate-y-[-50%]" data-name="Vector" style={{ top: "calc(50% - 320.438px)" }}>
        <div className="absolute inset-[-7.62%_-6.86%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 16">
            <path d={svgPaths.p213aaa80} id="Vector" stroke="var(--stroke-0, #585858)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <Frame390 />
    </div>
  );
}

function Group140() {
  return (
    <div className="absolute contents left-[669px] top-[152px]">
      <Group137 />
    </div>
  );
}

export default function NotesBarSeleciton() {
  return (
    <div className="bg-white relative size-full" data-name="notes - bar seleciton">
      <div className="absolute flex h-[46.375px] items-center justify-center left-[524px] top-[68px] w-[449.813px]">
        <div className="flex-none rotate-[90deg]">
          <ContentCabecalho />
        </div>
      </div>
      <div className="absolute font-['Alexandria:Regular',_sans-serif] font-normal h-[486px] leading-[0] left-[531px] text-[#202020] text-[16px] top-[133px] w-[700px]">
        <p className="leading-[27px] mb-0">No Java, o tratamento de exceções é uma prática essencial para garantir que o programa lide adequadamente com erros que possam ocorrer durante sua execução, sem que o sistema trave ou apresente falhas inesperadas.</p>
        <p className="leading-[27px] mb-0">O tratamento de exceções é feito utilizando os blocos try, catch, finally e, em alguns casos, criando exceções personalizadas. Abaixo estão os principais conceitos:</p>
        <ol className="list-decimal" start="1">
          <li className="mb-0 ms-[24px]">
            <span className="leading-[27px]">
              try:
              <br aria-hidden="true" />O bloco try contém o código que pode gerar uma exceção. Se algo der errado, o controle será transferido para o bloco catch.
            </span>
          </li>
          <li className="mb-0 ms-[24px]">
            <span className="leading-[27px]">
              catch:
              <br aria-hidden="true" />O bloco catch é usado para capturar e tratar a exceção que foi lançada no bloco try. É possível usar vários blocos catch para tratar diferentes tipos de exceções.
            </span>
          </li>
          <li className="mb-0 ms-[24px]">
            <span className="leading-[27px]">
              finally:
              <br aria-hidden="true" />O bloco finally é executado independentemente de uma exceção ter sido lançada ou não. Ele é geralmente usado para liberar recursos, como fechar arquivos ou conexões com bancos de dados.
            </span>
          </li>
          <li className="ms-[24px]">
            <span className="leading-[27px]">
              Exceções Personalizadas:
              <br aria-hidden="true" />É possível criar suas próprias classes de exceção para lidar com erros específicos que seu programa pode enfrentar.
            </span>
          </li>
        </ol>
      </div>
      <Frame378 />
      <Sidebar />
      <Group140 />
    </div>
  );
}