
import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the types for our commands and outputs
export type CommandOutput = {
  id: string;
  command: string;
  output: string;
  timestamp: Date;
  status: 'success' | 'error' | 'processing';
};

type CommandContextType = {
  history: CommandOutput[];
  addCommand: (command: string) => void;
  clearHistory: () => void;
  isProcessing: boolean;
};

const CommandContext = createContext<CommandContextType | undefined>(undefined);

export const useCommandContext = () => {
  const context = useContext(CommandContext);
  if (!context) {
    throw new Error('useCommandContext must be used within a CommandProvider');
  }
  return context;
};

export const CommandProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<CommandOutput[]>([{
    id: '0',
    command: '',
    output: 'Добро пожаловать в РУКОД AI Command Center! Введите команду или напишите "help" для просмотра доступных команд.',
    timestamp: new Date(),
    status: 'success'
  }]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Simple command processor
  const processCommand = (command: string): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (command.toLowerCase() === 'help') {
          resolve(`Доступные команды:
- help - показать этот список
- clear - очистить историю
- version - показать версию
- settings - открыть настройки
- exit - выйти из системы

Пример: "Запуск: help" для запуска команды help`);
        } else if (command.toLowerCase() === 'clear') {
          setHistory([]);
          resolve('История очищена');
        } else if (command.toLowerCase() === 'version') {
          resolve('РУКОД AI Command Center v0.1.0');
        } else if (command.toLowerCase() === 'settings') {
          resolve('Открытие настроек...');
        } else if (command.toLowerCase() === 'exit') {
          resolve('Выход из системы...');
        } else if (command.toLowerCase().startsWith('скачать:')) {
          const mod = command.split(':')[1]?.trim();
          if (mod) {
            resolve(`Загрузка модификации "${mod}"... Это может занять некоторое время.`);
          } else {
            resolve('Ошибка: укажите имя модификации после "Скачать:"');
          }
        } else if (command.toLowerCase().startsWith('запуск:')) {
          const cmd = command.split(':')[1]?.trim();
          if (cmd) {
            return processCommand(cmd);
          } else {
            resolve('Ошибка: укажите команду после "Запуск:"');
          }
        } else {
          resolve(`Команда не распознана: ${command}. Используйте "help" для просмотра доступных команд.`);
        }
      }, 500);
    });
  };

  const addCommand = async (command: string) => {
    if (!command.trim()) return;
    
    setIsProcessing(true);
    
    const newCommand: CommandOutput = {
      id: Date.now().toString(),
      command,
      output: 'Обработка команды...',
      timestamp: new Date(),
      status: 'processing'
    };
    
    setHistory(prev => [...prev, newCommand]);
    
    try {
      const output = await processCommand(command);
      
      setHistory(prev => 
        prev.map(item => 
          item.id === newCommand.id 
            ? { ...item, output, status: 'success' } 
            : item
        )
      );
    } catch (error) {
      setHistory(prev => 
        prev.map(item => 
          item.id === newCommand.id 
            ? { ...item, output: `Ошибка: ${(error as Error).message}`, status: 'error' } 
            : item
        )
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <CommandContext.Provider value={{ 
      history, 
      addCommand, 
      clearHistory,
      isProcessing 
    }}>
      {children}
    </CommandContext.Provider>
  );
};
