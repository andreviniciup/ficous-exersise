import { ArrowLeft, Home } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  onHome?: () => void;
  showHome?: boolean;
}

export function PageHeader({ 
  title, 
  subtitle, 
  onBack, 
  onHome, 
  showHome = true 
}: PageHeaderProps) {
  return (
    <div className="h-[110px] bg-blue-600 flex items-center px-8">
      <div className="flex items-center gap-4 flex-1">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-2 text-blue-100 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            Voltar
          </button>
        )}
        
        {showHome && onHome && (
          <button
            onClick={onHome}
            className="flex items-center gap-2 px-3 py-2 text-blue-100 hover:text-white transition-colors"
          >
            <Home size={20} />
            Início
          </button>
        )}
      </div>
      
      <div className="text-center flex-1">
        <h1 className="text-white text-2xl font-bold">{title}</h1>
        {subtitle && (
          <p className="text-blue-100">{subtitle}</p>
        )}
      </div>
      
      <div className="flex-1"></div>
    </div>
  );
}
