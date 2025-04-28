
import React, { useState, useEffect } from 'react';
import { Library, ProgrammingLanguage } from '../models/types';
import { useTheme } from '../context/ThemeContext';
import { getFilteredLibraries, getLibrariesByCategory, getPopularLibraries } from '../data/mockLibraries';
import { LibraryCard } from './LibraryCard';
import { LibraryFilters } from './LibraryFilters';
import { toast } from 'sonner';
import { Package, ScrollText, Cpu, Zap, BarChart3 } from 'lucide-react';
import { Progress } from './ui/progress';

export const LibraryManager: React.FC = () => {
  const { currentTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<ProgrammingLanguage | undefined>();
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const [showGamesOnly, setShowGamesOnly] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [installingAll, setInstallingAll] = useState(false);
  const [installProgress, setInstallProgress] = useState(0);
  const [selectedLibraries, setSelectedLibraries] = useState<string[]>([]);
  
  // Get libraries based on filters and categories
  const getLibraries = () => {
    if (selectedCategory) {
      const byCategory = getLibrariesByCategory(selectedCategory);
      return byCategory.filter(lib => {
        if (selectedLanguage && lib.language !== selectedLanguage) return false;
        if (showFreeOnly && lib.isPaid) return false;
        if (showGamesOnly && !lib.isGame) return false;
        if (searchQuery && !lib.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
            !lib.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
      });
    } else {
      return getFilteredLibraries(
        selectedLanguage,
        searchQuery,
        showFreeOnly ? false : undefined,
        showGamesOnly ? true : undefined
      );
    }
  };
  
  const filteredLibraries = getLibraries();
  
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
    setInstallProgress(0);
    
    // Show initial toast
    toast.info(`Турбо-установка ${filteredLibraries.length} библиотек запущена!`, {
      description: "Подготовка контейнеров и зависимостей..."
    });
    
    // Reset progress and start incrementing
    let completed = 0;
    const totalLibs = filteredLibraries.length;
    
    // Process each library with a staggered delay
    filteredLibraries.forEach((library, index) => {
      setTimeout(() => {
        completed++;
        setInstallProgress(Math.floor((completed / totalLibs) * 100));
        
        toast.info(`Установка ${library.name} (${index+1}/${filteredLibraries.length})`, {
          description: `Язык: ${library.language}, Версия: ${library.version}`
        });
      }, index * 800);
    });
    
    // Complete the process after all libraries would be "installed"
    setTimeout(() => {
      setInstallProgress(100);
      toast.success(`Турбо-установка завершена!`, {
        description: `Установлено ${filteredLibraries.length} библиотек`
      });
      
      setTimeout(() => {
        setInstallingAll(false);
        setInstallProgress(0);
      }, 1000);
      
    }, filteredLibraries.length * 800 + 1000);
  };
  
  const toggleLibrarySelection = (libraryId: string) => {
    setSelectedLibraries(prev => 
      prev.includes(libraryId) 
        ? prev.filter(id => id !== libraryId)
        : [...prev, libraryId]
    );
  };
  
  const handleBatchInstall = () => {
    if (selectedLibraries.length === 0) {
      toast.error("Выберите хотя бы одну библиотеку для установки.");
      return;
    }
    
    toast.info(`Подготовка к установке ${selectedLibraries.length} библиотек...`);
    
    // Get names of selected libraries for display
    const selectedNames = filteredLibraries
      .filter(lib => selectedLibraries.includes(lib.id))
      .map(lib => lib.name);
      
    toast.promise(
      new Promise((resolve) => {
        // Simulate installation delay - longer for more libraries
        setTimeout(resolve, 1000 + selectedLibraries.length * 500);
      }),
      {
        loading: `Установка выбранных библиотек (${selectedLibraries.length})...`,
        success: `Установлено ${selectedLibraries.length} библиотек: ${selectedNames.join(', ')}`,
        error: `Ошибка при установке библиотек`
      }
    );
    
    // Clear selection after installation starts
    setSelectedLibraries([]);
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
        
        <div className="flex items-center gap-2 bg-opacity-10 p-2 rounded-lg"
             style={{ backgroundColor: currentTheme.primaryColor }}>
          <BarChart3 className="h-5 w-5" style={{ color: currentTheme.primaryColor }} />
          <div>
            <div className="text-xs opacity-70">Выбрано библиотек</div>
            <div className="font-semibold">{selectedLibraries.length}</div>
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
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      
      <div className="mb-4 space-y-2">
        {/* Installation progress bar */}
        {installProgress > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Прогресс установки</span>
              <span>{installProgress}%</span>
            </div>
            <Progress value={installProgress} className="h-2" />
          </div>
        )}

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
      
      <div className="space-y-4">
        {filteredLibraries.length > 0 ? (
          filteredLibraries.map(library => (
            <LibraryCard
              key={library.id}
              library={library}
              onInstall={handleInstallLibrary}
              isSelected={selectedLibraries.includes(library.id)}
              onToggleSelect={() => toggleLibrarySelection(library.id)}
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
