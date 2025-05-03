
import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { Button } from '../ui/button';
import { CodeExecutionResult } from './CodeExecutionResult';
import { toast } from 'sonner';
import { ProgrammingLanguage } from '@/models/types';
import { executeCode } from '@/utils/codeUtils';

interface CodeRunnerProps {
  code: string;
  language: ProgrammingLanguage;
  fileName: string;
}

export const CodeRunner: React.FC<CodeRunnerProps> = ({ code, language, fileName }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [executionResult, setExecutionResult] = useState<string>('');
  const [resultDialogOpen, setResultDialogOpen] = useState(false);
  const [executionTime, setExecutionTime] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [suggestions, setSuggestions] = useState<{text: string; action: () => void; label: string}[]>([]);

  const runCode = async () => {
    if (!code.trim()) {
      toast.error('Код пуст. Нечего выполнять.');
      return;
    }

    setIsRunning(true);
    
    // Запоминаем время начала выполнения
    const startTime = performance.now();
    
    try {
      const result = await executeCode(code, language);
      
      // Подсчитываем время выполнения
      const endTime = performance.now();
      setExecutionTime(Math.round(endTime - startTime));
      
      if (result.success) {
        // Успешное выполнение
        setExecutionResult(result.output);
        setHasError(false);
        setSuggestions([]);
      } else {
        // Ошибка выполнения
        setExecutionResult(result.error || 'Неизвестная ошибка');
        setHasError(true);
        
        // Генерируем предложения по исправлению
        const newSuggestions = [];
        
        if (result.error?.includes('not defined') || result.error?.includes('is not defined')) {
          const missingVar = result.error.match(/(\w+) is not defined/)?.[1];
          if (missingVar) {
            newSuggestions.push({
              text: `Переменная "${missingVar}" не определена.`,
              action: () => {
                toast.info(`Добавьте объявление переменной ${missingVar} перед её использованием.`);
              },
              label: 'Подробнее'
            });
          }
        }
        
        if (result.error?.includes('import') || result.error?.includes('require')) {
          newSuggestions.push({
            text: `Возможно, отсутствует необходимый модуль.`,
            action: () => {
              toast.info('Используйте команду "install [имя-пакета]" в терминале для установки необходимой библиотеки.');
            },
            label: 'Установить'
          });
        }
        
        if (result.error?.includes('Syntax Error') || result.error?.includes('SyntaxError')) {
          newSuggestions.push({
            text: `Синтаксическая ошибка в коде.`,
            action: () => {
              toast.info('Проверьте правильность синтаксиса: скобки, точки с запятой, кавычки и т.д.');
            },
            label: 'Подсказки'
          });
        }
        
        // Если не нашли конкретных ошибок, добавим общую подсказку
        if (newSuggestions.length === 0) {
          newSuggestions.push({
            text: `Для исправления ошибки попробуйте найти помощь в документации.`,
            action: () => {
              const docsUrl = {
                'python': 'https://docs.python.org/3/',
                'javascript': 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
                'cpp': 'https://en.cppreference.com/w/',
                'lua': 'https://www.lua.org/manual/5.4/'
              }[language] || 'https://www.google.com/search?q=' + encodeURIComponent(`${language} documentation`);
              
              window.open(docsUrl, '_blank');
            },
            label: 'Документация'
          });
        }
        
        setSuggestions(newSuggestions);
      }
      
      // Показываем диалог с результатом
      setResultDialogOpen(true);
      
      if (!result.success) {
        toast.error('Ошибка выполнения кода');
      } else {
        toast.success('Код успешно выполнен');
      }
    } catch (error) {
      console.error('Ошибка выполнения кода:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
      setExecutionResult(`Ошибка выполнения:\n${errorMessage}`);
      setHasError(true);
      
      const endTime = performance.now();
      setExecutionTime(Math.round(endTime - startTime));
      
      setResultDialogOpen(true);
      toast.error(`Ошибка выполнения: ${errorMessage}`);
      
      setSuggestions([{
        text: 'Произошла неожиданная ошибка при выполнении кода.',
        action: () => {
          toast.info('Проверьте консоль разработчика для получения дополнительной информации.');
        },
        label: 'Подробнее'
      }]);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <>
      <Button 
        variant="outline"
        size="sm"
        onClick={runCode}
        disabled={isRunning}
        className="flex items-center gap-1"
      >
        <Play className="h-4 w-4 text-green-500" />
        {isRunning ? 'Выполнение...' : 'Запустить'}
      </Button>
      
      <CodeExecutionResult
        open={resultDialogOpen}
        onOpenChange={setResultDialogOpen}
        output={executionResult}
        fileName={fileName}
        executionTime={executionTime}
        language={language}
        hasError={hasError}
        suggestions={suggestions}
      />
    </>
  );
};
