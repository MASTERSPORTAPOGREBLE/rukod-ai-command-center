
import { Library, ProgrammingLanguage } from "../models/types";

export const mockLibraries: Library[] = [
  // Python Libraries - Machine Learning & Data Science
  {
    id: "python-numpy",
    name: "NumPy",
    description: "Фундаментальный пакет для научных вычислений с Python",
    version: "1.26.3",
    language: "python",
    source: "PyPI",
    popularity: 5.0,
    tags: ["numerical", "array", "scientific"],
    isPaid: false,
    isGame: false
  },
  {
    id: "python-pandas",
    name: "Pandas",
    description: "Мощная библиотека для анализа и манипуляции данными",
    version: "2.1.4",
    language: "python",
    source: "PyPI",
    popularity: 4.9,
    tags: ["data-analysis", "dataframes", "statistics"],
    isPaid: false,
    isGame: false
  },
  {
    id: "python-matplotlib",
    name: "Matplotlib",
    description: "Библиотека визуализации данных для Python",
    version: "3.8.2",
    language: "python",
    source: "PyPI",
    popularity: 4.8,
    tags: ["visualization", "plotting", "charts"],
    isPaid: false,
    isGame: false
  },
  {
    id: "python-tensorflow",
    name: "TensorFlow",
    description: "Библиотека машинного обучения с открытым исходным кодом",
    version: "2.15.0",
    language: "python",
    source: "PyPI",
    popularity: 4.9,
    tags: ["machine-learning", "deep-learning", "neural-networks"],
    isPaid: false,
    isGame: false
  },
  {
    id: "python-pytorch",
    name: "PyTorch",
    description: "Библиотека для машинного обучения и компьютерного зрения",
    version: "2.1.2",
    language: "python",
    source: "PyPI",
    popularity: 4.9,
    tags: ["machine-learning", "deep-learning", "neural-networks"],
    isPaid: false,
    isGame: false
  },
  {
    id: "python-scikitlearn",
    name: "scikit-learn",
    description: "Инструменты машинного обучения для Python",
    version: "1.3.2",
    language: "python",
    source: "PyPI",
    popularity: 4.8,
    tags: ["machine-learning", "classification", "regression"],
    isPaid: false,
    isGame: false
  },
  
  // Python Web Development
  {
    id: "python-django",
    name: "Django",
    description: "Полнофункциональный веб-фреймворк для Python",
    version: "5.0.1",
    language: "python",
    source: "PyPI",
    popularity: 4.7,
    tags: ["web", "framework", "mvc"],
    isPaid: false,
    isGame: false
  },
  {
    id: "python-flask",
    name: "Flask",
    description: "Легковесный WSGI веб-фреймворк",
    version: "3.0.0",
    language: "python",
    source: "PyPI",
    popularity: 4.8,
    tags: ["web", "microframework", "restful"],
    isPaid: false,
    isGame: false
  },
  {
    id: "python-fastapi",
    name: "FastAPI",
    description: "Современный, быстрый веб-фреймворк для создания API",
    version: "0.109.0",
    language: "python",
    source: "PyPI",
    popularity: 4.8,
    tags: ["web", "api", "async"],
    isPaid: false,
    isGame: false
  },
  
  // Python UI and Visualization
  {
    id: "python-kivymd",
    name: "KivyMD",
    description: "Набор виджетов Material Design для фреймворка Kivy",
    version: "1.2.0",
    language: "python",
    source: "PyPI",
    popularity: 4.7,
    tags: ["ui", "material-design", "mobile"],
    isPaid: false,
    isGame: false
  },
  {
    id: "python-opencv",
    name: "OpenCV",
    description: "Библиотека компьютерного зрения с открытым исходным кодом",
    version: "4.8.0",
    language: "python",
    source: "PyPI",
    popularity: 4.9,
    tags: ["computer-vision", "image-processing"],
    isPaid: false,
    isGame: false
  },
  {
    id: "python-pygame",
    name: "Pygame",
    description: "Библиотека разработки игр на Python",
    version: "2.5.2",
    language: "python",
    source: "PyPI",
    popularity: 4.8,
    tags: ["games", "graphics", "multimedia"],
    isPaid: false,
    isGame: true
  },
  {
    id: "python-pillow",
    name: "Pillow",
    description: "Библиотека для обработки изображений в Python",
    version: "10.2.0",
    language: "python",
    source: "PyPI",
    popularity: 4.7,
    tags: ["image-processing", "graphics"],
    isPaid: false,
    isGame: false
  },
  {
    id: "python-plotly",
    name: "Plotly",
    description: "Интерактивная библиотека визуализации для Python",
    version: "5.18.0",
    language: "python",
    source: "PyPI",
    popularity: 4.8,
    tags: ["visualization", "interactive", "dashboards"],
    isPaid: false,
    isGame: false
  },
  
  // C++ Libraries - Core and Utilities
  {
    id: "cpp-boost",
    name: "Boost",
    description: "Набор высококачественных библиотек C++",
    version: "1.83.0",
    language: "cpp",
    source: "Conan",
    popularity: 4.9,
    tags: ["utilities", "algorithms", "performance"],
    isPaid: false,
    isGame: false
  },
  {
    id: "cpp-eigen",
    name: "Eigen",
    description: "Библиотека линейной алгебры для C++",
    version: "3.4.0",
    language: "cpp",
    source: "Conan",
    popularity: 4.7,
    tags: ["linear-algebra", "matrices", "scientific"],
    isPaid: false,
    isGame: false
  },
  {
    id: "cpp-fmt",
    name: "fmt",
    description: "Современная библиотека форматирования строк для C++",
    version: "10.1.1",
    language: "cpp",
    source: "Conan",
    popularity: 4.6,
    tags: ["formatting", "strings", "io"],
    isPaid: false,
    isGame: false
  },
  {
    id: "cpp-abseil",
    name: "Abseil",
    description: "Библиотека основных компонентов C++ от Google",
    version: "20230802.1",
    language: "cpp",
    source: "Conan",
    popularity: 4.5,
    tags: ["utilities", "google", "string"],
    isPaid: false,
    isGame: false
  },
  {
    id: "cpp-poco",
    name: "POCO",
    description: "Коллекция классов C++ для разработки сетевых приложений",
    version: "1.12.5",
    language: "cpp",
    source: "Conan",
    popularity: 4.4,
    tags: ["networking", "database", "utilities"],
    isPaid: false,
    isGame: false
  },
  
  // C++ Graphics and Games
  {
    id: "cpp-sfml",
    name: "SFML",
    description: "Simple and Fast Multimedia Library для C++",
    version: "2.6.0",
    language: "cpp",
    source: "Conan",
    popularity: 4.6,
    tags: ["graphics", "audio", "games"],
    isPaid: false,
    isGame: true
  },
  {
    id: "cpp-sdl2",
    name: "SDL2",
    description: "Simple DirectMedia Layer: мультимедийная библиотека",
    version: "2.28.3",
    language: "cpp",
    source: "Conan",
    popularity: 4.7,
    tags: ["graphics", "audio", "input", "games"],
    isPaid: false,
    isGame: true
  },
  {
    id: "cpp-opengl",
    name: "OpenGL",
    description: "API для рендеринга 2D и 3D графики",
    version: "4.6.0",
    language: "cpp",
    source: "System",
    popularity: 4.8,
    tags: ["graphics", "rendering", "3d"],
    isPaid: false,
    isGame: true
  },
  {
    id: "cpp-bullet",
    name: "Bullet Physics",
    description: "Физический движок для симуляции 3D коллизий",
    version: "3.25",
    language: "cpp",
    source: "Conan",
    popularity: 4.5,
    tags: ["physics", "game-engine", "collision"],
    isPaid: false,
    isGame: true
  },
  
  // C++ UI
  {
    id: "cpp-qt",
    name: "Qt6",
    description: "Кроссплатформенный фреймворк для разработки ПО",
    version: "6.5.3",
    language: "cpp",
    source: "Conan",
    popularity: 4.8,
    tags: ["gui", "widgets", "cross-platform"],
    isPaid: false,
    isGame: false
  },
  {
    id: "cpp-imgui",
    name: "Dear ImGui",
    description: "Быстрый и минималистичный графический интерфейс для C++",
    version: "1.90.0",
    language: "cpp",
    source: "Conan",
    popularity: 4.9,
    tags: ["gui", "immediate-mode", "graphics"],
    isPaid: false,
    isGame: false
  },
  {
    id: "cpp-wxwidgets",
    name: "wxWidgets",
    description: "Кроссплатформенная библиотека виджетов для C++",
    version: "3.2.3",
    language: "cpp",
    source: "Conan",
    popularity: 4.3,
    tags: ["gui", "widgets", "cross-platform"],
    isPaid: false,
    isGame: false
  },
  
  // C++ Network and Web
  {
    id: "cpp-asio",
    name: "Asio",
    description: "Кроссплатформенная библиотека асинхронного ввода-вывода",
    version: "1.28.0",
    language: "cpp",
    source: "Conan",
    popularity: 4.7,
    tags: ["networking", "async", "io"],
    isPaid: false,
    isGame: false
  },
  {
    id: "cpp-crow",
    name: "Crow",
    description: "C++ микрофреймворк для веб-приложений",
    version: "1.0",
    language: "cpp",
    source: "Conan",
    popularity: 4.3,
    tags: ["web", "http", "framework"],
    isPaid: false,
    isGame: false
  },
  {
    id: "cpp-grpc",
    name: "gRPC",
    description: "Высокопроизводительный RPC фреймворк",
    version: "1.59.2",
    language: "cpp",
    source: "Conan",
    popularity: 4.6,
    tags: ["rpc", "protobuf", "networking"],
    isPaid: false,
    isGame: false
  },
  
  // Lua Libraries
  {
    id: "lua-love2d",
    name: "LÖVE (Love2D)",
    description: "Фреймворк для создания 2D-игр на Lua",
    version: "11.5.0",
    language: "lua",
    source: "LuaRocks",
    popularity: 4.7,
    tags: ["games", "2d", "graphics"],
    isPaid: false,
    isGame: true
  },
  {
    id: "lua-luasocket",
    name: "LuaSocket",
    description: "Библиотека для сетевого взаимодействия на Lua",
    version: "3.1.0",
    language: "lua",
    source: "LuaRocks",
    popularity: 4.3,
    tags: ["network", "sockets", "io"],
    isPaid: false,
    isGame: false
  },
  {
    id: "lua-lgi",
    name: "LGI",
    description: "Динамические биндинги Lua к GObject библиотекам",
    version: "0.9.2",
    language: "lua",
    source: "LuaRocks",
    popularity: 4.2,
    tags: ["gui", "gobject", "bindings"],
    isPaid: false,
    isGame: false
  },
  {
    id: "lua-luajit",
    name: "LuaJIT",
    description: "JIT-компилятор для Lua с расширениями",
    version: "2.1.0",
    language: "lua",
    source: "LuaRocks",
    popularity: 4.8,
    tags: ["jit", "performance", "ffi"],
    isPaid: false,
    isGame: false
  },
  {
    id: "lua-penlight",
    name: "Penlight",
    description: "Библиотека полезных функций для Lua",
    version: "1.13.1",
    language: "lua",
    source: "LuaRocks",
    popularity: 4.4,
    tags: ["utilities", "data-structures", "functional"],
    isPaid: false,
    isGame: false
  },
  {
    id: "lua-busted",
    name: "Busted",
    description: "Элегантный фреймворк для тестирования в Lua",
    version: "2.2.0",
    language: "lua",
    source: "LuaRocks",
    popularity: 4.2,
    tags: ["testing", "bdd", "tdd"],
    isPaid: false,
    isGame: false
  },
  {
    id: "lua-lapis",
    name: "Lapis",
    description: "Веб-фреймворк для Lua на OpenResty",
    version: "1.16.0",
    language: "lua",
    source: "LuaRocks",
    popularity: 4.1,
    tags: ["web", "framework", "openresty"],
    isPaid: false,
    isGame: false
  },
  {
    id: "lua-middleclass",
    name: "MiddleClass",
    description: "Объектно-ориентированная библиотека для Lua",
    version: "4.1.1",
    language: "lua",
    source: "LuaRocks",
    popularity: 4.3,
    tags: ["oop", "class", "inheritance"],
    isPaid: false,
    isGame: false
  },
  {
    id: "lua-luafilesystem",
    name: "LuaFileSystem",
    description: "Файловые операции для Lua",
    version: "1.8.0",
    language: "lua",
    source: "LuaRocks",
    popularity: 4.5,
    tags: ["filesystem", "io", "directory"],
    isPaid: false,
    isGame: false
  },
  {
    id: "lua-copas",
    name: "Copas",
    description: "Кооперативное многозадачное программирование для Lua",
    version: "2.0.2",
    language: "lua",
    source: "LuaRocks",
    popularity: 4.0,
    tags: ["async", "networking", "coroutines"],
    isPaid: false,
    isGame: false
  }
];

