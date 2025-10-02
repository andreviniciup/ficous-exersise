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

function ContentPrincipal() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-center justify-center p-[10px] relative shrink-0" data-name="content-principal">
      <p className="font-['Arial_Rounded_MT_Bold:Regular',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[20px] text-black text-center w-[462px]">Quais foram os principais impactos da Revolução Industrial, que ocorreu durante a Idade Moderna, nas mudanças sociais e econômicas da Europa?</p>
    </div>
  );
}

function ButtonMostraResposta() {
  return (
    <div className="bg-[#3b82d6] box-border content-stretch flex gap-[10px] h-[40px] items-center justify-center px-[14px] py-[12px] relative rounded-[10px] shrink-0 w-[150px]" data-name="button-mostra-resposta">
      <div aria-hidden="true" className="absolute border border-[#16467f] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <p className="capitalize font-['Arial_Rounded_MT_Bold:Regular',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-center text-nowrap text-white whitespace-pre">mostrar resposta</p>
    </div>
  );
}

function FrameFaltamDeckContent() {
  return (
    <div className="bg-[#c2c2c2] box-border content-stretch flex gap-[10px] h-[30px] items-center justify-center px-[11px] py-[9px] relative rounded-[10px] shrink-0 w-[70px]" data-name="frame-faltam-deck-content">
      <div aria-hidden="true" className="absolute border border-[#222222] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <p className="capitalize font-['Arial_Rounded_MT_Bold:Regular',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[#222222] text-[10px] text-nowrap whitespace-pre">faltam 47</p>
    </div>
  );
}

function Footer() {
  return (
    <div className="content-stretch flex gap-[144px] items-center relative shrink-0" data-name="footer">
      <ButtonMostraResposta />
      <FrameFaltamDeckContent />
    </div>
  );
}

function Frame183() {
  return (
    <div className="bg-[#f4f4f4] box-border content-stretch flex flex-col gap-[121px] h-[500px] items-center px-[46px] py-[27px] relative rounded-[40px] w-[700px]">
      <div aria-hidden="true" className="absolute border border-[#585858] border-solid inset-0 pointer-events-none rounded-[40px]" />
      <HeaderInfo />
      <ContentPrincipal />
      <Footer />
    </div>
  );
}

export default function FlashcardsPergunta() {
  return (
    <div className="bg-[#353535] relative size-full" data-name="flashcards-pergunta">
      <div className="absolute flex h-[700px] items-center justify-center left-[262px] top-[333px] w-[500px]">
        <div className="flex-none rotate-[270deg]">
          <Frame183 />
        </div>
      </div>
    </div>
  );
}