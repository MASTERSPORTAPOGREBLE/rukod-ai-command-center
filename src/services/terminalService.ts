
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
    startTime: new Date(Date.now() - 3600000) // 1 hour ago
  },
  {
    id: 'container-2',
    name: 'cpp-build',
    language: 'cpp',
    status: 'stopped',
    memoryUsage: 0,
    cpuUsage: 0,
    tags: ['build'],
    startTime: new Date(Date.now() - 7200000) // 2 hours ago
  },
  {
    id: 'container-3',
    name: 'lua-game',
    language: 'lua',
    status: 'running',
    memoryUsage: 12.8,
    cpuUsage: 5.3,
    tags: ['game', 'development'],
    startTime: new Date(Date.now() - 1800000) // 30 minutes ago
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

  // Execute command method
  executeCommand: async (command: string) => {
    // Add log for command execution
    terminalService.addLog(`Выполнение команды: ${command}`, 'info');
    
    // Simulate command execution delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Process different commands
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
          startTime: new Date()
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
    } else if (command.toLowerCase().includes('clear') || command.toLowerCase().includes('очистить')) {
      terminalService.clearLogs();
      return 'История команд очищена';
    } else if (command.toLowerCase().includes('help') || command.toLowerCase().includes('помощь')) {
      terminalService.addLog('Вызвана команда помощи', 'info');
      return `Доступные команды:
- container start [язык] - запустить контейнер
- container stop [id] - остановить контейнер
- container list - список контейнеров
- clear - очистить историю команд
- help - показать эту справку`;
    } else if (command.toLowerCase().includes('run') || command.toLowerCase().includes('запустить')) {
      const parts = command.split(' ');
      const file = parts[parts.length - 1];
      
      terminalService.addLog(`Запуск файла: ${file}`, 'info');
      
      // Simulate file execution
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      terminalService.addLog(`Файл ${file} успешно выполнен`, 'success');
      return `Файл ${file} выполнен`;
    } else {
      terminalService.addLog(`Неизвестная команда: ${command}`, 'warning');
      return `Неизвестная команда: ${command}. Введите "help" для получения списка команд.`;
    }
  }
};
