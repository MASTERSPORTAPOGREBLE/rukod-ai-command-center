
import React, { useState } from 'react';
import { Library, ProgrammingLanguage } from '../models/types';
import { useTheme } from '../context/ThemeContext';
import { getFilteredLibraries } from '../data/mockLibraries';
import { LibraryCard } from './LibraryCard';
import { LibraryFilters } from './LibraryFilters';
import { toast } from 'sonner';
import { Package, ScrollText, Cpu } from 'lucide-react';

export const LibraryManager: React.FC = () => {
  const { currentTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<ProgrammingLanguage | undefined>();
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const [showGamesOnly, setShowGamesOnly] = useState(false);
  
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
