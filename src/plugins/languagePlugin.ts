
import { ProgrammingLanguage } from "../models/types";

// Интерфейс для плагинов языков программирования
export interface LanguagePlugin {
  id: string;
  name: string;
  fileExtensions: string[];
  language: ProgrammingLanguage;
  packageManager: {
    install: (packageName: string, version?: string) => Promise<boolean>;
    uninstall: (packageName: string) => Promise<boolean>;
    list: () => Promise<string[]>;
    checkInstalled: (packageName: string) => Promise<boolean>;
  };
  run: (code: string) => Promise<{
    output: string;
    error?: string;
    exitCode: number;
  }>;
  getCompletions?: (code: string, position: { line: number; column: number }) => Promise<string[]>;
}

// Базовая реализация для плагина Python
export const pythonPlugin: LanguagePlugin = {
  id: 'python',
  name: 'Python',
  fileExtensions: ['.py', '.pyw', '.pyi'],
  language: 'python',
  packageManager: {
    install: async (packageName: string, version?: string) => {
      console.log(`[Python] Installing ${packageName}${version ? '@' + version : ''}...`);
      return true; // Mock successful installation
    },
    uninstall: async (packageName: string) => {
      console.log(`[Python] Uninstalling ${packageName}...`);
      return true;
    },
    list: async () => {
      return ['numpy', 'pandas', 'matplotlib']; // Mock installed packages
    },
    checkInstalled: async (packageName: string) => {
      return ['numpy', 'pandas', 'matplotlib'].includes(packageName);
    }
  },
  run: async (code: string) => {
    console.log(`[Python] Running: ${code}`);
    // Mock execution
    return {
      output: "Hello from Python!",
      exitCode: 0
    };
  }
};

// Базовая реализация для плагина C++
export const cppPlugin: LanguagePlugin = {
  id: 'cpp',
  name: 'C++',
  fileExtensions: ['.cpp', '.hpp', '.h', '.cc'],
  language: 'cpp',
  packageManager: {
    install: async (packageName: string, version?: string) => {
      console.log(`[C++] Installing ${packageName}${version ? '@' + version : ''}...`);
      return true;
    },
    uninstall: async (packageName: string) => {
      console.log(`[C++] Uninstalling ${packageName}...`);
      return true;
    },
    list: async () => {
      return ['boost', 'sfml', 'qt']; // Mock installed packages
    },
    checkInstalled: async (packageName: string) => {
      return ['boost', 'sfml', 'qt'].includes(packageName);
    }
  },
  run: async (code: string) => {
    console.log(`[C++] Compiling and running: ${code}`);
    // Mock execution
    return {
      output: "Hello from C++!",
      exitCode: 0
    };
  }
};

// Базовая реализация для плагина Lua
export const luaPlugin: LanguagePlugin = {
  id: 'lua',
  name: 'Lua',
  fileExtensions: ['.lua'],
  language: 'lua',
  packageManager: {
    install: async (packageName: string, version?: string) => {
      console.log(`[Lua] Installing ${packageName}${version ? '@' + version : ''}...`);
      return true;
    },
    uninstall: async (packageName: string) => {
      console.log(`[Lua] Uninstalling ${packageName}...`);
      return true;
    },
    list: async () => {
      return ['luasocket', 'luafilesystem']; // Mock installed packages
    },
    checkInstalled: async (packageName: string) => {
      return ['luasocket', 'luafilesystem'].includes(packageName);
    }
  },
  run: async (code: string) => {
    console.log(`[Lua] Running: ${code}`);
    // Mock execution
    return {
      output: "Hello from Lua!",
      exitCode: 0
    };
  }
};

// Реестр плагинов
export const pluginRegistry = {
  python: pythonPlugin,
  cpp: cppPlugin,
  lua: luaPlugin,
  
  // API для регистрации новых плагинов
  register: (plugin: LanguagePlugin) => {
    (pluginRegistry as any)[plugin.id] = plugin;
    console.log(`Plugin ${plugin.id} registered successfully`);
  }
};
