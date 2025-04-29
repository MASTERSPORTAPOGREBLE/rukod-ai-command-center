import { ProgrammingLanguage } from "../models/types";

// Interface for language plugins
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
  detectDependencies?: (files: { path: string; content: string }[]) => Promise<string[]>;
  setupEnvironment?: () => Promise<boolean>;
  hasCompiler?: boolean;
  compileOptions?: string[];
}

// Implementation for Python plugin
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
      // Extended list of Python packages
      return [
        'numpy', 'pandas', 'matplotlib', 'scikit-learn', 'tensorflow',
        'pytorch', 'keras', 'opencv-python', 'nltk', 'spacy', 'gensim',
        'beautifulsoup4', 'scrapy', 'requests', 'flask', 'django',
        'fastapi', 'sqlalchemy', 'pygame', 'pillow', 'sympy',
        'xgboost', 'lightgbm', 'catboost', 'scipy'
      ];
    },
    checkInstalled: async (packageName: string) => {
      return ['numpy', 'pandas', 'matplotlib', 'scikit-learn', 'tensorflow',
        'pytorch', 'keras', 'opencv-python', 'nltk', 'spacy', 'gensim',
        'beautifulsoup4', 'scrapy', 'requests', 'flask', 'django',
        'fastapi', 'sqlalchemy', 'pygame', 'pillow', 'sympy',
        'xgboost', 'lightgbm', 'catboost', 'scipy'].includes(packageName);
    }
  },
  run: async (code: string) => {
    console.log(`[Python] Running: ${code}`);
    // Mock execution
    return {
      output: "Hello from Python!",
      exitCode: 0
    };
  },
  detectDependencies: async (files) => {
    // Look for requirements.txt
    const requirementsFile = files.find(f => f.path.endsWith('requirements.txt'));
    if (requirementsFile) {
      return requirementsFile.content.split('\n')
        .filter(line => line.trim() && !line.startsWith('#'))
        .map(line => line.split('==')[0].trim());
    }
    
    // Look for imports in Python files
    const pythonFiles = files.filter(f => f.path.endsWith('.py'));
    const imports = new Set<string>();
    
    pythonFiles.forEach(file => {
      const importRegex = /import\s+(\w+)|from\s+(\w+)\s+import/g;
      let match;
      while ((match = importRegex.exec(file.content)) !== null) {
        const moduleName = match[1] || match[2];
        if (!['os', 'sys', 'math', 'time', 'datetime'].includes(moduleName)) {
          imports.add(moduleName);
        }
      }
    });
    
    return Array.from(imports);
  },
  setupEnvironment: async () => {
    console.log(`[Python] Setting up environment...`);
    return true;
  }
};

