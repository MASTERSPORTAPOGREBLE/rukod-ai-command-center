
import React, { useState, useEffect } from 'react';
import { CommandInput } from '../components/CommandInput';
import { CommandOutput } from '../components/CommandOutput';
import { SystemStats } from '../components/SystemStats';
import { useTheme } from '../context/ThemeContext';
import { useCommandContext } from '../context/CommandContext';
import { 
  Cpu, 
  Code, 
  Terminal as TerminalIcon, 
  History, 
  Settings, 
  BookOpen,
  GitBranch,
  PanelLeft,
  ListFilter
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Terminal = () => {
  const { currentTheme } = useTheme();
  const { installedModules, history } = useCommandContext();
  const [terminalInfo, setTerminalInfo] = useState({
    version: '1.0.0',
    status: 'active',
    activeEnvironment: 'python',
    memoryUsage: '128MB'
  });
  const [activeTab, setActiveTab] = useState('terminal');
  
  // Simulate terminal activity
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

  // Get installed library count per language
  const getLibraryCount = (language: string) => {
    // Mock counts, in a real app this would come from the actual installed libraries
    const counts = {
      python: 14,
      cpp: 12,
      lua: 8,
      javascript: 6,
      rust: 3,
      ruby: 1
    };
    return counts[language as keyof typeof counts] || 0;
  };
  
  const environmentOptions = [
    { id: 'python', name: 'Python 3.11', icon: <Code className="h-4 w-4" /> },
    { id: 'cpp', name: 'C++ 17', icon: <Code className="h-4 w-4" /> },
    { id: 'lua', name: 'Lua 5.4', icon: <Code className="h-4 w-4" /> }
  ];
  
  return (
    <div className="flex flex-col h-full animate-fade-in">
      <header className="p-4 border-b border-gray-800">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <TerminalIcon 
              className="h-6 w-6 mr-2" 
              style={{ color: currentTheme.primaryColor }} 
            />
            <h1 className="text-xl font-bold" style={{ color: currentTheme.primaryColor }}>
              CodeVerse Terminal
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {environmentOptions.map((env) => (
                <button
                  key={env.id}
                  className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs ${
                    terminalInfo.activeEnvironment === env.id 
                      ? 'bg-rukod-purple bg-opacity-20 text-rukod-purple' 
                      : 'text-gray-400 hover:bg-rukod-purple hover:bg-opacity-10'
                  }`}
                  onClick={() => setTerminalInfo(prev => ({ ...prev, activeEnvironment: env.id }))}
                >
                  {env.icon}
                  <span>{env.name}</span>
                  <span className="ml-1 opacity-70">({getLibraryCount(env.id)})</span>
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-1">
              <Cpu className="h-4 w-4" style={{ color: currentTheme.accentColor }} />
              <span className="text-xs text-gray-400">v{terminalInfo.version}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              <span className="text-xs text-gray-400">{terminalInfo.status}</span>
            </div>
          </div>
        </div>
      </header>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-grow flex flex-col h-full">
        <div className="border-b border-gray-800 bg-rukod-dark">
          <TabsList className="bg-transparent border-b border-transparent">
            <TabsTrigger value="terminal" className="data-[state=active]:border-b-2 data-[state=active]:border-rukod-purple rounded-none">
              <TerminalIcon className="h-4 w-4 mr-2" />
              Терминал
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:border-b-2 data-[state=active]:border-rukod-purple rounded-none">
              <History className="h-4 w-4 mr-2" />
              История ({history.length})
            </TabsTrigger>
            <TabsTrigger value="help" className="data-[state=active]:border-b-2 data-[state=active]:border-rukod-purple rounded-none">
              <BookOpen className="h-4 w-4 mr-2" />
              Справка
            </TabsTrigger>
          </TabsList>
        </div>
        
        <div className="flex flex-col flex-grow p-4 overflow-hidden">
          <TabsContent value="terminal" className="flex-grow flex flex-col space-y-4 m-0">
            <div>
              <SystemStats />
            </div>
            
            <div className="flex-grow overflow-auto">
              <CommandOutput />
            </div>
            
            <div className="mt-auto">
              <CommandInput />
            </div>
            
            <div className="w-full text-center">
              <span className="text-xs text-gray-500">
                Введите "помощь" для просмотра доступных команд
              </span>
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="flex-grow overflow-auto m-0">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold" style={{ color: currentTheme.primaryColor }}>История команд</h3>
              <div className="space-y-1">
                {history.length > 0 ? (
                  history.map((item, index) => (
                    <div key={item.id} className="p-2 rounded bg-opacity-10 hover:bg-opacity-20 cursor-pointer transition-colors"
                        style={{ backgroundColor: currentTheme.primaryColor }}>
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-sm">{item.command}</span>
                        <span className="text-xs opacity-70">
                          {item.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
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
                    <div className="font-mono text-sm">запустить контейнер [язык]</div>
                    <div className="text-xs opacity-70">Запустить контейнер для указанного языка</div>
                  </div>
                  <div className="p-2 rounded bg-opacity-10" style={{ backgroundColor: currentTheme.primaryColor }}>
                    <div className="font-mono text-sm">остановить контейнер [id]</div>
                    <div className="text-xs opacity-70">Остановить указанный контейнер</div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 rounded bg-opacity-10" style={{ backgroundColor: currentTheme.accentColor }}>
                <h4 className="text-md font-semibold mb-2">Примеры команд:</h4>
                <div className="space-y-1">
                  <div className="font-mono text-sm">установить библиотеку numpy для python</div>
                  <div className="font-mono text-sm">запустить контейнер cpp</div>
                  <div className="font-mono text-sm">список библиотек python</div>
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
