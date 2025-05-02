
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Library, ProgrammingLanguage } from '../models/types';
import { LibraryFilters } from './LibraryFilters';
import { LibraryCard } from './LibraryCard';
import { LibraryDetails } from './LibraryDetails';
import { ScrollArea } from './ui/scroll-area';
import { Package, CalendarDays, Search } from 'lucide-react';
import { Input } from './ui/input';
import { Spinner } from './ui/spinner';

// Import mock data
import { mockLibraries } from '../data/mockLibraries';

export const LibrariesContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<ProgrammingLanguage>('all');
  const [sortOption, setSortOption] = useState('popular');
  const [filterStable, setFilterStable] = useState(false);
  const [filterPopular, setFilterPopular] = useState(true);
  const [filterNew, setFilterNew] = useState(false);
  const [showGameLibraries, setShowGameLibraries] = useState(false);
  const [selectedLibrary, setSelectedLibrary] = useState<Library | null>(null);
  
  // Use react-query to fetch libraries
  const { data: libraries, isLoading } = useQuery({
    queryKey: ['libraries', selectedLanguage, sortOption, filterStable, filterPopular, filterNew, showGameLibraries],
    queryFn: async () => {
      // In a real app, we would fetch from an API
      // For now, we'll use our mock data
      await new Promise(resolve => setTimeout(resolve, 600)); // Simulate network delay
      
      let filteredLibraries = [...mockLibraries];
      
      // Apply language filter
      if (selectedLanguage !== 'all') {
        filteredLibraries = filteredLibraries.filter(lib => lib.language === selectedLanguage);
      }
      
      // Apply stable filter
      if (filterStable) {
        filteredLibraries = filteredLibraries.filter(lib => lib.isStable);
      }
      
      // Apply popular filter
      if (filterPopular) {
        filteredLibraries = filteredLibraries.filter(lib => lib.downloadCount > 10000);
      }
      
      // Apply new filter
      if (filterNew) {
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        filteredLibraries = filteredLibraries.filter(lib => new Date(lib.lastUpdated) > threeMonthsAgo);
      }
      
      // Apply game libraries filter
      if (showGameLibraries) {
        filteredLibraries = filteredLibraries.filter(lib => lib.tags.includes('game'));
      }
      
      // Sort libraries
      switch (sortOption) {
        case 'popular':
          filteredLibraries.sort((a, b) => b.downloadCount - a.downloadCount);
          break;
        case 'name':
          filteredLibraries.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'updated':
          filteredLibraries.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
          break;
      }
      
      return filteredLibraries;
    },
  });
  
  // Further filter by search term
  const filteredLibraries = libraries?.filter(library => 
    library.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    library.description.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];
  
  // Handle library selection
  const handleSelectLibrary = (library: Library) => {
    setSelectedLibrary(library);
  };
  
  // Handle library installation
  const handleInstallLibrary = async (library: Library) => {
    toast.promise(
      // Simulate an installation
      new Promise<void>((resolve) => setTimeout(() => resolve(), 1500)),
      {
        loading: `Установка ${library.name}...`,
        success: `Библиотека ${library.name} успешно установлена!`,
        error: `Ошибка при установке ${library.name}.`
      }
    );
  };
  
  return (
    <div className="container mx-auto p-4 h-full">
      <h1 className="text-3xl font-bold mb-6">Библиотеки</h1>
      
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left panel: Filters */}
        <div className="w-full lg:w-64 space-y-4">
          <LibraryFilters
            searchQuery={searchTerm}
            onSearchChange={setSearchTerm}
            selectedLanguage={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
          />
        </div>
        
        {/* Center panel: Library list */}
        <div className="flex-grow">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск библиотек..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <Spinner className="mx-auto mb-2" />
                <p>Загрузка библиотек...</p>
              </div>
            </div>
          ) : filteredLibraries.length === 0 ? (
            <div className="text-center p-8 border rounded-lg">
              <Package className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">Библиотеки не найдены</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Попробуйте изменить критерии поиска или фильтры
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-270px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
                {filteredLibraries.map(library => (
                  <LibraryCard 
                    key={library.id} 
                    library={library} 
                    onSelect={() => handleSelectLibrary(library)} 
                    onInstall={() => handleInstallLibrary(library)}
                  />
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
        
        {/* Right panel: Library details */}
        <div className="w-full lg:w-1/4 space-y-4">
          {selectedLibrary ? (
            <LibraryDetails 
              library={selectedLibrary} 
              onInstall={() => handleInstallLibrary(selectedLibrary)}
            />
          ) : (
            <div className="text-center p-8 border rounded-lg">
              <CalendarDays className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">Выберите библиотеку</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Выберите библиотеку из списка для просмотра подробностей
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
