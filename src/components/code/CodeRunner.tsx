
import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { Button } from '../ui/button';
import { CodeExecutionResult } from './CodeExecutionResult';
import { toast } from 'sonner';
import { ProgrammingLanguage } from '@/models/types';

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

  const runCode = async () => {
    if (!code.trim()) {
      toast.error('Код пуст. Нечего выполнять.');
      return;
    }

    setIsRunning(true);
    
    // Запоминаем время начала выполнения
    const startTime = performance.now();
    
    // Симулируем исполнение кода
    let output = '';
    
    try {
      // Задержка для имитации выполнения
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Простая симуляция вывода на основе языка и содержания кода
      if (language === 'python') {
        if (code.includes('print(')) {
          // Извлекаем содержимое print
          const printMatches = code.match(/print\s*\(['"](.+?)['"]\)/g);
          if (printMatches) {
            output = printMatches.map(match => {
              const content = match.match(/print\s*\(['"](.+?)['"]\)/);
              return content ? content[1] : '';
            }).join('\n');
          } else {
            output = "Hello, World!";
          }
        } else {
          output = "Выполнено без вывода";
        }
      } else if (language === 'cpp') {
        if (code.includes('cout')) {
          output = "Hello, C++ World!";
        } else {
          output = "Программа выполнена успешно";
        }
      } else if (language === 'javascript') {
        if (code.includes('console.log')) {
          const logMatches = code.match(/console\.log\s*\(['"](.+?)['"]\)/g);
          if (logMatches) {
            output = logMatches.map(match => {
              const content = match.match(/console\.log\s*\(['"](.+?)['"]\)/);
              return content ? content[1] : '';
            }).join('\n');
          } else {
            output = "Hello, JavaScript World!";
          }
        } else {
          output = "Выполнено без вывода";
        }
      } else {
        output = `Выполнение кода для языка ${language}:\n\nHello, World!`;
      }
      
      // Подсчитываем время выполнения
      const endTime = performance.now();
      setExecutionTime(Math.round(endTime - startTime));
      
      // Устанавливаем результат
      setExecutionResult(output || "Программа выполнена без вывода");
      
      // Показываем диалог с результатом
      setResultDialogOpen(true);
      
      toast.success('Код успешно выполнен');
    } catch (error) {
      console.error('Ошибка выполнения кода:', error);
      toast.error(`Ошибка выполнения: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
      
      setExecutionResult(`Ошибка выполнения:\n${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
      setResultDialogOpen(true);
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
      />
    </>
  );
};
