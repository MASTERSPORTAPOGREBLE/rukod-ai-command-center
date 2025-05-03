
import { ContainerInfo, LogEntry, ProgrammingLanguage } from '../models/types';
import { commandHandlers, processContainerCommand } from './commandHandlers';

// Mock containers data
const mockContainers: ContainerInfo[] = [
  {
    id: 'container-1',
    name: 'python-dev',
    language: 'python',
    status: 'running',
    memoryUsage: 25.4,
    cpuUsage: 12.7,
    tags: ['development', 'ml'],
    startTime: new Date(Date.now() - 3600000), // 1 hour ago
    libraryId: 'lib-python-1'
  },
  {
    id: 'container-2',
    name: 'cpp-build',
    language: 'cpp',
    status: 'stopped',
    memoryUsage: 0,
    cpuUsage: 0,
    tags: ['build'],
    startTime: new Date(Date.now() - 7200000), // 2 hours ago
    libraryId: undefined
  },
  {
    id: 'container-3',
    name: 'lua-game',
    language: 'lua',
    status: 'running',
    memoryUsage: 12.8,
    cpuUsage: 5.3,
    tags: ['game', 'development'],
    startTime: new Date(Date.now() - 1800000), // 30 minutes ago
    libraryId: 'lib-lua-1'
  }
];

// Mock logs data
const mockLogs: LogEntry[] = [
  {
    id: 'log-1',
    level: 'info',
    message: 'Система инициализирована',
    timestamp: new Date(Date.now() - 3600000) // 1 hour ago
  },
  {
    id: 'log-2',
    level: 'error',
    message: 'Ошибка выполнения: недопустимый синтаксис',
    timestamp: new Date(Date.now() - 1800000) // 30 minutes ago
  },
  {
    id: 'log-3',
    level: 'warning',
    message: 'Предупреждение: высокое использование памяти',
    timestamp: new Date(Date.now() - 900000) // 15 minutes ago
  },
  {
    id: 'log-4',
    level: 'success',
    message: 'Контейнер успешно запущен: python-dev',
    timestamp: new Date(Date.now() - 600000) // 10 minutes ago
  }
];

// Container listeners
const containerListeners: Array<(containers: ContainerInfo[]) => void> = [];

// Logs listeners
const logListeners: Array<(logs: LogEntry[]) => void> = [];

// Available commands dictionary
const availableCommands: Record<string, (args: string[]) => Promise<string>> = {
  // Container commands
  'container': async (args: string[]) => processContainerCommand(args),
  
  // File system commands
  'ls': commandHandlers.fileSystemCommands.ls,
  'cd': commandHandlers.fileSystemCommands.cd,
  'pwd': commandHandlers.fileSystemCommands.pwd,
  'echo': commandHandlers.utilityCommands.echo,
  'cat': commandHandlers.fileSystemCommands.cat,
  
  // Package management
  'install': commandHandlers.packageCommands.install,
  'uninstall': commandHandlers.packageCommands.uninstall,
  
  // Utility commands
  'clear': commandHandlers.utilityCommands.clear,
  'help': commandHandlers.utilityCommands.help,
  
  // Python commands
  'print': commandHandlers.pythonCommands.print,
  
  // Execution commands
  'run': commandHandlers.executionCommands.run
};

