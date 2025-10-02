import { useState, useEffect } from 'react';
import { Search, FileText, Users, Clock, Hash } from 'lucide-react';

interface SearchResult {
  id: string;
  type: 'note' | 'flashcard' | 'exercise' | 'subject';
  title: string;
  description: string;
  subject?: string;
  lastModified?: Date;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResultClick: (result: SearchResult) => void;
}

export function SearchModal({ isOpen, onClose, onResultClick }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Dados mockados para demonstração
  const allData: SearchResult[] = [
    {
      id: '1',
      type: 'note',
      title: 'Tratamento de exceções',
      description: 'No Java, o tratamento de exceções é uma prática essencial...',
      subject: 'Projeto de Programação',
      lastModified: new Date('2024-01-15')
    },
    {
      id: '2',
      type: 'note',
      title: 'Estruturas de dados básicas',
      description: 'Arrays, listas ligadas e pilhas são estruturas fundamentais...',
      subject: 'Projeto de Programação',
      lastModified: new Date('2024-01-14')
    },
    {
      id: '3',
      type: 'flashcard',
      title: 'Programação - Conceitos Básicos',
      description: 'Conceitos fundamentais de programação',
      subject: 'Projeto de Programação',
      lastModified: new Date('2024-01-13')
    },
    {
      id: '4',
      type: 'exercise',
      title: 'Introdução à Programação',
      description: 'Questões básicas sobre conceitos fundamentais de programação',
      subject: 'Projeto de Programação',
      lastModified: new Date('2024-01-12')
    },
    {
      id: '5',
      type: 'note',
      title: 'Protocolos TCP/IP',
      description: 'Conceitos sobre a pilha de protocolos da internet...',
      subject: 'Redes de Computadores',
      lastModified: new Date('2024-01-11')
    },
    {
      id: '6',
      type: 'flashcard',
      title: 'Redes - Protocolos',
      description: 'Protocolos de comunicação em redes',
      subject: 'Redes de Computadores',
      lastModified: new Date('2024-01-10')
    },
    {
      id: '7',
      type: 'subject',
      title: 'Projeto de Programação',
      description: 'Disciplina focada em desenvolvimento de software',
      lastModified: new Date('2024-01-09')
    },
    {
      id: '8',
      type: 'subject',
      title: 'Redes de Computadores',
      description: 'Estudo sobre arquiteturas e protocolos de rede',
      lastModified: new Date('2024-01-08')
    }
  ];

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }

    const filtered = allData.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase()) ||
      (item.subject && item.subject.toLowerCase().includes(query.toLowerCase()))
    );

    setResults(filtered);
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < results.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : results.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (results[selectedIndex]) {
            onResultClick(results[selectedIndex]);
            onClose();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose, onResultClick]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const getIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'note': return FileText;
      case 'flashcard': return Users;
      case 'exercise': return Hash;
      case 'subject': return Clock;
      default: return FileText;
    }
  };

  const getTypeLabel = (type: SearchResult['type']) => {
    switch (type) {
      case 'note': return 'Nota';
      case 'flashcard': return 'Flashcard';
      case 'exercise': return 'Exercício';
      case 'subject': return 'Disciplina';
      default: return 'Item';
    }
  };

  const getTypeColor = (type: SearchResult['type']) => {
    switch (type) {
      case 'note': return '#6366f1';
      case 'flashcard': return '#10b981';
      case 'exercise': return '#f59e0b';
      case 'subject': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-[10%] z-50">
      <div className="bg-white rounded-[16px] shadow-2xl w-[600px] max-h-[70vh] overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-3 p-6 border-b border-gray-200">
          <Search size={20} className="text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar notas, flashcards, exercícios..."
            className="flex-1 bg-transparent border-none outline-none font-['Alexandria:Regular',_sans-serif] font-normal text-[18px] text-[#202020] placeholder:text-gray-400"
            autoFocus
          />
          <kbd className="hidden md:inline-block px-2 py-1 text-xs text-gray-500 bg-gray-100 rounded">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto">
          {query.trim() === '' ? (
            <div className="p-8 text-center">
              <Search size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="font-['Alexandria:Regular',_sans-serif] font-normal text-[16px] text-gray-500">
                Digite para pesquisar em suas notas, flashcards e exercícios
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center">
              <p className="font-['Alexandria:Regular',_sans-serif] font-normal text-[16px] text-gray-500">
                Nenhum resultado encontrado para "{query}"
              </p>
            </div>
          ) : (
            <div className="py-2">
              {results.map((result, index) => {
                const Icon = getIcon(result.type);
                const isSelected = index === selectedIndex;

                return (
                  <button
                    key={result.id}
                    onClick={() => {
                      onResultClick(result);
                      onClose();
                    }}
                    className={`w-full px-6 py-4 flex items-start gap-4 text-left hover:bg-gray-50 transition-colors ${
                      isSelected ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                    }`}
                  >
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-1"
                      style={{ backgroundColor: `${getTypeColor(result.type)}20` }}
                    >
                      <Icon size={20} style={{ color: getTypeColor(result.type) }} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-['Alexandria:Medium',_sans-serif] font-medium text-[16px] text-[#202020] truncate">
                          {result.title}
                        </h3>
                        <span 
                          className="px-2 py-1 rounded text-white text-[11px] font-medium shrink-0"
                          style={{ backgroundColor: getTypeColor(result.type) }}
                        >
                          {getTypeLabel(result.type)}
                        </span>
                      </div>
                      
                      <p className="font-['Alexandria:Regular',_sans-serif] font-normal text-[14px] text-gray-600 line-clamp-2 mb-2">
                        {result.description}
                      </p>
                      
                      <div className="flex items-center gap-4 text-[12px] text-gray-500">
                        {result.subject && (
                          <span>{result.subject}</span>
                        )}
                        {result.lastModified && (
                          <span>
                            {result.lastModified.toLocaleDateString('pt-BR', {
                              day: 'numeric',
                              month: 'short'
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {results.length > 0 && (
          <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 text-center">
            <p className="font-['Alexandria:Regular',_sans-serif] font-normal text-[12px] text-gray-500">
              Use ↑↓ para navegar, Enter para abrir, ESC para fechar
            </p>
          </div>
        )}
      </div>
    </div>
  );
}