
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
  ListFilter,
  AlertCircle,
  Server,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [errorLogs, setErrorLogs] = useState<{message: string, timestamp: Date, level: 'error' | 'warning' | 'info'}[]>([]);
  
  // Simulate terminal activity
  useEffect(() => {
    const timer = setInterval(() => {
      // Update memory usage randomly to simulate activity
      const newMemory = `${Math.floor(120 + Math.random() * 35)}MB`;
      setTerminalInfo(prev => ({
        ...prev,
        memoryUsage: newMemory
      }));
      
      // Occasionally add an error log
      if (Math.random() > 0.95) {
        addErrorLog('Низкая производительность сети', 'warning');
      }
    }, 5000);
    
    // Add initial logs
    addErrorLog('Терминал запущен', 'info');
    addErrorLog('Окружение Python 3.11 инициализировано', 'info');
    
    return () => clearInterval(timer);
  }, []);

  const addErrorLog = (message: string, level: 'error' | 'warning' | 'info') => {
    setErrorLogs(prev => [...prev, {
      message,
      timestamp: new Date(),
      level
    }]);
  };
  
  // Get installed library count per language
  const getLibraryCount = (language: string) => {
    // Mock counts, in a real app this would come from the actual installed libraries
    const counts = {
      python: 18,
      cpp: 16,
      lua: 10,
      javascript: 6,
      rust: 3,
      ruby: 1
    };
    return counts[language as keyof typeof counts] || 0;
  };
  
  const environmentOptions = [
    { id: 'python', name: 'Python 3.11', icon: <Code className="h-4 w-4" /> },
    { id: 'cpp', name: 'C++ 17', icon: <Code className="h-4 w-4" /> },
    { id: 'lua', name: 'Lua 5.4', icon: <Code className="h-4 w-4" /> },
    { id: 'javascript', name: 'Node.js', icon: <Code className="h-4 w-4" /> },
    { id: 'rust', name: 'Rust', icon: <Code className="h-4 w-4" /> }
  ];
  
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      toast.success("Полноэкранный режим включен");
    }
  };
  
  return (
    <div className={`flex flex-col animate-fade-in ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-950' : 'h-[calc(100vh-120px)]'}`}>
      <header className="p-3 border-b border-gray-800">
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
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              {environmentOptions.map((env) => (
                <button
                  key={env.id}
                  className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs ${
                    terminalInfo.activeEnvironment === env.id 
                      ? 'bg-rukod-purple bg-opacity-20 text-rukod-purple' 
                      : 'text-slate-300 hover:bg-rukod-purple hover:bg-opacity-10'
                  }`}
                  onClick={() => {
                    setTerminalInfo(prev => ({ ...prev, activeEnvironment: env.id }));
                    toast.info(`Среда ${env.name} выбрана`);
                  }}
                >
                  {env.icon}
                  <span>{env.name}</span>
                  <span className="ml-1 opacity-70">({getLibraryCount(env.id)})</span>
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-1 ml-2">
              <Cpu className="h-4 w-4" style={{ color: currentTheme.accentColor }} />
              <span className="text-xs text-slate-400">v{terminalInfo.version}</span>
            </div>
            
            <div className="flex items-center gap-1 ml-2">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              <span className="text-xs text-slate-400">{terminalInfo.status}</span>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              className="ml-2"
              onClick={toggleFullscreen}
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </header>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-grow flex flex-col">
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
            <TabsTrigger value="logs" className="data-[state=active]:border-b-2 data-[state=active]:border-rukod-purple rounded-none">
              <AlertCircle className="h-4 w-4 mr-2" />
              Логи ({errorLogs.length})
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
            
            <div className="flex-grow overflow-auto">
              <CommandOutput />
            </div>
            
            <div className="mt-auto">
              <CommandInput />
            </div>
            
            <div className="w-full text-center">
              <span className="text-xs text-slate-500">
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
          
          <TabsContent value="logs" className="flex-grow overflow-auto m-0">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold" style={{ color: currentTheme.primaryColor }}>Системные логи</h3>
              <div className="space-y-1">
                {errorLogs.length > 0 ? (
                  errorLogs.map((log, index) => (
                    <div key={index} className="p-2 rounded border-l-4 bg-opacity-10 bg-slate-800"
                        style={{ 
                          borderLeftColor: log.level === 'error' 
                            ? '#f43f5e' 
                            : log.level === 'warning' 
                              ? '#eab308' 
                              : '#3b82f6'
                        }}>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          {log.level === 'error' && <AlertCircle className="h-4 w-4 text-red-500 mr-2" />}
                          {log.level === 'warning' && <AlertCircle className="h-4 w-4 text-yellow-500 mr-2" />}
                          {log.level === 'info' && <Server className="h-4 w-4 text-blue-500 mr-2" />}
                          <span className="font-mono text-sm">{log.message}</span>
                        </div>
                        <span className="text-xs opacity-70">
                          {log.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 opacity-70">
                    Нет доступных логов
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
                  <div className="p-2 rounded bg-opacity-10" style={{ backgroundColor: currentTheme.primaryColor }}>
                    <div className="font-mono text-sm">обновить библиотеку [имя]</div>
                    <div className="text-xs opacity-70">Обновить библиотеку до последней версии</div>
                  </div>
                  <div className="p-2 rounded bg-opacity-10" style={{ backgroundColor: currentTheme.primaryColor }}>
                    <div className="font-mono text-sm">удалить библиотеку [имя]</div>
                    <div className="text-xs opacity-70">Удалить установленную библиотеку</div>
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
                  <div className="p-2 rounded bg-opacity-10" style={{ backgroundColor: currentTheme.primaryColor }}>
                    <div className="font-mono text-sm">контейнеры</div>
                    <div className="text-xs opacity-70">Список запущенных контейнеров</div>
                  </div>
                  <div className="p-2 rounded bg-opacity-10" style={{ backgroundColor: currentTheme.primaryColor }}>
                    <div className="font-mono text-sm">логи контейнера [id]</div>
                    <div className="text-xs opacity-70">Показать логи контейнера</div>
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
                  <div className="p-2 rounded bg-opacity-10" style={{ backgroundColor: currentTheme.primaryColor }}>
                    <div className="font-mono text-sm">тест [имя файла/директории]</div>
                    <div className="text-xs opacity-70">Запустить тесты</div>
                  </div>
                  <div className="p-2 rounded bg-opacity-10" style={{ backgroundColor: currentTheme.primaryColor }}>
                    <div className="font-mono text-sm">компилировать [имя файла]</div>
                    <div className="text-xs opacity-70">Скомпилировать файл</div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 rounded bg-opacity-10" style={{ backgroundColor: currentTheme.accentColor }}>
                <h4 className="text-md font-semibold mb-2">Примеры команд:</h4>
                <div className="space-y-1">
                  <div className="font-mono text-sm">установить библиотеку numpy для python</div>
                  <div className="font-mono text-sm">запустить контейнер cpp</div>
                  <div className="font-mono text-sm">выполнить main.py</div>
                  <div className="font-mono text-sm">компилировать main.cpp -o app</div>
                  <div className="font-mono text-sm">тест tests/</div>
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
