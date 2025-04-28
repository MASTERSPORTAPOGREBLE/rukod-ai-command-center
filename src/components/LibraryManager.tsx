
import React, { useState } from 'react';
import { Library, ProgrammingLanguage } from '../models/types';
import { useTheme } from '../context/ThemeContext';
import { getFilteredLibraries } from '../data/mockLibraries';
import { LibraryCard } from './LibraryCard';
import { LibraryFilters } from './LibraryFilters';
import { toast } from 'sonner';
import { Package, ScrollText, Cpu, Zap } from 'lucide-react';

export const LibraryManager: React.FC = () => {
  const { currentTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<ProgrammingLanguage | undefined>();
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const [showGamesOnly, setShowGamesOnly] = useState(false);
  const [installingAll, setInstallingAll] = useState(false);
  
  const filteredLibraries = getFilteredLibraries(
    selectedLanguage,
    searchQuery,
    showFreeOnly ? false : undefined,
    showGamesOnly ? true : undefined
  );
  
  const handleInstallLibrary = (libraryId: string) => {
    // Mock installation process
    const library = filteredLibraries.find(lib => lib.id === libraryId);
    if (!library) return;
    
    toast.promise(
      new Promise((resolve) => {
        // Simulate installation delay
        setTimeout(resolve, 2000);
      }),
      {
        loading: `Установка ${library.name}...`,
        success: `${library.name} успешно установлена!`,
        error: `Ошибка при установке ${library.name}`
      }
    );
  };
  
  const handleTurboInstall = () => {
    if (filteredLibraries.length === 0) {
      toast.error("Нет библиотек для установки. Измените фильтры поиска.");
      return;
    }
    
    setInstallingAll(true);
    
    // Show initial toast
    toast.info(`Турбо-установка ${filteredLibraries.length} библиотек запущена!`, {
      description: "Подготовка контейнеров и зависимостей..."
    });
    
    // Process each library with a staggered delay
    filteredLibraries.forEach((library, index) => {
      setTimeout(() => {
        toast.info(`Установка ${library.name} (${index+1}/${filteredLibraries.length})`, {
          description: `Язык: ${library.language}, Версия: ${library.version}`
        });
      }, index * 800);
    });
    
    // Complete the process after all libraries would be "installed"
    setTimeout(() => {
      toast.success(`Турбо-установка завершена!`, {
        description: `Установлено ${filteredLibraries.length} библиотек`
      });
      setInstallingAll(false);
    }, filteredLibraries.length * 800 + 1000);
  };
  
  return (
    <div className="p-4 max-w-2xl mx-auto" 
         style={{ backgroundColor: currentTheme.backgroundColor, color: currentTheme.textColor }}>
      <div className="flex items-center mb-6">
        <Package className="h-6 w-6 mr-2" style={{ color: currentTheme.primaryColor }} />
        <h2 className="text-2xl font-bold" style={{ color: currentTheme.primaryColor }}>Менеджер библиотек</h2>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="flex items-center gap-2 bg-opacity-10 p-2 rounded-lg" 
             style={{ backgroundColor: currentTheme.primaryColor }}>
          <ScrollText className="h-5 w-5" style={{ color: currentTheme.primaryColor }} />
          <div>
            <div className="text-xs opacity-70">Доступно библиотек</div>
            <div className="font-semibold">{filteredLibraries.length}</div>
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
      </div>
      
      <LibraryFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedLanguage={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
        showFreeOnly={showFreeOnly}
        onFreeOnlyChange={setShowFreeOnly}
        showGamesOnly={showGamesOnly}
        onGamesOnlyChange={setShowGamesOnly}
      />
      
      <div className="mb-4">
        <button
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-md transition-colors"
          style={{ 
            backgroundColor: installingAll ? `${currentTheme.primaryColor}60` : currentTheme.primaryColor,
            color: currentTheme.backgroundColor
          }}
          onClick={handleTurboInstall}
          disabled={installingAll || filteredLibraries.length === 0}
        >
          <Zap className="h-5 w-5" />
          {installingAll ? (
            <span className="flex items-center">
              <span className="mr-2">Турбо-установка...</span>
              <span className="animate-pulse">⚡</span>
            </span>
          ) : (
            <span>Турбо-установка всех библиотек</span>
          )}
        </button>
        <div className="text-xs text-center mt-1 opacity-70">
          Одним кликом установит все отображаемые библиотеки с автоматическим разрешением зависимостей
        </div>
      </div>
      
      <div className="space-y-4">
        {filteredLibraries.length > 0 ? (
          filteredLibraries.map(library => (
            <LibraryCard
              key={library.id}
              library={library}
              onInstall={handleInstallLibrary}
            />
          ))
        ) : (
          <div className="text-center py-8 opacity-70">
            Библиотеки не найдены. Попробуйте изменить параметры поиска.
          </div>
        )}
      </div>
    </div>
  );
};
