import React, { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { LibraryDetails } from '@/components/LibraryDetails';
import { LibraryCard } from '@/components/LibraryCard';
import { ProgrammingLanguage, Library, LogEntry } from '@/models/types';
import { useCommandContext } from '@/context/CommandContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LibraryFilters } from '@/components/LibraryFilters';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Code, 
  Package, 
  Search, 
  ArrowDown, 
  ArrowUp, 
  Filter,
  Download,
  Gamepad2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { mockLibraries } from '@/data/mockLibraries';
import { toast } from 'sonner';
import { RunButton } from '@/components/ui/terminal-button';
import { terminalService } from '@/services/terminalService';
import { SystemStats } from '@/components/SystemStats';
import { LogItem } from '@/components/LogItem';

type SortOption = 'popular' | 'newest' | 'alphabetical';

interface LibraryFiltersProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  selectedLanguage: ProgrammingLanguage | null;
  setSelectedLanguage: React.Dispatch<React.SetStateAction<ProgrammingLanguage | null>>;
  showPaidOnly: boolean;
  setShowPaidOnly: React.Dispatch<React.SetStateAction<boolean>>;
  sortBy: SortOption;
  setSortBy: React.Dispatch<React.SetStateAction<SortOption>>;
  showGameLibraries: boolean;
  setShowGameLibraries: React.Dispatch<React.SetStateAction<boolean>>;
}

interface LibraryCardProps {
  library: Library;
  onSelect: () => void;
  onInstall: () => Promise<void>;
}

