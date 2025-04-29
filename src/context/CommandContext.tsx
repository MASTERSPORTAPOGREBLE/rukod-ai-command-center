import React, { createContext, useState, useContext, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ProgrammingLanguage } from '../models/types';

// Define types for command context
export interface CommandOutputItem {
  id: string;
  command?: string;
  translatedCommand?: string;
  output: string | React.ReactNode;
  status: 'success' | 'error' | 'processing';
  timestamp: Date;
}

interface Module {
  id?: string; // Add the id property
  name: string;
  version: string;
  commands: Record<string, (args: string[]) => Promise<string>>;
}

export interface UserPreferences {
  theme: 'dark' | 'light';
  fontSize: number;
  recentCommands: string[];
}

interface CommandContextType {
  history: CommandOutputItem[];
  isProcessing: boolean;
  installedModules: Module[];
  language: 'ru' | 'en';
  userPreferences: UserPreferences;
  addCommand: (command: string, translatedCommand?: string) => Promise<void>;
  clearHistory: () => void;
  setLanguage: (lang: 'ru' | 'en') => void;
}

const CommandContext = createContext<CommandContextType | undefined>(undefined);

// Mock installed modules
const mockModules: Module[] = [
  {
    id: 'core-001',
    name: 'core',
    version: '1.0.0',
    commands: {
      'help': async () => `
# Доступные команды:

## Общие
- help: Показать эту справку
- clear: Очистить историю команд

## Библиотеки
- install [library] [language]: Установить библиотеку
- list [language]: Показать установленные библиотеки

## Контейнеры
- start [language]: Запустить контейнер
- stop [container-id]: Остановить контейнер
      `,
      'clear': async () => 'История команд очищена'
    }
  },
  {
    id: 'python-001',
    name: 'python',
    version: '3.11',
    commands: {
      'python': async (args) => `Выполнение Python: ${args.join(' ')}`,
      'pip': async (args) => `Управление пакетами Python: ${args.join(' ')}`
    }
  },
  {
    id: 'cpp-001',
    name: 'cpp',
    version: '17',
    commands: {
      'g++': async (args) => `Компиляция C++: ${args.join(' ')}`,
      'clang++': async (args) => `Компиляция C++ с Clang: ${args.join(' ')}`
    }
  }
];

// Mock user preferences
const initialPreferences: UserPreferences = {
  theme: 'dark',
  fontSize: 14,
  recentCommands: ['help', 'install numpy python', 'start cpp']
};

export const CommandProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<CommandOutputItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [language, setLanguage] = useState<'ru' | 'en'>('ru');
  const [installedModules] = useState<Module[]>(mockModules);
  const [userPreferences] = useState<UserPreferences>(initialPreferences);

  const addCommand = (command: string, translatedCommand?: string) => {
    // Process code commands
    if (command.startsWith('code:') || command.startsWith('код:')) {
      const commandParts = command.split(':');
      if (commandParts.length > 1) {
        const codeCommand = commandParts[1].trim();
        
        // Create a new output item for the code command
        const newItem: CommandOutputItem = {
          id: uuidv4(),
          timestamp: new Date(),
          command,
          translatedCommand,
          output: `Обработка команды для кода: ${codeCommand}...`,
          status: 'processing'
        };
        
        setHistory(prev => [...prev, newItem]);
        
        // Simulate processing
        setTimeout(() => {
          setHistory(prev => prev.map(item => 
            item.id === newItem.id 
              ? { 
                  ...item, 
                  status: 'success', 
                  output: `Выполнено: ${codeCommand}` 
                }
              : item
          ));
        }, 1000);
        
        return;
      }
    }
    
    // Add command to history immediately to show user input
    const commandId = uuidv4();
    
    setHistory(prev => [
      ...prev,
      {
        id: commandId,
        command,
        output: 'Обработка команды...',
        status: 'processing',
        timestamp: new Date()
      }
    ]);
    
    setIsProcessing(true);
    
    try {
      // Import the interpreter dynamically to ensure smaller initial bundle
      const { interpretCommand } = await import('../services/aiCommandInterpreter');
      const result = await interpretCommand(command);
      
      // Update history with the result
      setHistory(prev => 
        prev.map(item => 
          item.id === commandId 
            ? {
                ...item,
                output: result.output,
                status: result.success ? 'success' : 'error',
              }
            : item
        )
      );
      
      // Process actions if any
      if (result.action) {
        processCommandAction(result.action, result.params);
      }
      
    } catch (error) {
      console.error('Error processing command:', error);
      
      setHistory(prev => 
        prev.map(item => 
          item.id === commandId 
            ? {
                ...item,
                output: `Ошибка: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`,
                status: 'error',
              }
            : item
        )
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const processCommandAction = (action: string, params?: Record<string, any>) => {
    // Handle specific actions returned by the interpreter
    console.log('Processing action:', action, params);
    
    // This would be expanded in a real implementation to handle
    // various actions like starting containers, installing libraries, etc.
  };

  const clearHistory = () => {
    setHistory([]);
  };
  
  const changeLanguage = (lang: 'ru' | 'en') => {
    setLanguage(lang);
  };

  return (
    <CommandContext.Provider
      value={{
        history,
        isProcessing,
        installedModules,
        language,
        userPreferences,
        addCommand,
        clearHistory,
        setLanguage: changeLanguage
      }}
    >
      {children}
    </CommandContext.Provider>
  );
};

export const useCommandContext = () => {
  const context = useContext(CommandContext);
  if (!context) {
    throw new Error('useCommandContext must be used within a CommandProvider');
  }
  return context;
};
