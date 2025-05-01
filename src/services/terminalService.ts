
import { ContainerInfo, LogEntry, ProgrammingLanguage } from '../models/types';

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
  // Container management
  'container': async (args: string[]) => {
    const subCommand = args[0]?.toLowerCase();
    const param = args[1];
    
    switch (subCommand) {
      case 'start':
        if (!param) return 'Missing language parameter. Usage: container start [language]';
        return terminalService.executeCommand(`container start ${param}`);
      case 'stop':
        if (!param) return 'Missing container ID. Usage: container stop [id]';
        return terminalService.executeCommand(`container stop ${param}`);
      case 'list':
        return terminalService.executeCommand('container list');
      case 'remove':
      case 'rm':
        if (!param) return 'Missing container ID. Usage: container remove [id]';
        if (terminalService.removeContainer(param)) {
          return `Container ${param} removed`;
        }
        return `Container ${param} not found`;
      case 'logs':
        if (!param) return 'Missing container ID. Usage: container logs [id]';
        const container = mockContainers.find(c => c.id === param);
        if (!container) return `Container ${param} not found`;
        terminalService.addLog(`Showing logs for container ${param}`, 'info');
        return `Logs for container ${param} (${container.name}): No logs available`;
      default:
        return `Unknown container subcommand: ${subCommand}. Available: start, stop, list, remove, logs`;
    }
  },
  
  // System commands
  'ls': async (args: string[]) => {
    const files = [
      'main.py', 'utils.py', 'data.json', 'config.yml',
      'app.js', 'index.html', 'styles.css',
      'main.cpp', 'header.h', 'Makefile',
      'game.lua', 'engine.lua', 'sprites/'
    ];
    return files.join('\n');
  },
  
  'cd': async (args: string[]) => {
    const dir = args[0] || '';
    return `Changed directory to ${dir || '/'}`; 
  },
  
  'pwd': async () => '/home/user/project',
  
  'echo': async (args: string[]) => args.join(' '),
  
  'cat': async (args: string[]) => {
    const file = args[0];
    if (!file) return 'Missing file parameter. Usage: cat [file]';
    
    // Simple mock content for a few files
    const fileContents: Record<string, string> = {
      'main.py': 'def main():\n    print("Hello, World!")\n\nif __name__ == "__main__":\n    main()',
      'app.js': 'console.log("Hello from JavaScript!");',
      'main.cpp': '#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}',
      'game.lua': 'function love.draw()\n    love.graphics.print("Hello World!", 400, 300)\nend'
    };
    
    return fileContents[file] || `File ${file} not found`;
  },
  
  // Package management
  'install': async (args: string[]) => {
    const pkg = args[0];
    if (!pkg) return 'Missing package name. Usage: install [package]';
    
    terminalService.addLog(`Installing package: ${pkg}`, 'info');
    await new Promise(resolve => setTimeout(resolve, 1000));
    terminalService.addLog(`Package ${pkg} installed successfully`, 'success');
    
    return `Package ${pkg} installed successfully`;
  },
  
  'uninstall': async (args: string[]) => {
    const pkg = args[0];
    if (!pkg) return 'Missing package name. Usage: uninstall [package]';
    
    terminalService.addLog(`Uninstalling package: ${pkg}`, 'info');
    await new Promise(resolve => setTimeout(resolve, 800));
    terminalService.addLog(`Package ${pkg} uninstalled`, 'success');
    
    return `Package ${pkg} uninstalled`;
  },
  
  // Utility commands
  'clear': async () => {
    terminalService.clearLogs();
    return 'Terminal cleared';
  },
  
  'help': async () => {
    terminalService.addLog('Showing help information', 'info');
    return `Available commands:
- container start [language] - Start a container for the specified language
- container stop [id] - Stop a container
- container list - List all containers
- container remove [id] - Remove a container
- container logs [id] - Show logs for a container
- ls - List files
- cd [dir] - Change directory
- pwd - Show current directory
- echo [text] - Print text
- cat [file] - Show file contents
- install [package] - Install a package
- uninstall [package] - Uninstall a package
- run [file] - Run a file
- clear - Clear the terminal
- help - Show this help information`;
  },
  
  'run': async (args: string[]) => {
    const file = args[0];
    if (!file) return 'Missing file parameter. Usage: run [file]';
    
    terminalService.addLog(`Running file: ${file}`, 'info');
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (file.endsWith('.py')) {
      terminalService.addLog('Python interpreter started', 'info');
      await new Promise(resolve => setTimeout(resolve, 500));
      terminalService.addLog('Output: Hello from Python!', 'success');
      return 'File executed successfully';
    } else if (file.endsWith('.js')) {
      terminalService.addLog('Node.js runtime started', 'info');
      await new Promise(resolve => setTimeout(resolve, 500));
      terminalService.addLog('Output: Hello from JavaScript!', 'success');
      return 'File executed successfully';
    } else if (file.endsWith('.cpp')) {
      terminalService.addLog('Compiling C++ code...', 'info');
      await new Promise(resolve => setTimeout(resolve, 1000));
      terminalService.addLog('Compilation successful', 'success');
      terminalService.addLog('Running executable...', 'info');
      await new Promise(resolve => setTimeout(resolve, 500));
      terminalService.addLog('Output: Hello from C++!', 'success');
      return 'File compiled and executed successfully';
    } else {
      return `Cannot execute file with extension ${file.split('.').pop()}`;
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
