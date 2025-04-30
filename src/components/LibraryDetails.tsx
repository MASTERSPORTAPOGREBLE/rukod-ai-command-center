
import React from 'react';
import { Library } from '../models/types';
import { useTheme } from '../context/ThemeContext';
import { X, Download, Star, Code, Calendar, Globe, Package, Tag, ArrowRight, FileCode } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { getRelatedLibraries } from '../data/mockLibraries';
import { toast } from 'sonner';

interface LibraryDetailsProps {
  library: Library;
  onClose: () => void;
  onInstall: (library: Library) => void;
}

export const LibraryDetails: React.FC<LibraryDetailsProps> = ({ library, onClose, onInstall }) => {
  const { currentTheme } = useTheme();
  const relatedLibraries = getRelatedLibraries(library.id, 3);
  
  const languageColors = {
    python: { bg: '#3776AB', text: 'white' },
    cpp: { bg: '#00599C', text: 'white' },
    lua: { bg: '#00007C', text: 'white' },
    javascript: { bg: '#F7DF1E', text: 'black' },
    rust: { bg: '#DEA584', text: 'black' },
    ruby: { bg: '#CC342D', text: 'white' },
  };
  
  const languageColor = languageColors[library.language as keyof typeof languageColors];
  
  const handleViewDocs = () => {
    toast.info(`Открытие документации для ${library.name}...`);
    // In a real application, this would open documentation
  };
  
  const handleViewSource = () => {
    toast.info(`Открытие исходного кода для ${library.name}...`);
    // In a real application, this would open source repository
  };
  
  const handleCreateExample = () => {
    toast.info(`Создание примера проекта с использованием ${library.name}...`);
    // In a real application, this would create a sample project
  };
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-slate-900 border border-slate-700 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6"
        onClick={e => e.stopPropagation()}
        style={{ color: currentTheme.textColor }}
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-1" style={{ color: currentTheme.primaryColor }}>
              {library.name}
            </h2>
            <div className="flex items-center">
              <span 
                className="text-xs px-2 py-1 rounded mr-2" 
                style={{ backgroundColor: languageColor.bg, color: languageColor.text }}
              >
                {library.language}
              </span>
              
              <span className="text-yellow-400 flex items-center">
                <Star className="h-3.5 w-3.5 fill-yellow-400 mr-1" />
                {library.popularity.toFixed(1)}
              </span>
              
              {library.isPaid && (
                <Badge variant="outline" className="ml-2 border-amber-500 text-amber-400">
                  Платная
                </Badge>
              )}
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="mb-6">
          <p className="text-slate-300 mb-4">{library.description}</p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <Code className="h-4 w-4 mr-2 text-slate-400" />
              <span className="text-sm">Версия: {library.version}</span>
            </div>
            <div className="flex items-center">
              <Globe className="h-4 w-4 mr-2 text-slate-400" />
              <span className="text-sm">Источник: {library.source}</span>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-md font-semibold mb-2">Теги</h3>
          <div className="flex flex-wrap gap-2">
            {library.tags?.map(tag => (
              <Badge key={tag} variant="secondary" className="bg-slate-800">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-md font-semibold mb-2">Действия</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button 
              className="flex items-center justify-center gap-2"
              onClick={() => onInstall(library)}
              style={{ backgroundColor: currentTheme.primaryColor }}
            >
              <Download className="h-4 w-4" />
              Установить {library.name}
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center justify-center gap-2"
              onClick={handleViewDocs}
            >
              <FileCode className="h-4 w-4" />
              Документация
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center justify-center gap-2"
              onClick={handleViewSource}
            >
              <Code className="h-4 w-4" />
              Исходный код
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center justify-center gap-2"
              onClick={handleCreateExample}
            >
              <Package className="h-4 w-4" />
              Создать пример
            </Button>
          </div>
        </div>
        
        {relatedLibraries.length > 0 && (
          <>
            <Separator className="my-4" />
            
            <div>
              <h3 className="text-md font-semibold mb-3">Похожие библиотеки</h3>
              <div className="space-y-2">
                {relatedLibraries.map(relatedLib => (
                  <div 
                    key={relatedLib.id} 
                    className="bg-slate-800 p-3 rounded flex justify-between items-center cursor-pointer hover:bg-slate-700 transition-colors"
                  >
                    <div>
                      <div className="font-medium">{relatedLib.name}</div>
                      <div className="text-xs text-slate-400 truncate max-w-xs">{relatedLib.description}</div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => onInstall(relatedLib)}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
