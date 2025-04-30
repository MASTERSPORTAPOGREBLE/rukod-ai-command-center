
import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { BookOpen, Terminal, Settings, FileCode, Database, Play, Code, Download } from 'lucide-react';

const Help = () => {
  const { currentTheme } = useTheme();
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6 text-center">
        <BookOpen className="inline-block mr-2 mb-1" /> 
        Руководство пользователя
      </h1>
      
      <Tabs defaultValue="getting-started" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4">
          <TabsTrigger value="getting-started">Начало работы</TabsTrigger>
          <TabsTrigger value="features">Функционал</TabsTrigger>
          <TabsTrigger value="installation">Установка</TabsTrigger>
          <TabsTrigger value="faq">Частые вопросы</TabsTrigger>
        </TabsList>
        
        <TabsContent value="getting-started">
          <Card>
            <CardHeader>
              <CardTitle>Начало работы с РУКОД IDE</CardTitle>
              <CardDescription>
                Основные сведения для быстрого старта работы с системой
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2 flex items-center">
                  <Play className="mr-2 h-4 w-4" /> Запуск приложения
                </h3>
                <div className="ml-6 space-y-2">
                  <p>Для запуска РУКОД IDE выполните следующие шаги:</p>
                  <ol className="list-decimal ml-6 space-y-2">
                    <li>Установите Node.js версии 14 или выше</li>
                    <li>Клонируйте репозиторий: <code className="bg-slate-800 px-2 py-0.5 rounded">git clone https://github.com/yourusername/rukod-ide.git</code></li>
                    <li>Перейдите в директорию проекта: <code className="bg-slate-800 px-2 py-0.5 rounded">cd rukod-ide</code></li>
                    <li>Установите зависимости: <code className="bg-slate-800 px-2 py-0.5 rounded">npm install</code></li>
                    <li>Запустите приложение: <code className="bg-slate-800 px-2 py-0.5 rounded">npm run dev</code></li>
                    <li>Откройте в браузере <code className="bg-slate-800 px-2 py-0.5 rounded">http://localhost:8080</code></li>
                  </ol>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2 flex items-center">
                  <Terminal className="mr-2 h-4 w-4" /> Работа с терминалом
                </h3>
                <div className="ml-6 space-y-2">
                  <p>Терминал предоставляет интерфейс для выполнения команд:</p>
                  <ul className="list-disc ml-6 space-y-1">
                    <li><code className="bg-slate-800 px-2 py-0.5 rounded">help</code> - показать список доступных команд</li>
                    <li><code className="bg-slate-800 px-2 py-0.5 rounded">clear</code> - очистить историю логов</li>
                    <li><code className="bg-slate-800 px-2 py-0.5 rounded">container start &lt;язык&gt;</code> - запустить контейнер</li>
                    <li><code className="bg-slate-800 px-2 py-0.5 rounded">container stop &lt;id&gt;</code> - остановить контейнер</li>
                    <li><code className="bg-slate-800 px-2 py-0.5 rounded">container list</code> - список контейнеров</li>
                  </ul>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2 flex items-center">
                  <FileCode className="mr-2 h-4 w-4" /> Редактор кода
                </h3>
                <div className="ml-6">
                  <p>Редактор кода поддерживает различные языки программирования и предоставляет:</p>
                  <ul className="list-disc ml-6 space-y-1 mt-2">
                    <li>Подсветку синтаксиса</li>
                    <li>Автодополнение кода</li>
                    <li>Выполнение кода в контейнере</li>
                    <li>Сохранение и загрузку файлов</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="features">
          <Card>
            <CardHeader>
              <CardTitle>Функциональные возможности</CardTitle>
              <CardDescription>
                Обзор основных возможностей и функций системы РУКОД IDE
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-slate-700 rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-3 flex items-center" style={{ color: currentTheme.primaryColor }}>
                    <Terminal className="mr-2" /> Терминал
                  </h3>
                  <ul className="space-y-2 ml-6 list-disc">
                    <li>Выполнение произвольных команд</li>
                    <li>История команд с возможностью повторного использования</li>
                    <li>Автодополнение команд</li>
                    <li>Расширенное логирование и отладка</li>
                    <li>Экспорт истории команд и логов</li>
                  </ul>
                </div>
                
                <div className="border border-slate-700 rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-3 flex items-center" style={{ color: currentTheme.primaryColor }}>
                    <FileCode className="mr-2" /> Редактор кода
                  </h3>
                  <ul className="space-y-2 ml-6 list-disc">
                    <li>Многоязыковая поддержка (Python, JavaScript, C++, и др.)</li>
                    <li>Интеллектуальная подсветка синтаксиса</li>
                    <li>Автоформатирование кода</li>
                    <li>Обнаружение ошибок в реальном времени</li>
                    <li>Интеграция с системой контроля версий</li>
                  </ul>
                </div>
                
                <div className="border border-slate-700 rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-3 flex items-center" style={{ color: currentTheme.primaryColor }}>
                    <Database className="mr-2" /> Управление библиотеками
                  </h3>
                  <ul className="space-y-2 ml-6 list-disc">
                    <li>Поиск библиотек по ключевым словам</li>
                    <li>Установка и управление зависимостями</li>
                    <li>Информация о версиях и совместимости</li>
                    <li>Документация библиотек</li>
                    <li>Автоматическое обновление библиотек</li>
                  </ul>
                </div>
                
                <div className="border border-slate-700 rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-3 flex items-center" style={{ color: currentTheme.primaryColor }}>
                    <Settings className="mr-2" /> Настройка интерфейса
                  </h3>
                  <ul className="space-y-2 ml-6 list-disc">
                    <li>Выбор готовых цветовых схем</li>
                    <li>Создание пользовательских тем</li>
                    <li>Настройка шрифтов и размеров интерфейса</li>
                    <li>Персонализация панелей и инструментов</li>
                    <li>Сохранение профилей настроек</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="installation">
          <Card>
            <CardHeader>
              <CardTitle>Установка и запуск</CardTitle>
              <CardDescription>
                Подробные инструкции по установке и запуску приложения РУКОД IDE
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3 flex items-center">
                  <Download className="mr-2 h-5 w-5" /> Установка через NPM
                </h3>
                <div className="ml-6 space-y-4">
                  <p>Следуйте этим шагам для установки РУКОД IDE с использованием NPM:</p>
                  
                  <div className="bg-slate-800 rounded-lg p-4 font-mono text-sm">
                    <p className="text-green-400"># Установка глобально</p>
                    <p className="mt-2">npm install -g rukod-ide</p>
                    
                    <p className="mt-4 text-green-400"># Запуск IDE</p>
                    <p className="mt-2">rukod-ide start</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3 flex items-center">
                  <Code className="mr-2 h-5 w-5" /> Установка из исходных кодов
                </h3>
                <div className="ml-6 space-y-4">
                  <p>Для разработчиков и продвинутых пользователей, установка из исходного кода:</p>
                  
                  <div className="bg-slate-800 rounded-lg p-4 font-mono text-sm">
                    <p className="text-green-400"># Клонирование репозитория</p>
                    <p className="mt-2">git clone https://github.com/yourusername/rukod-ide.git</p>
                    <p className="mt-2">cd rukod-ide</p>
                    
                    <p className="mt-4 text-green-400"># Установка зависимостей</p>
                    <p className="mt-2">npm install</p>
                    
                    <p className="mt-4 text-green-400"># Запуск в режиме разработки</p>
                    <p className="mt-2">npm run dev</p>
                    
                    <p className="mt-4 text-green-400"># Сборка для продакшена</p>
                    <p className="mt-2">npm run build</p>
                    
                    <p className="mt-4 text-green-400"># Запуск продакшн-версии</p>
                    <p className="mt-2">npm run start</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">Системные требования</h3>
                <div className="ml-6">
                  <ul className="list-disc ml-6 space-y-2">
                    <li>Node.js версии 14.x или выше</li>
                    <li>NPM версии 6.x или выше</li>
                    <li>Минимум 1 ГБ оперативной памяти</li>
                    <li>100 МБ свободного дискового пространства</li>
                    <li>Современный браузер (Chrome, Firefox, Edge)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="faq">
          <Card>
            <CardHeader>
              <CardTitle>Часто задаваемые вопросы</CardTitle>
              <CardDescription>
                Ответы на распространенные вопросы по использованию РУКОД IDE
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">Как добавить пользовательскую библиотеку?</h3>
                  <p className="mt-1 text-slate-300">
                    Для добавления пользовательской библиотеки откройте раздел "Библиотеки", 
                    нажмите кнопку "Добавить библиотеку" и укажите путь к файлам библиотеки или ссылку на GitHub репозиторий.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Поддерживает ли РУКОД IDE работу офлайн?</h3>
                  <p className="mt-1 text-slate-300">
                    Да, РУКОД IDE может работать полностью офлайн после первичной установки. Однако некоторые функции, 
                    такие как установка новых библиотек или обновления, требуют подключения к интернету.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Какие языки программирования поддерживаются?</h3>
                  <p className="mt-1 text-slate-300">
                    РУКОД IDE поддерживает широкий спектр языков программирования, включая Python, JavaScript, 
                    TypeScript, C++, Rust, Go, Ruby, PHP, Lua и многие другие. Поддержка новых языков 
                    добавляется регулярно.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Как создать свою тему оформления?</h3>
                  <p className="mt-1 text-slate-300">
                    Для создания собственной темы перейдите в раздел "Настройки" → "Темы" → "Создать тему". 
                    Выберите цвета для различных элементов интерфейса, предварительно просмотрите результат и сохраните тему.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Возможна ли совместная работа над кодом?</h3>
                  <p className="mt-1 text-slate-300">
                    В текущей версии совместная работа напрямую не поддерживается. Однако вы можете использовать 
                    интеграцию с Git для синхронизации кода и работы в команде. В будущих версиях планируется 
                    добавить полноценную поддержку совместной работы в реальном времени.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Help;
