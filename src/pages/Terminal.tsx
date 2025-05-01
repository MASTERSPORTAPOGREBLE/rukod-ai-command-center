
import React, { useState, useEffect } from 'react';
import { CommandOutput } from '../components/CommandOutput';
import { SystemStats } from '../components/SystemStats';
import { useTheme } from '../context/ThemeContext';
import { useCommandContext } from '../context/CommandContext';
import { TerminalLogs } from '../components/TerminalLogs';
import { ContainersList } from '../components/ContainersList';
import { terminalService } from '../services/terminalService';
import { TerminalHeader } from '../components/TerminalHeader';
import { QuickFileRunner } from '../components/QuickFileRunner';
import { TerminalCommandInput } from '../components/TerminalCommandInput';
import { 
  Code, 
  Terminal as TerminalIcon, 
  History, 
  BookOpen,
  AlertCircle,
  Server
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

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
            <div>
              <SystemStats />
            </div>
            
            <QuickFileRunner 
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              isRunning={isRunning}
              setIsRunning={setIsRunning}
            />
            
            <div className="flex-grow overflow-auto">
              <CommandOutput />
            </div>
            
            <TerminalCommandInput 
              terminalInput={terminalInput}
              setTerminalInput={setTerminalInput}
              handleSubmitCommand={handleSubmitCommand}
              handleKeyDown={handleKeyDown}
              currentTheme={currentTheme}
            />
            
            <div className="w-full text-center">
              <span className="text-xs text-slate-500">
                Введите "помощь" для просмотра доступных команд
              </span>
            </div>
          </TabsContent>
          
          <TabsContent value="logs" className="flex-grow overflow-auto m-0">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold" style={{ color: currentTheme.primaryColor }}>
                Системные логи
              </h3>
              <div className="w-full">
                <TerminalLogs maxHeight="calc(100vh - 250px)" />
              </div>
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    terminalService.clearLogs();
                    toast.success('Логи очищены');
                  }}
                >
                  Очистить логи
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="containers" className="flex-grow overflow-auto m-0">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold" style={{ color: currentTheme.primaryColor }}>
                  Управление контейнерами
                </h3>
              </div>
              <ContainersList />
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="flex-grow overflow-auto m-0">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold" style={{ color: currentTheme.primaryColor }}>История команд</h3>
              <div className="space-y-1">
                {terminalHistory.length > 0 ? (
                  [...terminalHistory].reverse().map((cmd, index) => (
                    <div 
                      key={index} 
                      className="p-2 rounded bg-opacity-10 hover:bg-opacity-20 cursor-pointer transition-colors flex justify-between items-center"
                      style={{ backgroundColor: currentTheme.primaryColor }}
                      onClick={() => {
                        setTerminalInput(cmd);
                      }}
                    >
                      <span className="font-mono text-sm">{cmd}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          setTerminalInput(cmd);
                          handleSubmitCommand();
                        }}
                      >
                        Повторить
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 opacity-70">
                    История команд пуста
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="help" className="flex-grow overflow-auto m-0">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold" style={{ color: currentTheme.primaryColor }}>Справка по командам</h3>
              
              <div className="space-y-2">
                <h4 className="text-md font-semibold">Общие команды</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="p-2 rounded bg-opacity-10" style={{ backgroundColor: currentTheme.primaryColor }}>
                    <div className="font-mono text-sm">помощь</div>
                    <div className="text-xs opacity-70">Показать справку по командам</div>
                  </div>
                  <div className="p-2 rounded bg-opacity-10" style={{ backgroundColor: currentTheme.primaryColor }}>
                    <div className="font-mono text-sm">очистить</div>
                    <div className="text-xs opacity-70">Очистить историю команд</div>
                  </div>
                  <div className="p-2 rounded bg-opacity-10" style={{ backgroundColor: currentTheme.primaryColor }}>
                    <div className="font-mono text-sm">статус</div>
                    <div className="text-xs opacity-70">Показать текущий статус системы</div>
                  </div>
                  <div className="p-2 rounded bg-opacity-10" style={{ backgroundColor: currentTheme.primaryColor }}>
                    <div className="font-mono text-sm">инфо [тема]</div>
                    <div className="text-xs opacity-70">Показать информацию по теме</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-md font-semibold">Управление библиотеками</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="p-2 rounded bg-opacity-10" style={{ backgroundColor: currentTheme.primaryColor }}>
                    <div className="font-mono text-sm">установить библиотеку [имя] для [язык]</div>
                    <div className="text-xs opacity-70">Установить библиотеку для указанного языка</div>
                  </div>
                  <div className="p-2 rounded bg-opacity-10" style={{ backgroundColor: currentTheme.primaryColor }}>
                    <div className="font-mono text-sm">список библиотек [язык]</div>
                    <div className="text-xs opacity-70">Показать список установленных библиотек</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-md font-semibold">Управление контейнерами</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="p-2 rounded bg-opacity-10" style={{ backgroundColor: currentTheme.primaryColor }}>
                    <div className="font-mono text-sm">container start [язык]</div>
                    <div className="text-xs opacity-70">Запустить контейнер для указанного языка</div>
                  </div>
                  <div className="p-2 rounded bg-opacity-10" style={{ backgroundColor: currentTheme.primaryColor }}>
                    <div className="font-mono text-sm">container stop [id]</div>
                    <div className="text-xs opacity-70">Остановить указанный контейнер</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-md font-semibold">Выполнение кода</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="p-2 rounded bg-opacity-10" style={{ backgroundColor: currentTheme.primaryColor }}>
                    <div className="font-mono text-sm">выполнить [имя файла]</div>
                    <div className="text-xs opacity-70">Запустить указанный файл</div>
                  </div>
                  <div className="p-2 rounded bg-opacity-10" style={{ backgroundColor: currentTheme.primaryColor }}>
                    <div className="font-mono text-sm">дебаг [имя файла]</div>
                    <div className="text-xs opacity-70">Запустить в режиме отладки</div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 rounded bg-opacity-10" style={{ backgroundColor: currentTheme.accentColor }}>
                <h4 className="text-md font-semibold mb-2">Примеры команд:</h4>
                <div className="space-y-1">
                  <div className="font-mono text-sm">container start python</div>
                  <div className="font-mono text-sm">container list</div>
                  <div className="font-mono text-sm">установить numpy</div>
                  <div className="font-mono text-sm">выполнить main.py</div>
                  <div className="font-mono text-sm">очистить</div>
                </div>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default Terminal;
