
import React from 'react';
import { Library } from '../models/types';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'sonner';
import { Download, Star } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface LibraryCardProps {
  library: Library;
  onInstall: (libraryId: string) => void;
}

export const LibraryCard: React.FC<LibraryCardProps> = ({ library, onInstall }) => {
  const { currentTheme } = useTheme();

  const handleInstall = () => {
    onInstall(library.id);
    toast.success(`Начало установки ${library.name}`, {
      description: 'Библиотека будет доступна после завершения установки'
    });
  };

  return (
    <Card className="w-full mb-4 overflow-hidden hover:shadow-lg transition-shadow duration-300"
          style={{ backgroundColor: currentTheme.backgroundColor, color: currentTheme.textColor, borderColor: currentTheme.primaryColor }}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-semibold" style={{ color: currentTheme.primaryColor }}>{library.name}</h3>
          <div className="flex items-center">
            <Star className="h-4 w-4 mr-1 text-yellow-500 fill-yellow-500" />
            <span className="text-sm">{library.popularity.toFixed(1)}</span>
          </div>
        </div>
        
        <div className="text-sm mb-2">{library.description}</div>
        
        <div className="flex items-center justify-between mb-3 text-xs">
          <span>Версия: {library.version}</span>
          <span>Источник: {library.source}</span>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {library.tags.map(tag => (
            <Badge key={tag} variant="outline" className="text-xs" 
                  style={{ borderColor: currentTheme.accentColor, color: currentTheme.accentColor }}>
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-xs">
            {library.isPaid ? 'Платная' : 'Бесплатная'}
          </span>
          <Button 
            onClick={handleInstall}
            className="flex items-center gap-1 px-3 py-1"
            style={{ backgroundColor: currentTheme.accentColor, color: currentTheme.backgroundColor }}
          >
            <Download className="h-4 w-4" />
            Установить
          </Button>
        </div>
      </div>
    </Card>
  );
};
