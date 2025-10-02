import { useState } from 'react';
import { X, Palette, BookOpen } from 'lucide-react';

interface CreateSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateSubject: (subject: { name: string; color: string; description: string; semester: string; professor: string; credits: number }) => void;
}

export function CreateSubjectModal({ isOpen, onClose, onCreateSubject }: CreateSubjectModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [semester, setSemester] = useState('');
  const [professor, setProfessor] = useState('');
  const [credits, setCredits] = useState(4);
  const [selectedColor, setSelectedColor] = useState('#6366f1');

  const colors = [
    '#6366f1', // Azul
    '#10b981', // Verde
    '#f59e0b', // Amarelo
    '#ef4444', // Vermelho
    '#8b5cf6', // Roxo
    '#06b6d4', // Ciano
    '#f97316', // Laranja
    '#84cc16', // Verde Lima
    '#ec4899', // Rosa
    '#64748b', // Cinza
    '#c89558', // Marrom
    '#9cbe7a', // Verde Musgo
    '#91acc5', // Azul Acinzentado
    '#ab2c32'  // Vermelho Escuro
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (name.trim()) {
      onCreateSubject({
        name: name.trim(),
        color: selectedColor,
        description: description.trim(),
        semester: semester.trim(),
        professor: professor.trim(),
        credits
      });
      
      // Reset form
      setName('');
      setDescription('');
      setSemester('');
      setProfessor('');
      setCredits(4);
      setSelectedColor('#6366f1');
      
      onClose();
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setName('');
    setDescription('');
    setSemester('');
    setProfessor('');
    setCredits(4);
    setSelectedColor('#6366f1');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-[16px] shadow-2xl w-[600px] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${selectedColor}20` }}
            >
              <BookOpen size={20} style={{ color: selectedColor }} />
            </div>
            <h2 className="font-['Alexandria:Medium',_sans-serif] font-medium text-[24px] text-[#202020]">
              Nova Disciplina
            </h2>
          </div>
          
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Nome da Disciplina */}
          <div>
            <label className="block font-['Alexandria:Medium',_sans-serif] font-medium text-[16px] text-[#202020] mb-2">
              Nome da Disciplina *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Algoritmos e Estruturas de Dados"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg font-['Alexandria:Regular',_sans-serif] font-normal text-[16px] focus:border-[#6366f1] focus:outline-none transition-colors"
              required
            />
          </div>

          {/* Cor da Disciplina */}
          <div>
            <label className="block font-['Alexandria:Medium',_sans-serif] font-medium text-[16px] text-[#202020] mb-3">
              Cor da Disciplina
            </label>
            <div className="flex items-center gap-3 mb-4">
              <Palette size={20} className="text-gray-600" />
              <div 
                className="w-8 h-8 rounded-lg border-2 border-gray-200"
                style={{ backgroundColor: selectedColor }}
              />
              <span className="font-['Alexandria:Regular',_sans-serif] font-normal text-[14px] text-gray-600">
                Esta cor será usada nos cabeçalhos e identificação da disciplina
              </span>
            </div>
            
            <div className="grid grid-cols-7 gap-3">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`w-10 h-10 rounded-lg border-2 transition-all hover:scale-110 ${
                    selectedColor === color 
                      ? 'border-gray-400 scale-110' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label className="block font-['Alexandria:Medium',_sans-serif] font-medium text-[16px] text-[#202020] mb-2">
              Descrição
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva brevemente o conteúdo desta disciplina..."
              className="w-full h-24 px-4 py-3 border border-gray-200 rounded-lg font-['Alexandria:Regular',_sans-serif] font-normal text-[16px] resize-none focus:border-[#6366f1] focus:outline-none transition-colors"
            />
          </div>

          {/* Informações Adicionais */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-['Alexandria:Medium',_sans-serif] font-medium text-[16px] text-[#202020] mb-2">
                Semestre
              </label>
              <input
                type="text"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                placeholder="Ex: 2024.1"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg font-['Alexandria:Regular',_sans-serif] font-normal text-[16px] focus:border-[#6366f1] focus:outline-none transition-colors"
              />
            </div>
            
            <div>
              <label className="block font-['Alexandria:Medium',_sans-serif] font-medium text-[16px] text-[#202020] mb-2">
                Créditos
              </label>
              <input
                type="number"
                min="1"
                max="12"
                value={credits}
                onChange={(e) => setCredits(parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg font-['Alexandria:Regular',_sans-serif] font-normal text-[16px] focus:border-[#6366f1] focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Professor */}
          <div>
            <label className="block font-['Alexandria:Medium',_sans-serif] font-medium text-[16px] text-[#202020] mb-2">
              Professor(a)
            </label>
            <input
              type="text"
              value={professor}
              onChange={(e) => setProfessor(e.target.value)}
              placeholder="Nome do professor responsável"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg font-['Alexandria:Regular',_sans-serif] font-normal text-[16px] focus:border-[#6366f1] focus:outline-none transition-colors"
            />
          </div>

          {/* Preview Card */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <h3 className="font-['Alexandria:Medium',_sans-serif] font-medium text-[14px] text-[#202020] mb-3">
              Prévia da Disciplina
            </h3>
            
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div 
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: selectedColor }}
                />
                <span className="font-['Alexandria:Medium',_sans-serif] font-medium text-[14px] text-[#202020]">
                  {name || 'Nome da Disciplina'}
                </span>
              </div>
              
              {description && (
                <p className="font-['Alexandria:Regular',_sans-serif] font-normal text-[12px] text-gray-600 mb-2">
                  {description}
                </p>
              )}
              
              <div className="flex items-center gap-4 text-[11px] text-gray-500">
                {semester && <span>{semester}</span>}
                <span>{credits} créditos</span>
                {professor && <span>Prof. {professor}</span>}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-['Alexandria:Medium',_sans-serif] font-medium text-[16px] hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-6 py-3 text-white rounded-lg font-['Alexandria:Medium',_sans-serif] font-medium text-[16px] transition-colors disabled:opacity-50"
              style={{ 
                backgroundColor: name.trim() ? selectedColor : '#e0e0e0',
                cursor: name.trim() ? 'pointer' : 'not-allowed'
              }}
            >
              Criar Disciplina
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}