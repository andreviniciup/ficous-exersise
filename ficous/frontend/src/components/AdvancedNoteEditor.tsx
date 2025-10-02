/**
 * Editor Avançado de Notas
 * Baseado no SlateEditor do ficusAppv02, adaptado para Ficous
 */

import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { EditorToolbar } from './EditorToolbar';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Save, 
  Eye, 
  Edit, 
  Bot, 
  Lightbulb, 
  Tag,
  FileText,
  Download,
  Upload
} from 'lucide-react';

interface AdvancedNoteEditorProps {
  value?: any[];
  onChange?: (value: any[]) => void;
  mode?: 'edit' | 'view';
  onSave?: () => void;
  onToggleMode?: () => void;
  className?: string;
}

const INITIAL_VALUE = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
];

export function AdvancedNoteEditor({ 
  value, 
  onChange, 
  mode = 'edit',
  onSave,
  onToggleMode,
  className 
}: AdvancedNoteEditorProps) {
  const [editorValue, setEditorValue] = useState(INITIAL_VALUE);
  const [showPlaceholder, setShowPlaceholder] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Simular editor Slate (sem dependências externas)
  const editor = useMemo(() => ({
    children: editorValue,
    getMarks: () => ({}),
    addMark: (format: string, value: any) => {
      console.log(`Add mark: ${format} = ${value}`);
    },
    removeMark: (format: string) => {
      console.log(`Remove mark: ${format}`);
    },
    wrapBlock: (format: string) => {
      console.log(`Wrap block: ${format}`);
    },
    unwrapBlock: (format: string) => {
      console.log(`Unwrap block: ${format}`);
    }
  }), [editorValue]);

  // Atualizar valor do editor
  useEffect(() => {
    if (value && Array.isArray(value)) {
      setEditorValue(value);
    }
  }, [value]);

  // Detectar mudanças
  useEffect(() => {
    setHasChanges(JSON.stringify(editorValue) !== JSON.stringify(value));
  }, [editorValue, value]);

  const handleChange = (newValue: any[]) => {
    setEditorValue(newValue);
    onChange?.(newValue);
  };

  const renderElement = useCallback((props: any) => {
    const { attributes, children, element } = props;

    const baseStyles = "break-words relative leading-[1.5]";

    const LineWrapper = ({ children }: { children: React.ReactNode }) => (
      <div className="relative">
        <span className="relative">{children}</span>
      </div>
    );

    const wrapLines = (content: any) => {
      if (typeof content === 'string') {
        return content.split('\n').map((line: string, i: number) => (
          <LineWrapper key={i}>{line}</LineWrapper>
        ));
      }
      return <LineWrapper>{content}</LineWrapper>;
    };

    switch (element.type) {
      case 'heading-one':
        return <h1 {...attributes} className={`text-2xl font-bold ${baseStyles}`}>{wrapLines(children)}</h1>;
      case 'heading-two':
        return <h2 {...attributes} className={`text-xl font-bold ${baseStyles}`}>{wrapLines(children)}</h2>;
      case 'bulleted-list':
        return <ul {...attributes} className={`list-disc ml-6 ${baseStyles}`}>{wrapLines(children)}</ul>;
      case 'numbered-list':
        return <ol {...attributes} className={`list-decimal ml-6 ${baseStyles}`}>{wrapLines(children)}</ol>;
      case 'list-item':
        return <li {...attributes} className={baseStyles}>{wrapLines(children)}</li>;
      case 'block-quote':
        return <blockquote {...attributes} className={`border-l-4 border-gray-300 pl-4 italic ${baseStyles}`}>{wrapLines(children)}</blockquote>;
      case 'code':
        return <pre {...attributes} className={`bg-gray-100 p-2 rounded font-mono text-sm ${baseStyles}`}>{wrapLines(children)}</pre>;
      default:
        return (
          <p {...attributes} className={baseStyles} style={{ margin: 0 }}>
            {wrapLines(children)}
          </p>
        );
    }
  }, []);

  const renderLeaf = useCallback((props: any) => {
    let { attributes, children, leaf } = props;

    if (leaf.bold) {
      children = <strong>{children}</strong>;
    }
    if (leaf.italic) {
      children = <em>{children}</em>;
    }
    if (leaf.underline) {
      children = <u>{children}</u>;
    }
    if (leaf.code) {
      children = <code className="bg-gray-100 px-1 rounded text-sm">{children}</code>;
    }

    return <span {...attributes}>{children}</span>;
  }, []);

  const renderContent = () => {
    if (mode === 'view') {
      return (
        <div className="h-full overflow-y-auto">
          <div className="prose max-w-none">
            {editorValue.map((node, index) => (
              <div key={index}>
                {renderElement({
                  attributes: {},
                  children: node.children?.map((child: any, childIndex: number) => (
                    <span key={childIndex}>{child.text}</span>
                  )) || [],
                  element: node
                })}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="h-full flex flex-col">
        <EditorToolbar editor={editor} />
        
        <div 
          className="flex-1 relative max-w-[750px] border border-gray-200 rounded-b-md"
          onMouseEnter={() => setShowPlaceholder(true)}
          onMouseLeave={() => setShowPlaceholder(false)}
        >
          <div
            className="h-full text-neutral-800 text-base font-normal font-['Alexandria'] outline-none px-4 py-2 break-words whitespace-pre-wrap min-h-[400px]"
            contentEditable
            suppressContentEditableWarning
            onInput={(e) => {
              const newValue = [{
                type: 'paragraph',
                children: [{ text: e.currentTarget.textContent || '' }],
              }];
              handleChange(newValue);
            }}
            style={{ 
              pointerEvents: mode === 'edit' ? 'auto' : 'none',
            }}
          >
            {editorValue.map((node, index) => (
              <div key={index}>
                {renderElement({
                  attributes: {},
                  children: node.children?.map((child: any, childIndex: number) => (
                    <span key={childIndex}>{child.text}</span>
                  )) || [],
                  element: node
                })}
              </div>
            ))}
          </div>
          
          {showPlaceholder && !editorValue[0]?.children?.[0]?.text && (
            <div className="absolute top-2 left-4 text-gray-400 pointer-events-none">
              Digite seu texto aqui...
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`advanced-note-editor h-full ${className}`}>
      {/* Cabeçalho com controles */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Editor Avançado</h3>
          {hasChanges && (
            <Badge variant="outline" className="text-orange-600 border-orange-200">
              Modificado
            </Badge>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleMode}
          >
            {mode === 'edit' ? <Eye className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
            {mode === 'edit' ? 'Visualizar' : 'Editar'}
          </Button>
          
          {mode === 'edit' && onSave && (
            <Button
              onClick={onSave}
              size="sm"
              disabled={!hasChanges}
            >
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
          )}
        </div>
      </div>

      {/* Área do editor */}
      <div className="w-full h-[calc(100%-80px)]">
        {renderContent()}
      </div>

      {/* Barra de ferramentas inferior */}
      {mode === 'edit' && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                <Bot className="h-4 w-4 mr-2" />
                IA Assistente
              </Button>
              <Button variant="ghost" size="sm">
                <Lightbulb className="h-4 w-4 mr-2" />
                Extrair Conceitos
              </Button>
              <Button variant="ghost" size="sm">
                <Tag className="h-4 w-4 mr-2" />
                Gerar Tags
              </Button>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{editorValue[0]?.children?.[0]?.text?.length || 0} caracteres</span>
              <span>•</span>
              <span>{editorValue.length} parágrafos</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
