/**
 * Toolbar para o editor de notas
 * Baseado no Toolbar do ficusAppv02, adaptado para Ficous
 */

import React from 'react';
import { Button } from './ui/button';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Quote,
  Heading1,
  Heading2,
  Code,
  Link,
  Image,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react';

interface EditorToolbarProps {
  editor?: any;
  className?: string;
}

export function EditorToolbar({ editor, className }: EditorToolbarProps) {
  const isMarkActive = (format: string) => {
    if (!editor) return false;
    const marks = editor.getMarks();
    return marks ? marks[format] === true : false;
  };

  const isBlockActive = (format: string) => {
    if (!editor) return false;
    const { selection } = editor;
    if (!selection) return false;
    
    const [match] = editor.getMarks() || [];
    return match ? match.type === format : false;
  };

  const toggleMark = (format: string) => {
    if (!editor) return;
    
    const isActive = isMarkActive(format);
    if (isActive) {
      editor.removeMark(format);
    } else {
      editor.addMark(format, true);
    }
  };

  const toggleBlock = (format: string) => {
    if (!editor) return;
    
    const isActive = isBlockActive(format);
    if (isActive) {
      editor.unwrapBlock(format);
    } else {
      editor.wrapBlock(format);
    }
  };

  const toolbarItems = [
    {
      type: 'mark',
      format: 'bold',
      icon: Bold,
      label: 'Negrito',
      shortcut: 'Ctrl+B'
    },
    {
      type: 'mark',
      format: 'italic',
      icon: Italic,
      label: 'Itálico',
      shortcut: 'Ctrl+I'
    },
    {
      type: 'mark',
      format: 'underline',
      icon: Underline,
      label: 'Sublinhado',
      shortcut: 'Ctrl+U'
    },
    {
      type: 'separator'
    },
    {
      type: 'block',
      format: 'heading-one',
      icon: Heading1,
      label: 'Título 1',
      shortcut: 'Ctrl+1'
    },
    {
      type: 'block',
      format: 'heading-two',
      icon: Heading2,
      label: 'Título 2',
      shortcut: 'Ctrl+2'
    },
    {
      type: 'separator'
    },
    {
      type: 'block',
      format: 'bulleted-list',
      icon: List,
      label: 'Lista com marcadores',
      shortcut: 'Ctrl+Shift+8'
    },
    {
      type: 'block',
      format: 'numbered-list',
      icon: ListOrdered,
      label: 'Lista numerada',
      shortcut: 'Ctrl+Shift+7'
    },
    {
      type: 'block',
      format: 'block-quote',
      icon: Quote,
      label: 'Citação',
      shortcut: 'Ctrl+Shift+>'
    },
    {
      type: 'separator'
    },
    {
      type: 'block',
      format: 'code',
      icon: Code,
      label: 'Código',
      shortcut: 'Ctrl+`'
    },
    {
      type: 'action',
      action: 'link',
      icon: Link,
      label: 'Link',
      shortcut: 'Ctrl+K'
    },
    {
      type: 'action',
      action: 'image',
      icon: Image,
      label: 'Imagem',
      shortcut: 'Ctrl+Shift+I'
    },
    {
      type: 'separator'
    },
    {
      type: 'action',
      action: 'align-left',
      icon: AlignLeft,
      label: 'Alinhar à esquerda'
    },
    {
      type: 'action',
      action: 'align-center',
      icon: AlignCenter,
      label: 'Centralizar'
    },
    {
      type: 'action',
      action: 'align-right',
      icon: AlignRight,
      label: 'Alinhar à direita'
    }
  ];

  const handleAction = (item: any) => {
    if (item.type === 'mark') {
      toggleMark(item.format);
    } else if (item.type === 'block') {
      toggleBlock(item.format);
    } else if (item.type === 'action') {
      // Implementar ações específicas
      console.log(`Ação: ${item.action}`);
    }
  };

  return (
    <div className={`flex items-center gap-1 p-2 border-b border-gray-200 bg-gray-50 ${className}`}>
      {toolbarItems.map((item, index) => {
        if (item.type === 'separator') {
          return (
            <div key={index} className="w-px h-6 bg-gray-300 mx-1" />
          );
        }

        const Icon = item.icon;
        const isActive = item.type === 'mark' 
          ? isMarkActive(item.format)
          : item.type === 'block' 
          ? isBlockActive(item.format)
          : false;

        return (
          <Button
            key={index}
            variant={isActive ? "default" : "ghost"}
            size="sm"
            onClick={() => handleAction(item)}
            title={`${item.label} (${item.shortcut})`}
            className={`h-8 w-8 p-0 ${isActive ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
          >
            <Icon className="h-4 w-4" />
          </Button>
        );
      })}
    </div>
  );
}
