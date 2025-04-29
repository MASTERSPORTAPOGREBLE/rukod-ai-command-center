
import React, { useState } from 'react';
import { CodeEditor } from '../components/CodeEditor';
import { SystemStats } from '../components/SystemStats';
import { AIAssistant } from '../components/AIAssistant';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CodeTerminal = () => {
  const [aiHelperActive, setAiHelperActive] = useState(true);
  
  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <SystemStats />
      </div>
      
      <div className="flex-grow h-[calc(100vh-300px)] overflow-hidden border border-gray-800 rounded-md">
        <Tabs defaultValue="editor" className="w-full h-full">
          <TabsList className="border-b border-gray-800 w-full justify-start">
            <TabsTrigger value="editor">Редактор кода</TabsTrigger>
            <TabsTrigger value="libraries">Библиотеки</TabsTrigger>
            <TabsTrigger value="documentation">Документация</TabsTrigger>
          </TabsList>
          
          <TabsContent value="editor" className="h-[calc(100%-40px)]">
            <CodeEditor />
          </TabsContent>
          
          <TabsContent value="libraries">
            <div className="p-4">
              <h2 className="text-xl font-bold mb-4">Доступные библиотеки</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <LibraryList language="python" />
                <LibraryList language="cpp" />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="documentation">
            <div className="p-4">
              <h2 className="text-xl font-bold mb-4">Документация по языкам</h2>
              <div className="space-y-4">
                <LanguageDocumentation language="python" />
                <LanguageDocumentation language="cpp" />
                <LanguageDocumentation language="lua" />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <AIAssistant isActive={aiHelperActive} />
    </div>
  );
};