const Libraries = () => {
  const { currentTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<ProgrammingLanguage | null>(null);
  const [selectedLibrary, setSelectedLibrary] = useState<Library | null>(null);
  const [showPaidOnly, setShowPaidOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [showGameLibraries, setShowGameLibraries] = useState(false);
  const { installedModules } = useCommandContext();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const queryClient = useQueryClient();
  
  // Get logs from terminal service
  useEffect(() => {
    // Initial load
    setLogs(terminalService.getLogs());
    
    // Subscribe to logs updates
    const unsubscribe = terminalService.addLogListener((updatedLogs) => {
      setLogs([...updatedLogs]);
    });
    
    return unsubscribe;
  }, []);
  
  // Fetch libraries
  const { data: libraries = [], isLoading } = useQuery({
    queryKey: ['libraries', selectedLanguage],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      return mockLibraries.filter(lib => 
        selectedLanguage ? lib.language === selectedLanguage : true
      );
    }
  });
  
  // Handle install library
  const handleInstallLibrary = async (library: Library) => {
    try {
      toast.loading(`Installing ${library.name}...`);
      
      // Simulate installation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if a container exists for this language
      const containers = terminalService.getContainers();
      let containerForLanguage = containers.find(c => c.language === library.language);
      
      if (!containerForLanguage) {
        // Create a new container for this language
        await terminalService.executeCommand(`container start ${library.language}`);
        toast.info(`Created new ${library.language} container for library installation`);
        
        // Get the updated containers
        const updatedContainers = terminalService.getContainers();
        containerForLanguage = updatedContainers.find(c => c.language === library.language);
      }
      
      // Log the installation
      terminalService.addLog(`Installing ${library.name} v${library.version} for ${library.language}`, 'info');
      
      // Simulate installation steps
      await new Promise(resolve => setTimeout(resolve, 1000));
      terminalService.addLog(`Downloading ${library.name} package...`, 'info');
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      terminalService.addLog(`Resolving dependencies for ${library.name}...`, 'info');
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      terminalService.addLog(`Unpacking ${library.name}...`, 'info');
      
      await new Promise(resolve => setTimeout(resolve, 500));
      terminalService.addLog(`Successfully installed ${library.name} v${library.version}`, 'success');
      
      // Update cache to refresh UI
      queryClient.invalidateQueries({ queryKey: ['libraries'] });
      
      toast.success(`Installed ${library.name} successfully`);
      
      // Add success log
      terminalService.addLog(`Library ${library.name} installed successfully`, 'success');
    } catch (error) {
      console.error('Error installing library:', error);
      toast.error(`Failed to install ${library.name}`);
      terminalService.addLog(`Error installing ${library.name}: ${error}`, 'error');
    }
  };
  
  const filterLibraries = () => {
    if (!libraries) return [];
    
    let filtered = [...libraries];
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(lib => 
        lib.name.toLowerCase().includes(term) || 
        lib.description.toLowerCase().includes(term) ||
        (lib.tags && lib.tags.some(tag => tag.toLowerCase().includes(term)))
      );
    }
    
    // Filter by paid status
    if (showPaidOnly) {
      filtered = filtered.filter(lib => lib.isPaid);
    }
    
    // Filter by game libraries
    if (showGameLibraries) {
      filtered = filtered.filter(lib => lib.isGame);
    }
    
    // Sort libraries
    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => b.popularity - a.popularity);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.version).getTime() - new Date(a.version).getTime());
        break;
      case 'alphabetical':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    
    return filtered;
  };
  
  const filteredLibraries = filterLibraries();
  
  const installLogEntry = (message: string) => {
    terminalService.addLog(message, 'info');
  };
  
  const errorLogEntry = (message: string) => {
    terminalService.addLog(message, 'error');
  };
  
  return (
    <div className="animate-fade-in">
      <div className="mb-4">
        <h1 className="text-2xl font-bold" style={{ color: currentTheme.primaryColor }}>
          Library Manager
        </h1>
        <p className="text-gray-400">
          Browse, install and manage libraries for your projects
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            <LibraryFilters 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedLanguage={selectedLanguage}
              setSelectedLanguage={setSelectedLanguage}
              showPaidOnly={showPaidOnly}
              setShowPaidOnly={setShowPaidOnly}
              sortBy={sortBy}
              setSortBy={setSortBy}
              showGameLibraries={showGameLibraries}
              setShowGameLibraries={setShowGameLibraries}
            />
            
            <div className="border border-slate-800 rounded-lg">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <div className="border-b border-slate-800 p-2">
                  <TabsList className="bg-slate-900">
                    <TabsTrigger value="all">All Libraries</TabsTrigger>
                    <TabsTrigger value="installed">Installed</TabsTrigger>
                    <TabsTrigger value="updates">Updates Available</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="all" className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-rukod-purple"></div>
                    </div>
                  ) : filteredLibraries.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredLibraries.map(library => (
                        <LibraryCard 
                          key={library.id}
                          library={library}
                          onSelect={() => setSelectedLibrary(library)}
                          onInstall={() => handleInstallLibrary(library)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      No libraries found matching your filters
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="installed" className="p-4">
                  <div className="text-center py-8 text-gray-400">
                    No libraries currently installed
                  </div>
                </TabsContent>
                
                <TabsContent value="updates" className="p-4">
                  <div className="text-center py-8 text-gray-400">
                    No updates available at this time
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <SystemStats />
          
          {/* Installation logs */}
          <div className="border border-slate-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3" style={{ color: currentTheme.primaryColor }}>
              Installation Logs
            </h3>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {logs.length > 0 ? (
                logs.filter(log => 
                  log.message.includes('library') || 
                  log.message.includes('install') || 
                  log.message.includes('download')
                ).slice(-5).map(log => (
                  <LogItem key={log.id} log={log} />
                ))
              ) : (
                <div className="text-center py-4 text-gray-400">
                  No installation logs yet
                </div>
              )}
            </div>
            <div className="mt-3 space-x-2 flex justify-end">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  installLogEntry("Testing library installation features");
                }}
              >
                Test Log
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => terminalService.clearLogs()}
              >
                Clear Logs
              </Button>
            </div>
          </div>
          
          {selectedLibrary && (
            <LibraryDetails 
              library={selectedLibrary} 
              onClose={() => setSelectedLibrary(null)}
              onInstall={() => handleInstallLibrary(selectedLibrary)}
            />
          )}
          
          {/* Quick access to terminal */}
          <div className="border border-slate-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3" style={{ color: currentTheme.primaryColor }}>
              Terminal Access
            </h3>
            <p className="text-sm text-gray-400 mb-3">
              Access the terminal for custom installations and commands
            </p>
            <div className="flex justify-between space-x-2">
              <RunButton
                onClick={() => window.location.href = '/terminal'}
              >
                Open Terminal
              </RunButton>
              <Button 
                variant="outline"
                onClick={() => {
                  // Add a log entry
                  terminalService.addLog("Checking for library updates...", "info");
                  
                  // Simulate update check
                  setTimeout(() => {
                    terminalService.addLog("All libraries are up to date", "success");
                  }, 1500);
                }}
              >
                Check Updates
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Libraries;
