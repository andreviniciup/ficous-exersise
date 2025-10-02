import { useState, useRef, useCallback, KeyboardEvent, ChangeEvent, useEffect } from 'react';
import { Plus, Bold, Italic, List, Hash, Type, Quote, Code, ListOrdered } from 'lucide-react';

interface NotionStyleEditorProps {
  initialTitle?: string;
  initialContent?: string;
  disciplineColor: string;
  onSave: (title: string, content: string) => void;
  onCancel: () => void;
}

interface Block {
  id: string;
  type: 'title' | 'heading1' | 'heading2' | 'heading3' | 'paragraph' | 'bullet-list' | 'numbered-list' | 'quote' | 'code';
  content: string;
  placeholder?: string;
}

export function NotionStyleEditor({
  initialTitle = "",
  initialContent = "",
  disciplineColor,
  onSave,
  onCancel
}: NotionStyleEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [blocks, setBlocks] = useState<Block[]>([
    {
      id: '1',
      type: 'paragraph',
      content: initialContent,
      placeholder: 'Digite "/" para comandos ou comece a escrever...'
    }
  ]);
  const [showCommands, setShowCommands] = useState(false);
  const [commandPosition, setCommandPosition] = useState({ x: 0, y: 0 });
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [commandQuery, setCommandQuery] = useState('');
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0);

  const editorRef = useRef<HTMLDivElement>(null);

  const commands = [
    { icon: Type, label: 'Texto', description: 'Parágrafo simples', type: 'paragraph' as const },
    { icon: Hash, label: 'Título 1', description: 'Título grande', type: 'heading1' as const },
    { icon: Hash, label: 'Título 2', description: 'Título médio', type: 'heading2' as const },
    { icon: Hash, label: 'Título 3', description: 'Título pequeno', type: 'heading3' as const },
    { icon: List, label: 'Lista com marcadores', description: 'Lista não ordenada', type: 'bullet-list' as const },
    { icon: ListOrdered, label: 'Lista numerada', description: 'Lista ordenada', type: 'numbered-list' as const },
    { icon: Quote, label: 'Citação', description: 'Texto em destaque', type: 'quote' as const },
    { icon: Code, label: 'Código', description: 'Bloco de código', type: 'code' as const },
  ];

  const filteredCommands = commands.filter(cmd => 
    cmd.label.toLowerCase().includes(commandQuery.toLowerCase()) ||
    cmd.description.toLowerCase().includes(commandQuery.toLowerCase())
  );

  const addBlock = useCallback((afterId: string, type: Block['type'] = 'paragraph') => {
    const newBlock: Block = {
      id: Date.now().toString(),
      type,
      content: '',
      placeholder: type === 'paragraph' ? 'Digite "/" para comandos...' : getPlaceholder(type)
    };

    setBlocks(prev => {
      const index = prev.findIndex(block => block.id === afterId);
      const newBlocks = [...prev];
      newBlocks.splice(index + 1, 0, newBlock);
      return newBlocks;
    });

    // Focus no novo bloco
    setTimeout(() => {
      const element = document.querySelector(`[data-block-id="${newBlock.id}"]`) as HTMLElement;
      if (element) {
        element.focus();
      }
    }, 0);
  }, []);

  const updateBlock = useCallback((id: string, content: string) => {
    setBlocks(prev => prev.map(block => 
      block.id === id ? { ...block, content } : block
    ));
  }, []);

  const changeBlockType = useCallback((id: string, type: Block['type']) => {
    setBlocks(prev => prev.map(block => 
      block.id === id ? { ...block, type, placeholder: getPlaceholder(type) } : block
    ));
    setShowCommands(false);
    setCommandQuery('');
  }, []);

  const deleteBlock = useCallback((id: string) => {
    setBlocks(prev => {
      if (prev.length === 1) return prev; // Manter pelo menos um bloco
      return prev.filter(block => block.id !== id);
    });
  }, []);

  function getPlaceholder(type: Block['type']): string {
    switch (type) {
      case 'heading1': return 'Título 1';
      case 'heading2': return 'Título 2';
      case 'heading3': return 'Título 3';
      case 'bullet-list': return 'Lista com marcadores';
      case 'numbered-list': return 'Lista numerada';
      case 'quote': return 'Citação';
      case 'code': return 'Digite seu código aqui';
      default: return 'Digite "/" para comandos...';
    }
  }

  function getBlockStyle(type: Block['type']): string {
    const baseStyles = "w-full bg-transparent border-none outline-none resize-none font-['Alexandria:Regular',_sans-serif] min-h-[1.5em] placeholder:text-[#bebebe]";
    
    switch (type) {
      case 'heading1':
        return `${baseStyles} text-[32px] font-['Alexandria:Medium',_sans-serif] font-medium text-[#202020] leading-[1.2]`;
      case 'heading2':
        return `${baseStyles} text-[24px] font-['Alexandria:Medium',_sans-serif] font-medium text-[#202020] leading-[1.3]`;
      case 'heading3':
        return `${baseStyles} text-[20px] font-['Alexandria:Medium',_sans-serif] font-medium text-[#202020] leading-[1.4]`;
      case 'quote':
        return `${baseStyles} text-[16px] text-[#666666] italic border-l-4 border-gray-300 pl-4 leading-[1.6]`;
      case 'code':
        return `${baseStyles} text-[14px] font-mono bg-gray-100 p-3 rounded-md text-[#333333] leading-[1.5]`;
      case 'bullet-list':
      case 'numbered-list':
        return `${baseStyles} text-[16px] text-[#202020] leading-[1.6] ml-6`;
      default:
        return `${baseStyles} text-[16px] text-[#202020] leading-[1.6]`;
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>, blockId: string) => {
    const block = blocks.find(b => b.id === blockId);
    if (!block) return;

    if (showCommands) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedCommandIndex(prev => 
          prev < filteredCommands.length - 1 ? prev + 1 : 0
        );
        return;
      }
      
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedCommandIndex(prev => 
          prev > 0 ? prev - 1 : filteredCommands.length - 1
        );
        return;
      }
      
      if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands.length > 0) {
          changeBlockType(blockId, filteredCommands[selectedCommandIndex].type);
          updateBlock(blockId, '');
        }
        return;
      }
      
      if (e.key === 'Escape') {
        setShowCommands(false);
        setCommandQuery('');
        setSelectedCommandIndex(0);
        return;
      }
    } else {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        addBlock(blockId);
      }

      if (e.key === 'Backspace' && block.content === '') {
        e.preventDefault();
        if (blocks.length > 1) {
          const blockIndex = blocks.findIndex(b => b.id === blockId);
          deleteBlock(blockId);
          
          // Focus no bloco anterior
          if (blockIndex > 0) {
            setTimeout(() => {
              const prevBlock = blocks[blockIndex - 1];
              const element = document.querySelector(`[data-block-id="${prevBlock.id}"]`) as HTMLElement;
              if (element) {
                element.focus();
              }
            }, 0);
          }
        }
      }
    }
  };

  const handleInput = (e: ChangeEvent<HTMLTextAreaElement>, blockId: string) => {
    const value = e.target.value;
    updateBlock(blockId, value);

    // Auto-resize textarea
    const target = e.target as HTMLTextAreaElement;
    target.style.height = 'auto';
    target.style.height = target.scrollHeight + 'px';

    // Detectar comandos
    if (value.startsWith('/')) {
      const query = value.slice(1);
      setCommandQuery(query);
      setActiveBlockId(blockId);
      setShowCommands(true);
      setSelectedCommandIndex(0);
      
      // Posicionar menu de comandos
      const rect = e.target.getBoundingClientRect();
      setCommandPosition({
        x: rect.left,
        y: rect.bottom + 5
      });
    } else {
      setShowCommands(false);
      setCommandQuery('');
      setSelectedCommandIndex(0);
    }
  };

  const handleSave = () => {
    const content = blocks.map(block => {
      switch (block.type) {
        case 'heading1': return `# ${block.content}`;
        case 'heading2': return `## ${block.content}`;
        case 'heading3': return `### ${block.content}`;
        case 'bullet-list': return `- ${block.content}`;
        case 'numbered-list': return `1. ${block.content}`;
        case 'quote': return `> ${block.content}`;
        case 'code': return `\`\`\`\n${block.content}\n\`\`\``;
        default: return block.content;
      }
    }).join('\n\n');

    onSave(title, content);
  };

  return (
    <>
      <div className="absolute left-[61px] top-[280px] w-[1150px] h-[650px] bg-white rounded-[12px] border border-gray-200 shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <input
            type="text"
            placeholder="Título da nota"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-[28px] font-['Alexandria:Medium',_sans-serif] font-medium bg-transparent border-none outline-none text-[#202020] placeholder:text-[#bebebe] flex-1"
          />
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={!title.trim()}
              className="px-5 py-2 rounded-[8px] font-['Alexandria:Medium',_sans-serif] font-medium text-[14px] transition-colors disabled:opacity-50"
              style={{ 
                backgroundColor: title.trim() ? disciplineColor : '#e0e0e0',
                color: title.trim() ? 'white' : '#999999'
              }}
            >
              Salvar
            </button>
            <button
              onClick={onCancel}
              className="px-5 py-2 bg-gray-200 text-gray-700 rounded-[8px] font-['Alexandria:Medium',_sans-serif] font-medium text-[14px] hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>

        {/* Editor Area */}
        <div ref={editorRef} className="p-6 h-[calc(100%-100px)] overflow-y-auto">
          <div className="max-w-full space-y-2">
            {blocks.map((block, index) => (
              <div key={block.id} className="group relative">
                {/* Block Type Indicator */}
                <div className="absolute left-[-50px] top-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  <div className="w-5 h-5 rounded flex items-center justify-center text-gray-400">
                    {block.type === 'heading1' && <Hash size={14} />}
                    {block.type === 'heading2' && <Hash size={12} />}
                    {block.type === 'heading3' && <Hash size={10} />}
                    {block.type === 'bullet-list' && <List size={14} />}
                    {block.type === 'numbered-list' && <ListOrdered size={14} />}
                    {block.type === 'quote' && <Quote size={14} />}
                    {block.type === 'code' && <Code size={14} />}
                    {block.type === 'paragraph' && <Type size={14} />}
                  </div>
                  <button 
                    className="w-6 h-6 rounded flex items-center justify-center hover:bg-gray-100 text-gray-400"
                    onClick={() => addBlock(block.id)}
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {/* Lista com marcadores */}
                {block.type === 'bullet-list' && (
                  <div className="flex items-start">
                    <span className="text-[16px] text-[#202020] leading-[1.6] mr-2 mt-1">•</span>
                    <textarea
                      data-block-id={block.id}
                      value={block.content}
                      onChange={(e) => handleInput(e, block.id)}
                      onKeyDown={(e) => handleKeyDown(e, block.id)}
                      placeholder={block.placeholder}
                      className={getBlockStyle(block.type)}
                      rows={1}
                      style={{ height: 'auto' }}
                      onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = 'auto';
                        target.style.height = target.scrollHeight + 'px';
                      }}
                    />
                  </div>
                )}

                {/* Lista numerada */}
                {block.type === 'numbered-list' && (
                  <div className="flex items-start">
                    <span className="text-[16px] text-[#202020] leading-[1.6] mr-2 mt-1">{index + 1}.</span>
                    <textarea
                      data-block-id={block.id}
                      value={block.content}
                      onChange={(e) => handleInput(e, block.id)}
                      onKeyDown={(e) => handleKeyDown(e, block.id)}
                      placeholder={block.placeholder}
                      className={getBlockStyle(block.type)}
                      rows={1}
                      style={{ height: 'auto' }}
                      onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = 'auto';
                        target.style.height = target.scrollHeight + 'px';
                      }}
                    />
                  </div>
                )}

                {/* Outros tipos de bloco */}
                {!['bullet-list', 'numbered-list'].includes(block.type) && (
                  <textarea
                    data-block-id={block.id}
                    value={block.content}
                    onChange={(e) => handleInput(e, block.id)}
                    onKeyDown={(e) => handleKeyDown(e, block.id)}
                    placeholder={block.placeholder}
                    className={getBlockStyle(block.type)}
                    rows={1}
                    style={{ height: 'auto' }}
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = 'auto';
                      target.style.height = target.scrollHeight + 'px';
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Menu de Comandos */}
      {showCommands && (
        <div 
          className="fixed bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50 w-80"
          style={{ 
            left: commandPosition.x, 
            top: commandPosition.y,
            maxHeight: '300px',
            overflowY: 'auto'
          }}
        >
          <div className="px-3 py-2 text-[12px] text-gray-500 font-['Alexandria:Medium',_sans-serif] font-medium uppercase tracking-wide">
            Blocos básicos
          </div>
          {filteredCommands.map((command, index) => (
            <button
              key={command.type}
              onClick={() => {
                if (activeBlockId) {
                  changeBlockType(activeBlockId, command.type);
                  updateBlock(activeBlockId, '');
                }
              }}
              className={`w-full px-3 py-2 flex items-center gap-3 transition-colors ${
                index === selectedCommandIndex ? 'bg-blue-50 border-l-2 border-blue-500' : 'hover:bg-gray-50'
              }`}
            >
              <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
                <command.icon size={16} className="text-gray-600" />
              </div>
              <div className="text-left">
                <div className="font-['Alexandria:Medium',_sans-serif] font-medium text-[14px] text-[#202020]">
                  {command.label}
                </div>
                <div className="font-['Alexandria:Regular',_sans-serif] font-normal text-[12px] text-[#666666]">
                  {command.description}
                </div>
              </div>
            </button>
          ))}
          {filteredCommands.length === 0 && (
            <div className="px-3 py-4 text-[14px] text-gray-500 text-center">
              Nenhum comando encontrado
            </div>
          )}
        </div>
      )}
    </>
  );
}