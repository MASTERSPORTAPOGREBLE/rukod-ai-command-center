import { Library } from '@/models/types';

// Функция для создания библиотеки с полными данными
const createLibrary = (lib: any) => {
  return {
    ...lib,
    // Добавляем недостающие поля
    author: lib.author || 'Unknown Author',
    isStable: lib.isStable !== undefined ? lib.isStable : true,
    downloadCount: lib.downloadCount || Math.floor(Math.random() * 100000),
    lastUpdated: lib.lastUpdated || new Date().toISOString().split('T')[0],
    license: lib.license || 'MIT'
  };
};

export const pythonLibraries: Library[] = [
  createLibrary({
    id: 'python-numpy',
    name: 'Numpy',
    description: 'Библиотека для научных вычислений на Python',
    version: '1.23.0',
    language: 'python',
    source: 'pip',
    popularity: 95,
    tags: ['math', 'science', 'arrays'],
    isPaid: false,
    isGame: false
  }),
  createLibrary({
    id: 'python-pandas',
    name: 'Pandas',
    description: 'Библиотека для анализа данных на Python',
    version: '1.4.0',
    language: 'python',
    source: 'pip',
    popularity: 92,
    tags: ['data-analysis', 'data-science', 'dataframes'],
    isPaid: false,
    isGame: false
  }),
  createLibrary({
    id: 'python-requests',
    name: 'Requests',
    description: 'Библиотека для отправки HTTP-запросов на Python',
    version: '2.28.0',
    language: 'python',
    source: 'pip',
    popularity: 88,
    tags: ['http', 'api', 'web'],
    isPaid: false,
    isGame: false
  }),
  createLibrary({
    id: 'python-django',
    name: 'Django',
    description: 'Веб-фреймворк высокого уровня на Python',
    version: '4.1.0',
    language: 'python',
    source: 'pip',
    popularity: 85,
    tags: ['web-framework', 'web-development', 'backend'],
    isPaid: false,
    isGame: false
  }),
  createLibrary({
    id: 'python-flask',
    name: 'Flask',
    description: 'Микро веб-фреймворк на Python',
    version: '2.2.0',
    language: 'python',
    source: 'pip',
    popularity: 80,
    tags: ['web-framework', 'web-development', 'microframework'],
    isPaid: false,
    isGame: false
  }),
  createLibrary({
    id: 'python-pygame',
    name: 'Pygame',
    description: 'Библиотека для разработки игр на Python',
    version: '2.1.0',
    language: 'python',
    source: 'pip',
    popularity: 75,
    tags: ['game-development', '2d', 'multimedia'],
    isPaid: false,
    isGame: true
  }),
  createLibrary({
    id: 'python-matplotlib',
    name: 'Matplotlib',
    description: 'Библиотека для визуализации данных на Python',
    version: '3.6.0',
    language: 'python',
    source: 'pip',
    popularity: 90,
    tags: ['data-visualization', 'plotting', 'charts'],
    isPaid: false,
    isGame: false
  }),
  createLibrary({
    id: 'python-scikit-learn',
    name: 'Scikit-learn',
    description: 'Библиотека машинного обучения на Python',
    version: '1.2.0',
    language: 'python',
    source: 'pip',
    popularity: 88,
    tags: ['machine-learning', 'data-science', 'algorithms'],
    isPaid: false,
    isGame: false
  }),
  createLibrary({
    id: 'python-opencv',
    name: 'OpenCV',
    description: 'Библиотека компьютерного зрения на Python',
    version: '4.6.0',
    language: 'python',
    source: 'pip',
    popularity: 82,
    tags: ['computer-vision', 'image-processing', 'video-analysis'],
    isPaid: false,
    isGame: false
  }),
  createLibrary({
    id: 'python-beautifulsoup4',
    name: 'Beautiful Soup 4',
    description: 'Библиотека для парсинга HTML и XML на Python',
    version: '4.11.0',
    language: 'python',
    source: 'pip',
    popularity: 78,
    tags: ['web-scraping', 'html', 'xml'],
    isPaid: false,
    isGame: false
  }),
  createLibrary({
    id: 'python-keras',
    name: 'Keras',
    description: 'Библиотека глубокого обучения для Python',
    version: '2.9.0',
    language: 'python',
    source: 'pip',
    popularity: 92,
    tags: ['deep-learning', 'neural-networks', 'machine-learning'],
    isPaid: false,
    isGame: false
  }),
  
  createLibrary({
    id: 'python-tensorflow',
    name: 'TensorFlow',
    description: 'Библиотека машинного обучения от Google',
    version: '2.9.1',
    language: 'python',
    source: 'pip',
    popularity: 95,
    tags: ['machine-learning', 'neural-networks', 'gpu'],
    isPaid: false,
    isGame: false
  }),
];

