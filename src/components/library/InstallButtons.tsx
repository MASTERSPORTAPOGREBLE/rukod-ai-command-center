
import React from 'react';
import { Package, Zap } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Library } from '../../models/types';

interface InstallButtonsProps {
  selectedLibraries: string[];
  filteredLibraries: Library[];
  installingAll: boolean;
  handleBatchInstall: () => void;
  handleTurboInstall: () => void;
}

export const InstallButtons: React.FC<InstallButtonsProps> = ({ 
  selectedLibraries,
  filteredLibraries,
  installingAll,
  handleBatchInstall,
  handleTurboInstall
}) => {
  const { currentTheme } = useTheme();
  
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        {selectedLibraries.length > 0 ? (
          <button
            className="w-1/2 flex items-center justify-center gap-2 py-2.5 rounded-md transition-colors"
            style={{ 
              backgroundColor: currentTheme.accentColor,
              color: currentTheme.backgroundColor
            }}
            onClick={handleBatchInstall}
          >
            <Package className="h-4 w-4" />
            <span>Установить выбранные ({selectedLibraries.length})</span>
          </button>
        ) : (
          <button
            className="w-1/2 flex items-center justify-center gap-2 py-2.5 rounded-md transition-colors opacity-60"
            style={{ 
              backgroundColor: `${currentTheme.accentColor}80`,
              color: currentTheme.backgroundColor
            }}
            disabled
          >
            <Package className="h-4 w-4" />
            <span>Выберите библиотеки</span>
          </button>
        )}
      
        <button
          className="w-1/2 flex items-center justify-center gap-2 py-2.5 rounded-md transition-colors"
          style={{ 
            backgroundColor: installingAll ? `${currentTheme.primaryColor}60` : currentTheme.primaryColor,
            color: currentTheme.backgroundColor
          }}
          onClick={handleTurboInstall}
          disabled={installingAll || filteredLibraries.length === 0}
        >
          <Zap className="h-4 w-4" />
          {installingAll ? (
            <span className="flex items-center">
              <span className="mr-2">Турбо-установка...</span>
              <span className="animate-pulse">⚡</span>
            </span>
          ) : (
            <span>Турбо-установка всех</span>
          )}
        </button>
      </div>

      <div className="text-xs text-center mt-1 opacity-70">
        Одним кликом установит все отображаемые библиотеки с автоматическим разрешением зависимостей
      </div>
    </div>
  );
};
