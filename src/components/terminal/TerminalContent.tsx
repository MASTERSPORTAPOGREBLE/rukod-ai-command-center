
import React, { useState } from 'react';
import { CommandOutput } from '../CommandOutput';
import { SystemStats } from '../SystemStats';
import { TerminalCommandInput } from '../TerminalCommandInput';
import { QuickFileRunner } from '../QuickFileRunner';
import { CodeExecutionResult } from '../code/CodeExecutionResult';

interface TerminalContentProps {
  terminalInput: string;
  setTerminalInput: React.Dispatch<React.SetStateAction<string>>;
  handleSubmitCommand: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  currentTheme: any;
  selectedFile: string;
  setSelectedFile: React.Dispatch<React.SetStateAction<string>>;
  isRunning: boolean;
  setIsRunning: React.Dispatch<React.SetStateAction<boolean>>;
}

export const TerminalContent: React.FC<TerminalContentProps> = ({
  terminalInput,
  setTerminalInput,
  handleSubmitCommand,
  handleKeyDown,
  currentTheme,
  selectedFile,
  setSelectedFile,
  isRunning,
  setIsRunning
}) => {
  const [resultDialogOpen, setResultDialogOpen] = useState(false);
  const [commandOutput, setCommandOutput] = useState("");
  const [executedCommand, setExecutedCommand] = useState("");
  const [hasError, setHasError] = useState(false);
  const [suggestions, setSuggestions] = useState<{text: string; action: () => void; label: string}[]>([]);
  const [execTime, setExecTime] = useState(0);

  // Расширяем функциональность QuickFileRunner для отображения результатов
  const onFileRun = (output: string, command: string) => {
    setCommandOutput(output);
    setExecutedCommand(command);
    setResultDialogOpen(true);
    
    // Определение, есть ли ошибка в выводе
    const isError = output.toLowerCase().includes('error') || 
                   output.toLowerCase().includes('exception') ||
                   output.toLowerCase().includes('ошибка');
    
    setHasError(isError);
    
    // Генерируем предложения по исправлению, если есть ошибка
    if (isError) {
      const newSuggestions: {text: string; action: () => void; label: string}[] = [];
      
      // Проверяем на типичные ошибки
      if (output.includes('not defined') || output.includes('is not defined')) {
        newSuggestions.push({
          text: 'Возможно, не определена переменная или функция',
          action: () => {
            setTerminalInput('помощь переменные');
          },
          label: 'Справка'
        });
      }
      
      if (output.includes('import') || output.includes('require')) {
        newSuggestions.push({
          text: 'Возможно, отсутствует необходимый модуль',
          action: () => {
            const match = output.match(/['"]([\w\-\.]+)['"]/);
            if (match && match[1]) {
              setTerminalInput(`install ${match[1]}`);
            } else {
              setTerminalInput('install ');
            }
          },
          label: 'Установить'
        });
      }
      
      if (output.includes('syntax')) {
        newSuggestions.push({
          text: 'Обнаружена синтаксическая ошибка',
          action: () => {
            setTerminalInput('помощь синтаксис');
          },
          label: 'Подробнее'
        });
      }
      
      // Если не нашли конкретных ошибок, добавим общую подсказку
      if (newSuggestions.length === 0) {
        newSuggestions.push({
          text: 'Посмотреть примеры кода для исправления',
          action: () => {
            // Определение языка по файлу
            const extension = selectedFile.split('.').pop()?.toLowerCase();
            let language = '';
            
            switch (extension) {
              case 'py': language = 'python'; break;
              case 'js': language = 'javascript'; break;
              case 'cpp': language = 'cpp'; break;
              case 'lua': language = 'lua'; break;
              default: language = 'code';
            }
            
            setTerminalInput(`примеры ${language}`);
          },
          label: 'Примеры'
        });
      }
      
      setSuggestions(newSuggestions);
    } else {
      // Если нет ошибки, сбрасываем предложения
      setSuggestions([]);
    }
    
    // Установка времени выполнения
    setExecTime(Math.floor(Math.random() * 50) + 10);
  };

  return (
    <div className="flex-grow flex flex-col space-y-2 m-0">
      <div>
        <SystemStats />
      </div>
      
      <QuickFileRunner 
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        isRunning={isRunning}
        setIsRunning={setIsRunning}
        onFileRun={onFileRun}
      />
      
      <div className="flex-grow overflow-auto">
        <CommandOutput />
      </div>
      
      <TerminalCommandInput 
        terminalInput={terminalInput}
        setTerminalInput={setTerminalInput}
        handleSubmitCommand={handleSubmitCommand}
        handleKeyDown={handleKeyDown}
        currentTheme={currentTheme}
      />
      
      <div className="w-full text-center">
        <span className="text-xs text-slate-500">
          Введите "помощь" для просмотра доступных команд
        </span>
      </div>

      <CodeExecutionResult
        open={resultDialogOpen}
        onOpenChange={setResultDialogOpen}
        output={commandOutput}
        fileName={executedCommand}
        executionTime={execTime}
        language={selectedFile.split('.').pop()?.toLowerCase() || 'unknown'}
        hasError={hasError}
        suggestions={suggestions}
      />
    </div>
  );
};
