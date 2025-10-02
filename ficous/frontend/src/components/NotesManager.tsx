/**
 * Componente para gerenciar notas
 */

import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { Note } from '../services/api';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { NoteEditor } from './NoteEditor';
import { AdvancedNoteEditor } from './AdvancedNoteEditor';
import { Plus, Edit, Trash2, FileText, Tag, Lightbulb, Settings, Bot } from 'lucide-react';

interface NotesManagerProps {
  className?: string;
}

export function NotesManager({ className }: NotesManagerProps) {
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

  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editorMode, setEditorMode] = useState<'simple' | 'advanced'>('simple');
  const [editorValue, setEditorValue] = useState<any[]>([]);

  // Estados do formulário
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    discipline_id: '',
  });

  // Filtrar notas por termo de busca
  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Resetar formulário
  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      discipline_id: '',
    });
    setIsEditing(false);
    setIsCreating(false);
    setSelectedNote(null);
    setEditorValue([]);
  };

  // Salvar nota
  const handleSave = async () => {
    try {
      if (isCreating) {
        await createNote({
          title: formData.title,
          content: formData.content,
          discipline_id: formData.discipline_id || undefined,
        });
      } else if (selectedNote && isEditing) {
        await updateNote(selectedNote.id, {
          title: formData.title,
          content: formData.content,
          discipline_id: formData.discipline_id || undefined,
        });
      }
      resetForm();
    } catch (err) {
      console.error('Erro ao salvar nota:', err);
    }
  };

  // Editar nota
  const handleEdit = (note: Note) => {
    setSelectedNote(note);
    setFormData({
      title: note.title,
      content: note.content,
      discipline_id: note.discipline_id || '',
    });
    setIsEditing(true);
    setIsCreating(false);
  };

  // Deletar nota
  const handleDelete = async (noteId: string) => {
    if (confirm('Tem certeza que deseja deletar esta nota?')) {
      try {
        await deleteNote(noteId);
        if (selectedNote?.id === noteId) {
          resetForm();
        }
      } catch (err) {
        console.error('Erro ao deletar nota:', err);
      }
    }
  };

  // Criar nova nota
  const handleCreate = () => {
    resetForm();
    setIsCreating(true);
    setSelectedNote(null);
  };

  // Selecionar nota para visualização
  const handleSelectNote = (note: Note) => {
    setSelectedNote(note);
    setIsEditing(false);
    setIsCreating(false);
  };

  if (notesLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando notas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-full flex ${className}`}>
      {/* Lista de notas */}
      <div className="w-1/3 border-r border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Notas</h2>
          <Button onClick={handleCreate} size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Nova
          </Button>
        </div>

        {/* Busca */}
        <Input
          placeholder="Buscar notas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />

        {/* Lista de notas */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredNotes.map((note) => (
            <Card 
              key={note.id} 
              className={`cursor-pointer transition-colors ${
                selectedNote?.id === note.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
              }`}
              onClick={() => handleSelectNote(note)}
            >
              <CardContent className="p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">{note.title}</h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {note.content.substring(0, 100)}...
                    </p>
                    {note.concepts_json && note.concepts_json.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {note.concepts_json.slice(0, 2).map((concept, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            <Lightbulb className="h-3 w-3 mr-1" />
                            {concept}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1 ml-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(note);
                      }}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(note.id);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Editor de notas */}
      <div className="flex-1 p-4">
        {selectedNote && !isEditing && !isCreating ? (
          // Visualização da nota
          <div className="h-full">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">{selectedNote.title}</h1>
              <div className="flex gap-2">
                <Button onClick={() => handleEdit(selectedNote)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <Button variant="outline" onClick={() => setEditorMode(editorMode === 'simple' ? 'advanced' : 'simple')}>
                  <Settings className="h-4 w-4 mr-2" />
                  {editorMode === 'simple' ? 'Editor Avançado' : 'Editor Simples'}
                </Button>
              </div>
            </div>
            
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                {selectedNote.content}
              </div>
            </div>

            {/* Metadados da nota */}
            {(selectedNote.concepts_json?.length > 0 || selectedNote.tags_json?.length > 0) && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                {selectedNote.concepts_json && selectedNote.concepts_json.length > 0 && (
                  <div className="mb-3">
                    <h4 className="font-medium text-sm text-gray-700 mb-2 flex items-center">
                      <Lightbulb className="h-4 w-4 mr-1" />
                      Conceitos
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedNote.concepts_json.map((concept, idx) => (
                        <Badge key={idx} variant="outline">
                          {concept}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedNote.tags_json && selectedNote.tags_json.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-2 flex items-center">
                      <Tag className="h-4 w-4 mr-1" />
                      Tags
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedNote.tags_json.map((tag, idx) => (
                        <Badge key={idx} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          // Editor de notas
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">
                {isCreating ? 'Nova Nota' : 'Editar Nota'}
              </h1>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setEditorMode(editorMode === 'simple' ? 'advanced' : 'simple')}>
                  <Settings className="h-4 w-4 mr-2" />
                  {editorMode === 'simple' ? 'Editor Avançado' : 'Editor Simples'}
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
                <Button onClick={handleSave}>
                  Salvar
                </Button>
              </div>
            </div>

            {editorMode === 'simple' ? (
              // Editor simples
              <div className="flex-1 space-y-4">
                <Input
                  placeholder="Título da nota"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />

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

                <Textarea
                  placeholder="Conteúdo da nota..."
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  className="flex-1 min-h-96"
                />
              </div>
            ) : (
              // Editor avançado
              <div className="flex-1">
                <Tabs defaultValue="content" className="h-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="content">Conteúdo</TabsTrigger>
                    <TabsTrigger value="advanced">Editor Avançado</TabsTrigger>
                    <TabsTrigger value="ai">IA Assistente</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="content" className="h-full mt-4">
                    <div className="space-y-4 h-full">
                      <Input
                        placeholder="Título da nota"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      />

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

                      <Textarea
                        placeholder="Conteúdo da nota..."
                        value={formData.content}
                        onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                        className="flex-1 min-h-96"
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="advanced" className="h-full mt-4">
                    <AdvancedNoteEditor
                      value={editorValue}
                      onChange={setEditorValue}
                      mode="edit"
                      onSave={handleSave}
                      className="h-full"
                    />
                  </TabsContent>
                  
                  <TabsContent value="ai" className="h-full mt-4">
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center">
                        <Bot className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <h3 className="text-lg font-semibold mb-2">IA Assistente</h3>
                        <p className="text-gray-600 mb-4">
                          Use o Sage para processar e melhorar seu conteúdo
                        </p>
                        <Button>
                          <Bot className="h-4 w-4 mr-2" />
                          Abrir Sage
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        )}
      </div>

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
