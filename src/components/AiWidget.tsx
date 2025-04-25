
import React, { useState, useRef } from 'react';
import { Bot, Maximize2, Minimize2, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCommandContext } from '@/context/CommandContext';

type Message = {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
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
      timestamp: new Date()
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addCommand } = useCommandContext();
  
  const toggleWidget = () => {
    setIsOpen(!isOpen);
  };
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
      let response = '';
      
      // Simple AI response logic
      const lowercaseMsg = message.toLowerCase();
      
      if (lowercaseMsg.includes('привет') || lowercaseMsg.includes('здравствуй')) {
        response = 'Здравствуйте! Чем могу помочь вам сегодня?';
      } else if (lowercaseMsg.includes('команд')) {
        response = 'Основные команды РУКОД:\n- help - список команд\n- привет - приветствие\n- скачать: [модуль] - загрузка модуля\n- запуск: [команда] - запуск команды\n- анализировать [объект] - анализ с ИИ\n\nПопробуйте ввести их в командной строке!';
      } else if (lowercaseMsg.includes('модул')) {
        response = 'Доступные модули включают:\n- Core (базовый)\n- Анимация (визуальные эффекты)\n- Разработка (инструменты разработки)\n\nВы можете установить модуль командой "скачать: [название модуля]"';
      } else if (lowercaseMsg.includes('как') && (lowercaseMsg.includes('использовать') || lowercaseMsg.includes('работать'))) {
        response = 'Для работы с РУКОД просто введите команду в строку ввода и нажмите Enter или кнопку запуска. Используйте Tab для автодополнения команд. Попробуйте начать с команды "help"!';
      } else if (lowercaseMsg.includes('запустить')) {
        const commandToRun = message.replace(/запустить/i, '').trim();
        if (commandToRun) {
          response = `Я запустил команду "${commandToRun}" для вас в командной строке.`;
          // Actually run the command
          addCommand(commandToRun);
        } else {
          response = 'Укажите, пожалуйста, какую команду запустить.';
        }
      } else {
        response = 'Я могу помочь вам с командами РУКОД, объяснить работу системы или запустить команды для вас. Что именно вас интересует?';
      }
      
      // Add AI response
      const newAiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newAiMessage]);
      scrollToBottom();
    }, 800);
    
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
          className="fixed bottom-20 right-6 h-12 w-12 rounded-full bg-rukod-purple text-white shadow-lg hover:bg-rukod-purple-dark"
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
          <CardHeader className="border-b flex flex-row items-center justify-between p-4">
            <CardTitle className="text-lg flex items-center">
              <Bot className="h-5 w-5 mr-2 text-rukod-purple" />
              ИИ Ассистент
            </CardTitle>
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleExpand}>
                {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleWidget}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-4 flex-1 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`${
                    msg.sender === 'ai' 
                      ? 'bg-muted' 
                      : 'bg-rukod-purple bg-opacity-20 ml-auto'
                  } p-3 rounded-lg max-w-[80%] animate-fade-in`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
          
          <div className="border-t p-4">
            <div className="relative">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Задайте вопрос..."
                className="w-full rounded-md border border-input px-4 py-2 pr-10 text-sm"
              />
              <Button 
                className="absolute right-1 top-1 h-7 w-7 p-1" 
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
