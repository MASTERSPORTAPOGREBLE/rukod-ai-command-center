import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

// Types for modules and commands
export type Module = {
  id: string;
  name: string;
  englishName?: string;
  description: string;
  isInstalled: boolean;
  commands: Record<string, CommandHandler>;
  synonyms?: string[];
  categories?: string[];
  popularity?: number;
};

export type CommandHandler = {
  description: string;
  englishDescription?: string;
  synonyms?: string[];
  execute: (args: string[]) => Promise<string>;
};

// Define the types for our commands and outputs
export type CommandOutputItem = {
  id: string;
  command: string;
  output: string;
  timestamp: Date;
  status: 'success' | 'error' | 'processing';
  translatedCommand?: string;
};

type CommandContextType = {
  history: CommandOutputItem[];
  addCommand: (command: string) => void;
  clearHistory: () => void;
  isProcessing: boolean;
  installedModules: Module[];
  language: 'ru' | 'en';
  setLanguage: (lang: 'ru' | 'en') => void;
  userPreferences: {
    favoriteModules: string[];
    recentCommands: string[];
  };
  translateCommand: (command: string) => string;
  findModule: (searchTerm: string) => Module | null;
};

const CommandContext = createContext<CommandContextType | undefined>(undefined);

export const useCommandContext = () => {
  const context = useContext(CommandContext);
  if (!context) {
    throw new Error('useCommandContext must be used within a CommandProvider');
  }
  return context;
};

