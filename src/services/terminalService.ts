
import { v4 as uuidv4 } from 'uuid';
import { ProgrammingLanguage } from '../models/types';

export interface TerminalLog {
  id: string;
  message: string;
  timestamp: Date;
  level: 'error' | 'warning' | 'info' | 'success';
}

export interface ContainerInfo {
  id: string;
  name: string;
  language: ProgrammingLanguage;
  status: 'running' | 'stopped' | 'error';
  startTime: Date;
  memoryUsage: string;
  cpuUsage: string;
}

class TerminalService {
  private logs: TerminalLog[] = [];
  private containers: ContainerInfo[] = [];
  private listeners: ((logs: TerminalLog[]) => void)[] = [];
  private containerListeners: ((containers: ContainerInfo[]) => void)[] = [];
  
  constructor() {
    // Initialize with some default logs
    this.addLog('Терминальный сервис инициализирован', 'info');
    
    // Create some mock containers
    this.containers = [
      {
        id: uuidv4(),
        name: 'python-dev',
        language: 'python',
        status: 'running',
        startTime: new Date(Date.now() - 3600000), // 1 hour ago
        memoryUsage: '128MB',
        cpuUsage: '2%'
      },
      {
        id: uuidv4(),
        name: 'cpp-compiler',
        language: 'cpp',
        status: 'stopped',
        startTime: new Date(Date.now() - 7200000), // 2 hours ago
        memoryUsage: '0MB',
        cpuUsage: '0%'
      }
    ];
    
    // Simulate system activity
    setInterval(() => {
      // Update container stats
      this.containers = this.containers.map(container => {
        if (container.status === 'running') {
          const memoryUsage = parseInt(container.memoryUsage) + Math.floor(Math.random() * 10 - 5);
          const cpuUsage = Math.max(1, Math.min(99, Math.floor(Math.random() * 5) + parseInt(container.cpuUsage)));
          
          return {
            ...container,
            memoryUsage: `${memoryUsage}MB`,
            cpuUsage: `${cpuUsage}%`
          };
        }
        return container;
      });
      
      // Notify listeners
      this.notifyContainerListeners();
      
      // Occasionally add system logs
      if (Math.random() > 0.9) {
        const messages = [
          'Проверка системных ресурсов...',
          'Обновление индексов пакетов...',
          'Проверка сетевого подключения...',
          'Очистка временных файлов...'
        ];
        
        const randomMsg = messages[Math.floor(Math.random() * messages.length)];
        this.addLog(randomMsg, 'info');
      }
    }, 5000);
  }
  
  public getLogs(): TerminalLog[] {
    return [...this.logs];
  }
  
  public getContainers(): ContainerInfo[] {
    return [...this.containers];
  }
  
  public addLog(message: string, level: TerminalLog['level'] = 'info'): TerminalLog {
    const newLog: TerminalLog = {
      id: uuidv4(),
      message,
      timestamp: new Date(),
      level
    };
    
    this.logs.unshift(newLog); // Add to beginning for reverse chronological order
    
    // Limit logs to 1000 entries to prevent memory issues
    if (this.logs.length > 1000) {
      this.logs = this.logs.slice(0, 1000);
    }
    
    this.notifyListeners();
    return newLog;
  }
  
  public clearLogs(): void {
    this.logs = [];
    this.notifyListeners();
  }
  
  public startContainer(language: ProgrammingLanguage): ContainerInfo {
    const containerNames = {
      python: 'python-runtime',
      cpp: 'cpp-compiler',
      lua: 'lua-interpreter',
      javascript: 'node-runtime',
      rust: 'rust-compiler',
      ruby: 'ruby-interpreter'
    };
    
    const newContainer: ContainerInfo = {
      id: uuidv4(),
      name: containerNames[language],
      language,
      status: 'running',
      startTime: new Date(),
      memoryUsage: `${Math.floor(Math.random() * 50 + 50)}MB`,
      cpuUsage: `${Math.floor(Math.random() * 10 + 1)}%`
    };
    
    this.containers.push(newContainer);
    this.notifyContainerListeners();
    
    this.addLog(`Контейнер ${newContainer.name} (${language}) запущен`, 'success');
    return newContainer;
  }
  
  public stopContainer(containerId: string): boolean {
    const containerIndex = this.containers.findIndex(c => c.id === containerId);
    
    if (containerIndex >= 0) {
      const container = this.containers[containerIndex];
      
      // Update container status
      this.containers[containerIndex] = {
        ...container,
        status: 'stopped',
        memoryUsage: '0MB',
        cpuUsage: '0%'
      };
      
      this.notifyContainerListeners();
      this.addLog(`Контейнер ${container.name} (${container.language}) остановлен`, 'info');
      return true;
    }
    
    this.addLog(`Ошибка: контейнер с ID ${containerId} не найден`, 'error');
    return false;
  }
  