export const javascriptLibraries: Library[] = [
  createLibrary({
    id: 'javascript-react',
    name: 'React',
    description: 'JavaScript-библиотека для создания пользовательских интерфейсов',
    version: '18.0.0',
    language: 'javascript',
    source: 'npm',
    popularity: 95,
    tags: ['ui', 'components', 'frontend'],
    isPaid: false,
    isGame: false
  }),
  createLibrary({
    id: 'javascript-angular',
    name: 'Angular',
    description: 'Платформа для создания клиентских приложений с использованием HTML, CSS и TypeScript',
    version: '14.0.0',
    language: 'javascript',
    source: 'npm',
    popularity: 80,
    tags: ['framework', 'web', 'frontend'],
    isPaid: false,
    isGame: false
  }),
  createLibrary({
    id: 'javascript-vue',
    name: 'Vue',
    description: 'Прогрессивный JavaScript-фреймворк для создания пользовательских интерфейсов',
    version: '3.0.0',
    language: 'javascript',
    source: 'npm',
    popularity: 85,
    tags: ['ui', 'components', 'frontend'],
    isPaid: false,
    isGame: false
  }),
  createLibrary({
    id: 'javascript-node',
    name: 'Node.js',
    description: 'JavaScript-среда выполнения на стороне сервера',
    version: '16.0.0',
    language: 'javascript',
    source: 'npm',
    popularity: 90,
    tags: ['backend', 'server', 'runtime'],
    isPaid: false,
    isGame: false
  }),
  createLibrary({
    id: 'javascript-express',
    name: 'Express',
    description: 'Минималистичный и гибкий Node.js веб-фреймворк',
    version: '4.18.0',
    language: 'javascript',
    source: 'npm',
    popularity: 88,
    tags: ['web-framework', 'backend', 'api'],
    isPaid: false,
    isGame: false
  }),
  createLibrary({
    id: 'javascript-three',
    name: 'Three.js',
    description: 'JavaScript 3D-библиотека',
    version: '0.140.0',
    language: 'javascript',
    source: 'npm',
    popularity: 75,
    tags: ['3d', 'graphics', 'webgl'],
    isPaid: false,
    isGame: true
  }),
  createLibrary({
    id: 'javascript-phaser',
    name: 'Phaser',
    description: 'Быстрый, бесплатный и забавный HTML5 игровой фреймворк',
    version: '3.55.0',
    language: 'javascript',
    source: 'npm',
    popularity: 82,
    tags: ['game-framework', '2d', 'html5'],
    isPaid: false,
    isGame: true
  }),
  createLibrary({
    id: 'javascript-socket.io',
    name: 'Socket.IO',
    description: 'Библиотека для обеспечения связи в реальном времени между клиентом и сервером',
    version: '4.5.0',
    language: 'javascript',
    source: 'npm',
    popularity: 78,
    tags: ['realtime', 'communication', 'websocket'],
    isPaid: false,
    isGame: false
  }),
];

export const cppLibraries: Library[] = [
  createLibrary({
    id: 'cpp-sfml',
    name: 'SFML',
    description: 'Простая и быстрая мультимедийная библиотека',
    version: '2.5.0',
    language: 'cpp',
    source: 'apt',
    popularity: 70,
    tags: ['multimedia', 'graphics', 'game-development'],
    isPaid: false,
    isGame: true
  }),
  createLibrary({
    id: 'cpp-boost',
    name: 'Boost',
    description: 'Набор бесплатных рецензируемых библиотек C++',
    version: '1.79.0',
    language: 'cpp',
    source: 'apt',
    popularity: 85,
    tags: ['utilities', 'algorithms', 'data-structures'],
    isPaid: false,
    isGame: false
  }),
  createLibrary({
    id: 'cpp-opencv',
    name: 'OpenCV',
    description: 'Библиотека компьютерного зрения',
    version: '4.6.0',
    language: 'cpp',
    source: 'apt',
    popularity: 80,
    tags: ['computer-vision', 'image-processing', 'video-analysis'],
    isPaid: false,
    isGame: false
  }),
  createLibrary({
    id: 'cpp-sdl',
    name: 'SDL',
    description: 'Простая DirectMedia Layer',
    version: '2.0.0',
    language: 'cpp',
    source: 'apt',
    popularity: 75,
    tags: ['multimedia', 'game-development', 'graphics'],
    isPaid: false,
    isGame: true
  }),
];