// Component to display libraries for each language
const LibraryList: React.FC<{ language: string }> = ({ language }) => {
  // Libraries for each language
  const libraries = {
    python: [
      { name: 'NumPy', version: '1.26.3', description: 'Вычислительные операции с массивами' },
      { name: 'Pandas', version: '2.1.4', description: 'Анализ данных и манипуляции' },
      { name: 'Matplotlib', version: '3.8.2', description: 'Визуализация данных' },
      { name: 'SciPy', version: '1.12.0', description: 'Научные вычисления' },
      { name: 'Scikit-learn', version: '1.3.2', description: 'Машинное обучение' },
      { name: 'TensorFlow', version: '2.15.0', description: 'Глубокое обучение' },
      { name: 'PyTorch', version: '2.1.2', description: 'Глубокое обучение' },
      { name: 'Keras', version: '3.0.2', description: 'Высокоуровневое API для нейросетей' },
      { name: 'OpenCV-Python', version: '4.8.1', description: 'Компьютерное зрение' },
      { name: 'NLTK', version: '3.8.1', description: 'Обработка естественного языка' },
      { name: 'SpaCy', version: '3.7.2', description: 'Обработка естественного языка' },
      { name: 'Gensim', version: '4.3.2', description: 'Тематическое моделирование' },
      { name: 'BeautifulSoup4', version: '4.12.2', description: 'Парсинг HTML и XML' },
      { name: 'Scrapy', version: '2.11.0', description: 'Веб-скрапинг' },
      { name: 'Requests', version: '2.31.0', description: 'HTTP-запросы' },
      { name: 'Flask', version: '3.0.0', description: 'Веб-фреймворк' },
      { name: 'Django', version: '4.2.8', description: 'Веб-фреймворк' },
      { name: 'FastAPI', version: '0.104.1', description: 'Веб-фреймворк' },
      { name: 'SQLAlchemy', version: '2.0.23', description: 'ORM для баз данных' },
      { name: 'Pygame', version: '2.5.2', description: 'Разработка игр' },
      { name: 'Pillow', version: '10.1.0', description: 'Обработка изображений' },
      { name: 'Sympy', version: '1.12', description: 'Символьные вычисления' },
      { name: 'XGBoost', version: '2.0.2', description: 'Градиентный бустинг' },
      { name: 'LightGBM', version: '4.1.0', description: 'Градиентный бустинг' },
      { name: 'CatBoost', version: '1.2.2', description: 'Градиентный бустинг' }
    ],
    cpp: [
      { name: 'Boost', version: '1.83.0', description: 'Коллекция библиотек' },
      { name: 'Eigen', version: '3.4.0', description: 'Линейная алгебра' },
      { name: 'OpenCV', version: '4.8.0', description: 'Компьютерное зрение' },
      { name: 'Qt', version: '6.5.3', description: 'GUI фреймворк' },
      { name: 'SFML', version: '2.6.1', description: 'Мультимедиа и графика' },
      { name: 'SDL', version: '2.30.0', description: 'Мультимедиа' },
      { name: 'OpenGL', version: '4.6', description: '3D графика' },
      { name: 'Vulkan', version: '1.3.269', description: '3D графика' },
      { name: 'GLM', version: '0.9.9.8', description: 'Математика для OpenGL' },
      { name: 'Poco', version: '1.12.5', description: 'Сеть и утилиты' },
      { name: 'CGAL', version: '5.6.1', description: 'Вычислительная геометрия' },
      { name: 'PCL', version: '1.13.1', description: 'Обработка облаков точек' },
      { name: 'Dlib', version: '19.24.2', description: 'Машинное обучение' },
      { name: 'TensorFlow C++', version: '2.15.0', description: 'Глубокое обучение' },
      { name: 'FFTW', version: '3.3.10', description: 'Быстрое преобразование Фурье' },
      { name: 'Ceres Solver', version: '2.1.0', description: 'Нелинейная оптимизация' },
      { name: 'ArrayFire', version: '3.8.3', description: 'Параллельные вычисления' },
      { name: 'JSON for Modern C++', version: '3.11.3', description: 'Работа с JSON' },
      { name: 'Catch2', version: '3.5.0', description: 'Фреймворк для тестирования' },
      { name: 'fmt', version: '10.1.1', description: 'Форматирование строк' },
      { name: 'spdlog', version: '1.12.0', description: 'Быстрое логирование' },
      { name: 'ZeroMQ', version: '4.3.5', description: 'Асинхронная передача сообщений' },
      { name: 'libcurl', version: '8.4.0', description: 'HTTP-клиент' },
      { name: 'RapidJSON', version: '1.1.0', description: 'Быстрый JSON парсер/генератор' },
      { name: 'OpenMP', version: '5.1', description: 'Параллельные вычисления' }
    ],
    lua: [
      { name: 'LuaSocket', version: '3.1.0', description: 'Сетевые операции' },
      { name: 'LuaFileSystem', version: '1.8.0', description: 'Работа с файлами' },
      { name: 'Penlight', version: '1.13.1', description: 'Набор утилит' },
      { name: 'lua-cjson', version: '2.1.0', description: 'JSON парсинг' },
      { name: 'luaunit', version: '3.4', description: 'Модульное тестирование' },
      { name: 'Copas', version: '4.3.0', description: 'Корутины для асинхронного I/O' },
      { name: 'lua-llthreads2', version: '0.1.6', description: 'Многопоточность' },
      { name: 'LuaSQL', version: '2.6.0', description: 'Работа с БД' },
      { name: 'LuaLogging', version: '1.5.1', description: 'Логирование' },
      { name: 'LuaXML', version: '1.5.0', description: 'Парсинг XML' },
      { name: 'LuaGL', version: '1.5', description: 'Привязки к OpenGL' },
      { name: 'LPeg', version: '1.1.0', description: 'Парсинг шаблонов' },
      { name: 'Lua-curl', version: '0.3.13', description: 'Привязки к libcurl' },
      { name: 'LuaRocks', version: '3.9.2', description: 'Менеджер пакетов' },
      { name: 'MoonScript', version: '0.5.0', description: 'Язык, компилируемый в Lua' }
    ]
  };

  const languageLibraries = libraries[language as keyof typeof libraries] || [];
  const displayName = language === 'cpp' ? 'C++' : language.charAt(0).toUpperCase() + language.slice(1);

  return (
    <div className="border border-gray-700 rounded-md p-2">
      <h3 className="font-bold mb-2">{displayName} ({languageLibraries.length})</h3>
      <div className="h-96 overflow-y-auto">
        {languageLibraries.map((lib, index) => (
          <div key={index} className="mb-2 p-2 border-b border-gray-700">
            <div className="font-medium">{lib.name} <span className="text-xs text-gray-400">v{lib.version}</span></div>
            <div className="text-sm text-gray-300">{lib.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Component to display documentation for languages
const LanguageDocumentation: React.FC<{ language: string }> = ({ language }) => {
  const docs = {
    python: {
      title: 'Python',
      links: [
        { name: 'Официальная документация', url: 'https://docs.python.org/3/' },
        { name: 'NumPy', url: 'https://numpy.org/doc/' },
        { name: 'Pandas', url: 'https://pandas.pydata.org/docs/' },
        { name: 'Matplotlib', url: 'https://matplotlib.org/stable/contents.html' },
        { name: 'TensorFlow', url: 'https://www.tensorflow.org/api_docs' }
      ]
    },
    cpp: {
      title: 'C++',
      links: [
        { name: 'C++ Reference', url: 'https://en.cppreference.com/' },
        { name: 'Boost', url: 'https://www.boost.org/doc/libs/' },
        { name: 'OpenCV', url: 'https://docs.opencv.org/4.x/' },
        { name: 'Qt', url: 'https://doc.qt.io/' },
        { name: 'Modern C++ Tutorial', url: 'https://github.com/changkun/modern-cpp-tutorial' }
      ]
    },
    lua: {
      title: 'Lua',
      links: [
        { name: 'Lua Reference Manual', url: 'https://www.lua.org/manual/5.4/' },
        { name: 'Programming in Lua', url: 'https://www.lua.org/pil/' },
        { name: 'LuaRocks', url: 'https://luarocks.org/doc' },
        { name: 'LÖVE Game Framework', url: 'https://love2d.org/wiki/Main_Page' }
      ]
    }
  };

  const languageDocs = docs[language as keyof typeof docs];
  if (!languageDocs) return null;

  const displayName = language === 'cpp' ? 'C++' : language.charAt(0).toUpperCase() + language.slice(1);

  return (
    <div className="border border-gray-700 rounded-md p-4">
      <h3 className="font-bold mb-2">{displayName} документация</h3>
      <ul className="list-disc pl-6 space-y-1">
        {languageDocs.links.map((link, index) => (
          <li key={index}>
            <a 
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-rukod-purple hover:underline"
            >
              {link.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CodeTerminal;
