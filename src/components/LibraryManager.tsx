
import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'sonner';
import { Package } from 'lucide-react';
import { useLibraryFiltering } from '../hooks/useLibraryFiltering';
import { LibraryFilters } from './LibraryFilters';
import { LibraryStats } from './library/LibraryStats';
import { InstallProgress } from './library/InstallProgress';
import { InstallButtons } from './library/InstallButtons';
import { LibrariesList } from './library/LibrariesList';

export const LibraryManager: React.FC = () => {
  const { currentTheme } = useTheme();
  const {
    searchQuery,
    setSearchQuery,
    selectedLanguage,
    setSelectedLanguage,
    showFreeOnly,
    setShowFreeOnly,
    showGamesOnly,
    setShowGamesOnly,
    selectedCategory,
    setSelectedCategory,
    getLibraries,
  } = useLibraryFiltering();
  
  const [installingAll, setInstallingAll] = useState(false);
  const [installProgress, setInstallProgress] = useState(0);
  const [selectedLibraries, setSelectedLibraries] = useState<string[]>([]);
  
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
      
      <LibraryStats 
        filteredLibrariesCount={filteredLibraries.length} 
        selectedLibrariesCount={selectedLibraries.length} 
      />
      
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
        <InstallProgress installProgress={installProgress} />
        <InstallButtons 
          selectedLibraries={selectedLibraries}
          filteredLibraries={filteredLibraries}
          installingAll={installingAll}
          handleBatchInstall={handleBatchInstall}
          handleTurboInstall={handleTurboInstall}
        />
      </div>
      
      <LibrariesList 
        libraries={filteredLibraries}
        onInstallLibrary={handleInstallLibrary}
        selectedLibraries={selectedLibraries}
        onToggleSelection={toggleLibrarySelection}
      />
    </div>
  );
};
