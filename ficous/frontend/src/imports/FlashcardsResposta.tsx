function ContentInfo() {
  return (
    <div className="content-stretch flex flex-col font-['Arial_Rounded_MT_Bold:Regular',_sans-serif] items-center leading-[normal] not-italic relative shrink-0 w-[103px]" data-name="content-info">
      <p className="relative shrink-0 text-[#5a7691] text-[14px] w-full">Idade Moderna</p>
      <p className="capitalize relative shrink-0 text-[#91acc5] text-[10px] text-center w-full">história</p>
    </div>
  );
}

function HeaderInfo() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-[608px]" data-name="header-info">
      <p className="font-['Arial_Rounded_MT_Bold:Regular',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[#5a7691] text-[14px] text-nowrap whitespace-pre">01</p>
      <ContentInfo />
    </div>
  );
}

function TextPergunta() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-center justify-center p-[10px] relative shrink-0" data-name="text-pergunta">
      <p className="font-['Arial_Rounded_MT_Bold:Regular',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[#585858] text-[14px] text-center w-[462px]">Quais foram os principais impactos da Revolução Industrial, que ocorreu durante a Idade Moderna, nas mudanças sociais e econômicas da Europa?</p>
    </div>
  );
}

function DivisorLine() {
  return (
    <div className="h-[20px] relative shrink-0 w-[380px]" data-name="divisor-line">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 380 20">
        <g id="divisor-line">
          <line id="Line 2" stroke="var(--stroke-0, #D9D9D9)" x1="10" x2="370" y1="9.5" y2="9.5" />
        </g>
      </svg>
    </div>
  );
}

function TextResposta() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-center justify-center p-[10px] relative shrink-0" data-name="text-resposta">
      <p className="font-['Arial_Rounded_MT_Bold:Regular',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[15px] text-black text-center w-[462px]">A Revolução Industrial trouxe grandes mudanças econômicas e sociais, como o crescimento das fábricas, a urbanização, o surgimento do capitalismo industrial e o aumento da produção. Socialmente, resultou no crescimento da classe trabalhadora (proletariado) e em condições de trabalho precárias, o que levou à formação de movimentos por direitos laborais.</p>
    </div>
  );
}

function ButtonNivelDeDificuldadeDeNovo() {
  return (
    <div className="bg-[#c93a4b] box-border content-stretch flex gap-[10px] h-[30px] items-center justify-center px-[14px] py-[9px] relative rounded-[10px] shrink-0 w-[70px]" data-name="button-nivel-de-dificuldade-de-novo">
      <div aria-hidden="true" className="absolute border-2 border-[#971919] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <p className="capitalize font-['Arial_Rounded_MT_Bold:Regular',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[10px] text-nowrap text-white whitespace-pre">de novo</p>
    </div>
  );
}

function ButtonNivelDeDificuldadeDificil() {
  return (
    <div className="bg-[#73a7ae] box-border content-stretch flex gap-[10px] h-[30px] items-center justify-center px-[21px] py-[9px] relative rounded-[10px] shrink-0 w-[70px]" data-name="button-nivel-de-dificuldade-dificil">
      <div aria-hidden="true" className="absolute border-2 border-[#45858e] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <p className="capitalize font-['Arial_Rounded_MT_Bold:Regular',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[10px] text-nowrap text-white whitespace-pre">Difícil</p>
    </div>
  );
}

function ButtonNivelDeDificuldadeBom() {
  return (
    <div className="bg-[#9cbe7a] box-border content-stretch flex gap-[10px] h-[30px] items-center justify-center px-[23px] py-[9px] relative rounded-[10px] shrink-0 w-[70px]" data-name="button-nivel-de-dificuldade-bom">
      <div aria-hidden="true" className="absolute border-2 border-[#637746] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <p className="capitalize font-['Arial_Rounded_MT_Bold:Regular',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[10px] text-nowrap text-white whitespace-pre">Bom</p>
    </div>
  );
}

function ButtonNivelDeDificuldadeFacil() {
  return (
    <div className="bg-[#f0d471] box-border content-stretch flex gap-[10px] h-[30px] items-center justify-center px-[23px] py-[9px] relative rounded-[10px] shrink-0 w-[70px]" data-name="button-nivel-de-dificuldade-facil">
      <div aria-hidden="true" className="absolute border-2 border-[#d7bb58] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <p className="capitalize font-['Arial_Rounded_MT_Bold:Regular',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[10px] text-nowrap text-white whitespace-pre">Fácil</p>
    </div>
  );
}

function ButtonNivelDeDificuldade() {
  return (
    <div className="content-stretch flex gap-[26px] items-center relative shrink-0" data-name="button-nivel-de-dificuldade">
      <ButtonNivelDeDificuldadeDeNovo />
      <ButtonNivelDeDificuldadeDificil />
      <ButtonNivelDeDificuldadeBom />
      <ButtonNivelDeDificuldadeFacil />
    </div>
  );
}

function ButtonEditar() {
  return (
    <div className="absolute bg-[#c2c2c2] box-border content-stretch flex gap-[10px] h-[30px] items-center justify-center left-[46px] px-[20px] py-[9px] rounded-[10px] top-[429px] w-[70px]" data-name="button-editar">
      <div aria-hidden="true" className="absolute border border-[#222222] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <p className="capitalize font-['Arial_Rounded_MT_Bold:Regular',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[#222222] text-[10px] text-nowrap whitespace-pre">editar</p>
    </div>
  );
}

function FrameCardResposta() {
  return (
    <div className="bg-[#f4f4f4] box-border content-stretch flex flex-col gap-[25px] h-[500px] items-center px-[39px] py-[36px] relative rounded-[40px] w-[700px]" data-name="frame-card-resposta">
      <div aria-hidden="true" className="absolute border border-[#585858] border-solid inset-0 pointer-events-none rounded-[40px]" />
      <HeaderInfo />
      <TextPergunta />
      <DivisorLine />
      <TextResposta />
      <ButtonNivelDeDificuldade />
      <ButtonEditar />
    </div>
  );
}

export default function FlashcardsResposta() {
  return (
    <div className="bg-[#353535] relative size-full" data-name="flashcards-resposta">
      <div className="absolute flex h-[700px] items-center justify-center left-[262px] top-[333px] w-[500px]">
        <div className="flex-none rotate-[270deg]">
          <FrameCardResposta />
        </div>
      </div>
    </div>
  );
}