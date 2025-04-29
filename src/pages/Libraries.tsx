
import React, { useState, useEffect } from 'react';
import { mockLibraries } from '../data/mockLibraries';
import { Library, ProgrammingLanguage } from '../models/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, Database, Star, Package, Download, Loader2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'sonner';

const Libraries = () => {
  const { currentTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<ProgrammingLanguage | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [displayedLibraries, setDisplayedLibraries] = useState<Library[]>([]);
  const [page, setPage] = useState(1);
  const librariesPerPage = 18;
  
  const filterLibraries = () => {
    return mockLibraries.filter(lib => 
      (activeTab === 'all' || lib.language === activeTab) &&
      (lib.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
       lib.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };
  
  // Handle initial loading and pagination
  useEffect(() => {
    setIsLoading(true);
    // Simulate API loading delay
    setTimeout(() => {
      const filtered = filterLibraries();
      const paginatedLibraries = filtered.slice(0, page * librariesPerPage);
      setDisplayedLibraries(paginatedLibraries);
      setIsLoading(false);
    }, 300);
  }, [activeTab, searchQuery, page]);
  
  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };
  
  const handleInstallLibrary = (library: Library) => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: `Установка ${library.name}...`,
        success: `Библиотека ${library.name} успешно установлена!`,
        error: `Ошибка при установке ${library.name}`
      }
    );
  };
  
  const libraryCount = {
    all: mockLibraries.length,
    python: mockLibraries.filter(lib => lib.language === 'python').length,
    cpp: mockLibraries.filter(lib => lib.language === 'cpp').length,
    lua: mockLibraries.filter(lib => lib.language === 'lua').length,
    javascript: mockLibraries.filter(lib => lib.language === 'javascript').length,
    rust: mockLibraries.filter(lib => lib.language === 'rust').length,
    ruby: mockLibraries.filter(lib => lib.language === 'ruby').length,
  };

  const totalFilteredLibraries = filterLibraries().length;
  const hasMoreToLoad = displayedLibraries.length < totalFilteredLibraries;

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col overflow-hidden">
      <header className="p-3 border-b border-gray-800 flex justify-between items-center">
        <div className="flex items-center">
          <Database className="h-6 w-6 mr-2" style={{ color: currentTheme.primaryColor }} />
          <h1 className="text-xl font-bold" style={{ color: currentTheme.primaryColor }}>
            Библиотеки <span className="text-sm opacity-70">({totalFilteredLibraries})</span>
          </h1>
        </div>
        
        <div className="flex items-center">
          <div className="relative mr-2">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Поиск библиотек..."
              className="bg-slate-900 border border-slate-700 rounded-md py-1 pl-8 pr-4 text-sm w-44 md:w-64 focus:outline-none focus:border-rukod-purple"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="p-1 rounded-md bg-slate-900 border border-slate-700">
            <Filter className="h-4 w-4 text-slate-400" />
          </button>
        </div>
      </header>
      
      <Tabs value={activeTab} onValueChange={(value) => {
        setActiveTab(value as ProgrammingLanguage | 'all');
        setPage(1); // Reset to first page when changing tabs
      }} className="flex-grow flex flex-col">
        <div className="border-b border-gray-800">
          <TabsList className="bg-transparent overflow-x-auto w-full">
            <TabsTrigger value="all" className="data-[state=active]:border-b-2 data-[state=active]:border-rukod-purple rounded-none">
              Все <span className="ml-1 text-xs opacity-70">({libraryCount.all})</span>
            </TabsTrigger>
            <TabsTrigger value="python" className="data-[state=active]:border-b-2 data-[state=active]:border-rukod-purple rounded-none">
              Python <span className="ml-1 text-xs opacity-70">({libraryCount.python})</span>
            </TabsTrigger>
            <TabsTrigger value="cpp" className="data-[state=active]:border-b-2 data-[state=active]:border-rukod-purple rounded-none">
              C++ <span className="ml-1 text-xs opacity-70">({libraryCount.cpp})</span>
            </TabsTrigger>
            <TabsTrigger value="lua" className="data-[state=active]:border-b-2 data-[state=active]:border-rukod-purple rounded-none">
              Lua <span className="ml-1 text-xs opacity-70">({libraryCount.lua})</span>
            </TabsTrigger>
            <TabsTrigger value="javascript" className="data-[state=active]:border-b-2 data-[state=active]:border-rukod-purple rounded-none">
              JS <span className="ml-1 text-xs opacity-70">({libraryCount.javascript})</span>
            </TabsTrigger>
            <TabsTrigger value="rust" className="data-[state=active]:border-b-2 data-[state=active]:border-rukod-purple rounded-none">
              Rust <span className="ml-1 text-xs opacity-70">({libraryCount.rust})</span>
            </TabsTrigger>
            <TabsTrigger value="ruby" className="data-[state=active]:border-b-2 data-[state=active]:border-rukod-purple rounded-none">
              Ruby <span className="ml-1 text-xs opacity-70">({libraryCount.ruby})</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <div className="flex-grow overflow-auto p-4 relative">
          {isLoading && displayedLibraries.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <Loader2 className="h-12 w-12 animate-spin text-rukod-purple mb-4" />
              <p>Загрузка библиотек...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayedLibraries.map((lib) => (
                  <LibraryCard key={lib.id} library={lib} onInstall={handleInstallLibrary} />
                ))}
              </div>
              
              {displayedLibraries.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <Package className="h-16 w-16 mb-4" />
                  <p className="text-lg">Библиотеки не найдены</p>
                  <p className="text-sm">Попробуйте изменить параметры поиска</p>
                </div>
              )}
              
              {hasMoreToLoad && (
                <div className="flex justify-center mt-6">
                  <button 
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-md flex items-center gap-2"
                    onClick={handleLoadMore}
                  >
                    {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                    Загрузить еще
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </Tabs>
    </div>
  );
};

interface LibraryCardProps {
  library: Library;
  onInstall: (library: Library) => void;
}

const LibraryCard = ({ library, onInstall }: LibraryCardProps) => {
  const { currentTheme } = useTheme();
  
  const languageColors = {
    python: { bg: '#3776AB', text: 'white' },
    cpp: { bg: '#00599C', text: 'white' },
    lua: { bg: '#00007C', text: 'white' },
    javascript: { bg: '#F7DF1E', text: 'black' },
    rust: { bg: '#DEA584', text: 'black' },
    ruby: { bg: '#CC342D', text: 'white' },
  };
  
  const languageColor = languageColors[library.language as keyof typeof languageColors];
  
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 hover:border-rukod-purple transition-all duration-200">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-lg" style={{ color: currentTheme.primaryColor }}>
          {library.name}
        </h3>
        <div className="flex items-center">
          <span className="text-yellow-400 flex items-center mr-2">
            <Star className="h-3.5 w-3.5 fill-yellow-400 mr-1" />
            {library.popularity.toFixed(1)}
          </span>
          <span 
            className="text-xs px-2 py-1 rounded" 
            style={{ 
              backgroundColor: languageColor.bg, 
              color: languageColor.text
            }}
          >
            {library.language}
          </span>
        </div>
      </div>
      
      <p className="text-sm text-slate-300 mb-3">{library.description}</p>
      
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center text-xs text-slate-400">
          <span className="mr-2">v{library.version}</span>
          <span>{library.source}</span>
        </div>
        
        <div className="flex items-center">
          <button 
            className="text-xs bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded flex items-center"
            onClick={() => onInstall(library)}
          >
            <Download className="w-3.5 h-3.5 mr-1" />
            Установить
          </button>
        </div>
      </div>
    </div>
  );
};

export default Libraries;
