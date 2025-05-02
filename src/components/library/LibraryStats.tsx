
import React from 'react';
import { ScrollText, Cpu, BarChart3 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface LibraryStatsProps {
  filteredLibrariesCount: number;
  selectedLibrariesCount: number;
}

export const LibraryStats: React.FC<LibraryStatsProps> = ({ 
  filteredLibrariesCount, 
  selectedLibrariesCount 
}) => {
  const { currentTheme } = useTheme();
  
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-4">
      <div className="flex items-center gap-2 bg-opacity-10 p-2 rounded-lg" 
           style={{ backgroundColor: currentTheme.primaryColor }}>
        <ScrollText className="h-5 w-5" style={{ color: currentTheme.primaryColor }} />
        <div>
          <div className="text-xs opacity-70">Доступно библиотек</div>
          <div className="font-semibold">{filteredLibrariesCount}</div>
        </div>
      </div>
      
      <div className="flex items-center gap-2 bg-opacity-10 p-2 rounded-lg"
           style={{ backgroundColor: currentTheme.accentColor }}>
        <Cpu className="h-5 w-5" style={{ color: currentTheme.accentColor }} />
        <div>
          <div className="text-xs opacity-70">Свободно на диске</div>
          <div className="font-semibold">26.4 GB</div>
        </div>
      </div>
      
      <div className="flex items-center gap-2 bg-opacity-10 p-2 rounded-lg"
           style={{ backgroundColor: currentTheme.primaryColor }}>
        <BarChart3 className="h-5 w-5" style={{ color: currentTheme.primaryColor }} />
        <div>
          <div className="text-xs opacity-70">Выбрано библиотек</div>
          <div className="font-semibold">{selectedLibrariesCount}</div>
        </div>
      </div>
    </div>
  );
};
