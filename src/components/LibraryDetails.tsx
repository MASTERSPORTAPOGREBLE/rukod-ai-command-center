import React, { useState } from 'react';
import { Library } from '../models/types';
import { useTheme } from '../context/ThemeContext';
import { 
  X, Download, Star, Code, Calendar, Globe, Package, Tag, ArrowRight, FileCode, 
  RefreshCw, Github, Book, FileText, CheckCircle, Play, Terminal, BarChart3, Info, ExternalLink 
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { getRelatedLibraries } from '../data/mockLibraries';
import { toast } from 'sonner';
import { Progress } from './ui/progress';

interface LibraryDetailsProps {
  library: Library;
  onClose: () => void;
  onInstall: (library: Library) => void;
  isInstalled?: boolean;
}

export const LibraryDetails: React.FC<LibraryDetailsProps> = ({ 
  library, 
  onClose, 
  onInstall,
  isInstalled = false
}) => {
  const { currentTheme } = useTheme();
  const relatedLibraries = getRelatedLibraries(library.id, 3);
  const [activeTab, setActiveTab] = useState<'details' | 'examples' | 'docs'>('details');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateProgress, setUpdateProgress] = useState(0);
  const [showExamples, setShowExamples] = useState(false);
  
  const languageColors = {
    python: { bg: '#3776AB', text: 'white' },
    cpp: { bg: '#00599C', text: 'white' },
    lua: { bg: '#00007C', text: 'white' },
    javascript: { bg: '#F7DF1E', text: 'black' },
    rust: { bg: '#DEA584', text: 'black' },
    ruby: { bg: '#CC342D', text: 'white' },
  };
  
  const languageColor = languageColors[library.language as keyof typeof languageColors];
  
  const handleViewDocs = () => {
    toast.info(`Открытие документации для ${library.name}...`);
    setActiveTab('docs');
  };
  
  const handleViewSource = () => {
    toast.info(`Открытие исходного кода для ${library.name}...`);
    window.open(`https://github.com/search?q=${library.name}`, '_blank');
  };
  
  const handleCreateExample = () => {
    toast.info(`Создание примера проекта с использованием ${library.name}...`);
    setShowExamples(true);
    setActiveTab('examples');
  };
  
  const handleUpdateLibrary = () => {
    setIsUpdating(true);
    setUpdateProgress(0);
    
    const interval = setInterval(() => {
      setUpdateProgress(prev => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsUpdating(false);
          toast.success(`Библиотека ${library.name} успешно обновлена!`);
          return 100;
        }
        return newProgress;
      });
    }, 300);
  };
  
  const handleRunExample = () => {
    toast.info(`Запуск примера ${library.name}...`);
    
    setTimeout(() => {
      toast.success(`Пример успешно запущен!`);
    }, 1500);
  };
  
  const currentDate = new Date();
  const releaseDate = new Date(currentDate);
  releaseDate.setMonth(releaseDate.getMonth() - Math.floor(Math.random() * 6));
  
  const formatLibrarySize = () => {
    // Random size between 1KB and 50MB
    const sizeKB = Math.floor(Math.random() * 50000) + 1;
    if (sizeKB < 1000) return `${sizeKB} KB`;
    return `${(sizeKB / 1000).toFixed(1)} MB`;
  };

  // Example code snippets based on language
  const getExampleCode = () => {
    switch (library.language) {
      case 'python':
        return `# Пример использования библиотеки ${library.name}
import ${library.name.toLowerCase()}

# Инициализация
client = ${library.name.toLowerCase()}.Client()

# Приме�� функции
result = client.process_data([1, 2, 3, 4, 5])
print(f"Результат: {result}")`;
      
      case 'cpp':
        return `// Пример использования библиотеки ${library.name}
#include <${library.name.toLowerCase()}.h>
#include <iostream>

int main() {
    // Инициализация
    ${library.name}::Client client;
    
    // Пример функции
    auto result = client.processData({1, 2, 3, 4, 5});
    std::cout << "Результат: " << result << std::endl;
    
    return 0;
}`;
      
      case 'lua':
        return `-- Пример использования библиотеки ${library.name}
local ${library.name.toLowerCase()} = require "${library.name.toLowerCase()}"

-- Инициализация
local client = ${library.name.toLowerCase()}.new()

-- Пример функции
local result = client:process_data({1, 2, 3, 4, 5})
print("Результат: " .. result)`;
        
      default:
        return `// Пример использования ${library.name}\n// Код зависит от языка и API библиотеки`;
    }
  };
  
  const getInstallCommand = () => {
    switch (library.language) {
      case 'python':
        return `pip install ${library.name.toLowerCase()}`;
      case 'cpp':
        return `conan install ${library.name.toLowerCase()}/${library.version}@`;
      case 'lua':
        return `luarocks install ${library.name.toLowerCase()}`;
      case 'javascript':
        return `npm install ${library.name.toLowerCase()}`;
      case 'rust':
        return `cargo add ${library.name.toLowerCase()}`;
      case 'ruby':
        return `gem install ${library.name.toLowerCase()}`;
      default:
        return `# Installation command depends on the package manager`;
    }
  };
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-slate-900 border border-slate-700 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6"
        onClick={e => e.stopPropagation()}
        style={{ color: currentTheme.textColor }}
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold mb-1" style={{ color: currentTheme.primaryColor }}>
                {library.name}
              </h2>
              {isInstalled && <CheckCircle className="h-5 w-5 text-green-500" />}
            </div>
            <div className="flex items-center">
              <span 
                className="text-xs px-2 py-1 rounded mr-2" 
                style={{ backgroundColor: languageColor.bg, color: languageColor.text }}
              >
                {library.language}
              </span>
              
              <span className="text-yellow-400 flex items-center">
                <Star className="h-3.5 w-3.5 fill-yellow-400 mr-1" />
                {library.popularity.toFixed(1)}
              </span>
              
              {library.isPaid && (
                <Badge variant="outline" className="ml-2 border-amber-500 text-amber-400">
                  Платная
                </Badge>
              )}
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'details' | 'examples' | 'docs')}>
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="details">Детали</TabsTrigger>
            <TabsTrigger value="examples">Примеры</TabsTrigger>
            <TabsTrigger value="docs">Документация</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details">
            <div className="mb-6">
              <p className="text-slate-300 mb-4">{library.description}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Code className="h-4 w-4 mr-2 text-slate-400" />
                  <span className="text-sm">Версия: {library.version}</span>
                </div>
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-2 text-slate-400" />
                  <span className="text-sm">Источник: {library.source}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                  <span className="text-sm">Дата выпуска: {releaseDate.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <Package className="h-4 w-4 mr-2 text-slate-400" />
                  <span className="text-sm">Размер: {formatLibrarySize()}</span>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-slate-800 rounded-md">
                <h4 className="text-sm font-medium mb-1 flex items-center">
                  <Terminal className="h-4 w-4 mr-2" />
                  Команда установки
                </h4>
                <code className="text-xs block bg-slate-950 p-2 rounded font-mono">
                  {getInstallCommand()}
                </code>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-md font-semibold mb-2">Теги</h3>
              <div className="flex flex-wrap gap-2">
                {library.tags?.map(tag => (
                  <Badge key={tag} variant="secondary" className="bg-slate-800">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-md font-semibold mb-2">Статистика использования</h3>
              <div className="space-y-2">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Популярность</span>
                    <span>{Math.round(library.popularity * 20)}%</span>
                  </div>
                  <Progress value={library.popularity * 20} className="h-2" />
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Стабильность</span>
                    <span>{Math.round(Math.random() * 60) + 40}%</span>
                  </div>
                  <Progress value={Math.round(Math.random() * 60) + 40} className="h-2" />
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Активность сообщества</span>
                    <span>{Math.round(Math.random() * 100)}%</span>
                  </div>
                  <Progress value={Math.round(Math.random() * 100)} className="h-2" />
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-md font-semibold mb-2">Действия</h3>
              <div className="grid grid-cols-2 gap-3">
                {isInstalled ? (
                  <Button 
                    className="flex items-center justify-center gap-2"
                    onClick={handleUpdateLibrary}
                    disabled={isUpdating}
                    style={{ backgroundColor: isUpdating ? '#333' : currentTheme.primaryColor }}
                  >
                    {isUpdating ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Обновление...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4" />
                        Обновить библиотеку
                      </>
                    )}
                  </Button>
                ) : (
                  <Button 
                    className="flex items-center justify-center gap-2"
                    onClick={() => onInstall(library)}
                    style={{ backgroundColor: currentTheme.primaryColor }}
                  >
                    <Download className="h-4 w-4" />
                    Установить {library.name}
                  </Button>
                )}
                
                <Button 
                  variant="outline" 
                  className="flex items-center justify-center gap-2"
                  onClick={handleViewDocs}
                >
                  <FileCode className="h-4 w-4" />
                  Документация
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex items-center justify-center gap-2"
                  onClick={handleViewSource}
                >
                  <Github className="h-4 w-4" />
                  Исходный код
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex items-center justify-center gap-2"
                  onClick={handleCreateExample}
                >
                  <Play className="h-4 w-4" />
                  Создать пример
                </Button>
              </div>
            </div>
            
            {isUpdating && (
              <div className="mb-6 space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Прогресс обновления</span>
                  <span>{updateProgress}%</span>
                </div>
                <Progress value={updateProgress} className="h-2" />
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="examples">
            <div className="mb-4">
              <h3 className="text-md font-semibold mb-2">Примеры использования</h3>
              {showExamples ? (
                <div className="space-y-4">
                  <div className="p-3 bg-slate-800 rounded-md">
                    <h4 className="text-sm font-medium mb-2">Базовый пример</h4>
                    <pre className="text-xs bg-slate-950 p-3 rounded font-mono overflow-x-auto">
                      {getExampleCode()}
                    </pre>
                    
                    <div className="mt-3 flex justify-end">
                      <Button 
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={handleRunExample}
                      >
                        <Play className="h-3 w-3" />
                        Запустить
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Больше примеров доступно в онлайн-документации</span>
                    <Button variant="link" className="text-sm" onClick={handleViewDocs}>
                      <span>Открыть документацию</span>
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 bg-slate-800 rounded-md">
                  <FileText className="h-12 w-12 text-slate-500 mb-4" />
                  <p className="text-center text-slate-400 mb-4">Создайте пример для просмотра кода и функциональности</p>
                  <Button onClick={handleCreateExample}>Создать пример</Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="docs">
            <div className="mb-4">
              <h3 className="text-md font-semibold mb-2">Документация</h3>
              <div className="p-4 bg-slate-800 rounded-md">
                <h4 className="text-sm font-semibold mb-3">Обзор {library.name}</h4>
                <p className="text-sm text-slate-300 mb-3">{library.description}</p>
                
                <h5 className="text-sm font-medium mb-2">Основные особенности:</h5>
                <ul className="list-disc pl-5 text-sm text-slate-300 mb-4 space-y-1">
                  {library.tags?.map(tag => (
                    <li key={tag}>{tag.charAt(0).toUpperCase() + tag.slice(1).replace("-", " ")}</li>
                  ))}
                  <li>Поддержка {library.language.charAt(0).toUpperCase() + library.language.slice(1)} версии {library.version}</li>
                  <li>Открытый исходный код</li>
                </ul>
                
                <h5 className="text-sm font-medium mb-2">Установка:</h5>
                <pre className="text-xs bg-slate-950 p-2 rounded font-mono mb-4">
                  {getInstallCommand()}
                </pre>
                
                <div className="flex justify-between items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => window.open(`https://google.com/search?q=${library.name}+documentation`, '_blank')}
                  >
                    Полная документация
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => window.open(`https://github.com/search?q=${library.name}`, '_blank')}
                  >
                    Репозиторий
                    <Github className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        {relatedLibraries.length > 0 && (
          <>
            <Separator className="my-4" />
            
            <div>
              <h3 className="text-md font-semibold mb-3">Похожие библиотеки</h3>
              <div className="space-y-2">
                {relatedLibraries.map(relatedLib => (
                  <div 
                    key={relatedLib.id} 
                    className="bg-slate-800 p-3 rounded flex justify-between items-center cursor-pointer hover:bg-slate-700 transition-colors"
                  >
                    <div>
                      <div className="font-medium">{relatedLib.name}</div>
                      <div className="text-xs text-slate-400 truncate max-w-xs">{relatedLib.description}</div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => onInstall(relatedLib)}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
