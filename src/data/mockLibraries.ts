
import { Library, ProgrammingLanguage } from "../models/types";

export const mockLibraries: Library[] = [
  // Python Libraries
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
  
  // C++ Libraries
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
    id: "cpp-qt",
    name: "Qt6",
    description: "Кроссплатформенный фреймворк для разработки ПО",
    version: "6.5.0",
    language: "cpp",
    source: "Conan",
    popularity: 4.8,
    tags: ["gui", "widgets", "cross-platform"],
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