// Define base modules with enhanced metadata
const baseModules: Module[] = [
  {
    id: 'core',
    name: 'Core',
    englishName: 'Core',
    description: 'Базовые команды системы РУКОД',
    isInstalled: true,
    synonyms: ['ядро', 'основное', 'базовое', 'главное'],
    categories: ['system', 'base'],
    popularity: 10,
    commands: {
      'help': {
        description: 'Показывает список доступных команд',
        englishDescription: 'Shows a list of available commands',
        synonyms: ['помощь', 'справка', 'команды'],
        execute: async (args: string[]) => {
          return 'Загрузка списка команд...';
        }
      },
      'clear': {
        description: 'Очищает историю команд',
        englishDescription: 'Clears command history',
        synonyms: ['очистить', 'очистка', 'удалить историю'],
        execute: async () => {
          return 'История очищена';
        }
      },
      'version': {
        description: 'Показывает версию системы',
        englishDescription: 'Shows system version',
        synonyms: ['версия', 'релиз'],
        execute: async () => {
          return 'РУКОД AI Command Center v0.1.0';
        }
      },
      'привет': {
        description: 'Приветствие',
        englishDescription: 'Greeting',
        synonyms: ['здравствуй', 'здравствуйте', 'привет', 'hello', 'hi'],
        execute: async () => {
          return 'Привет, командир! Чем могу помочь?';
        }
      },
      'анализировать': {
        description: 'Анализирует данные с помощью ИИ',
        englishDescription: 'Analyzes data using AI',
        synonyms: ['анализ', 'исследование', 'изучить', 'analyze'],
        execute: async (args: string[]) => {
          const target = args.join(' ') || 'объект';
          return `Запущен процесс анализа: "${target}"\n\nАнализ в процессе...\n\nРезультаты анализа:\n- Структура: оптимизирована\n- Производительность: высокая\n- Ресурсы: доступны\n- Статус: готово к использованию`;
        }
      },
      'язык': {
        description: 'Изменить язык системы',
        englishDescription: 'Change system language',
        synonyms: ['language', 'локализация', 'перевод'],
        execute: async (args: string[]) => {
          const lang = args[0]?.toLowerCase();
          if (lang === 'ru' || lang === 'русский' || lang === 'russian') {
            return 'Язык системы изменен на русский.';
          } else if (lang === 'en' || lang === 'english' || lang === 'английский') {
            return 'System language changed to English.';
          } else {
            return 'Укажите язык: русский (ru) или английский (en)';
          }
        }
      },
      // ... keep existing code (other core commands)
    }
  },
  {
    id: 'animation',
    name: 'Анимация',
    englishName: 'Animation',
    description: 'Модуль анимаций и визуальных эффектов',
    isInstalled: false,
    synonyms: ['аниматор', 'эффекты', 'анимации', 'мультипликация'],
    categories: ['visual', 'graphics', 'effects'],
    popularity: 5,
    commands: {
      'анимация': {
        description: 'Запускает визуальный эффект',
        englishDescription: 'Launches visual effect',
        synonyms: ['эффект', 'анимировать', 'animate'],
        execute: async (args: string[]) => {
          const effect = args[0] || 'pulse';
          return `Анимационный эффект "${effect}" запущен успешно. Вы можете видеть эффект в интерфейсе.`;
        }
      },
      'визуализация': {
        description: 'Создает визуализацию данных',
        englishDescription: 'Creates data visualization',
        synonyms: ['визуализировать', 'отображение', 'visualize'],
        execute: async (args: string[]) => {
          const dataType = args[0] || 'график';
          return `Визуализация "${dataType}" создается...\n\nВизуализация успешно создана и отображается в интерфейсе.`;
        }
      },
      'код:анимация': {
        description: 'Генерирует код для анимации',
        englishDescription: 'Generates animation code',
        synonyms: ['сгенерировать анимацию', 'генерация кода'],
        execute: async (args: string[]) => {
          const animType = args[0]?.toLowerCase() || '2d';
          let code = '';
          
          if (animType === '2d') {
            code = `// Пример кода для 2D анимации
import { useEffect, useRef } from 'react';

export const SimpleAnimation = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    // Параметры анимации
    const ball = {
      x: 100,
      y: 100,
      vx: 5,
      vy: 2,
      radius: 25,
      color: 'blue',
    };
    
    // Функция анимации
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Отрисовка шара
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = ball.color;
      ctx.fill();
      ctx.closePath();
      
      // Физика движения
      ball.x += ball.vx;
      ball.y += ball.vy;
      
      // Обработка столкновений
      if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.vx = -ball.vx;
      }
      
      if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.vy = -ball.vy;
      }
      
      animationFrameId = window.requestAnimationFrame(render);
    };
    
    render();
    
    // Очистка
    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return <canvas ref={canvasRef} width="500" height="300" />;
};`;
          } else if (animType === '3d') {
            code = `// Пример кода для 3D анимации с Three.js
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ThreeDAnimation = () => {
  const containerRef = useRef(null);
  
  useEffect(() => {
    // Инициализация сцены
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);
    
    // Создание куба
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    
    camera.position.z = 5;
    
    // Анимация
    const animate = () => {
      requestAnimationFrame(animate);
      
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Обработчик изменения размера окна
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Очистка ресурсов
    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current.removeChild(renderer.domElement);
    };
  }, []);
  
  return <div ref={containerRef} />;
};`;
          }
          
          return `Сгенерирован код для ${animType.toUpperCase()}-анимации:\n\n\`\`\`jsx\n${code}\n\`\`\`\n\nЧтобы использовать этот код, скопируйте его в свой проект или выполните команду "создать: компонент анимация".`;
        }
      }
    }
  },
  // ... keep existing code (other modules like dev, graphics, philosophy)
];

// Add Russian language to modules
const algebraModule: Module = {
  id: 'algebra',
  name: 'Алгебра',
  englishName: 'Algebra',
  description: 'Модуль для решения алгебраических задач',
  isInstalled: false,
  synonyms: ['математика', 'уравнения', 'вычисления'],
  categories: ['education', 'math'],
  popularity: 2,
  commands: {
    'алгебра': {
      description: 'Запускает модуль алгебры с указанным уровнем',
      englishDescription: 'Launches algebra module with specified level',
      synonyms: ['algebra', 'math', 'уравнения'],
      execute: async (args: string[]) => {
        const levels = args.join(' ');
        if (!levels) {
          return 'Укажите уровень или диапазон уровней (например, "алгебра 6-7")';
        }
        return `Модуль "Алгебра" активирован для уровней ${levels}. Выберите подмодуль для работы:\n- Уравнения\n- Функции\n- Графики`;
      }
    }
  }
};

// Add new modules to the base modules array
const allBaseModules = [...baseModules, algebraModule];