export function getFilteredLibraries(
  language?: ProgrammingLanguage,
  query?: string,
  isPaid?: boolean,
  isForGames?: boolean
): Library[] {
  return mockLibraries.filter(lib => {
    // Apply language filter
    if (language && lib.language !== language) return false;
    
    // Apply search query
    if (query && !lib.name.toLowerCase().includes(query.toLowerCase()) && 
        !lib.description.toLowerCase().includes(query.toLowerCase())) return false;
    
    // Apply paid filter
    if (isPaid !== undefined && lib.isPaid !== isPaid) return false;
    
    // Apply games filter
    if (isForGames !== undefined && lib.isGame !== isForGames) return false;
    
    return true;
  });
}

// Get libraries by category
export function getLibrariesByCategory(category: string): Library[] {
  const categoryTagMap: Record<string, string[]> = {
    'machine-learning': ['machine-learning', 'deep-learning', 'neural-networks'],
    'web-dev': ['web', 'framework', 'api', 'http'],
    'game-dev': ['games', 'graphics', '2d', '3d'],
    'data-science': ['data-analysis', 'statistics', 'numerical'],
    'gui': ['gui', 'widgets', 'ui']
  };
  
  const categoryTags = categoryTagMap[category] || [];
  if (categoryTags.length === 0) return [];
  
  return mockLibraries.filter(lib => 
    lib.tags.some(tag => categoryTags.includes(tag))
  );
}

// Get popular libraries across all languages
export function getPopularLibraries(limit: number = 5): Library[] {
  return [...mockLibraries]
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit);
}

// Get libraries for a specific language with a minimum popularity score
export function getTopLibrariesForLanguage(language: ProgrammingLanguage, minPopularity: number = 4.5, limit: number = 10): Library[] {
  return mockLibraries
    .filter(lib => lib.language === language && lib.popularity >= minPopularity)
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit);
}
