
import React, { useState } from 'react';
import { Bot, Maximize2, Minimize2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const AiWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const toggleWidget = () => {
    setIsOpen(!isOpen);
  };
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
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
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm">Я могу помочь вам с командами и анализом кода. Задайте мне вопрос или попросите о помощи.</p>
              </div>
              
              <div className="flex justify-end">
                <div className="bg-rukod-purple bg-opacity-20 p-3 rounded-lg max-w-[80%]">
                  <p className="text-sm">Как создать новую модификацию?</p>
                </div>
              </div>
              
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm">
                  Для создания новой модификации вам нужно выполнить следующие шаги:
                  <br /><br />
                  1. Использовать команду <code>модификация:создать &lt;имя&gt;</code>
                  <br />
                  2. Открыть редактор модификаций через настройки
                  <br />
                  3. Добавить необходимый функционал и команды
                  <br />
                  4. Сохранить и опубликовать вашу модификацию
                </p>
              </div>
            </div>
          </CardContent>
          
          <div className="border-t p-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Задайте вопрос..."
                className="w-full rounded-md border border-input px-4 py-2 text-sm"
              />
              <Button className="absolute right-1 top-1 h-7" size="sm">
                Отправить
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
