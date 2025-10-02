/**
 * Editor de Notas - Componente principal para edição de notas
 * Baseado no ContentDetails do ficusAppv02, adaptado para Ficous
 */

import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { Note } from '../services/api';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Save, 
  Edit, 
  Eye, 
  Trash2, 
  Tag, 
  Lightbulb, 
  FileText, 
  Bot,
  Download,
  Upload
} from 'lucide-react';

interface NoteEditorProps {
  noteId?: string;
  className?: string;
}

const INITIAL_VALUE = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
];

export function NoteEditor({ noteId, className }: NoteEditorProps) {
  const { 
    notes, 
    notesLoading, 
    createNote, 
    updateNote, 
    deleteNote,
    disciplines,
    error,
    setError 
  } = useData();

  const { user } = useAuth();
  
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'edit' | 'view'>('edit');
  const [editorValue, setEditorValue] = useState(INITIAL_VALUE);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Estados do formulário
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    discipline_id: '',
  });

  // Carregar nota se noteId for fornecido
  useEffect(() => {
    if (noteId) {
      const foundNote = notes.find(n => n.id === noteId);
      if (foundNote) {
        setNote(foundNote);
        setFormData({
          title: foundNote.title,
          content: foundNote.content,
          discipline_id: foundNote.discipline_id || '',
        });
        
        // Parsear conteúdo para editor
        if (foundNote.content) {
          try {
            const parsedContent = JSON.parse(foundNote.content);
            setEditorValue(Array.isArray(parsedContent) ? parsedContent : INITIAL_VALUE);
          } catch (e) {
            // Se não for JSON, usar como texto simples
            setEditorValue([{
              type: 'paragraph',
              children: [{ text: foundNote.content }],
            }]);
          }
        }
      }
    }
  }, [noteId, notes]);

  // Detectar mudanças
  useEffect(() => {
    if (note) {
      const hasFormChanges = 
        formData.title !== note.title ||
        formData.content !== note.content ||
        formData.discipline_id !== (note.discipline_id || '');
      
      setHasChanges(hasFormChanges);
    }
  }, [formData, note]);

  // Salvar nota
  const handleSave = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Título e conteúdo são obrigatórios');
      return;
    }

    setIsSaving(true);
    try {
      if (note) {
        // Atualizar nota existente
        const updatedNote = await updateNote(note.id, {
          title: formData.title,
          content: formData.content,
          discipline_id: formData.discipline_id || undefined,
        });
        setNote(updatedNote);
        setHasChanges(false);
      } else {
        // Criar nova nota
        const newNote = await createNote({
          title: formData.title,
          content: formData.content,
          discipline_id: formData.discipline_id || undefined,
        });
        setNote(newNote);
        setHasChanges(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar nota');
    } finally {
      setIsSaving(false);
    }
  };

  // Deletar nota
  const handleDelete = async () => {
    if (!note) return;
    
    if (confirm('Tem certeza que deseja deletar esta nota?')) {
      try {
        await deleteNote(note.id);
        setNote(null);
        setFormData({ title: '', content: '', discipline_id: '' });
        setEditorValue(INITIAL_VALUE);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao deletar nota');
      }
    }
  };

  // Alternar modo
  const toggleMode = () => {
    setMode(mode === 'edit' ? 'view' : 'edit');
  };

  // Renderizar tags
  const renderTags = () => {
    const tags = note?.tags_json || [];
    const concepts = note?.concepts_json || [];
    
    return (
      <div className="flex flex-wrap gap-1.5">
        {concepts.map((concept, index) => (
          <Badge 
            key={`concept-${index}`}
            variant="secondary"
            className="bg-blue-100 text-blue-700 border-blue-200"
          >
            <Lightbulb className="h-3 w-3 mr-1" />
            {concept}
          </Badge>
        ))}
        {tags.map((tag, index) => (
          <Badge 
            key={`tag-${index}`}
            variant="outline"
            className="bg-gray-100 text-gray-700 border-gray-200"
          >
            <Tag className="h-3 w-3 mr-1" />
            {tag}
          </Badge>
        ))}
      </div>
    );
  };

  if (notesLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando nota...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex h-full bg-white ${className}`}>
      <main className="flex-1 overflow-hidden">
        <div className="h-full p-8">
          {/* Cabeçalho com título e controles */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                {mode === 'edit' ? (
                  <Input
                    placeholder="Título da nota"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="text-2xl font-bold border-none shadow-none p-0 h-auto"
                  />
                ) : (
                  <h1 className="text-neutral-800 text-[40px] font-medium font-['Alexandria'] capitalize">
                    {note?.title || 'Nova Nota'}
                  </h1>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleMode}
                >
                  {mode === 'edit' ? <Eye className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
                  {mode === 'edit' ? 'Visualizar' : 'Editar'}
                </Button>
                
                {mode === 'edit' && (
                  <Button
                    onClick={handleSave}
                    disabled={!hasChanges || isSaving}
                    size="sm"
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Salvar
                      </>
                    )}
                  </Button>
                )}
                
                {note && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDelete}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Deletar
                  </Button>
                )}
              </div>
            </div>

            {/* Tags e conceitos */}
            {note && (note.tags_json?.length > 0 || note.concepts_json?.length > 0) && (
              <div className="mb-4">
                {renderTags()}
              </div>
            )}

            {/* Seletor de disciplina */}
            {mode === 'edit' && (
              <div className="mb-4">
                <select
                  value={formData.discipline_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, discipline_id: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Selecionar disciplina (opcional)</option>
                  {disciplines.map(discipline => (
                    <option key={discipline.id} value={discipline.id}>
                      {discipline.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Área do editor */}
          <div className="w-full h-[calc(100%-200px)]">
            <div className="relative h-full">
              {mode === 'edit' ? (
                <Tabs defaultValue="text" className="h-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="text">Texto</TabsTrigger>
                    <TabsTrigger value="markdown">Markdown</TabsTrigger>
                    <TabsTrigger value="ai">IA Assistente</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="text" className="h-full mt-4">
                    <Textarea
                      placeholder="Digite seu conteúdo aqui..."
                      value={formData.content}
                      onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                      className="h-full min-h-[400px] resize-none"
                    />
                  </TabsContent>
                  
                  <TabsContent value="markdown" className="h-full mt-4">
                    <div className="grid grid-cols-2 gap-4 h-full">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Markdown</label>
                        <Textarea
                          placeholder="Digite em Markdown..."
                          value={formData.content}
                          onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                          className="h-full min-h-[400px] resize-none font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Preview</label>
                        <div className="h-full min-h-[400px] p-4 border border-gray-300 rounded-md bg-gray-50 overflow-y-auto">
                          <div className="prose max-w-none">
                            {formData.content}
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="ai" className="h-full mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Bot className="h-5 w-5 mr-2" />
                          Assistente IA
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="p-4 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-700">
                              Use o Sage para processar e melhorar seu conteúdo automaticamente.
                            </p>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <Button variant="outline" className="h-20">
                              <Lightbulb className="h-4 w-4 mr-2" />
                              Extrair Conceitos
                            </Button>
                            <Button variant="outline" className="h-20">
                              <Tag className="h-4 w-4 mr-2" />
                              Gerar Tags
                            </Button>
                            <Button variant="outline" className="h-20">
                              <FileText className="h-4 w-4 mr-2" />
                              Resumir
                            </Button>
                            <Button variant="outline" className="h-20">
                              <Bot className="h-4 w-4 mr-2" />
                              Melhorar Texto
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              ) : (
                // Modo visualização
                <div className="h-full overflow-y-auto">
                  <div className="prose max-w-none">
                    <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                      {note?.content || 'Nenhum conteúdo disponível'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Mensagem de erro */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
          <button 
            onClick={() => setError(null)}
            className="ml-2 text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
