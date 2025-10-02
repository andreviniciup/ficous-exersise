/**
 * Componente para integração com Sage (IA)
 */

import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { api, SageAnswerOut } from '../services/api';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Bot, MessageSquare, Lightbulb, BookOpen, Zap } from 'lucide-react';

interface SageIntegrationProps {
  className?: string;
}

export function SageIntegration({ className }: SageIntegrationProps) {
  const { notes, disciplines } = useData();
  
  const [prompt, setPrompt] = useState('');
  const [selectedNote, setSelectedNote] = useState<string>('');
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('');
  const [responseLevel, setResponseLevel] = useState<1 | 2 | 3>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<SageAnswerOut | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fazer pergunta ao Sage
  const handleAskSage = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await api.askSage({
        note_id: selectedNote || undefined,
        discipline_id: selectedDiscipline || undefined,
        prompt: prompt.trim(),
        level: responseLevel,
        normalize: true,
        output_language: 'pt-BR',
      });

      setResponse(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao processar pergunta');
    } finally {
      setIsLoading(false);
    }
  };

  // Renderizar resposta baseada no nível
  const renderResponse = (response: SageAnswerOut) => {
    switch (response.type) {
      case 'level1':
        return (
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center">
              <Zap className="h-5 w-5 mr-2 text-yellow-500" />
              Resposta Rápida
            </h3>
            <div className="space-y-2">
              {response.payload.balloons?.map((balloon: any, idx: number) => (
                <div key={idx} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm">{balloon.text}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'level2':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-blue-500" />
              Mini-aula
            </h3>
            <div className="space-y-4">
              {response.payload.slides?.map((slide: any, idx: number) => (
                <Card key={idx}>
                  <CardHeader>
                    <CardTitle className="text-base">{slide.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1">
                      {slide.bullets?.map((bullet: string, bulletIdx: number) => (
                        <li key={bulletIdx} className="text-sm flex items-start">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'level3':
        return (
          <div className="space-y-6">
            <h3 className="font-semibold text-lg flex items-center">
              <Lightbulb className="h-5 w-5 mr-2 text-purple-500" />
              Explicação Imersiva
            </h3>
            <div className="space-y-6">
              {response.payload.sections?.map((section: any, idx: number) => (
                <Card key={idx}>
                  <CardHeader>
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="prose max-w-none">
                      <p className="text-gray-700 leading-relaxed">{section.content}</p>
                    </div>
                    
                    {section.code && (
                      <div className="bg-gray-900 text-gray-100 p-4 rounded-lg">
                        <pre className="text-sm overflow-x-auto">
                          <code>{section.code}</code>
                        </pre>
                      </div>
                    )}
                    
                    {section.image_hint && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm text-blue-700">
                          <strong>Dica de imagem:</strong> {section.image_hint}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center text-gray-500">
            <p>Resposta não reconhecida</p>
          </div>
        );
    }
  };

  return (
    <div className={`h-full ${className}`}>
      <Tabs defaultValue="ask" className="h-full flex flex-col">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="ask">Fazer Pergunta</TabsTrigger>
          <TabsTrigger value="process">Processar Nota</TabsTrigger>
        </TabsList>

        <TabsContent value="ask" className="flex-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bot className="h-5 w-5 mr-2" />
                Pergunte ao Sage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Seleção de contexto */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Nota específica (opcional)</label>
                  <select
                    value={selectedNote}
                    onChange={(e) => setSelectedNote(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Selecionar nota...</option>
                    {notes.map(note => (
                      <option key={note.id} value={note.id}>
                        {note.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Disciplina (opcional)</label>
                  <select
                    value={selectedDiscipline}
                    onChange={(e) => setSelectedDiscipline(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Selecionar disciplina...</option>
                    {disciplines.map(discipline => (
                      <option key={discipline.id} value={discipline.id}>
                        {discipline.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Nível de resposta */}
              <div>
                <label className="text-sm font-medium mb-2 block">Nível de resposta</label>
                <div className="flex gap-2">
                  {[
                    { level: 1, label: 'Rápida', icon: Zap, color: 'yellow' },
                    { level: 2, label: 'Mini-aula', icon: BookOpen, color: 'blue' },
                    { level: 3, label: 'Imersiva', icon: Lightbulb, color: 'purple' },
                  ].map(({ level, label, icon: Icon, color }) => (
                    <Button
                      key={level}
                      variant={responseLevel === level ? 'default' : 'outline'}
                      onClick={() => setResponseLevel(level as 1 | 2 | 3)}
                      className={`flex-1 ${
                        responseLevel === level 
                          ? `bg-${color}-500 hover:bg-${color}-600` 
                          : ''
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-1" />
                      {label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Campo de pergunta */}
              <div>
                <label className="text-sm font-medium mb-2 block">Sua pergunta</label>
                <Textarea
                  placeholder="Digite sua pergunta aqui..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-20"
                />
              </div>

              {/* Botão de envio */}
              <Button 
                onClick={handleAskSage} 
                disabled={!prompt.trim() || isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processando...
                  </>
                ) : (
                  <>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Perguntar ao Sage
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Resposta */}
          {response && (
            <Card>
              <CardHeader>
                <CardTitle>Resposta do Sage</CardTitle>
              </CardHeader>
              <CardContent>
                {renderResponse(response)}
              </CardContent>
            </Card>
          )}

          {/* Erro */}
          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-4">
                <p className="text-red-700">{error}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="process" className="flex-1">
          <Card>
            <CardHeader>
              <CardTitle>Processar Nota com IA</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Selecione uma nota para processar com IA e extrair resumo, perguntas, conceitos e tags.
              </p>
              
              <div className="space-y-2">
                {notes.map(note => (
                  <div key={note.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{note.title}</h4>
                      <p className="text-sm text-gray-500">
                        {note.content.substring(0, 100)}...
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      Processar
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
