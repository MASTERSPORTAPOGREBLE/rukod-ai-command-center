
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
import { CodeExecutionResult } from '@/components/code/CodeExecutionResult';

// Import our components
import { TerminalContent } from '@/components/terminal/TerminalContent';
import { TerminalLogsTab } from '@/components/terminal/TerminalLogsTab';
import { TerminalContainersTab } from '@/components/terminal/TerminalContainersTab';
import { TerminalHistoryTab } from '@/components/terminal/TerminalHistoryTab';
import { TerminalHelpTab } from '@/components/terminal/TerminalHelpTab';
import { useTerminalState } from '@/components/terminal/TerminalStateManager';
import { useTerminalExecution } from '@/components/terminal/TerminalExecutionEngine';

const Terminal = () => {
  const { currentTheme } = useTheme();
  const { installedModules } = useCommandContext();
  const [activeTab, setActiveTab] = useState('terminal');
  const [terminalHistory, setTerminalHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  // Use our custom hooks
  const {
    executionResult,
    isRunning,
    openResultDialog,
    runCommand,
    setOpenResultDialog
  } = useTerminalExecution();
  
  const onHistoryNavigation = (direction: 'up' | 'down') => {
    if (direction === 'up') {
      if (historyIndex < terminalHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setTerminalInput(terminalHistory[terminalHistory.length - 1 - newIndex]);
      }
    } else {
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
  
  const handleSubmitCommand = async () => {
    if (!terminalInput.trim()) return;
    
    // Add to history
    setTerminalHistory(prev => [...prev, terminalInput]);
    setHistoryIndex(-1);
    
    // Process command through our execution engine
    await runCommand(terminalInput);
    
    // Clear input
    setTerminalInput('');
  };
  
  const {
    terminalInfo,
    setTerminalInfo,
    isFullscreen,
    toggleFullscreen,
    terminalInput,
    setTerminalInput,
    selectedFile,
    setSelectedFile,
    handleTerminalKeyDown
  } = useTerminalState(handleSubmitCommand, onHistoryNavigation);
  
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
              handleKeyDown={handleTerminalKeyDown}
              currentTheme={currentTheme}
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              isRunning={isRunning}
              setIsRunning={() => {}} // This is now handled by useTerminalExecution
              onFileRun={runCommand}
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

      <CodeExecutionResult
        open={openResultDialog}
        onOpenChange={setOpenResultDialog}
        output={executionResult.output}
        fileName={executionResult.command}
        executionTime={executionResult.executionTime}
        language={terminalInfo.activeEnvironment}
        hasError={executionResult.hasError}
        suggestions={executionResult.suggestions}
      />
    </div>
  );
};

export default Terminal;