// Implementation for C++ plugin
export const cppPlugin: LanguagePlugin = {
  id: 'cpp',
  name: 'C++',
  fileExtensions: ['.cpp', '.hpp', '.h', '.cc', '.cxx'],
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
      // Extended list of C++ libraries
      return [
        'boost', 'eigen', 'opencv', 'qt', 'sfml', 'sdl',
        'opengl', 'vulkan', 'glm', 'poco', 'cgal', 'pcl',
        'dlib', 'tensorflow-cpp', 'fftw', 'ceres-solver',
        'arrayfire', 'nlohmann-json', 'catch2', 'fmt',
        'spdlog', 'zeromq', 'libcurl', 'rapidjson', 'openmp'
      ];
    },
    checkInstalled: async (packageName: string) => {
      return ['boost', 'eigen', 'opencv', 'qt', 'sfml', 'sdl',
        'opengl', 'vulkan', 'glm', 'poco', 'cgal', 'pcl',
        'dlib', 'tensorflow-cpp', 'fftw', 'ceres-solver',
        'arrayfire', 'nlohmann-json', 'catch2', 'fmt',
        'spdlog', 'zeromq', 'libcurl', 'rapidjson', 'openmp'].includes(packageName);
    }
  },
  run: async (code: string) => {
    console.log(`[C++] Compiling and running: ${code}`);
    // Mock execution
    return {
      output: "Hello from C++!",
      exitCode: 0
    };
  },
  hasCompiler: true,
  compileOptions: ['-std=c++20', '-O2'],
  detectDependencies: async (files) => {
    // Look for CMakeLists.txt
    const cmakeFile = files.find(f => f.path.endsWith('CMakeLists.txt'));
    if (cmakeFile) {
      const findPackageRegex = /find_package\s*\(\s*(\w+)/g;
      const packages = new Set<string>();
      let match;
      
      while ((match = findPackageRegex.exec(cmakeFile.content)) !== null) {
        packages.add(match[1].toLowerCase());
      }
      
      return Array.from(packages);
    }
    
    // Look for includes in C++ files
    const cppFiles = files.filter(f => 
      ['.cpp', '.hpp', '.h', '.cc', '.cxx'].some(ext => f.path.endsWith(ext))
    );
    
    const includes = new Set<string>();
    cppFiles.forEach(file => {
      const includeRegex = /#include\s+[<"](\w+)\/|#include\s+[<"](\w+)\.h/g;
      let match;
      
      while ((match = includeRegex.exec(file.content)) !== null) {
        const lib = match[1] || match[2];
        if (!['iostream', 'vector', 'string', 'algorithm'].includes(lib)) {
          includes.add(lib);
        }
      }
    });
    
    return Array.from(includes);
  }
};

