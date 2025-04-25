
import React, { createContext, useState, useContext, ReactNode } from 'react';

// Types for modules and commands
export type Module = {
  id: string;
  name: string;
  description: string;
  isInstalled: boolean;
  commands: Record<string, CommandHandler>;
};

export type CommandHandler = {
  description: string;
  execute: (args: string[]) => Promise<string>;
};

// Define the types for our commands and outputs
export type CommandOutputItem = {
  id: string;
  command: string;
  output: string;
  timestamp: Date;
  status: 'success' | 'error' | 'processing';
};

type CommandContextType = {
  history: CommandOutputItem[];
  addCommand: (command: string) => void;
  clearHistory: () => void;
  isProcessing: boolean;
  installedModules: Module[];
};

const CommandContext = createContext<CommandContextType | undefined>(undefined);

export const useCommandContext = () => {
  const context = useContext(CommandContext);
  if (!context) {
    throw new Error('useCommandContext must be used within a CommandProvider');
  }
  return context;
};

// Define base modules
const baseModules: Module[] = [
  {
    id: 'core',
    name: 'Core',
    description: 'Базовые команды системы РУКОД',
    isInstalled: true,
    commands: {
      'help': {
        description: 'Показывает список доступных команд',
        execute: async (args: string[]) => {
          // Logic for help command will be implemented in the processCommand function
          return 'Загрузка списка команд...';
        }
      },
      'clear': {
        description: 'Очищает историю команд',
        execute: async () => {
          return 'История очищена';
        }
      },
      'version': {
        description: 'Показывает версию системы',
        execute: async () => {
          return 'РУКОД AI Command Center v0.1.0';
        }
      },
      'привет': {
        description: 'Приветствие',
        execute: async () => {
          return 'Привет, командир! Чем могу помочь?';
        }
      },
      'анализировать': {
        description: 'Анализирует данные с помощью ИИ',
        execute: async (args: string[]) => {
          const target = args.join(' ') || 'объект';
          return `Запущен процесс анализа: "${target}"\n\nАнализ в процессе...\n\nРезультаты анализа:\n- Структура: оптимизирована\n- Производительность: высокая\n- Ресурсы: доступны\n- Статус: готово к использованию`;
        }
      },
      'авторизация': {
        description: 'Система авторизации',
        execute: async () => {
          return 'Запуск процесса авторизации...\n\nДоступные методы авторизации:\n- Google\n- Github\n- Telegram\n\nДля выбора метода используйте команду "авторизация: метод"';
        }
      }
    }
  },
  {
    id: 'animation',
    name: 'Анимация',
    description: 'Модуль анимаций и визуальных эффектов',
    isInstalled: false,
    commands: {
      'анимация': {
        description: 'Запускает визуальный эффект',
        execute: async (args: string[]) => {
          const effect = args[0] || 'pulse';
          return `Анимационный эффект "${effect}" запущен успешно. Вы можете видеть эффект в интерфейсе.`;
        }
      },
      'визуализация': {
        description: 'Создает визуализацию данных',
        execute: async (args: string[]) => {
          const dataType = args[0] || 'график';
          return `Визуализация "${dataType}" создается...\n\nВизуализация успешно создана и отображается в интерфейсе.`;
        }
      }
    }
  },
  {
    id: 'dev',
    name: 'Разработка',
    description: 'Модуль для разработки и отладки',
    isInstalled: false,
    commands: {
      'отладка': {
        description: 'Запускает режим отладки',
        execute: async () => {
          return 'Режим отладки активирован.\n\nОтслеживаются события:\n- ввод пользователя\n- выполнение команд\n- загрузка модулей';
        }
      },
      'тестирование': {
        description: 'Запускает тестирование системы',
        execute: async () => {
          return 'Начало тестирования системы...\n\nПроверка подсистем:\n✓ Ядро: ОК\n✓ Команды: ОК\n✓ ИИ: ОК\n✓ Интерфейс: ОК\n\nТестирование завершено успешно.';
        }
      }
    }
  }
];

