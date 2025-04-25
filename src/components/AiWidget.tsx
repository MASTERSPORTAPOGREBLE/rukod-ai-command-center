
import React, { useState, useRef, useEffect } from 'react';
import { Bot, Maximize2, Minimize2, X, Send, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCommandContext } from '@/context/CommandContext';

type Message = {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  actions?: {
    label: string;
    command?: string;
    action?: () => void;
  }[];
};

export const AiWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Я могу помочь вам с командами и анализом кода. Задайте мне вопрос или попросите о помощи.',
      sender: 'ai',
      timestamp: new Date(),
      actions: [
        { label: 'Как использовать РУКОД?', command: 'Как использовать РУКОД?' },
        { label: 'Доступные модули', command: 'modules' }
      ]
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addCommand, installedModules } = useCommandContext();
  
  const toggleWidget = () => {
    setIsOpen(!isOpen);
  };
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const executeAction = (command?: string, action?: () => void) => {
    if (command) {
      // Add as a user message first
      const userActionMessage: Message = {
        id: Date.now().toString() + 'action',
        content: command,
        sender: 'user',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userActionMessage]);
      
      // Then process the command
      if (command.startsWith('запустить:') || command.startsWith('скачать:')) {
        addCommand(command);
      } else {
        handleUserMessage(command);
      }
    }
    
    if (action) {
      action();
    }
  };

  const getModuleInfo = (moduleName: string) => {
    const moduleNames = ['Анимация', 'Разработка', 'Графика', 'Философия', 'Core'];
    const matchedModule = moduleNames.find(name => 
      name.toLowerCase() === moduleName.toLowerCase() ||
      moduleName.toLowerCase().includes(name.toLowerCase())
    );
    
    if (matchedModule === 'Анимация') {
      return {
        name: 'Анимация',
        description: 'Модуль для создания и работы с анимациями',
        submodules: ['2D анимация', '3D анимация', 'Спецэффекты'],
        installed: installedModules.some(m => m.name === 'Анимация')
      };
    } else if (matchedModule === 'Разработка') {
      return {
        name: 'Разработка',
        description: 'Инструменты для разработки и отладки',
        submodules: ['Отладчик', 'Тестирование', 'Профайлер'],
        installed: installedModules.some(m => m.name === 'Разработка')
      };
    } else if (matchedModule === 'Графика') {
      return {
        name: 'Графика',
        description: 'Инструменты для работы с графикой и визуализации',
        submodules: ['2D графика', '3D моделирование', 'Рендеринг'],
        installed: installedModules.some(m => m.id === 'graphics')
      };
    } else if (matchedModule === 'Философия') {
      return {
        name: 'Философия',
        description: 'Модуль для философских размышлений и анализа',
        submodules: ['Логика', 'Метафизика', 'Этика'],
        installed: installedModules.some(m => m.id === 'philosophy')
      };
    }
    
    return null;
  };
  
  const handleUserMessage = (userMessage: string) => {
    if (!userMessage.trim()) return;
    
    let response = '';
    let actions: Message['actions'] = [];
    
    // Process user message to generate intelligent response
    const lowercaseMsg = userMessage.toLowerCase();
    
    // Handle module related questions
    if (lowercaseMsg.includes('как скачать') || lowercaseMsg.includes('как установить')) {
      const moduleKeywords = ['модуль', 'мод', 'анимац', 'график', 'разработк', 'философ'];
      const mentionedModule = moduleKeywords.find(keyword => lowercaseMsg.includes(keyword));
      
      if (mentionedModule) {
        let moduleName = '';
        if (mentionedModule === 'анимац') moduleName = 'Анимация';
        else if (mentionedModule === 'график') moduleName = 'Графика';
        else if (mentionedModule === 'разработк') moduleName = 'Разработка';
        else if (mentionedModule === 'философ') moduleName = 'Философия';
        
        const moduleInfo = moduleName ? getModuleInfo(moduleName) : null;
        
        if (moduleInfo) {
          if (moduleInfo.installed) {
            response = `Модуль "${moduleInfo.name}" уже установлен. Вы можете использовать его функции прямо сейчас.`;
          } else {
            response = `Чтобы скачать модуль "${moduleInfo.name}", используйте команду 'скачать: ${moduleInfo.name}' в командной строке, или нажмите на кнопку ниже.`;
            actions = [
              { label: `Скачать модуль ${moduleInfo.name}`, command: `скачать: ${moduleInfo.name}` },
              { label: 'Посмотреть все модули', command: 'modules' }
            ];
          }
        } else {
          response = 'Для скачивания модуля используйте команду "скачать: [название модуля]". Например, "скачать: Анимация".';
          actions = [
            { label: 'Показать доступные модули', command: 'modules' }
          ];
        }
      } else {
        response = 'Чтобы скачать модуль, используйте команду "скачать: [название модуля]". Например, "скачать: Анимация".';
        actions = [
          { label: 'Показать доступные модули', command: 'modules' }
        ];
      }
    } 
    // Handle "how to use" questions
    else if (lowercaseMsg.includes('как использовать') || lowercaseMsg.includes('как работать')) {
      if (lowercaseMsg.includes('рукод')) {
        response = 'Для работы с РУКОД просто введите команду в строку ввода и нажмите Enter или кнопку запуска. Используйте Tab для автодополнения команд. Попробуйте начать с команды "help"!';
        actions = [
          { label: 'Список команд', command: 'help' },
          { label: 'Показать модули', command: 'modules' }
        ];
      } else {
        const moduleKeywords = ['анимац', 'график', 'разработк', 'библиотек'];
        const mentionedModule = moduleKeywords.find(keyword => lowercaseMsg.includes(keyword));
        
        if (mentionedModule) {
          let moduleName = '';
          if (mentionedModule === 'анимац') moduleName = 'Анимация';
          else if (mentionedModule === 'график') moduleName = 'Графика';
          else if (mentionedModule === 'разработк') moduleName = 'Разработка';
          else if (mentionedModule === 'библиотек') moduleName = 'библиотеки';
          
          const moduleInfo = moduleName !== 'библиотеки' ? getModuleInfo(moduleName) : null;
          
          if (moduleInfo) {
            if (moduleInfo.installed) {
              response = `Для использования модуля "${moduleInfo.name}", выполните команду с именем нужного подмодуля. Доступные подмодули: ${moduleInfo.submodules.join(', ')}.`;
              actions = moduleInfo.submodules.map(submodule => ({
                label: submodule,
                command: submodule.toLowerCase().replace(' ', '')
              }));
            } else {
              response = `Модуль "${moduleInfo.name}" не установлен. Сначала установите его командой "скачать: ${moduleInfo.name}".`;
              actions = [
                { label: `Скачать модуль ${moduleInfo.name}`, command: `скачать: ${moduleInfo.name}` }
              ];
            }
          } else if (moduleName === 'библиотеки') {
            response = 'Для использования библиотек сначала установите необходимый модуль, затем используйте его функции. Чтобы увидеть доступные модули, введите команду "modules".';
            actions = [
              { label: 'Показать модули', command: 'modules' }
            ];
          }
        } else {
          response = 'Уточните, пожалуйста, что именно вы хотите использовать? Я могу помочь с модулями, командами или библиотеками РУКОД.';
          actions = [
            { label: 'Модули', command: 'modules' },
            { label: 'Команды', command: 'help' }
          ];
        }
      }
    }
    // Handle "how to create" questions
    else if (lowercaseMsg.includes('как создать') || lowercaseMsg.includes('как сделать')) {
      if (lowercaseMsg.includes('проект') || lowercaseMsg.includes('новый проект')) {
        response = 'Для создания нового проекта выполните следующие шаги:\n1. Перейдите в раздел "Проекты"\n2. Выберите "Новый проект"\n3. Заполните необходимые данные\n4. Нажмите "Создать"';
        actions = [
          { label: 'Создать проект', command: 'создать: проект' }
        ];
      } else if (lowercaseMsg.includes('анимац')) {
        const moduleInfo = getModuleInfo('Анимация');
        if (moduleInfo?.installed) {
          response = 'Для создания анимации используйте функции модуля "Анимация". Выберите подходящий подмодуль: 2D анимация, 3D анимация или Спецэффекты.';
          actions = [
            { label: '2D анимация', command: 'анимация: 2d' },
            { label: '3D анимация', command: 'анимация: 3d' }
          ];
        } else {
          response = 'Для создания анимации сначала установите модуль "Анимация" командой "скачать: Анимация".';
          actions = [
            { label: 'Скачать модуль Анимация', command: 'скачать: Анимация' }
          ];
        }
      } else if (lowercaseMsg.includes('график')) {
        response = 'Для создания графики вам потребуется установить модуль "Графика". После установки вы сможете использовать его функции для работы с 2D и 3D графикой.';
        actions = [
          { label: 'Скачать модуль Графика', command: 'скачать: Графика' }
        ];
      } else {
        response = 'Уточните, пожалуйста, что именно вы хотите создать? Я могу помочь с созданием проектов, анимаций, графики и многого другого.';
      }
    }
    // Handle auth questions
    else if (lowercaseMsg.includes('авториз') || lowercaseMsg.includes('вход') || lowercaseMsg.includes('логин')) {
      response = 'Для авторизации используйте команду "авторизация: [метод]". Доступные методы: Google, Github, Telegram.';
      actions = [
        { label: 'Google', command: 'авторизация: Google' },
        { label: 'Github', command: 'авторизация: Github' },
        { label: 'Telegram', command: 'авторизация: Telegram' }
      ];
    }
    // Handle error/support questions
    else if (lowercaseMsg.includes('ошибк') || lowercaseMsg.includes('помощ') || lowercaseMsg.includes('поддержк')) {
      response = 'Если у вас возникла ошибка, пожалуйста, опишите её подробнее. Вы можете получить помощь, выбрав один из вариантов ниже:';
      actions = [
        { label: 'FAQ', command: 'help: faq' },
        { label: 'Связаться с поддержкой', command: 'поддержка' },
        { label: 'Отладка системы', command: 'отладка' }
      ];
    }
    // Handle module listing
    else if (lowercaseMsg.includes('модул') || lowercaseMsg.includes('список модул')) {
      addCommand('modules');
      response = 'Выполняю команду для показа списка доступных модулей...';
    }
    // Handle help command
    else if (lowercaseMsg === 'help' || lowercaseMsg === 'помощь' || lowercaseMsg.includes('команд')) {
      addCommand('help');
      response = 'Выполняю команду для показа списка доступных команд...';
    }
    // Default responses
    else {
      const keywords = ['анимац', 'график', 'модул', 'проект', 'библиотек', 'инструмент', 'функц'];
      const mentionedKeyword = keywords.find(keyword => lowercaseMsg.includes(keyword));
      
      if (mentionedKeyword) {
        response = 'Я могу помочь вам с использованием РУКОД. Уточните, пожалуйста, что именно вас интересует?';
        actions = [
          { label: 'Модули', command: 'modules' },
          { label: 'Команды', command: 'help' },
          { label: 'Создать проект', command: 'создать: проект' }
        ];
      } else {
        response = 'Я могу помочь вам с командами РУКОД, объяснить работу системы или запустить команды для вас. Что именно вас интересует?';
        actions = [
          { label: 'Список команд', command: 'help' },
          { label: 'Доступные модули', command: 'modules' },
          { label: 'Запустить команду', command: 'запустить:' }
        ];
      }
    }
    
    // Add AI response
    const newAiMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: response,
      sender: 'ai',
      timestamp: new Date(),
      actions: actions
    };
    
    setMessages(prev => [...prev, newAiMessage]);
    scrollToBottom();
  };
  
  const handleSend = () => {
    if (!message.trim()) return;
    
    // Add user message
    const newUserMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    
    // Process AI response
    setTimeout(() => {
      handleUserMessage(message);
    }, 500);
    
    setMessage('');
    scrollToBottom();
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating button to open widget */}
      {!isOpen && (
        <Button 
          variant="outline"
          className="fixed bottom-20 right-6 h-12 w-12 rounded-full bg-rukod-purple text-white shadow-lg hover:bg-rukod-purple-dark animate-pulse"
          onClick={toggleWidget}
        >
          <Bot className="h-6 w-6" />
        </Button>
      )}
      
      {/* AI Widget */}
      {isOpen && (
        <div 
          className={`fixed z-40 bg-card border border-border shadow-xl rounded-lg transition-all duration-300 ${
            isExpanded 
              ? 'inset-4 flex flex-col' 
              : 'bottom-20 right-6 w-80 h-96'
          }`}
        >
          <CardHeader className="border-b flex flex-row items-center justify-between p-4 bg-rukod-dark">
            <CardTitle className="text-lg flex items-center text-rukod-purple">
              <Bot className="h-5 w-5 mr-2 text-rukod-purple" />
              ИИ Ассистент РУКОД
            </CardTitle>
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white" onClick={toggleExpand}>
                {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white" onClick={toggleWidget}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-4 flex-1 overflow-y-auto bg-rukod-dark bg-opacity-70">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`${
                    msg.sender === 'ai' 
                      ? 'bg-muted border-l-2 border-rukod-purple' 
                      : 'bg-rukod-purple bg-opacity-20 ml-auto'
                  } p-3 rounded-lg max-w-[80%] animate-fade-in`}
                >
                  <p className="text-sm whitespace-pre-wrap">
                    {msg.content}
                  </p>
                  
                  {msg.actions && msg.actions.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {msg.actions.map((action, index) => (
                        <Button 
                          key={index} 
                          variant="outline" 
                          size="sm"
                          className="text-xs mt-1 bg-rukod-dark hover:bg-rukod-purple hover:text-white"
                          onClick={() => executeAction(action.command, action.action)}
                        >
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
          
          <div className="border-t p-4 bg-rukod-dark">
            <div className="relative">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Задайте вопрос..."
                className="w-full rounded-md border border-rukod-purple bg-rukod-dark px-4 py-2 pr-10 text-sm text-white placeholder:text-gray-400"
              />
              <Button 
                className="absolute right-1 top-1 h-7 w-7 p-1 bg-rukod-purple hover:bg-rukod-purple-dark" 
                size="sm"
                onClick={handleSend}
                disabled={!message.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