// Language-specific interpreters
const languageInterpreters: Record<string, (code: string) => Promise<string>> = {
  'python': async (code: string) => {
    // Simulate Python execution
    if (code.includes('print') || code.includes('print(')) {
      try {
        // Extract the content inside the print statement
        const printMatch = code.match(/print\s*\(['"](.+)['"]\)/i);
        if (printMatch) {
          return printMatch[1];
        } else {
          return 'Error: Invalid print syntax';
        }
      } catch (error) {
        return `Error executing Python code: ${error}`;
      }
    } else if (code.includes('import') && !code.includes('matplotlib')) {
      return 'Module imported successfully';
    } else if (code.includes('def')) {
      return 'Function defined';
    } else if (code.includes('class')) {
      return 'Class defined';
    } else {
      // Generic execution result
      return `Executing Python code:\n${code}\n\nExecution complete.`;
    }
  },
  
  'javascript': async (code: string) => {
    // Simulate JavaScript execution
    if (code.includes('console.log')) {
      try {
        const logMatch = code.match(/console\.log\(['"](.+)['"]\)/i);
        if (logMatch) {
          return logMatch[1];
        } else {
          return 'Error: Invalid console.log syntax';
        }
      } catch (error) {
        return `Error executing JavaScript code: ${error}`;
      }
    } else if (code.includes('function')) {
      return 'Function defined';
    } else if (code.includes('class')) {
      return 'Class defined';
    } else {
      // Generic execution result
      return `Executing JavaScript code:\n${code}\n\nExecution complete.`;
    }
  },
  
  'cpp': async (code: string) => {
    // Check for common C++ patterns
    if (code.includes('std::cout') || code.includes('cout <<')) {
      try {
        const coutMatch = code.match(/cout\s*<<\s*["'](.+)["']/i) || 
                          code.match(/std::cout\s*<<\s*["'](.+)["']/i);
        if (coutMatch) {
          return coutMatch[1];
        } else {
          return 'Error: Invalid cout syntax';
        }
      } catch (error) {
        return `Error executing C++ code: ${error}`;
      }
    } else if (code.includes('int main')) {
      return 'C++ program compiled and executed successfully.';
    } else {
      // Generic compilation and execution
      return `Compiling C++ code:\n${code}\n\nCompilation successful.\nExecution complete.`;
    }
  },
  
  'lua': async (code: string) => {
    // Simulate Lua execution
    if (code.includes('print(')) {
      try {
        const printMatch = code.match(/print\s*\(['"](.+)['"]\)/i);
        if (printMatch) {
          return printMatch[1];
        } else {
          return 'Error: Invalid print syntax';
        }
      } catch (error) {
        return `Error executing Lua code: ${error}`;
      }
    } else if (code.includes('function')) {
      return 'Lua function defined';
    } else if (code.includes('local')) {
      return 'Lua variable defined';
    } else {
      // Generic execution result
      return `Executing Lua code:\n${code}\n\nExecution complete.`;
    }
  }
};

export const terminalService = {
  // Container methods
  getContainers: () => {
    return [...mockContainers];
  },

  addContainerListener: (listener: (containers: ContainerInfo[]) => void) => {
    containerListeners.push(listener);
    return () => {
      const index = containerListeners.indexOf(listener);
      if (index !== -1) {
        containerListeners.splice(index, 1);
      }
    };
  },

  stopContainer: (containerId: string) => {
    const containerIndex = mockContainers.findIndex(c => c.id === containerId);
    if (containerIndex !== -1) {
      mockContainers[containerIndex].status = 'stopped';
      mockContainers[containerIndex].cpuUsage = 0;
      mockContainers[containerIndex].memoryUsage = 0;
      
      // Notify listeners
      containerListeners.forEach(listener => listener([...mockContainers]));
      
      return true;
    }
    return false;
  },
  
  startContainer: (containerId: string) => {
    const containerIndex = mockContainers.findIndex(c => c.id === containerId);
    if (containerIndex !== -1) {
      mockContainers[containerIndex].status = 'running';
      mockContainers[containerIndex].cpuUsage = Math.random() * 20;
      mockContainers[containerIndex].memoryUsage = Math.random() * 50;
      
      // Notify listeners
      containerListeners.forEach(listener => listener([...mockContainers]));
      
      return true;
    }
    return false;
  },
  
  removeContainer: (containerId: string) => {
    const containerIndex = mockContainers.findIndex(c => c.id === containerId);
    if (containerIndex !== -1) {
      mockContainers.splice(containerIndex, 1);
      
      // Notify listeners
      containerListeners.forEach(listener => listener([...mockContainers]));
      
      return true;
    }
    return false;
  },
  
  // Log methods
  getLogs: () => {
    return [...mockLogs];
  },
  
  addLogListener: (listener: (logs: LogEntry[]) => void) => {
    logListeners.push(listener);
    return () => {
      const index = logListeners.indexOf(listener);
      if (index !== -1) {
        logListeners.splice(index, 1);
      }
    };
  },
  
  addLog: (message: string, level: string = 'info') => {
    const newLog: LogEntry = {
      id: `log-${mockLogs.length + 1}`,
      level,
      message,
      timestamp: new Date()
    };
    
    mockLogs.push(newLog);
    
    // Notify listeners
    logListeners.forEach(listener => listener([...mockLogs]));
    
    return true;
  },
  
  clearLogs: () => {
    mockLogs.length = 0;
    
    // Notify listeners
    logListeners.forEach(listener => listener([...mockLogs]));
    
    return true;
  },

  // Enhanced code execution method
  executeCode: async (code: string, language: string): Promise<{ success: boolean, output: string, error?: string }> => {
    // Add log for code execution
    terminalService.addLog(`Выполнение кода на языке ${language}`, 'info');
    
    // Validate input
    if (!code || !code.trim()) {
      return { 
        success: false, 
        output: '', 
        error: 'Empty code provided' 
      };
    }
    
    // Check if we have an interpreter for this language
    const interpreter = languageInterpreters[language.toLowerCase()];
    if (!interpreter) {
      return { 
        success: false, 
        output: '', 
        error: `No interpreter available for ${language}` 
      };
    }
    
    try {
      // Simulate execution delay
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
      
      // Execute code using the appropriate interpreter
      const result = await interpreter(code);
      
      // Check for error patterns in the result
      if (result.toLowerCase().includes('error')) {
        terminalService.addLog(`Ошибка выполнения кода на языке ${language}`, 'error');
        return {
          success: false,
          output: '',
          error: result
        };
      }
      
      // Log successful execution
      terminalService.addLog(`Код на языке ${language} успешно выполнен`, 'success');
      
      return {
        success: true,
        output: result
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      terminalService.addLog(`Ошибка выполнения кода: ${errorMessage}`, 'error');
      
      return {
        success: false,
        output: '',
        error: errorMessage
      };
    }
  },

  // Execute command method - enhanced to handle any command
  executeCommand: async (command: string) => {
    // Add log for command execution
    terminalService.addLog(`Выполнение команды: ${command}`, 'info');
    
    // Parse the command and arguments
    const parts = command.trim().split(/\s+/);
    const mainCommand = parts[0].toLowerCase();
    const args = parts.slice(1);
    
    // Simulate command execution delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Special handling for Python print commands
    if (mainCommand === 'print') {
      try {
        // Extract the content inside the print statement
        // This handles both print("text") and print('text')
        const printMatch = command.match(/print\s*\(['"](.+)['"]\)/i);
        const printContent = printMatch ? printMatch[1] : args.join(' ');
        
        // Check for level request
        if (printContent.toLowerCase().includes('level')) {
          const level = Math.floor(Math.random() * 100);
          return `Level: ${level}`;
        }
        
        return printContent;
      } catch (error) {
        return `Error executing print: ${error}`;
      }
    }
    
    // Check if it's one of the predefined commands
    if (availableCommands[mainCommand]) {
      try {
        const result = await availableCommands[mainCommand](args);
        return result;
      } catch (error) {
        terminalService.addLog(`Error executing command: ${error}`, 'error');
        return `Error: ${error}`;
      }
    }
    
    // Process language-specific execution
    if (command.toLowerCase().startsWith('python ') || 
        command.toLowerCase().startsWith('node ') || 
        command.toLowerCase().startsWith('lua ') ||
        command.toLowerCase().startsWith('g++ ')) {
      
      let language = 'unknown';
      let code = '';
      
      if (command.toLowerCase().startsWith('python ')) {
        language = 'python';
        code = command.substring(7);
      } else if (command.toLowerCase().startsWith('node ')) {
        language = 'javascript';
        code = command.substring(5);
      } else if (command.toLowerCase().startsWith('lua ')) {
        language = 'lua';
        code = command.substring(4);
      } else if (command.toLowerCase().startsWith('g++ ')) {
        language = 'cpp';
        code = command.substring(4);
      }
      
      // Execute code as string
      const { success, output, error } = await terminalService.executeCode(code, language);
      
      if (!success) {
        return `Ошибка выполнения кода на языке ${language}: ${error}`;
      }
      
      return `Результат выполнения (${language}):\n${output}`;
    }
    
    // Process different commands (legacy command handling)
    if (command.toLowerCase().includes('container start') || command.toLowerCase().includes('запуск контейнера')) {
      const parts = command.split(' ');
      const language = parts[parts.length - 1] as ProgrammingLanguage;
      
      const container = mockContainers.find(c => c.language === language);
      if (container) {
        terminalService.startContainer(container.id);
        terminalService.addLog(`Контейнер ${language} успешно запущен`, 'success');
      } else {
        const newContainer: ContainerInfo = {
          id: `container-${mockContainers.length + 1}`,
          name: `${language}-new`,
          language: language as ProgrammingLanguage,
          status: 'running',
          memoryUsage: Math.random() * 30,
          cpuUsage: Math.random() * 15,
          tags: ['new'],
          startTime: new Date(),
          libraryId: undefined
        };
        
        mockContainers.push(newContainer);
        containerListeners.forEach(listener => listener([...mockContainers]));
        terminalService.addLog(`Новый контейнер ${language} создан и запущен`, 'success');
      }
      return `Контейнер ${language} запущен`;
    } else if (command.toLowerCase().includes('container stop') || command.toLowerCase().includes('остановить контейнер')) {
      const parts = command.split(' ');
      const id = parts[parts.length - 1];
      
      if (terminalService.stopContainer(id)) {
        terminalService.addLog(`Контейнер ${id} остановлен`, 'success');
        return `Контейнер ${id} остановлен`;
      } else {
        terminalService.addLog(`Контейнер ${id} не найден`, 'error');
        return `Контейнер ${id} не найден`;
      }
    } else if (command.toLowerCase().includes('container list') || command.toLowerCase().includes('список контейнеров')) {
      const containers = terminalService.getContainers();
      terminalService.addLog(`Список контейнеров: ${containers.length} найдено`, 'info');
      return `Найдено ${containers.length} контейнеров`;
    } else if (command.toLowerCase() === 'clear' || command.toLowerCase() === 'очистить') {
      terminalService.clearLogs();
      return 'История команд очищена';
    } else if (command.toLowerCase() === 'help' || command.toLowerCase() === 'помощь') {
      terminalService.addLog('Вызвана команда помощи', 'info');
      return `Доступные команды:
- container start [язык] - запустить контейнер
- container stop [id] - остановить контейнер
- container list - список контейнеров
- clear - очистить историю команд
- help - показать эту справку
- ls - список файлов
- cd [dir] - сменить директорию
- pwd - текущая директория
- cat [file] - показать содержимое файла
- run [file] - выполнить файл
- install [package] - установить пакет
- uninstall [package] - удалить пакет`;
    } else if (command.toLowerCase().includes('run') || command.toLowerCase().includes('запустить')) {
      const parts = command.split(' ');
      const file = parts[parts.length - 1];
      
      terminalService.addLog(`Запуск файла: ${file}`, 'info');
      
      // Simulate file execution
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      terminalService.addLog(`Файл ${file} успешно выполнен`, 'success');
      return `Файл ${file} выполнен`;
    } else {
      // Generic command handling
      terminalService.addLog(`Выполняется общая команда: ${command}`, 'info');
      
      // This simulates a shell that can execute any command, even if we don't specifically handle it
      await new Promise(resolve => setTimeout(resolve, 500));
      return `Executed: ${command}\nOutput: Command processed successfully`;
    }
  }
};
