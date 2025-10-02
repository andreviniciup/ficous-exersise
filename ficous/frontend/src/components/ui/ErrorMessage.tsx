import { XCircle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorMessage({ 
  title = 'Erro', 
  message, 
  onRetry, 
  className = '' 
}: ErrorMessageProps) {
  return (
    <div className={`flex flex-col items-center justify-center text-center ${className}`}>
      <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
      <h3 className="font-['Alexandria:Medium',_sans-serif] font-medium text-[18px] text-red-600 mb-2">
        {title}
      </h3>
      <p className="font-['Alexandria:Regular',_sans-serif] font-normal text-[16px] text-red-500 mb-4 max-w-md">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-['Alexandria:Medium',_sans-serif] font-medium text-[14px]"
        >
          <RefreshCw size={16} />
          Tentar Novamente
        </button>
      )}
    </div>
  );
}
