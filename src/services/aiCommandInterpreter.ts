
import { ProgrammingLanguage } from '../models/types';
import { pluginRegistry } from '../plugins/languagePlugin';
import { toast } from 'sonner';

// Types for AI Command Interpreter
interface CommandResult {
  success: boolean;
  output: string;
  action?: string;
  params?: Record<string, any>;
}

// Command patterns for natural language processing
const commandPatterns = [
  {
    pattern: /установи(?:ть)?\s+библиотеку\s+([a-zA-Z0-9_\-]+)(?:\s+для\s+([a-zA-Z\+]+))?/i,
    action: 'install',
    extractParams: (matches: RegExpMatchArray) => ({
      library: matches[1],
      language: mapLanguage(matches[2])
    })
  },
  {
    pattern: /скача(?:ть|й)\s+([a-zA-Z0-9_\-]+)(?:\s+для\s+([a-zA-Z\+]+))?/i,
    action: 'install',
    extractParams: (matches: RegExpMatchArray) => ({
      library: matches[1],
      language: mapLanguage(matches[2])
    })
  },
  {
    pattern: /install\s+(?:library\s+)?([a-zA-Z0-9_\-]+)(?:\s+for\s+([a-zA-Z\+]+))?/i,
    action: 'install',
    extractParams: (matches: RegExpMatchArray) => ({
      library: matches[1],
      language: mapLanguage(matches[2])
    })
  },
  {
    pattern: /запусти(?:ть)?\s+контейнер\s+([a-zA-Z\+]+)/i,
    action: 'startContainer',
    extractParams: (matches: RegExpMatchArray) => ({
      language: mapLanguage(matches[1])
    })
  },
  {
    pattern: /start\s+(?:container\s+)?([a-zA-Z\+]+)/i,
    action: 'startContainer',
    extractParams: (matches: RegExpMatchArray) => ({
      language: mapLanguage(matches[1])
    })
  },
  {
    pattern: /помо(?:щь|ги|чь)/i,
    action: 'help',
    extractParams: () => ({})
  },
  {
    pattern: /help/i,
    action: 'help',
    extractParams: () => ({})
  }
];

// Map common language names to official language identifiers
function mapLanguage(langInput?: string): ProgrammingLanguage | undefined {
  if (!langInput) return undefined;
  
  const langMap: Record<string, ProgrammingLanguage> = {
    'python': 'python',
    'py': 'python',
    'питон': 'python',
    'c++': 'cpp',
    'cpp': 'cpp',
    'си++': 'cpp',
    'lua': 'lua',
    'луа': 'lua',
    'javascript': 'javascript',
    'js': 'javascript',
    'rust': 'rust',
    'раст': 'rust',
    'ruby': 'ruby',
    'руби': 'ruby',
  };
  
  const normalized = langInput.toLowerCase();
  return langMap[normalized];
}

// Main interpreter function
export async function interpretCommand(command: string): Promise<CommandResult> {
  if (!command.trim()) {
    return { 
      success: false, 
      output: 'Пожалуйста, введите команду.'
    };
  }
  
  // Process through command patterns
  for (const pattern of commandPatterns) {
    const matches = command.match(pattern.pattern);
    if (matches) {
      const params = pattern.extractParams(matches);
      return executeCommand(pattern.action, params);
    }
  }
  
  // If no pattern matched, use AI-based interpretation
  return processWithAI(command);
}

// Execute identified commands
async function executeCommand(
  action: string, 
  params: Record<string, any>
): Promise<CommandResult> {
  switch (action) {
    case 'install':
      return installLibrary(params.library, params.language);
      
    case 'startContainer':
      return startContainer(params.language);
      
    case 'help':
      return showHelp();
      
    default:
      return {
        success: false,
        output: `Неизвестное действие: ${action}. Пожалуйста, используйте команду "помощь" для просмотра доступных команд.`
      };
  }
}

// Install a library
async function installLibrary(
  libraryName: string, 
  language?: ProgrammingLanguage
): Promise<CommandResult> {
  try {
    if (!libraryName) {
      return {
        success: false,
        output: 'Пожалуйста, укажите название библиотеки.'
      };
    }
    
    if (!language) {
      // If language not specified, try to detect from context or ask
      return {
        success: false,
        output: `Для какого языка нужно установить библиотеку "${libraryName}"? Пожалуйста, укажите язык.`,
        action: 'prompt_language',
        params: { library: libraryName }
      };
    }
    
    // Check if language plugin exists
    const plugin = pluginRegistry.getByLanguage(language);
    if (!plugin) {
      return {
        success: false,
        output: `Язык "${language}" не поддерживается. Поддерживаемые языки: python, cpp, lua, rust, ruby, javascript.`
      };
    }
    
    // Mock installation (in real app would connect to plugin install method)
    // In real implementation, this would be a proper async call with progress tracking
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      success: true,
      output: `Библиотека "${libraryName}" успешно установлена для языка ${language}!`,
      action: 'library_installed',
      params: { library: libraryName, language }
    };
  } catch (error) {
    console.error('Error installing library:', error);
    return {
      success: false,
      output: `Ошибка установки библиотеки "${libraryName}": ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`
    };
  }
}

// Start language container
async function startContainer(language?: ProgrammingLanguage): Promise<CommandResult> {
  if (!language) {
    return {
      success: false,
      output: 'Пожалуйста, укажите язык для запуска контейнера.'
    };
  }
  
  // Check if language plugin exists
  const plugin = pluginRegistry.getByLanguage(language);
  if (!plugin) {
    return {
      success: false,
      output: `Язык "${language}" не поддерживается. Поддерживаемые языки: python, cpp, lua, rust, ruby, javascript.`
    };
  }
  
  // In real app, this would connect to container management system
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return {
    success: true,
    output: `Контейнер для языка ${language} успешно запущен!`,
    action: 'container_started',
    params: { language }
  };
}

// Show help information
function showHelp(): Promise<CommandResult> {
  const helpContent = `
## Доступные команды:

### Библиотеки
- установить библиотеку [название] для [язык]
- скачать [название] для [язык]

### Контейнеры
- запустить контейнер [язык]

### Языки
Поддерживаемые языки: python, c++, lua, javascript, rust, ruby

### Примеры:
- установить библиотеку numpy для python
- скачать boost для c++
- запустить контейнер lua
  `;
  
  return Promise.resolve({
    success: true,
    output: helpContent,
    action: 'help_displayed'
  });
}

// Process command using AI (simplified mock version)
async function processWithAI(command: string): Promise<CommandResult> {
  // In a real app, this would connect to an AI service
  console.log('Processing with AI:', command);
  
  // Mock AI processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Attempt to guess intent
  if (command.toLowerCase().includes('install') || 
      command.toLowerCase().includes('download') ||
      command.toLowerCase().includes('установи') ||
      command.toLowerCase().includes('скачай')) {
    
    return {
      success: true,
      output: 'Я понимаю, что вы хотите установить библиотеку. Пожалуйста, укажите название библиотеки и язык программирования. Например: "установить библиотеку numpy для python"',
    };
  }
  
  if (command.toLowerCase().includes('container') || 
      command.toLowerCase().includes('контейнер')) {
    
    return {
      success: true,
      output: 'Я понимаю, что вы хотите работать с контейнером. Пожалуйста, укажите действие и язык. Например: "запустить контейнер python"',
    };
  }
  
  // Generic response for unknown commands
  return {
    success: true,
    output: `Я пытаюсь понять вашу команду: "${command}". Пожалуйста, уточните, что вы хотите сделать. Для справки введите "помощь".`,
  };
}