export const CommandProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<CommandOutputItem[]>([{
    id: '0',
    command: '',
    output: 'Добро пожаловать в РУКОД AI Command Center! Введите команду или напишите "help" для просмотра доступных команд.',
    timestamp: new Date(),
    status: 'success'
  }]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [installedModules, setInstalledModules] = useState<Module[]>(
    baseModules.filter(module => module.isInstalled)
  );

  // Helper function to format module list
  const formatModuleList = (): string => {
    const available = baseModules
      .filter(module => !module.isInstalled)
      .map(module => `- ${module.name}: ${module.description}`);
    
    const installed = installedModules
      .map(module => `- ${module.name}: ${module.description} [установлен]`);
    
    return `Доступные модули:\n${installed.join('\n')}\n\nМодули для установки:\n${available.join('\n')}`;
  };

  // Install module function
  const installModule = async (moduleName: string): Promise<string> => {
    const moduleToInstall = baseModules.find(
      m => m.name.toLowerCase() === moduleName.toLowerCase() || 
           m.id.toLowerCase() === moduleName.toLowerCase()
    );

    if (!moduleToInstall) {
      return `Модуль "${moduleName}" не найден. Используйте команду "modules" для просмотра доступных модулей.`;
    }

    if (moduleToInstall.isInstalled) {
      return `Модуль "${moduleToInstall.name}" уже установлен.`;
    }

    // Simulate installation delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const updatedModule = { ...moduleToInstall, isInstalled: true };
    
    setInstalledModules(prev => [...prev, updatedModule]);
    
    return `Модуль "${moduleToInstall.name}" успешно установлен.\n\nДобавлены команды:\n${
      Object.entries(moduleToInstall.commands)
        .map(([cmd, handler]) => `- ${cmd}: ${handler.description}`)
        .join('\n')
    }`;
  };

  // Command processor
  const processCommand = async (command: string): Promise<string> => {
    // Trim the command
    command = command.trim();
    
    // Check if command is empty
    if (!command) return 'Пожалуйста, введите команду.';

    // Handle special commands first
    if (command.toLowerCase() === 'help') {
      const commandList = installedModules.flatMap(module => 
        Object.entries(module.commands).map(([cmd, handler]) => 
          `- ${cmd}: ${handler.description}`
        )
      );
      
      return `Доступные команды:\n${commandList.join('\n')}\n\nСпециальные команды:\n- скачать: <модуль> - загрузить новый модуль\n- запуск: <команда> - запустить команду\n- modules - просмотр доступных модулей`;
    }
    
    if (command.toLowerCase() === 'clear') {
      setHistory([]);
      return 'История очищена';
    }
    
    if (command.toLowerCase() === 'modules') {
      return formatModuleList();
    }

    // Check for "скачать:" prefix
    if (command.toLowerCase().startsWith('скачать:')) {
      const moduleName = command.split(':')[1]?.trim();
      if (!moduleName) {
        return 'Ошибка: укажите название модуля после "Скачать:"';
      }
      
      return await installModule(moduleName);
    }
    
    // Check for "запуск:" prefix
    if (command.toLowerCase().startsWith('запуск:')) {
      const cmd = command.split(':')[1]?.trim();
      if (!cmd) {
        return 'Ошибка: укажите команду после "Запуск:"';
      }
      
      if (cmd.toLowerCase() === 'привет') {
        return 'Привет, командир. Я готов.';
      }
      
      // Process the remaining command without the prefix
      return processCommand(cmd);
    }
    
    // Check for "авторизация:" prefix
    if (command.toLowerCase().startsWith('авторизация:')) {
      const method = command.split(':')[1]?.trim().toLowerCase();
      
      if (!method) {
        return 'Укажите метод авторизации. Например: "авторизация: Google"';
      }
      
      if (['google', 'github', 'telegram'].includes(method)) {
        return `Запуск процесса авторизации через ${method}...\n\nАутентификация успешна!\nПользователь: Командир\nУровень доступа: Администратор`;
      } else {
        return `Метод авторизации "${method}" не поддерживается. Используйте Google, Github или Telegram.`;
      }
    }
    
    // Split command and arguments
    const [mainCmd, ...args] = command.split(' ');
    
    // Find command handler in installed modules
    for (const module of installedModules) {
      if (module.commands[mainCmd.toLowerCase()]) {
        return await module.commands[mainCmd.toLowerCase()].execute(args);
      }
    }

    // If we recognize a command related to an uninstalled module
    const uninstalledModule = baseModules
      .filter(m => !m.isInstalled)
      .find(m => Object.keys(m.commands).includes(mainCmd.toLowerCase()));
      
    if (uninstalledModule) {
      return `Команда "${mainCmd}" принадлежит модулю "${uninstalledModule.name}", который не установлен. Используйте "скачать: ${uninstalledModule.name}" для установки.`;
    }

    // Special case for analyzing with AI
    if (mainCmd.toLowerCase().startsWith('анализ')) {
      const target = args.join(' ') || 'текущий проект';
      return `ИИ анализирует: ${target}\n\nРабота с данными...\n\nЗаключение ИИ:\nАнализ успешно выполнен. Проект оптимизирован и готов к использованию. Рекомендуется добавить модуль Анимация для улучшения визуальной составляющей.`;
    }
    
    // Handle greetings
    if (['привет', 'здравствуй', 'здравствуйте', 'hi', 'hello'].includes(mainCmd.toLowerCase())) {
      return 'Добрый день, командир! Система РУКОД готова к работе. Чем могу помочь?';
    }
    
    // Default response for unknown commands
    return `Команда не распознана: ${command}. Используйте "help" для просмотра доступных команд.`;
  };

  const addCommand = async (command: string) => {
    if (!command.trim()) return;
    
    setIsProcessing(true);
    
    const newCommand: CommandOutputItem = {
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
      isProcessing,
      installedModules
    }}>
      {children}
    </CommandContext.Provider>
  );
};