export const luaLibraries: Library[] = [
  createLibrary({
    id: 'lua-love2d',
    name: 'Love2D',
    description: 'Бесплатный 2D игровой движок на Lua',
    version: '11.3',
    language: 'lua',
    source: 'luarocks',
    popularity: 90,
    tags: ['game-engine', '2d', 'game-development'],
    isPaid: false,
    isGame: true
  }),
  createLibrary({
    id: 'lua-socket',
    name: 'LuaSocket',
    description: 'Сетевая библиотека для Lua',
    version: '3.0',
    language: 'lua',
    source: 'luarocks',
    popularity: 70,
    tags: ['networking', 'sockets', 'communication'],
    isPaid: false,
    isGame: false
  }),
  createLibrary({
    id: 'lua-luasql',
    name: 'LuaSQL',
    description: 'Библиотека для работы с базами данных в Lua',
    version: '2.3',
    language: 'lua',
    source: 'luarocks',
    popularity: 65,
    tags: ['database', 'sql', 'data-management'],
    isPaid: false,
    isGame: false
  }),
];

export const rubyLibraries: Library[] = [
  createLibrary({
    id: 'ruby-rails',
    name: 'Rails',
    description: 'Веб-фреймворк на Ruby',
    version: '7.0',
    language: 'ruby',
    source: 'gem',
    popularity: 90,
    tags: ['web-framework', 'backend', 'mvc'],
    isPaid: false,
    isGame: false
  }),
  createLibrary({
    id: 'ruby-sinatra',
    name: 'Sinatra',
    description: 'DSL для быстрого создания веб-приложений на Ruby',
    version: '2.0',
    language: 'ruby',
    source: 'gem',
    popularity: 75,
    tags: ['web-framework', 'microframework', 'api'],
    isPaid: false,
    isGame: false
  }),
  createLibrary({
    id: 'ruby-nokogiri',
    name: 'Nokogiri',
    description: 'Библиотека для парсинга HTML, XML, SAX и Reader на Ruby',
    version: '1.13',
    language: 'ruby',
    source: 'gem',
    popularity: 70,
    tags: ['xml', 'html', 'parsing'],
    isPaid: false,
    isGame: false
  }),
];

export const rustLibraries: Library[] = [
  createLibrary({
    id: 'rust-tokio',
    name: 'Tokio',
    description: 'Асинхронная среда выполнения для Rust',
    version: '1.0',
    language: 'rust',
    source: 'cargo',
    popularity: 85,
    tags: ['async', 'runtime', 'networking'],
    isPaid: false,
    isGame: false
  }),
  createLibrary({
    id: 'rust-rocket',
    name: 'Rocket',
    description: 'Веб-фреймворк для Rust',
    version: '0.5',
    language: 'rust',
    source: 'cargo',
    popularity: 70,
    tags: ['web-framework', 'backend', 'api'],
    isPaid: false,
    isGame: false
  }),
  createLibrary({
    id: 'rust-ggez',
    name: 'GGEZ',
    description: 'Легковесный фреймворк для создания 2D игр на Rust',
    version: '0.7',
    language: 'rust',
    source: 'cargo',
    popularity: 60,
    tags: ['game-framework', '2d', 'graphics'],
    isPaid: false,
    isGame: true
  }),
];

export const getAllLibraries = (): Library[] => {
  return [
    ...pythonLibraries,
    ...javascriptLibraries,
    ...cppLibraries,
    ...luaLibraries,
    ...rubyLibraries,
    ...rustLibraries,
  ];
};

export const getLibrariesByCategory = (category: string): Library[] => {
  const allLibraries = getAllLibraries();
  return allLibraries.filter(lib => lib.tags?.includes(category) || false);
};

export const getFilteredLibraries = (filters: {
  language?: string;
  category?: string;
  isPaid?: boolean;
  isGame?: boolean;
}): Library[] => {
  const allLibraries = getAllLibraries();
  
  return allLibraries.filter(lib => {
    if (filters.language && lib.language !== filters.language) return false;
    if (filters.category && !lib.tags?.includes(filters.category)) return false;
    if (filters.isPaid !== undefined && lib.isPaid !== filters.isPaid) return false;
    if (filters.isGame !== undefined && lib.isGame !== filters.isGame) return false;
    return true;
  });
};
