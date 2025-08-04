import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Bot, 
  User, 
  Send, 
  Loader2, 
  Code, 
  Copy, 
  Download,
  Trash2,
  Sparkles,
  MessageSquare,
  Settings
} from 'lucide-react';
import { GeminiService, CodeGenerationRequest, GeneratedCode } from '@/services/geminiService';
import { CodeFile } from '../editor/CodeEditor';

export interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  generatedCode?: GeneratedCode[];
}

interface AiChatProps {
  onCodeGenerated?: (codes: GeneratedCode[]) => void;
  onFileCreate?: (file: CodeFile) => void;
  className?: string;
  currentProject?: string;
}

const languages = [
  'JavaScript',
  'TypeScript', 
  'Python',
  'Java',
  'C++',
  'Go',
  'Rust',
  'PHP',
  'Ruby',
  'Swift',
  'Kotlin',
  'Dart',
  'HTML/CSS',
  'SQL',
  'Shell'
];

const projectTypes = [
  'Веб-приложение',
  'Мобильное приложение',
  'API/Backend',
  'Desktop приложение',
  'Скрипт/Утилита',
  'Игра',
  'Библиотека',
  'Другое'
];

export const AiChat: React.FC<AiChatProps> = ({
  onCodeGenerated,
  onFileCreate,
  className = '',
  currentProject
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('JavaScript');
  const [selectedProjectType, setSelectedProjectType] = useState('Веб-приложение');
  const [showSettings, setShowSettings] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const geminiService = new GeminiService();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Add welcome message if no messages
    if (messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        type: 'ai',
        content: `Привет! Я ваш ИИ-помощник для создания кода. 

Я могу:
• Создать код на любом языке программирования
• Помочь с архитектурой проекта
• Исправить ошибки в коде
• Объяснить, как работает код
• Предложить улучшения

Просто опишите, что вы хотите создать, и я сгенерирую готовый код!`,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    if (!geminiService.isConfigured()) {
      alert('Пожалуйста, настройте API ключ Gemini в настройках');
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Check if this is a code generation request
      const isCodeRequest = /создай|напиши|сделай|код|приложение|функция|компонент|класс/i.test(inputValue);

      if (isCodeRequest) {
        // Generate code
        const request: CodeGenerationRequest = {
          prompt: inputValue.trim(),
          language: selectedLanguage,
          projectType: selectedProjectType,
          context: currentProject ? `Проект: ${currentProject}` : undefined
        };

        const generatedCodes = await geminiService.generateCode(request);
        
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: `Я создал код по вашему запросу. Вот что получилось:`,
          timestamp: new Date(),
          generatedCode: generatedCodes
        };

        setMessages(prev => [...prev, aiMessage]);
        onCodeGenerated?.(generatedCodes);
      } else {
        // Regular chat
        const response = await geminiService.chatWithAI(inputValue);
        
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: response,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error('Ошибка отправки сообщения:', error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `Извините, произошла ошибка: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  const downloadCode = (generatedCode: GeneratedCode) => {
    const blob = new Blob([generatedCode.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = generatedCode.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const addToProject = (generatedCode: GeneratedCode) => {
    if (onFileCreate) {
      const codeFile: CodeFile = {
        id: Date.now().toString(),
        filename: generatedCode.filename,
        content: generatedCode.code,
        language: generatedCode.language
      };
      onFileCreate(codeFile);
    }
  };

  const clearChat = () => {
    if (confirm('Очистить историю чата?')) {
      setMessages([]);
    }
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <Card className={`${className} flex flex-col h-full`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bot className="w-5 h-5" />
            ИИ Помощник
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center gap-1"
            >
              <Settings className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={clearChat}
              className="flex items-center gap-1 text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="mt-2 p-3 bg-muted rounded-lg space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Язык программирования</label>
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map(lang => (
                      <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Тип проекта</label>
                <Select value={selectedProjectType} onValueChange={setSelectedProjectType}>
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {projectTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground">
              Настройки помогают ИИ лучше понимать ваши запросы и генерировать более точный код
            </div>
          </div>
        )}
      </CardHeader>

      <Separator />

      {/* Messages */}
      <CardContent className="flex-1 p-0 flex flex-col">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    {message.type === 'ai' ? (
                      <Bot className="w-4 h-4 text-blue-500" />
                    ) : (
                      <User className="w-4 h-4 text-green-500" />
                    )}
                    <span className="text-xs text-muted-foreground">
                      {formatTimestamp(message.timestamp)}
                    </span>
                  </div>
                  
                  <div
                    className={`p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                  </div>

                  {/* Generated Code Display */}
                  {message.generatedCode && (
                    <div className="mt-3 space-y-3">
                      {message.generatedCode.map((code, index) => (
                        <div key={index} className="border rounded-lg overflow-hidden">
                          <div className="bg-muted px-3 py-2 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Code className="w-4 h-4" />
                              <span className="font-medium text-sm">{code.filename}</span>
                              <Badge variant="outline" className="text-xs">
                                {code.language}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyCode(code.code)}
                                className="h-7 w-7 p-0"
                                title="Копировать код"
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => downloadCode(code)}
                                className="h-7 w-7 p-0"
                                title="Скачать файл"
                              >
                                <Download className="w-3 h-3" />
                              </Button>
                              
                              {onFileCreate && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => addToProject(code)}
                                  className="h-7 px-2 text-xs"
                                  title="Добавить в проект"
                                >
                                  Добавить
                                </Button>
                              )}
                            </div>
                          </div>
                          
                          <div className="p-3 bg-background">
                            <pre className="text-xs overflow-x-auto">
                              <code>{code.code}</code>
                            </pre>
                          </div>
                          
                          {code.explanation && (
                            <div className="px-3 py-2 bg-blue-50 dark:bg-blue-950 border-t">
                              <p className="text-xs text-blue-800 dark:text-blue-200">
                                <strong>Объяснение:</strong> {code.explanation}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">ИИ генерирует ответ...</span>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Опишите, какой код вы хотите создать..."
              className="flex-1 min-h-[80px] max-h-[200px] resize-none"
              disabled={isLoading}
            />
            
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="px-3"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          
          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <MessageSquare className="w-3 h-3" />
            <span>Enter - отправить, Shift+Enter - новая строка</span>
            <Sparkles className="w-3 h-3 ml-auto" />
            <span>Powered by Gemini 2.5 Flash</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};