import { useRef } from 'react';
import { TextSelectionMenu } from "./TextSelectionMenu";

interface NoteDetailPageProps {
  noteTitle: string;
  disciplineName: string;
  disciplineColor: string;
}

function ContentCabecalho({ title }: { title: string }) {
  return (
    <div className="content-stretch flex gap-[30px] items-end relative" data-name="content-cabeçalho">
      <div className="flex h-[449.813px] items-center justify-center relative shrink-0 w-[46.391px]">
        <div className="flex-none rotate-[270deg]">
          <p className="capitalize font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] relative text-[#202020] text-[40px] text-nowrap whitespace-pre">{title}</p>
        </div>
      </div>
    </div>
  );
}

export function NoteDetailPage({ noteTitle, disciplineName, disciplineColor }: NoteDetailPageProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div className="absolute flex h-[46.375px] items-center justify-center left-[524px] top-[68px] w-[449.813px]">
        <div className="flex-none rotate-[90deg]">
          <ContentCabecalho title={noteTitle} />
        </div>
      </div>
      <div 
        ref={contentRef}
        className="absolute font-['Alexandria:Regular',_sans-serif] font-normal h-[486px] leading-[0] left-[531px] text-[#202020] text-[16px] top-[133px] w-[700px] select-text"
      >
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
      <TextSelectionMenu contentRef={contentRef} />
    </>
  );
}