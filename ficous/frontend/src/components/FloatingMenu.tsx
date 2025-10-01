import { useState } from 'react';
import svgPaths from "../imports/svg-cjhbniuoxi";

type MenuState = 'actions' | 'sage' | 'library' | null;

interface FloatingMenuProps {
  className?: string;
}

function ActionsMenu() {
  return (
    <div className="absolute bg-neutral-100 box-border content-stretch flex flex-col gap-[10px] items-start left-[738px] p-[10px] rounded-[20px] top-[704px] w-[305px]">
      <div aria-hidden="true" className="absolute border border-[#eaeaea] border-solid inset-0 pointer-events-none rounded-[20px] shadow-[0px_0px_6px_0px_rgba(148,165,168,0.15)]" />
      
      <div className="content-stretch flex gap-[5px] items-center relative shrink-0 cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors">
        <div className="h-[10px] relative shrink-0 w-[9px]">
          <div className="absolute inset-[-6.25%_-6.94%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 12">
              <g>
                <path d="M5.5 1L3.25 5.11765H7.75L5.5 1Z" stroke="var(--stroke-0, #9A9A9A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
                <path d="M6.625 9.23529C6.625 9.70332 6.80279 10.1522 7.11926 10.4831C7.43572 10.8141 7.86495 11 8.3125 11C8.76005 11 9.18928 10.8141 9.50574 10.4831C9.82221 10.1522 10 9.70332 10 9.23529C10 8.76727 9.82221 8.31841 9.50574 7.98746C9.18928 7.65651 8.76005 7.47059 8.3125 7.47059C7.86495 7.47059 7.43572 7.65651 7.11926 7.98746C6.80279 8.31841 6.625 8.76727 6.625 9.23529Z" stroke="var(--stroke-0, #9A9A9A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
                <path d="M1 8.05882C1 7.90281 1.05926 7.75319 1.16475 7.64288C1.27024 7.53256 1.41332 7.47059 1.5625 7.47059H3.8125C3.96168 7.47059 4.10476 7.53256 4.21025 7.64288C4.31574 7.75319 4.375 7.90281 4.375 8.05882V10.4118C4.375 10.5678 4.31574 10.7174 4.21025 10.8277C4.10476 10.938 3.96168 11 3.8125 11H1.5625C1.41332 11 1.27024 10.938 1.16475 10.8277C1.05926 10.7174 1 10.5678 1 10.4118V8.05882Z" stroke="var(--stroke-0, #9A9A9A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
              </g>
            </svg>
          </div>
        </div>
        <p className="capitalize font-['Alexandria:Regular',_sans-serif] font-normal leading-[normal] relative shrink-0 text-[#9a9a9a] text-[14px] text-nowrap whitespace-pre">shapes</p>
      </div>

      <div className="content-stretch flex gap-[5px] items-center relative shrink-0 cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors">
        <div className="relative shrink-0 size-[10px]">
          <div className="absolute inset-[-6.25%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
              <path d="M7.19764 2.1928L9.80717 4.80233M1 11H3.60953L10.4595 4.14998C10.6309 3.97864 10.7668 3.77522 10.8595 3.55135C10.9523 3.32748 11 3.08753 11 2.84522C11 2.6029 10.9523 2.36296 10.8595 2.13908C10.7668 1.91521 10.6309 1.7118 10.4595 1.54045C10.2882 1.36911 10.0848 1.23319 9.86092 1.14046C9.63704 1.04773 9.3971 1 9.15478 1C8.91247 1 8.67252 1.04773 8.44865 1.14046C8.22478 1.23319 8.02136 1.36911 7.85002 1.54045L1 8.39047V11Z" stroke="var(--stroke-0, #9A9A9A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
            </svg>
          </div>
        </div>
        <p className="capitalize font-['Alexandria:Regular',_sans-serif] font-normal leading-[normal] relative shrink-0 text-[#9a9a9a] text-[14px] text-nowrap whitespace-pre">draw</p>
      </div>

      <div className="content-stretch flex gap-[5px] items-center relative shrink-0 cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors">
        <div className="h-[10px] relative shrink-0 w-[14px]">
          <div className="absolute inset-[-6.25%_-4.46%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 12">
              <path d="M2 4H4C4.53043 4 5.03914 4.21071 5.41421 4.58579C5.78929 4.96086 6 5.46957 6 6V11H3C2.46957 11 1.96086 10.7893 1.58579 10.4142C1.21071 10.0391 1 9.53043 1 9C1 8.46957 1.21071 7.96086 1.58579 7.58579C1.96086 7.21071 2.46957 7 3 7H6M10 1V11M10 6C10 5.46957 10.2107 4.96086 10.5858 4.58579C10.9609 4.21071 11.4696 4 12 4H13C13.5304 4 14.0391 4.21071 14.4142 4.58579C14.7893 4.96086 15 5.46957 15 6V9C15 9.53043 14.7893 10.0391 14.4142 10.4142C14.0391 10.7893 13.5304 11 13 11H12C11.4696 11 10.9609 10.7893 10.5858 10.4142C10.2107 10.0391 10 9.53043 10 9V6Z" stroke="var(--stroke-0, #9A9A9A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
            </svg>
          </div>
        </div>
        <p className="capitalize font-['Alexandria:Regular',_sans-serif] font-normal leading-[normal] relative shrink-0 text-[#9a9a9a] text-[14px] text-nowrap whitespace-pre">Text</p>
      </div>
    </div>
  );
}

