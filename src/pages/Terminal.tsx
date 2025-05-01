
import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useCommandContext } from '../context/CommandContext';
import { terminalService } from '../services/terminalService';
import { TerminalHeader } from '../components/TerminalHeader';
import { 
  Code, 
  Terminal as TerminalIcon, 
  History, 
  BookOpen,
  AlertCircle,
  Server
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

// Import our new components
import { TerminalContent } from '@/components/terminal/TerminalContent';
import { TerminalLogsTab } from '@/components/terminal/TerminalLogsTab';
import { TerminalContainersTab } from '@/components/terminal/TerminalContainersTab';
import { TerminalHistoryTab } from '@/components/terminal/TerminalHistoryTab';
import { TerminalHelpTab } from '@/components/terminal/TerminalHelpTab';

const Terminal = () => {
  const { currentTheme } = useTheme();
  const { installedModules } = useCommandContext();
  const [terminalInfo, setTerminalInfo] = useState({
    version: '1.0.0',
    status: 'active',
    activeEnvironment: 'python',
    memoryUsage: '128MB'
  });
  const [activeTab, setActiveTab] = useState('terminal');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [selectedFile, setSelectedFile] = useState('main.py');
  const [isRunning, setIsRunning] = useState(false);
  
  // Update memory usage to simulate activity
  useEffect(() => {
    const timer = setInterval(() => {
      // Update memory usage randomly to simulate activity
      const newMemory = `${Math.floor(120 + Math.random() * 35)}MB`;
      setTerminalInfo(prev => ({
        ...prev,
        memoryUsage: newMemory
      }));
    }, 5000);
    
    return () => clearInterval(timer);
  }, []);
  
  const handleSubmitCommand = async () => {
    if (!terminalInput.trim()) return;
    
    // Add to history
    setTerminalHistory(prev => [...prev, terminalInput]);
    setHistoryIndex(-1);
    
    // Process command
    try {
      const result = await terminalService.executeCommand(terminalInput);
      // Add the result as a log
      terminalService.addLog(result, 'info');
    } catch (error) {
      console.error('Error executing command:', error);
      terminalService.addLog(`Ошибка выполнения: ${error}`, 'error');
    }
    
    // Clear input
    setTerminalInput('');
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmitCommand();
    } else if (e.key === 'ArrowUp') {
      // Navigate history upwards
      e.preventDefault();
      if (historyIndex < terminalHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setTerminalInput(terminalHistory[terminalHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      // Navigate history downwards
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setTerminalInput(terminalHistory[terminalHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setTerminalInput('');
      }
    }
  };
  
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      toast.success("Полноэкранный режим включен");
    }
  };
  
  return (
    <div className={`flex flex-col animate-fade-in ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-950' : 'h-[calc(100vh-120px)]'}`}>
      <TerminalHeader 
        currentTheme={currentTheme}
        terminalInfo={terminalInfo}
        setTerminalInfo={setTerminalInfo}
        isFullscreen={isFullscreen}
        toggleFullscreen={toggleFullscreen}
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-grow flex flex-col">
        <div className="border-b border-gray-800 bg-rukod-dark">
          <TabsList className="bg-transparent border-b border-transparent">
            <TabsTrigger value="terminal" className="data-[state=active]:border-b-2 data-[state=active]:border-rukod-purple rounded-none">
              <TerminalIcon className="h-4 w-4 mr-2" />
              Терминал
            </TabsTrigger>
            <TabsTrigger value="logs" className="data-[state=active]:border-b-2 data-[state=active]:border-rukod-purple rounded-none">
              <AlertCircle className="h-4 w-4 mr-2" />
              Логи системы
            </TabsTrigger>
            <TabsTrigger value="containers" className="data-[state=active]:border-b-2 data-[state=active]:border-rukod-purple rounded-none">
              <Server className="h-4 w-4 mr-2" />
              Контейнеры
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:border-b-2 data-[state=active]:border-rukod-purple rounded-none">
              <History className="h-4 w-4 mr-2" />
              История
            </TabsTrigger>
            <TabsTrigger value="help" className="data-[state=active]:border-b-2 data-[state=active]:border-rukod-purple rounded-none">
              <BookOpen className="h-4 w-4 mr-2" />
              Справка
            </TabsTrigger>
          </TabsList>
        </div>
        
        <div className="flex flex-col flex-grow p-2 overflow-hidden">
          <TabsContent value="terminal" className="flex-grow flex flex-col space-y-2 m-0">
            <TerminalContent
              terminalInput={terminalInput}
              setTerminalInput={setTerminalInput}
              handleSubmitCommand={handleSubmitCommand}
              handleKeyDown={handleKeyDown}
              currentTheme={currentTheme}
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              isRunning={isRunning}
              setIsRunning={setIsRunning}
            />
          </TabsContent>
          
          <TabsContent value="logs" className="flex-grow overflow-auto m-0">
            <TerminalLogsTab currentTheme={currentTheme} />
          </TabsContent>
          
          <TabsContent value="containers" className="flex-grow overflow-auto m-0">
            <TerminalContainersTab currentTheme={currentTheme} />
          </TabsContent>
          
          <TabsContent value="history" className="flex-grow overflow-auto m-0">
            <TerminalHistoryTab 
              currentTheme={currentTheme}
              terminalHistory={terminalHistory}
              setTerminalInput={setTerminalInput}
              handleSubmitCommand={handleSubmitCommand}
            />
          </TabsContent>
          
          <TabsContent value="help" className="flex-grow overflow-auto m-0">
            <TerminalHelpTab currentTheme={currentTheme} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default Terminal;
