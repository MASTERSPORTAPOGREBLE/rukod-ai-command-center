
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
  
  addLog: (log: LogEntry) => {
    mockLogs.push(log);
    
    // Notify listeners
    logListeners.forEach(listener => listener([...mockLogs]));
    
    return true;
  },
  
  clearLogs: () => {
    mockLogs.length = 0;
    
    // Notify listeners
    logListeners.forEach(listener => listener([...mockLogs]));
    
    return true;
  }
};