function SageMenu() {
  return (
    <div className="absolute flex h-[51px] items-center justify-center left-[603px] top-[744px] w-[570px]">
      <div className="flex-none rotate-[90deg]">
        <div className="backdrop-blur-[2.5px] backdrop-filter bg-[rgba(245,245,245,0.75)] box-border content-stretch flex gap-[10px] items-center p-[5px] relative rounded-[15px]">
          <div aria-hidden="true" className="absolute border border-[#eaeaea] border-solid inset-0 pointer-events-none rounded-[15px] shadow-[0px_0px_6px_0px_rgba(148,165,168,0.15)]" />
          <div className="flex h-[560px] items-center justify-center relative shrink-0 w-[41px]">
            <div className="flex-none rotate-[270deg]">
              <div className="box-border content-stretch flex h-[41px] items-center justify-between px-[12px] py-[14px] relative rounded-[10px] w-[560px]">
                <input 
                  type="text" 
                  placeholder="Pergunte alguma coisa" 
                  className="font-['Alexandria:Regular',_sans-serif] font-normal leading-[normal] relative shrink-0 text-[10px] text-grey w-[169px] bg-transparent border-none outline-none"
                />
                <div className="bg-[#d9d9d9] rounded-[999px] shrink-0 size-[20px] cursor-pointer hover:bg-[#c0c0c0] transition-colors" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LibraryMenu() {
  return (
    <div className="absolute backdrop-blur-[2.5px] backdrop-filter bg-[rgba(245,245,245,0.75)] box-border content-stretch flex flex-col gap-[20px] items-start left-[738px] p-[10px] rounded-[20px] top-[534px] w-[305px]">
      <div aria-hidden="true" className="absolute border border-[#eaeaea] border-solid inset-0 pointer-events-none rounded-[20px] shadow-[0px_0px_6px_0px_rgba(148,165,168,0.15)]" />
      
      <div className="content-stretch flex flex-col gap-[5px] items-start relative shrink-0 w-full">
        {[
          "Introdução ao Tratamento de",
          "Estrutura do Try-Catch-Finally", 
          "Exceções Checked e Uncheck",
          "Hierarquia das Exceções em"
        ].map((title, index) => (
          <div key={index} className="bg-[rgba(230,230,230,0.3)] relative rounded-[5px] shrink-0 w-full cursor-pointer hover:bg-[rgba(220,220,220,0.4)] transition-colors">
            <div className="flex flex-row items-center size-full">
              <div className="box-border content-stretch flex gap-[10px] items-center p-[5px] relative w-full">
                <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
                  <div className="[grid-area:1_/_1] h-[27.13px] ml-0 mt-0 relative w-[21.189px]">
                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 28">
                      <path d="M0 22.13V5C0 2.23858 2.23858 0 5 0H10.2396C11.5462 0 12.8009 0.511481 13.7352 1.42497L19.6847 7.2423C20.6468 8.18301 21.1891 9.47178 21.1891 10.8173V22.13C21.1891 24.8914 18.9505 27.13 16.1891 27.13H5C2.23858 27.13 0 24.8914 0 22.13Z" fill="white" />
                    </svg>
                  </div>
                  <div className="[grid-area:1_/_1] bg-[#d32727] h-[8.52px] ml-[6px] mt-[12px] rounded-[2px] w-[19.596px]" />
                  <p className="[grid-area:1_/_1] font-['Alexandria:Regular',_sans-serif] font-normal leading-[normal] ml-[15.79px] mt-[13px] relative text-[6px] text-center text-white translate-x-[-50%] uppercase w-[19.58px]">pdf</p>
                </div>
                <p className="font-['Alexandria:Regular',_sans-serif] font-normal leading-[27px] relative shrink-0 text-[#444444] text-[12px] flex-1">{title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[rgba(231,231,231,0.45)] relative rounded-[8px] shrink-0 w-full cursor-pointer hover:bg-[rgba(221,221,221,0.6)] transition-colors">
        <div aria-hidden="true" className="absolute border border-[rgba(190,190,190,0.75)] border-dashed inset-[-0.5px] pointer-events-none rounded-[8.5px]" />
        <div className="flex flex-row items-center justify-center size-full">
          <div className="box-border content-stretch flex gap-[10px] items-center justify-center px-[10px] py-[20px] relative w-full">
            <div className="h-[15px] relative shrink-0 w-[11px]">
              <div className="absolute inset-[-5%_-6.82%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 17">
                  <path d="M8.07143 1V4.33333C8.07143 4.55435 8.15421 4.76631 8.30156 4.92259C8.44891 5.07887 8.64876 5.16667 8.85714 5.16667H12M8.07143 1H2.57143C2.15466 1 1.75496 1.17559 1.46026 1.48816C1.16556 1.80072 1 2.22464 1 2.66667V14.3333C1 14.7754 1.16556 15.1993 1.46026 15.5118C1.75496 15.8244 2.15466 16 2.57143 16H10.4286C10.8453 16 11.245 15.8244 11.5397 15.5118C11.8344 15.1993 12 14.7754 12 14.3333V5.16667M8.07143 1L12 5.16667M6.5 7.66667V12.6667M6.5 7.66667L4.53571 9.75M6.5 7.66667L8.46429 9.75" stroke="var(--stroke-0, #ADADAD)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
            <div className="content-stretch flex gap-[5px] items-center relative shrink-0">
              <p className="font-['Alexandria:Regular',_sans-serif] font-normal leading-[normal] relative shrink-0 text-[#adadad] text-[12px] text-nowrap whitespace-pre">Adicionar nova fonte</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FloatingMenu({ className }: FloatingMenuProps) {
  const [activeMenu, setActiveMenu] = useState<MenuState>(null);

  const handleMenuClick = (menu: MenuState) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  return (
    <>
      {/* Menu Toggle Bar */}
      <div className={`absolute backdrop-blur-[2px] backdrop-filter bg-[rgba(245,245,245,0.75)] box-border content-stretch flex gap-[10px] items-center left-[738px] px-[10px] py-[9px] rounded-[13px] top-[805px] ${className}`}>
        <div aria-hidden="true" className="absolute border border-[#eaeaea] border-solid inset-0 pointer-events-none rounded-[13px] shadow-[0px_0px_6px_0px_rgba(148,165,168,0.15)]" />
        
        {/* Actions Button */}
        <div 
          className={`box-border content-stretch flex gap-[5px] items-center px-[10px] py-[5px] relative shrink-0 cursor-pointer rounded-[8px] transition-colors ${
            activeMenu === 'actions' ? 'bg-[#e7e7e7]' : 'hover:bg-[rgba(231,231,231,0.5)]'
          }`}
          onClick={() => handleMenuClick('actions')}
        >
          <div className="relative shrink-0 size-[13px]">
            <div className="absolute inset-[-5.769%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
                <g>
                  <path d={svgPaths.p3af86480} stroke="var(--stroke-0, #8D8D8D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  <path d={svgPaths.p9d53580} stroke="var(--stroke-0, #8D8D8D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </g>
              </svg>
            </div>
          </div>
          <p className="capitalize font-['Alexandria:Regular',_sans-serif] font-normal leading-[normal] relative shrink-0 text-[#8d8d8d] text-[16px] text-nowrap whitespace-pre">actions</p>
        </div>

        {/* Sage Button */}
        <div 
          className={`box-border content-stretch flex gap-[5px] items-center px-[10px] py-[5px] relative shrink-0 cursor-pointer rounded-[8px] transition-colors ${
            activeMenu === 'sage' ? 'bg-[#e7e7e7]' : 'hover:bg-[rgba(231,231,231,0.5)]'
          }`}
          onClick={() => handleMenuClick('sage')}
        >
          <div className="h-[13px] relative shrink-0 w-[12px]">
            <div className="absolute inset-[-5.77%_-6.25%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 15">
                <path d={svgPaths.p3884cf00} stroke="var(--stroke-0, #8D8D8D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
          <p className="capitalize font-['Alexandria:Regular',_sans-serif] font-normal leading-[normal] relative shrink-0 text-[#8d8d8d] text-[16px] text-nowrap whitespace-pre">Sage</p>
        </div>

        {/* Library Button */}
        <div 
          className={`box-border content-stretch flex gap-[5px] items-center px-[10px] py-[5px] relative shrink-0 cursor-pointer rounded-[8px] transition-colors ${
            activeMenu === 'library' ? 'bg-[#e7e7e7]' : 'hover:bg-[rgba(231,231,231,0.5)]'
          }`}
          onClick={() => handleMenuClick('library')}
        >
          <div className="h-[13px] relative shrink-0 w-[11px]">
            <div className="absolute inset-[-5.77%_-6.82%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 15">
                <path d={svgPaths.pc2ba400} stroke="var(--stroke-0, #8D8D8D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
          <p className="capitalize font-['Alexandria:Regular',_sans-serif] font-normal leading-[normal] relative shrink-0 text-[#8d8d8d] text-[16px] text-nowrap whitespace-pre">library</p>
        </div>
      </div>

      {/* Conditional Menu Content */}
      {activeMenu === 'actions' && <ActionsMenu />}
      {activeMenu === 'sage' && <SageMenu />}
      {activeMenu === 'library' && <LibraryMenu />}
    </>
  );
}