  public removeContainer(containerId: string): boolean {
    const containerIndex = this.containers.findIndex(c => c.id === containerId);
    
    if (containerIndex >= 0) {
      const container = this.containers[containerIndex];
      
      // Remove container
      this.containers = this.containers.filter(c => c.id !== containerId);
      
      this.notifyContainerListeners();
      this.addLog(`Контейнер ${container.name} (${container.language}) удален`, 'info');
      return true;
    }
    
    this.addLog(`Ошибка: контейнер с ID ${containerId} не найден`, 'error');
    return false;
  }
  
  public executeCommand(command: string): Promise<string> {
    return new Promise((resolve) => {
      this.addLog(`Выполнение команды: ${command}`, 'info');
      
      // Simulate command execution delay
      setTimeout(() => {
        // Simple command parsing logic
        if (command.startsWith('help') || command.startsWith('помощь')) {
          const result = `
Доступные команды:
- help/помощь - показать эту справку
- clear/очистить - очистить историю логов
- container start <язык> - запустить контейнер
- container stop <id> - остановить контейнер
- container list - список контейнеров
- echo <текст> - вывести текст
- install <библиотека> - установить библиотеку
          `;
          this.addLog(result, 'info');
          resolve(result);
        }
        else if (command.startsWith('clear') || command.startsWith('очистить')) {
          this.clearLogs();
          this.addLog('История логов очищена', 'info');
          resolve('История логов очищена');
        }
        else if (command.startsWith('container start') || command.startsWith('запустить контейнер')) {
          const parts = command.split(' ');
          const language = parts[parts.length - 1] as ProgrammingLanguage;
          
          if (['python', 'cpp', 'lua', 'javascript', 'rust', 'ruby'].includes(language)) {
            const container = this.startContainer(language as ProgrammingLanguage);
            resolve(`Контейнер ${container.name} запущен с ID: ${container.id}`);
          } else {
            this.addLog(`Ошибка: неподдерживаемый язык '${language}'`, 'error');
            resolve(`Ошибка: неподдерживаемый язык '${language}'`);
          }
        }
        else if (command.startsWith('container stop') || command.startsWith('остановить контейнер')) {
          const parts = command.split(' ');
          const containerId = parts[parts.length - 1];
          
          const success = this.stopContainer(containerId);
          if (success) {
            resolve(`Контейнер с ID ${containerId} остановлен`);
          } else {
            resolve(`Ошибка: контейнер с ID ${containerId} не найден`);
          }
        }
        else if (command.startsWith('container list') || command.startsWith('список контейнеров')) {
          const containerList = this.containers.map(c => 
            `- ${c.name} (${c.id}): ${c.status}, RAM: ${c.memoryUsage}, CPU: ${c.cpuUsage}`
          ).join('\n');
          
          const result = containerList || 'Нет запущенных контейнеров';
          this.addLog(result, 'info');
          resolve(result);
        }
        else if (command.startsWith('echo') || command.startsWith('вывести')) {
          const text = command.substring(command.indexOf(' ') + 1);
          this.addLog(text, 'info');
          resolve(text);
        }
        else if (command.startsWith('install') || command.startsWith('установить')) {
          const package_name = command.substring(command.indexOf(' ') + 1);
          this.addLog(`Установка ${package_name}...`, 'info');
          
          // Simulate package installation
          setTimeout(() => {
            this.addLog(`Пакет ${package_name} успешно установлен!`, 'success');
          }, 1500);
          
          resolve(`Начата установка ${package_name}`);
        }
        else {
          this.addLog(`Неизвестная команда: ${command}`, 'error');
          resolve(`Неизвестная команда: ${command}. Используйте 'help' для получения списка команд.`);
        }
      }, 300);
    });
  }
  
  public addLogListener(listener: (logs: TerminalLog[]) => void): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
  
  public addContainerListener(listener: (containers: ContainerInfo[]) => void): () => void {
    this.containerListeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      this.containerListeners = this.containerListeners.filter(l => l !== listener);
    };
  }
  
  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      listener(this.getLogs());
    });
  }
  
  private notifyContainerListeners(): void {
    this.containerListeners.forEach(listener => {
      listener(this.getContainers());
    });
  }
}

// Singleton instance
export const terminalService = new TerminalService();
