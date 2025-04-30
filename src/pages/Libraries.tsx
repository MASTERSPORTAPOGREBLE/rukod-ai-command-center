import React, { useState, useEffect } from 'react';
import { Library } from '../models/types';
import { terminalService } from '../services/terminalService';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

const mockLibraries: Library[] = [
  {
    id: '1',
    name: 'requests',
    description: 'A simple, yet elegant, HTTP library.',
    version: '2.28.1',
    language: 'python',
    source: 'https://pypi.org/project/requests/',
    popularity: 98,
    tags: ['http', 'api', 'web'],
  },
  {
    id: '2',
    name: 'numpy',
    description: 'The fundamental package for scientific computing with Python.',
    version: '1.23.4',
    language: 'python',
    source: 'https://numpy.org/',
    popularity: 95,
    tags: ['math', 'science', 'array'],
  },
  {
    id: '3',
    name: 'pandas',
    description: 'Powerful data structures for data analysis, time series, and statistics.',
    version: '1.5.1',
    language: 'python',
    source: 'https://pandas.pydata.org/',
    popularity: 92,
    tags: ['data', 'analysis', 'statistics'],
  },
  {
    id: '4',
    name: 'discord.py',
    description: 'A Python library for interacting with the Discord API.',
    version: '2.0.0',
    language: 'python',
    source: 'https://discord.com/developers/docs/intro',
    popularity: 88,
    tags: ['discord', 'api', 'bot'],
    isGame: true,
  },
  {
    id: '5',
    name: 'pygame',
    description: 'A Python library for creating games and multimedia applications.',
    version: '2.1.2',
    language: 'python',
    source: 'https://www.pygame.org/',
    popularity: 85,
    tags: ['game', 'multimedia'],
    isGame: true,
  },
  {
    id: '6',
    name: 'SFML',
    description: 'Simple and Fast Multimedia Library',
    version: '2.5.1',
    language: 'cpp',
    source: 'https://www.sfml-dev.org/',
    popularity: 70,
    tags: ['graphics', 'audio', 'window', 'multimedia'],
    isGame: true,
  },
  {
    id: '7',
    name: 'Boost',
    description: 'A set of portable C++ source libraries.',
    version: '1.77.0',
    language: 'cpp',
    source: 'https://www.boost.org/',
    popularity: 75,
    tags: ['library', 'portable'],
  },
  {
    id: '8',
    name: 'LuaSocket',
    description: 'Networking extension for Lua.',
    version: '3.0',
    language: 'lua',
    source: 'https://luarocks.org/modules/luasocket/luasocket',
    popularity: 60,
    tags: ['networking', 'socket'],
  },
  {
    id: '9',
    name: 'love2d',
    description: 'Free 2D game engine in Lua.',
    version: '11.3',
    language: 'lua',
    source: 'https://love2d.org/',
    popularity: 78,
    tags: ['game', '2d'],
    isGame: true,
  },
  {
    id: '10',
    name: 'axios',
    description: 'Promise based HTTP client for the browser and node.js',
    version: '0.27.2',
    language: 'javascript',
    source: 'https://axios-http.com/docs/intro',
    popularity: 92,
    tags: ['http', 'api'],
  },
  {
    id: '11',
    name: 'lodash',
    description: 'A modern JavaScript utility library delivering modularity, performance & extras.',
    version: '4.17.21',
    language: 'javascript',
    source: 'https://lodash.com/',
    popularity: 89,
    tags: ['utility', 'function'],
  },
  {
    id: '12',
    name: 'tokio',
    description: 'A runtime for writing reliable asynchronous applications with Rust.',
    version: '1.12.0',
    language: 'rust',
    source: 'https://tokio.rs/',
    popularity: 80,
    tags: ['async', 'runtime'],
  },
  {
    id: '13',
    name: 'rocket',
    description: 'Web framework for Rust with a focus on ease-of-use, expressiveness, and safety.',
    version: '0.5',
    language: 'rust',
    source: 'https://rocket.rs/',
    popularity: 72,
    tags: ['web', 'framework'],
  },
  {
    id: '14',
    name: 'rails',
    description: 'Full-stack web framework optimized for sustainable productivity.',
    version: '7.0',
    language: 'ruby',
    source: 'https://rubyonrails.org/',
    popularity: 85,
    tags: ['web', 'framework', 'full-stack'],
  },
  {
    id: '15',
    name: 'sinatra',
    description: 'A DSL for quickly creating web applications in Ruby with minimal effort.',
    version: '2.0',
    language: 'ruby',
    source: 'https://sinatrarb.com/',
    popularity: 70,
    tags: ['web', 'dsl'],
  },
];

const Libraries: React.FC = () => {
  const [libraries, setLibraries] = useState<Library[]>(mockLibraries);
  const [searchQuery, setSearchQuery] = useState('');
  const [languageFilter, setLanguageFilter] = useState<string>('all');

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const filteredLibraries = libraries.filter(library => {
    const searchMatch = library.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      library.description.toLowerCase().includes(searchQuery.toLowerCase());
    const languageMatch = languageFilter === 'all' || library.language === languageFilter;
    return searchMatch && languageMatch;
  });

  const handleInstall = (library: Library) => {
    // Simulate installation process
    toast.promise(
      new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate success or failure
          const success = Math.random() > 0.5;
          if (success) {
            terminalService.addLog({
              id: uuidv4(),
              level: "success",
              message: `Library ${library.name} installed successfully.`,
              timestamp: new Date()
            });
            resolve(`Library ${library.name} installed!`);
          } else {
            terminalService.addLog({
              id: uuidv4(),
              level: "error",
              message: `Failed to install library ${library.name}.`,
              timestamp: new Date()
            });
            reject(`Failed to install ${library.name}.`);
          }
        }, 2000);
      }),
      {
        loading: `Installing ${library.name}...`,
        success: (data) => data,
        error: (error) => error,
      }
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Библиотеки</h1>

      <div className="flex flex-col md:flex-row items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Поиск библиотек..."
          className="p-2 border rounded text-black w-full md:w-auto mb-2 md:mb-0"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />

        <select
          className="p-2 border rounded text-black w-full md:w-auto"
          value={languageFilter}
          onChange={e => setLanguageFilter(e.target.value)}
        >
          <option value="all">Все языки</option>
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="cpp">C++</option>
          <option value="rust">Rust</option>
          <option value="ruby">Ruby</option>
          <option value="lua">Lua</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLibraries.map(library => (
          <div key={library.id} className="bg-gray-800 rounded-lg p-4">
            <h2 className="text-lg font-semibold">{library.name}</h2>
            <p className="text-gray-400">{library.description}</p>
            <p className="text-sm mt-2">
              Язык: {library.language}, Версия: {library.version}
            </p>
            <a
              href={library.source}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline block mt-2"
            >
              Подробнее
            </a>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
              onClick={() => handleInstall(library)}
            >
              Установить
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Libraries;