// Translation mappings
const ruToEnCommandMap: Record<string, string> = {
  'помощь': 'help',
  'очистить': 'clear',
  'версия': 'version',
  'привет': 'hello',
  'анализировать': 'analyze',
  'скачать': 'download',
  'запуск': 'run',
  'авторизация': 'auth',
  'создать': 'create',
  'поддержка': 'support',
  'алгебра': 'algebra',
  'анимация': 'animation',
  'визуализация': 'visualize',
  'отладка': 'debug',
  'тестирование': 'test',
  'графика': 'graphics',
  'рендеринг': 'render',
  'философия': 'philosophy',
  'логика': 'logic',
  'язык': 'language'
};

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
    allBaseModules.filter(module => module.isInstalled)
  );
  const [language, setLanguage] = useState<'ru' | 'en'>('ru');
  const [userPreferences, setUserPreferences] = useState({
    favoriteModules: [] as string[],
    recentCommands: [] as string[]
  });

  // Track command usage to update module popularity
  const trackCommandUsage = (command: string) => {
    // Update recent commands
    const newRecentCommands = [command, ...userPreferences.recentCommands.filter(cmd => cmd !== command).slice(0, 9)];
    
    // Update module popularity based on command usage
    const updatedPrefs = {
      ...userPreferences,
      recentCommands: newRecentCommands
    };
    
    setUserPreferences(updatedPrefs);
    
    // Store in localStorage for persistence
    try {
      localStorage.setItem('rukod_preferences', JSON.stringify(updatedPrefs));
    } catch (e) {
      console.error('Failed to save preferences to localStorage', e);
    }
  };
  
  // Load user preferences from localStorage
  useEffect(() => {
    try {
      const storedPrefs = localStorage.getItem('rukod_preferences');
      if (storedPrefs) {
        setUserPreferences(JSON.parse(storedPrefs));
      }
    } catch (e) {
      console.error('Failed to load preferences from localStorage', e);
    }
  }, []);

  // Translate command from Russian to English
  const translateCommand = (command: string): string => {
    if (language === 'en') return command; // No translation needed
    
    // Split the command into parts (command and arguments)
    const parts = command.trim().split(/\s+/);
    if (parts.length === 0) return command;
    
    // Check if we need to translate the command part
    const mainCommand = parts[0].toLowerCase();
    if (mainCommand in ruToEnCommandMap) {
      // Replace the command with its English equivalent
      parts[0] = ruToEnCommandMap[mainCommand];
      return parts.join(' ');
    }
    
    // If no direct translation found, return original
    return command;
  };

  // Find module by partial name, synonym, or category
  const findModule = (searchTerm: string): Module | null => {
    if (!searchTerm) return null;
    
    const normalizedSearch = searchTerm.toLowerCase();
    
    // First try exact match with ID or name
    const exactMatch = allBaseModules.find(
      m => m.id.toLowerCase() === normalizedSearch || 
           m.name.toLowerCase() === normalizedSearch ||
           m.englishName?.toLowerCase() === normalizedSearch
    );
    
    if (exactMatch) return exactMatch;
    
    // Then try synonyms
    const synonymMatch = allBaseModules.find(
      m => m.synonyms?.some(syn => syn.toLowerCase().includes(normalizedSearch))
    );
    
    if (synonymMatch) return synonymMatch;
    
    // Then try partial name match
    const partialMatch = allBaseModules.find(
      m => m.name.toLowerCase().includes(normalizedSearch) ||
           m.englishName?.toLowerCase()?.includes(normalizedSearch)
    );
    
    if (partialMatch) return partialMatch;
    
    // Try category match
    const categoryMatch = allBaseModules.find(
      m => m.categories?.some(cat => cat.toLowerCase().includes(normalizedSearch))
    );
    
    if (categoryMatch) return categoryMatch;
    
    // No match found
    return null;
  };

  // Helper function to format module list with better categorization
  const formatModuleList = (): string => {
    // Group modules by category
    const categories: Record<string, Module[]> = {};
    
    allBaseModules.forEach(module => {
      const mainCategory = module.categories?.[0] || 'other';
      if (!categories[mainCategory]) {
        categories[mainCategory] = [];
      }
      categories[mainCategory].push(module);
    });
    
    // Build formatted output
    let output = 'Доступные модули по категориям:\n\n';
    
    for (const [category, modules] of Object.entries(categories)) {
      output += `== ${category.toUpperCase()} ==\n`;
      
      const installed = modules
        .filter(m => m.isInstalled)
        .map(m => `- ${m.name}: ${m.description} [установлен]`);
      
      const available = modules
        .filter(m => !m.isInstalled)
        .map(m => `- ${m.name}: ${m.description}`);
      
      if (installed.length > 0) {
        output += installed.join('\n') + '\n';
      }
      
      if (available.length > 0) {
        output += available.join('\n') + '\n';
      }
      
      output += '\n';
    }
    
    output += 'Для установки модуля используйте команду "скачать: [название модуля]".';
    return output;
  };

  // Install module function with enhanced feedback
  const installModule = async (moduleName: string): Promise<string> => {
    // Try to find the module with flexible matching
    const moduleToInstall = findModule(moduleName);

    if (!moduleToInstall) {
      toast({
        title: "Модуль не найден",
        description: `Модуль "${moduleName}" не найден. Используйте команду "modules" для просмотра доступных модулей.`
      });
      return `Модуль "${moduleName}" не найден. Возможно вы имели в виду один из этих модулей:\n- Анимация\n- Графика\n- Алгебра\n\nИспользуйте команду "modules" для просмотра всех доступных модулей.`;
    }

    if (moduleToInstall.isInstalled) {
      toast({
        title: "Модуль уже установлен",
        description: `Модуль "${moduleToInstall.name}" уже установлен.`
      });
      return `Модуль "${moduleToInstall.name}" уже установлен. Вы можете использовать его команды.`;
    }

    // Simulate installation delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const updatedModule = { ...moduleToInstall, isInstalled: true };
    
    setInstalledModules(prev => [...prev, updatedModule]);
    
    // Update user preferences
    setUserPreferences(prev => ({
      ...prev,
      favoriteModules: [...prev.favoriteModules, moduleToInstall.id]
    }));
    
    toast({
      title: "Модуль установлен",
      description: `Модуль "${moduleToInstall.name}" успешно установлен.`
    });
    
    return `Модуль "${moduleToInstall.name}" успешно установлен.\n\nДобавлены команды:\n${
      Object.entries(moduleToInstall.commands)
        .map(([cmd, handler]) => `- ${cmd}: ${handler.description}`)
        .join('\n')
    }`;
  };

  // Enhanced command processor with fuzzy matching and translation
  const processCommand = async (command: string): Promise<string> => {
    // Trim the command
    command = command.trim();
    
    // Check if command is empty
    if (!command) return 'Пожалуйста, введите команду.';

    // Track command usage for personalization
    trackCommandUsage(command);
    
    // Handle language translation if needed
    let translatedCommand = translateCommand(command);
    let translationMessage = '';
    
    if (translatedCommand !== command) {
      translationMessage = `Перевод команды: "${translatedCommand}"\n\n`;
    }

    // Handle special commands first
    if (command.toLowerCase() === 'help' || command.toLowerCase() === 'помощь') {
      const commandList = installedModules.flatMap(module => 
        Object.entries(module.commands).map(([cmd, handler]) => 
          `- ${cmd}: ${handler.description}`
        )
      );
      
      return `${translationMessage}Доступные команды:\n${commandList.join('\n')}\n\nСпециальные команды:\n- скачать: <модуль> - загрузить новый модуль\n- запуск: <команда> - запустить команду\n- modules - просмотр доступных модулей\n- создать: <объект> - создание проектов и объектов\n- поддержка - получить помощь от службы поддержки\n- код: <тип> - генерация примера кода\n- язык: <ru|en> - изменить язык системы`;
    }
    
    if (command.toLowerCase() === 'clear' || command.toLowerCase() === 'очистить') {
      setHistory([]);
      return 'История очищена';
    }
    
    if (command.toLowerCase() === 'modules' || command.toLowerCase() === 'модули') {
      return formatModuleList();
    }

    // Handle language settings
    if (command.toLowerCase().startsWith('язык:') || command.toLowerCase().startsWith('language:')) {
      const lang = command.split(':')[1]?.trim().toLowerCase();
      
      if (lang === 'ru' || lang === 'русский' || lang === 'russian') {
        setLanguage('ru');
        return 'Язык системы изменен на русский.';
      } else if (lang === 'en' || lang === 'english' || lang === 'английский') {
        setLanguage('en');
        return 'System language changed to English.';
      } else {
        return 'Укажите язык: русский (ru) или английский (en)';
      }
    }

    // Handle algebra level specification (special case for numeric input)
    const algebraLevelRegex = /^(\d+)[-\s]+(\d+)$/;
    const algebraMatch = command.match(algebraLevelRegex);
    if (algebraMatch) {
      const startLevel = algebraMatch[1];
      const endLevel = algebraMatch[2];
      return `Определен запрос уровней алгебры ${startLevel}-${endLevel}. Активирую модуль "Алгебра" для указанных уровней.\n\nМодуль "Алгебра" с уровнями ${startLevel}-${endLevel} активирован. Доступны темы:\n- Уравнения\n- Функции\n- Неравенства`;
    }

    // Check for "help:" prefix for specialized help topics
    if (command.toLowerCase().startsWith('help:') || command.toLowerCase().startsWith('помощь:')) {
      const topic = command.split(':')[1]?.trim().toLowerCase();
      
      if (topic === 'faq') {
        return 'Часто задаваемые вопросы (FAQ):\n\n1. Как установить модуль?\n   Используйте команду "скачать: [название модуля]"\n\n2. Как использовать команды?\n   Введите команду в поле ввода и нажмите Enter или кнопку запуска\n\n3. Как создать проект?\n   Используйте команду "создать: проект"\n\n4. Как получить помощь?\n   Используйте команду "поддержка" или обратитесь к ИИ Ассистенту';
      }
      
      // Try to find help for a module
      const moduleForHelp = findModule(topic);
      if (moduleForHelp) {
        return `Справка по модулю "${moduleForHelp.name}":\n\n${moduleForHelp.description}\n\nДоступные команды:\n${
          Object.entries(moduleForHelp.commands)
            .map(([cmd, handler]) => `- ${cmd}: ${handler.description}`)
            .join('\n')
        }\n\n${moduleForHelp.isInstalled ? 'Модуль установлен и готов к использованию.' : 'Модуль не установлен. Используйте команду "скачать: ' + moduleForHelp.name + '" для установки.'}`;
      }
      
      return `Помощь по теме "${topic}" недоступна. Используйте команду "help" для просмотра списка доступных команд или "help: faq" для часто задаваемых вопросов.`;
    }

    // Check for "скачать:" prefix
    if (command.toLowerCase().startsWith('скачать:') || command.toLowerCase().startsWith('download:')) {
      const moduleName = command.split(':')[1]?.trim();
      if (!moduleName) {
        return 'Ошибка: укажите название модул�� после "Скачать:"';
      }
      
      return await installModule(moduleName);
    }

    // Check for "код:" prefix for code generation
    if (command.toLowerCase().startsWith('код:') || command.toLowerCase().startsWith('code:')) {
      const codeType = command.split(':')[1]?.trim().toLowerCase();
      
      if (!codeType) {
        return 'Укажите тип кода для генерации. Например: "код: анимация"';
      }
      
      // Check for animation code request
      if (codeType === 'анимация' || codeType === 'animation') {
        const animModule = installedModules.find(m => m.id === 'animation');
        
        if (!animModule) {
          toast({
            title: "Модуль не установлен",
            description: "Требуется установить модуль Анимация"
          });
          return 'Для генерации кода анимации необходимо установить модуль "Анимация". Используйте команду "скачать: Анимация".';
        }
        
        // Default to 2D animation code
        const animHandler = animModule.commands['код:анимация'];
        if (animHandler) {
          return await animHandler.execute(['2d']);
        }
        
        return 'Команда для генерации кода не найдена в модуле "Анимация".';
      }
      
      return `Генерация кода типа "${codeType}" в данный момент не поддерживается.`;
    }
    
    // Handle partial command matching
    const mainCommand = command.split(' ')[0].toLowerCase();
    
    // Look for commands that might match partially
    let foundCommand = false;
    let commandResult = '';
    
    // Try to find commands in installed modules with fuzzy matching
    for (const module of installedModules) {
      for (const [cmdName, handler] of Object.entries(module.commands)) {
        // Check direct command match
        if (cmdName.toLowerCase() === mainCommand) {
          foundCommand = true;
          const args = command.split(' ').slice(1);
          commandResult = await handler.execute(args);
          break;
        }
        
        // Check command synonyms
        if (handler.synonyms?.some(syn => syn.toLowerCase() === mainCommand)) {
          foundCommand = true;
          const args = command.split(' ').slice(1);
          commandResult = await handler.execute(args);
          break;
        }
      }
      
      if (foundCommand) break;
    }
    
    if (foundCommand) {
      return translationMessage + commandResult;
    }
    
    // Try to interpret the command as a module search
    const moduleMatch = findModule(mainCommand);
    if (moduleMatch) {
      if (moduleMatch.isInstalled) {
        const commandList = Object.entries(moduleMatch.commands)
          .map(([cmd, handler]) => `- ${cmd}: ${handler.description}`)
          .join('\n');
        
        return `Модуль "${moduleMatch.name}" активирован. Доступные команды:\n\n${commandList}`;
      } else {
        toast({
          title: "Модуль не установлен",
          description: `Модуль "${moduleMatch.name}" не установлен.`
        });
        return `Модуль "${moduleMatch.name}" не установлен. Используйте команду "скачать: ${moduleMatch.name}" для установки.`;
      }
    }

    // Look for command in uninstalled modules
    for (const module of allBaseModules.filter(m => !m.isInstalled)) {
      for (const cmdName of Object.keys(module.commands)) {
        if (cmdName.toLowerCase() === mainCommand || 
            module.commands[cmdName].synonyms?.some(syn => syn.toLowerCase() === mainCommand)) {
          toast({
            title: "Модуль не установлен",
            description: `Для команды "${mainCommand}" требуется установить модуль "${module.name}"`
          });
          return `Команда "${mainCommand}" принадлежит модулю "${module.name}", который не установлен. Используйте "скачать: ${module.name}" для установки.`;
        }
      }
    }
    
    // If no direct match found, provide suggestions
    const allCommands = installedModules.flatMap(module => 
      Object.entries(module.commands).map(([cmd, handler]) => ({
        command: cmd,
        description: handler.description,
        module: module.name,
        synonyms: handler.synonyms || []
      }))
    );
    
    // Find similar commands based on Levenshtein distance (simple implementation)
    const getSimilarityScore = (a: string, b: string): number => {
      a = a.toLowerCase();
      b = b.toLowerCase();
      
      // Exact match with command or synonym
      if (a === b) return 100;
      
      // Starts with
      if (b.startsWith(a)) return 80;
      
      // Contains
      if (b.includes(a)) return 60;
      
      // Otherwise return low score
      return 0;
    };
    
    const suggestedCommands = allCommands
      .map(cmd => ({
        ...cmd,
        score: Math.max(
          getSimilarityScore(mainCommand, cmd.command),
          ...cmd.synonyms.map(syn => getSimilarityScore(mainCommand, syn))
        )
      }))
      .filter(cmd => cmd.score > 50)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
    
    if (suggestedCommands.length > 0) {
      return `Команда не распознана: ${command}.\n\nВозможно, вы имели в виду:\n${
        suggestedCommands.map(cmd => `- ${cmd.command}: ${cmd.description}`).join('\n')
      }\n\nИспользуйте команду "help" для просмотра доступных команд.`;
    }
    
    // Default response for unknown commands
    return `Команда не распознана: ${command}. Используйте "help" для просмотра доступных команд.`;
  };

  const addCommand = async (command: string) => {
    if (!command.trim()) return;
    
    setIsProcessing(true);
    
    // Get translation if needed
    const translatedCommand = translateCommand(command);
    
    const newCommand: CommandOutputItem = {
      id: Date.now().toString(),
      command,
      translatedCommand: translatedCommand !== command ? translatedCommand : undefined,
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
      installedModules,
      language,
      setLanguage,
      userPreferences,
      translateCommand,
      findModule
    }}>
      {children}
    </CommandContext.Provider>
  );
};
