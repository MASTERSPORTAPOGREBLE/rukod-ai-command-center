
import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Zap, Code, X, Settings, Cpu } from 'lucide-react';

interface AIAssistantProps {
  isActive?: boolean;
  onClose?: () => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ 
  isActive = false, 
  onClose 
}) => {
  const { currentTheme } = useTheme();
  const [message, setMessage] = useState<string>('');
  const [isTyping, setIsTyping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Simulate AI typing effect
  useEffect(() => {
    if (isActive && !message) {
      setIsTyping(true);
      const messages = [
        'Готов помочь с вашими задачами. Какую библиотеку установить?',
        'Какой язык программирования будем использовать сегодня?',
        'Могу помочь с установкой библиотек или запуском контейнеров.',
        'Введите "помощь" для получения списка команд.'
      ];
      
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      let index = 0;
      
      const typingInterval = setInterval(() => {
        setMessage(randomMessage.substring(0, index));
        index++;
        
        if (index > randomMessage.length) {
          clearInterval(typingInterval);
          setIsTyping(false);
        }
      }, 30);
      
      return () => clearInterval(typingInterval);
    }
  }, [isActive]);
  
  if (!isActive) return null;
  
  return (
    <div 
      className={`fixed bottom-20 right-6 z-50 transition-all duration-300 ease-in-out ${
        isExpanded ? 'w-80' : 'w-auto'
      }`}
    >
      {isExpanded ? (
        <div 
          className="rounded-lg shadow-lg overflow-hidden"
          style={{ 
            backgroundColor: currentTheme.backgroundColor,
            borderColor: currentTheme.primaryColor,
            borderWidth: '1px'
          }}
        >
          {/* Header */}
          <div 
            className="px-4 py-3 flex justify-between items-center"
            style={{ backgroundColor: currentTheme.primaryColor }}
          >
            <div className="flex items-center">
              <Cpu className="w-5 h-5 mr-2" style={{ color: currentTheme.backgroundColor }} />
              <h3 className="font-medium text-sm" style={{ color: currentTheme.backgroundColor }}>
                CodeVerse Ассистент
              </h3>
            </div>
            <div className="flex">
              <button 
                onClick={() => setIsExpanded(false)}
                className="p-1 rounded-full hover:bg-black/10"
                title="Свернуть"
              >
                <X className="w-4 h-4" style={{ color: currentTheme.backgroundColor }} />
              </button>
            </div>
          </div>
          
          {/* Body */}
          <div className="p-4 max-h-80 overflow-y-auto">
            <div className="flex items-start mb-4">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                style={{ backgroundColor: `${currentTheme.accentColor}30` }}
              >
                <Cpu className="w-4 h-4" style={{ color: currentTheme.accentColor }} />
              </div>
              <div>
                <p className="text-sm" style={{ color: currentTheme.textColor }}>
                  {message || "Загрузка..."}
                  {isTyping && <span className="animate-pulse">▌</span>}
                </p>
              </div>
            </div>
            
            <div className="mt-4">
              <p className="text-xs opacity-70 mb-2">Быстрые команды:</p>
              <div className="flex flex-wrap gap-2">
                <button 
                  className="text-xs py-1 px-2 rounded"
                  style={{ 
                    backgroundColor: `${currentTheme.primaryColor}20`,
                    color: currentTheme.primaryColor
                  }}
                  onClick={() => onClose && onClose()}
                >
                  Установить numpy
                </button>
                <button 
                  className="text-xs py-1 px-2 rounded"
                  style={{ 
                    backgroundColor: `${currentTheme.primaryColor}20`,
                    color: currentTheme.primaryColor
                  }}
                  onClick={() => onClose && onClose()}
                >
                  Запустить Python
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <button
          className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
          style={{ backgroundColor: currentTheme.primaryColor }}
          onClick={() => setIsExpanded(true)}
          title="AI ассистент"
        >
          <Zap className="w-5 h-5" style={{ color: currentTheme.backgroundColor }} />
        </button>
      )}
    </div>
  );
};
