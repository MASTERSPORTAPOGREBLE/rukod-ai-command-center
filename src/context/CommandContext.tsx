
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
      },
      'создать': {
        description: 'Создание проектов и объектов',
        execute: async (args: string[]) => {
          const target = args.join(' ') || '';
          
          if (target.toLowerCase().includes('проект')) {
            return 'Создание нового проекта...\n\nПроект успешно создан!\nНазвание: Новый проект\nДата создания: ' + new Date().toLocaleDateString() + '\n\nВы можете начать работу с проектом.';
          }
          
          return 'Укажите, что именно вы хотите создать. Например: "создать: проект"';
        }
      },
      'поддержка': {
        description: 'Получить помощь от службы поддержки',
        execute: async () => {
          return 'Запрос в службу поддержки отправлен.\n\nОжидаемое время ответа: до 24 часов.\n\nВы также можете обратиться к нашей базе знаний или FAQ для получения быстрой помощи.';
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
  },
  {
    id: 'graphics',
    name: 'Графика',
    description: 'Модуль для работы с графикой',
    isInstalled: false,
    commands: {
      'графика': {
        description: 'Работа с графическими объектами',
        execute: async (args: string[]) => {
          const type = args[0] || '2d';
          return `Инструменты ${type}-графики активированы. Вы можете начать работу с графическими объектами.`;
        }
      },
      'рендеринг': {
        description: 'Запускает процесс рендеринга',
        execute: async (args: string[]) => {
          const quality = args[0] || 'высокое';
          return `Запуск рендеринга с качеством "${quality}"...\n\nРендеринг завершен успешно. Результат доступен в галерее проекта.`;
        }
      }
    }
  },
  {
    id: 'philosophy',
    name: 'Философия',
    description: 'Модуль философских рассуждений',
    isInstalled: false,
    commands: {
      'философия': {
        description: 'Философские рассуждения',
        execute: async (args: string[]) => {
          const topic = args.join(' ') || 'бытие';
          const quotes = [
            'Я мыслю, следовательно, я существую. - Рене Декарт',
            'Человек - это канат, натянутый между животным и сверхчеловеком. - Фридрих Ницше',
            'Свобода - это осознанная необходимость. - Бенедикт Спиноза',
            'Мудрец ищет всё в себе, а неразумный человек ищет всё в других. - Конфуций',
            'Тот, кто имеет зачем жить, может вынести почти любое как. - Фридрих Ницше'
          ];
          return `Философские размышления на тему "${topic}":\n\n${quotes[Math.floor(Math.random() * quotes.length)]}\n\nПродолжите свои размышления с помощью других команд модуля "Философия".`;
        }
      },
      'логика': {
        description: 'Логические рассуждения',
        execute: async () => {
          return 'Запуск модуля логического анализа...\n\nЛогический анализ завершен. Выявлены следующие закономерности и принципы:\n- Принцип непротиворечия\n- Закон исключённого третьего\n- Принцип достаточного основания';
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
      
      return `Доступные команды:\n${commandList.join('\n')}\n\nСпециальные команды:\n- скачать: <модуль> - загрузить новый модуль\n- запуск: <команда> - запустить команду\n- modules - просмотр доступных модулей\n- создать: <объект> - создание проектов и объектов\n- поддержка - получить помощь от службы поддержки`;
    }
    
    if (command.toLowerCase() === 'clear') {
      setHistory([]);
      return 'История очищена';
    }
    
    if (command.toLowerCase() === 'modules') {
      return formatModuleList();
    }

    // Check for "help:" prefix for specialized help topics
    if (command.toLowerCase().startsWith('help:')) {
      const topic = command.split(':')[1]?.trim().toLowerCase();
      
      if (topic === 'faq') {
        return 'Часто задаваемые вопросы (FAQ):\n\n1. Как установить модуль?\n   Используйте команду "скачать: [название модуля]"\n\n2. Как использовать команды?\n   Введите команду в поле ввода и нажмите Enter или кнопку запуска\n\n3. Как создать проект?\n   Используйте команду "создать: проект"\n\n4. Как получить помощь?\n   Используйте команду "поддержка" или обратитесь к ИИ Ассистенту';
      }
      
      return `Помощь по теме "${topic}" недоступна. Используйте команду "help" для просмотра списка доступных команд или "help: faq" для часто задаваемых вопросов.`;
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
    
    // Check for "создать:" prefix
    if (command.toLowerCase().startsWith('создать:')) {
      const target = command.split(':')[1]?.trim();
      if (!target) {
        return 'Укажите, что вы хотите создать. Например: "создать: проект"';
      }
      
      const createHandler = installedModules
        .find(module => module.commands['создать'])
        ?.commands['создать'];
        
      if (createHandler) {
        return await createHandler.execute([target]);
      }
      
      return 'Команда для создания не найдена. Убедитесь, что необходимый модуль установлен.';
    }
    
    // Check for "анимация:" prefix
    if (command.toLowerCase().startsWith('анимация:')) {
      const type = command.split(':')[1]?.trim().toLowerCase();
      
      // Check if animation module is installed
      const animationModule = installedModules.find(module => module.id === 'animation');
      
      if (!animationModule) {
        return 'Модуль "Анимация" не установлен. Используйте команду "скачать: Анимация" для установки.';
      }
      
      if (!type) {
        return 'Укажите тип анимации. Например: "анимация: 2d" или "анимация: 3d"';
      }
      
      if (type === '2d') {
        return 'Запуск системы 2D-анимации...\n\nСистема 2D-анимации активирована. Вы можете начать создание анимированных объектов и эффектов.';
      } else if (type === '3d') {
        return 'Запуск системы 3D-анимации...\n\nСистема 3D-анимации активирована. Для работы с 3D-объектами используйте специализированные инструменты из панели редактора.';
      } else {
        return `Неизвестный тип анимации: "${type}". Доступные типы: 2d, 3d`;
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
