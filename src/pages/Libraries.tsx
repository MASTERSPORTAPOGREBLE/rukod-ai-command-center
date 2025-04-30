import React, { useState, useEffect, useMemo } from 'react';
import { mockLibraries, getLibrariesByLanguageCount, getLibraryById } from '../data/mockLibraries';
import { Library, ProgrammingLanguage, LogEntry } from '../models/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, Filter, Database, Star, Package, Download, Loader2, Book, 
  Grid3X3, Columns2, List, ChevronLeft, ChevronRight, Info
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'sonner';
import { LibraryDetails } from '../components/LibraryDetails';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { terminalService } from '../services/terminalService';

const Libraries = () => {
  const { currentTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<ProgrammingLanguage | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [displayedLibraries, setDisplayedLibraries] = useState<Library[]>([]);
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedLibrary, setSelectedLibrary] = useState<Library | null>(null);
  const [installedLibraries, setInstalledLibraries] = useState<Set<string>>(new Set());
  const [showOnlyFree, setShowOnlyFree] = useState(false);
  const [showOnlyGames, setShowOnlyGames] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  const librariesPerPage = 18;
  const libraryCount = getLibrariesByLanguageCount();
  
  const filterLibraries = () => {
    return mockLibraries.filter(lib => 
      // Filter by language
      (activeTab === 'all' || lib.language === activeTab) &&
      
      // Filter by free
      (!showOnlyFree || !lib.isPaid) &&
      
      // Filter by games
      (!showOnlyGames || lib.isGame) &&
      
      // Filter by category
      (!activeCategory || (lib.tags && lib.tags.includes(activeCategory))) &&
      
      // Filter by search query
      (lib.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
       lib.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
       lib.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
    );
  };

  // Calculate total pages and current page libraries
  const filteredLibraries = useMemo(() => filterLibraries(), [
    activeTab, searchQuery, showOnlyFree, showOnlyGames, activeCategory
  ]);
  
  const totalPages = Math.ceil(filteredLibraries.length / librariesPerPage);
  
  // Handle initial loading and pagination
  useEffect(() => {
    setIsLoading(true);
    // Simulate API loading delay
    setTimeout(() => {
      const start = (page - 1) * librariesPerPage;
      const end = start + librariesPerPage;
      const paginatedLibraries = filteredLibraries.slice(start, end);
      setDisplayedLibraries(paginatedLibraries);
      setIsLoading(false);
    }, 300);
  }, [filteredLibraries, page]);
  
  // Reset to first page when filters change
  useEffect(() => {
    setPage(1);
  }, [activeTab, searchQuery, showOnlyFree, showOnlyGames, activeCategory]);
  
  // Keep track of installed libraries
  useEffect(() => {
    // In a real app, we'd load this from a service
    // For now, just start with an empty set
    const containers = terminalService.getContainers();
    const installedSet = new Set<string>();
    
    // Assume each container has a "libraryId" property that links to the library
    containers.forEach(container => {
      if (container.libraryId) {
        installedSet.add(container.libraryId);
      }
    });
    
    setInstalledLibraries(installedSet);
  }, []);
  
  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };
  
  const handlePreviousPage = () => {
    setPage(p => Math.max(1, p - 1));
  };
  
  const handleNextPage = () => {
    setPage(p => Math.min(totalPages, p + 1));
  };
  
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  
  const handleInstallLibrary = (library: Library) => {
    toast.promise(
      new Promise((resolve) => {
        // Simulate installation process
        setTimeout(() => {
          // Add to installed libraries
          setInstalledLibraries(prev => new Set(prev).add(library.id));
          resolve(true);
        }, 1500);
      }),
      {
        loading: `Установка ${library.name}...`,
        success: `Библиотека ${library.name} успешно установлена!`,
        error: `Ошибка при установке ${library.name}`
      }
    );
    
    // In a real app, we would also update the terminal logs
    const installStartLog: LogEntry = {
      id: `install-${Date.now()}`,
      level: 'info',
      message: `Начало установки библиотеки ${library.name} (${library.language})`,
      timestamp: new Date()
    };
    terminalService.addLog(installStartLog);
    
    // After "installation" is complete
    setTimeout(() => {
      const installCompleteLog: LogEntry = {
        id: `install-complete-${Date.now()}`,
        level: 'success',
        message: `Библиотека ${library.name} версии ${library.version} успешно установлена`,
        timestamp: new Date()
      };
      terminalService.addLog(installCompleteLog);
    }, 2000);
  };
  
  const handleOpenDetails = (library: Library) => {
    setSelectedLibrary(library);
  };
  
  const handleCloseDetails = () => {
    setSelectedLibrary(null);
  };
  
  const isLibraryInstalled = (libraryId: string) => {
    return installedLibraries.has(libraryId);
  };
  
  const handleCategoryClick = (category: string) => {
    if (activeCategory === category) {
      setActiveCategory(null); // Toggle off
    } else {
      setActiveCategory(category);
    }
  };
  
  // Get unique tags for category filtering
  const commonTags = useMemo(() => {
    const tagCounts: Record<string, number> = {};
    
    filteredLibraries.forEach(lib => {
      if (lib.tags) {
        lib.tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });
    
    return Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([tag]) => tag);
  }, [filteredLibraries]);
  
  // Generate pagination UI
  const getPaginationItems = () => {
    // Always show the first page, the last page, and pages around the current page
    const pageItems: (number | string)[] = [];
    
    if (totalPages <= 7) {
      // If we have 7 or fewer pages, show all page numbers
      for (let i = 1; i <= totalPages; i++) {
        pageItems.push(i);
      }
    } else {
      // Always show first page
      pageItems.push(1);
      
      // Add ellipsis if needed
      if (page > 3) {
        pageItems.push('...');
      }
      
      // Show pages around current page
      const startPage = Math.max(2, page - 1);
      const endPage = Math.min(totalPages - 1, page + 1);
      
      for (let i = startPage; i <= endPage; i++) {
        pageItems.push(i);
      }
      
      // Add ellipsis if needed
      if (page < totalPages - 2) {
        pageItems.push('...');
      }
      
      // Always show last page if we have more than 1 page
      if (totalPages > 1) {
        pageItems.push(totalPages);
      }
    }
    
    return pageItems;
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col overflow-hidden">
      <header className="p-3 border-b border-gray-800 flex justify-between items-center">
        <div className="flex items-center">
          <Database className="h-6 w-6 mr-2" style={{ color: currentTheme.primaryColor }} />
          <h1 className="text-xl font-bold" style={{ color: currentTheme.primaryColor }}>
            Библиотеки <span className="text-sm opacity-70">({filteredLibraries.length})</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Поиск библиотек..."
              className="bg-slate-900 border border-slate-700 rounded-md py-1 pl-8 pr-4 text-sm w-44 md:w-64 focus:outline-none focus:border-rukod-purple"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex border border-slate-700 rounded-md">
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 rounded-none rounded-l-md ${viewMode === 'grid' ? 'bg-slate-700' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 rounded-none rounded-r-md ${viewMode === 'list' ? 'bg-slate-700' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="relative">
            <Button
              variant="outline"
              className="flex items-center gap-1 text-xs h-8"
            >
              <Filter className="h-3.5 w-3.5" />
              Фильтры
            </Button>
            <div className="absolute top-full right-0 mt-1 p-3 bg-slate-900 border border-slate-700 rounded-md shadow-lg z-10 hidden group-hover:block">
              <div className="space-y-2">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="free-only" 
                    checked={showOnlyFree}
                    onChange={() => setShowOnlyFree(!showOnlyFree)}
                    className="mr-2"
                  />
                  <label htmlFor="free-only" className="text-sm">Только бесплатные</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="games-only" 
                    checked={showOnlyGames}
                    onChange={() => setShowOnlyGames(!showOnlyGames)}
                    className="mr-2"
                  />
                  <label htmlFor="games-only" className="text-sm">Только игровые</label>
                </div>
              </div>
            </div>
          </div>
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
        
        {/* Top categories section */}
        {commonTags.length > 0 && (
          <div className="px-4 pt-2 pb-1 flex flex-wrap gap-2 border-b border-slate-800">
            {commonTags.map(tag => (
              <Badge 
                key={tag}
                variant={activeCategory === tag ? "default" : "outline"}
                className={`cursor-pointer ${activeCategory === tag ? 'bg-rukod-purple' : ''}`}
                onClick={() => handleCategoryClick(tag)}
              >
                {tag}
              </Badge>
            ))}
            {activeCategory && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs py-0 h-6" 
                onClick={() => setActiveCategory(null)}
              >
                Очистить
              </Button>
            )}
          </div>
        )}
        
        <div className="flex-grow overflow-auto p-4 relative">
          {isLoading && displayedLibraries.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <Loader2 className="h-12 w-12 animate-spin text-rukod-purple mb-4" />
              <p>Загрузка библиотек...</p>
            </div>
          ) : (
            <>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {displayedLibraries.map((lib) => (
                    <LibraryCard 
                      key={lib.id} 
                      library={lib} 
                      onInstall={handleInstallLibrary} 
                      onViewDetails={handleOpenDetails}
                      isInstalled={isLibraryInstalled(lib.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {displayedLibraries.map((lib) => (
                    <LibraryListItem
                      key={lib.id}
                      library={lib}
                      onInstall={handleInstallLibrary}
                      onViewDetails={handleOpenDetails}
                      isInstalled={isLibraryInstalled(lib.id)}
                    />
                  ))}
                </div>
              )}
              
              {displayedLibraries.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <Package className="h-16 w-16 mb-4" />
                  <p className="text-lg">Библиотеки не найдены</p>
                  <p className="text-sm">Попробуйте изменить параметры поиска</p>
                </div>
              )}
              
              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={handlePreviousPage} 
                      disabled={page === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    
                    <div className="flex items-center space-x-1">
                      {getPaginationItems().map((pageItem, index) => {
                        if (pageItem === '...') {
                          return (
                            <div key={`ellipsis-${index}`} className="px-2">
                              ...
                            </div>
                          );
                        }
                        
                        const pageNumber = Number(pageItem);
                        return (
                          <Button
                            key={`page-${pageNumber}`}
                            variant={page === pageNumber ? "default" : "outline"}
                            size="sm"
                            className={page === pageNumber ? "bg-rukod-purple" : ""}
                            onClick={() => handlePageChange(pageNumber)}
                          >
                            {pageNumber}
                          </Button>
                        );
                      })}
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={handleNextPage}
                      disabled={page === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </Tabs>
      
      {selectedLibrary && (
        <LibraryDetails
          library={selectedLibrary}
          onClose={handleCloseDetails}
          onInstall={handleInstallLibrary}
          isInstalled={isLibraryInstalled(selectedLibrary.id)}
        />
      )}
    </div>
  );
};

interface LibraryCardProps {
  library: Library;
  onInstall: (library: Library) => void;
  onViewDetails: (library: Library) => void;
  isInstalled?: boolean;
}

const LibraryCard = ({ library, onInstall, onViewDetails, isInstalled = false }: LibraryCardProps) => {
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
    <div 
      className="bg-slate-900 border border-slate-700 rounded-lg p-4 hover:border-rukod-purple transition-all duration-200 cursor-pointer"
      onClick={() => onViewDetails(library)}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex flex-col">
          <div className="flex items-center">
            <h3 className="font-bold text-lg" style={{ color: currentTheme.primaryColor }}>
              {library.name}
            </h3>
            {isInstalled && (
              <Badge variant="secondary" className="ml-2 bg-green-900 text-green-100 border-none text-xs">
                Установлено
              </Badge>
            )}
          </div>
          <div className="flex items-center mt-1">
            <span 
              className="text-xs px-2 py-1 rounded mr-2" 
              style={{ 
                backgroundColor: languageColor.bg, 
                color: languageColor.text
              }}
            >
              {library.language}
            </span>
            <span className="text-yellow-400 flex items-center">
              <Star className="h-3.5 w-3.5 fill-yellow-400 mr-1" />
              {library.popularity.toFixed(1)}
            </span>
          </div>
        </div>
      </div>
      
      <p className="text-sm text-slate-300 mb-3 line-clamp-2">{library.description}</p>
      
      <div className="flex flex-wrap gap-1 mb-3">
        {library.tags?.slice(0, 3).map(tag => (
          <Badge key={tag} variant="outline" className="text-xs">
            {tag}
          </Badge>
        ))}
        {library.tags && library.tags.length > 3 && (
          <Badge variant="outline" className="text-xs">
            +{library.tags.length - 3}
          </Badge>
        )}
      </div>
      
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center text-xs text-slate-400">
          <span className="mr-2">v{library.version}</span>
          <span>{library.source}</span>
        </div>
        
        <div className="flex items-center">
          <div className="flex items-center mr-2">
            <button 
              className="text-xs p-1 rounded flex items-center hover:text-rukod-purple"
              onClick={(e) => {
                e.stopPropagation();
                toast.info(`Информация о ${library.name}`, {
                  description: `Версия: ${library.version}, Источник: ${library.source}`
                });
              }}
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>
          
          {isInstalled ? (
            <button 
              className="text-xs bg-slate-800 hover:bg-green-900 px-2 py-1 rounded flex items-center text-green-400"
              onClick={(e) => {
                e.stopPropagation();
                toast.info(`Библиотека ${library.name} уже установлена`);
              }}
            >
              Установлено
            </button>
          ) : (
            <button 
              className="text-xs bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded flex items-center"
              onClick={(e) => {
                e.stopPropagation();
                onInstall(library);
              }}
            >
              <Download className="w-3.5 h-3.5 mr-1" />
              Установить
            </button>
          )}
        </div>
      </div>
      
      {library.isPaid && (
        <Badge variant="outline" className="mt-2 border-amber-500 text-amber-400">
          Платная
        </Badge>
      )}
    </div>
  );
};

const LibraryListItem = ({ library, onInstall, onViewDetails, isInstalled = false }: LibraryCardProps) => {
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
    <div 
      className="bg-slate-900 border border-slate-700 rounded-lg p-3 hover:border-rukod-purple transition-all duration-200 cursor-pointer flex items-center justify-between"
      onClick={() => onViewDetails(library)}
    >
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          <Book className="h-6 w-6 text-slate-400" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold" style={{ color: currentTheme.primaryColor }}>
              {library.name}
            </h3>
            <span 
              className="text-xs px-1.5 py-0.5 rounded" 
              style={{ 
                backgroundColor: languageColor.bg, 
                color: languageColor.text
              }}
            >
              {library.language}
            </span>
            <span className="text-xs">v{library.version}</span>
            {library.isPaid && (
              <Badge variant="outline" className="border-amber-500 text-amber-400 text-xs py-0 h-4">
                Платная
              </Badge>
            )}
            {isInstalled && (
              <Badge variant="secondary" className="bg-green-900 text-green-100 border-none text-xs py-0 h-4">
                Установлено
              </Badge>
            )}
          </div>
          <p className="text-sm text-slate-300 line-clamp-1">{library.description}</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {library.tags?.slice(0, 3).map(tag => (
              <Badge key={tag} variant="outline" className="text-xs py-0">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <span className="text-yellow-400 flex items-center">
          <Star className="h-3.5 w-3.5 fill-yellow-400 mr-1" />
          {library.popularity.toFixed(1)}
        </span>
        
        {isInstalled ? (
          <button 
            className="text-xs bg-slate-800 px-2 py-1 rounded flex items-center text-green-400 hover:bg-green-900"
            onClick={(e) => {
              e.stopPropagation();
              toast.info(`Библиотека ${library.name} уже установлена`);
            }}
          >
            Установлено
          </button>
        ) : (
          <button 
            className="text-xs bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded flex items-center"
            onClick={(e) => {
              e.stopPropagation();
              onInstall(library);
            }}
          >
            <Download className="w-3.5 h-3.5 mr-1" />
            Установить
          </button>
        )}
      </div>
    </div>
  );
};

export default Libraries;