// Implementation for Lua plugin
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
      // Extended list of Lua libraries
      return [
        'luasocket', 'luafilesystem', 'luarocks', 'love',
        'penlight', 'lua-cjson', 'luaunit', 'copas',
        'lua-llthreads2', 'luasql', 'lualogging',
        'luaxml', 'luagl', 'lpeg', 'lua-curl', 'moonscript'
      ];
    },
    checkInstalled: async (packageName: string) => {
      return ['luasocket', 'luafilesystem', 'luarocks', 'love',
        'penlight', 'lua-cjson', 'luaunit', 'copas',
        'lua-llthreads2', 'luasql', 'lualogging',
        'luaxml', 'luagl', 'lpeg', 'lua-curl', 'moonscript'].includes(packageName);
    }
  },
  run: async (code: string) => {
    console.log(`[Lua] Running: ${code}`);
    // Mock execution
    return {
      output: "Hello from Lua!",
      exitCode: 0
    };
  },
  detectDependencies: async (files) => {
    // Look for rockspec files
    const rockspecFile = files.find(f => f.path.endsWith('.rockspec'));
    if (rockspecFile) {
      const dependsRegex = /depends\s*=\s*\{([^}]+)\}/;
      const match = dependsRegex.exec(rockspecFile.content);
      
      if (match && match[1]) {
        return match[1]
          .split(',')
          .map(dep => {
            const nameMatch = /["'](\w+)["']/.exec(dep);
            return nameMatch ? nameMatch[1] : null;
          })
          .filter(Boolean) as string[];
      }
    }
    
    // Look for requires in Lua files
    const luaFiles = files.filter(f => f.path.endsWith('.lua'));
    const requires = new Set<string>();
    
    luaFiles.forEach(file => {
      const requireRegex = /require\s*\(\s*["'](\w+)["']\s*\)|require\s*["'](\w+)["']/g;
      let match;
      
      while ((match = requireRegex.exec(file.content)) !== null) {
        requires.add(match[1] || match[2]);
      }
    });
    
    return Array.from(requires);
  }
};

// Implementation for Rust plugin
export const rustPlugin: LanguagePlugin = {
  id: 'rust',
  name: 'Rust',
  fileExtensions: ['.rs'],
  language: 'rust',
  packageManager: {
    install: async (packageName: string, version?: string) => {
      console.log(`[Rust] Installing crate ${packageName}${version ? '@' + version : ''}...`);
      return true;
    },
    uninstall: async (packageName: string) => {
      console.log(`[Rust] Removing crate ${packageName}...`);
      return true;
    },
    list: async () => {
      return ['serde', 'tokio', 'wasm-bindgen', 'rocket']; // Mock installed crates
    },
    checkInstalled: async (packageName: string) => {
      return ['serde', 'tokio', 'wasm-bindgen', 'rocket'].includes(packageName);
    }
  },
  run: async (code: string) => {
    console.log(`[Rust] Compiling and running: ${code}`);
    return {
      output: "Hello from Rust!",
      exitCode: 0
    };
  },
  hasCompiler: true,
  detectDependencies: async (files) => {
    // Look for Cargo.toml
    const cargoFile = files.find(f => f.path.endsWith('Cargo.toml'));
    if (cargoFile) {
      const depsRegex = /\[dependencies\]([\s\S]*?)(\[|\Z)/;
      const match = depsRegex.exec(cargoFile.content);
      
      if (match && match[1]) {
        const depLines = match[1].split('\n');
        return depLines
          .map(line => {
            const nameMatch = /^(\w+)\s*=/.exec(line.trim());
            return nameMatch ? nameMatch[1] : null;
          })
          .filter(Boolean) as string[];
      }
    }
    
    return [];
  }
};

// Implementation for Ruby plugin
export const rubyPlugin: LanguagePlugin = {
  id: 'ruby',
  name: 'Ruby',
  fileExtensions: ['.rb', '.erb', '.rake'],
  language: 'ruby',
  packageManager: {
    install: async (packageName: string, version?: string) => {
      console.log(`[Ruby] Installing gem ${packageName}${version ? '@' + version : ''}...`);
      return true;
    },
    uninstall: async (packageName: string) => {
      console.log(`[Ruby] Uninstalling gem ${packageName}...`);
      return true;
    },
    list: async () => {
      return ['rails', 'sinatra', 'rspec', 'jekyll']; // Mock installed gems
    },
    checkInstalled: async (packageName: string) => {
      return ['rails', 'sinatra', 'rspec', 'jekyll'].includes(packageName);
    }
  },
  run: async (code: string) => {
    console.log(`[Ruby] Running: ${code}`);
    return {
      output: "Hello from Ruby!",
      exitCode: 0
    };
  },
  detectDependencies: async (files) => {
    // Look for Gemfile
    const gemFile = files.find(f => f.path.endsWith('Gemfile'));
    if (gemFile) {
      const gemRegex = /gem\s+['"](\w+)['"]/g;
      const gems = new Set<string>();
      let match;
      
      while ((match = gemRegex.exec(gemFile.content)) !== null) {
        gems.add(match[1]);
      }
      
      return Array.from(gems);
    }
    
    return [];
  }
};

// Registry of plugins
export const pluginRegistry = {
  python: pythonPlugin,
  cpp: cppPlugin,
  lua: luaPlugin,
  rust: rustPlugin,
  ruby: rubyPlugin,
  
  // API for registering new plugins
  register: (plugin: LanguagePlugin) => {
    (pluginRegistry as any)[plugin.id] = plugin;
    console.log(`Plugin ${plugin.id} registered successfully`);
  },

  // Enhanced getByLanguage method with more robust language detection
  getByLanguage: (language: ProgrammingLanguage): LanguagePlugin | undefined => {
    // Normalize language input
    const normalizedLang = language.toLowerCase();
    
    // Match by exact id
    if (Object.values(pluginRegistry)
        .filter(value => typeof value !== 'function')
        .some((plugin: any) => plugin.id === normalizedLang)) {
      return (pluginRegistry as any)[normalizedLang];
    }
    
    // Match by language
    return Object.values(pluginRegistry)
      .filter(value => typeof value !== 'function')
      .find((plugin: any) => plugin.language === normalizedLang);
  },

  // Get all registered plugins
  getAllPlugins: (): LanguagePlugin[] => {
    return Object.entries(pluginRegistry)
      .filter(([key, value]) => typeof value !== 'function')
      .map(([_, plugin]) => plugin as LanguagePlugin);
  }
};
