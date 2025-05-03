
import { useState } from 'react';
import { toast } from 'sonner';
import { terminalService } from '../../services/terminalService';

interface UseTerminalExecutionResult {
  isRunning: boolean;
  executionResult: {
    output: string;
    command: string;
    hasError: boolean;
    executionTime: number;
    suggestions: {text: string; action: () => void; label: string}[];
  };
  runCommand: (command: string) => Promise<void>;
  openResultDialog: boolean;
  setOpenResultDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useTerminalExecution = (): UseTerminalExecutionResult => {
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState('');
  const [executedCommand, setExecutedCommand] = useState('');
  const [hasError, setHasError] = useState(false);
  const [executionTime, setExecutionTime] = useState(0);
  const [suggestions, setSuggestions] = useState<{text: string; action: () => void; label: string}[]>([]);
  const [openResultDialog, setOpenResultDialog] = useState(false);

  const runCommand = async (command: string) => {
    if (!command.trim()) return;
    
    setIsRunning(true);
    const startTime = performance.now();
    
    try {
      // Execute the command through the terminal service
      const result = await terminalService.executeCommand(command);
      
      // Calculate execution time
      const endTime = performance.now();
      setExecutionTime(Math.round(endTime - startTime));
      
      setExecutedCommand(command);
      setOutput(result);
      
      // Determine if there's an error based on keywords
      const errorPattern = /error|exception|ошибка|failure|failed|неверный|invalid/i;
      const detectedError = errorPattern.test(result.toLowerCase());
      setHasError(detectedError);
      
      // Generate suggestions if there's an error
      if (detectedError) {
        generateErrorSuggestions(result, command);
      } else {
        setSuggestions([]);
      }
      
      // Show the result dialog
      setOpenResultDialog(true);
    } catch (error) {
      console.error('Error executing command:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setOutput(`Error executing command: ${errorMessage}`);
      setHasError(true);
      setExecutedCommand(command);
      
      const endTime = performance.now();
      setExecutionTime(Math.round(endTime - startTime));
      
      // Generate error suggestions
      generateErrorSuggestions(errorMessage, command);
      
      // Show the result dialog
      setOpenResultDialog(true);
      
      toast.error(`Ошибка выполнения команды`);
    } finally {
      setIsRunning(false);
    }
  };
  
  const generateErrorSuggestions = (errorText: string, commandText: string) => {
    const newSuggestions: {text: string; action: () => void; label: string}[] = [];
    
    // Check for common error patterns and generate suggestions
    if (/not defined|undefined|is not defined/i.test(errorText)) {
      newSuggestions.push({
        text: 'Возможно, не определена переменная или функция',
        action: () => {
          toast.info('Проверьте, что все переменные и функции объявлены до их использования');
        },
        label: 'Подробнее'
      });
    }
    
    if (/import|require|module not found/i.test(errorText)) {
      const moduleMatch = errorText.match(/['"]([\w\-\.]+)['"]/);
      const moduleName = moduleMatch ? moduleMatch[1] : '';
      
      newSuggestions.push({
        text: 'Возможно, отсутствует необходимый модуль',
        action: () => {
          toast.info(`Попробуйте установить модуль: install ${moduleName || ''}`);
        },
        label: 'Установить'
      });
    }
    
    if (/syntax|синтаксис/i.test(errorText)) {
      newSuggestions.push({
        text: 'Обнаружена синтаксическая ошибка',
        action: () => {
          toast.info('Проверьте правильность синтаксиса: скобки, точки с запятой, кавычки');
        },
        label: 'Подсказка'
      });
    }
    
    if (/permission|доступ|denied/i.test(errorText)) {
      newSuggestions.push({
        text: 'Проблема с правами доступа',
        action: () => {
          toast.info('В веб-среде некоторые операции могут быть ограничены из соображений безопасности');
        },
        label: 'Подробнее'
      });
    }
    
    // If we haven't found any specific issues, add a generic help suggestion
    if (newSuggestions.length === 0) {
      // Try to determine the language from the command
      let language = 'code';
      
      if (/python|\.py/i.test(commandText)) {
        language = 'python';
      } else if (/javascript|node|\.js/i.test(commandText)) {
        language = 'javascript';
      } else if (/cpp|g\+\+|\.cpp/i.test(commandText)) {
        language = 'cpp';
      } else if (/lua|\.lua/i.test(commandText)) {
        language = 'lua';
      }
      
      newSuggestions.push({
        text: 'Посмотреть документацию или примеры',
        action: () => {
          toast.info(`Введите команду "примеры ${language}" для получения информации`);
        },
        label: 'Примеры'
      });
    }
    
    setSuggestions(newSuggestions);
  };

  return {
    isRunning,
    executionResult: {
      output,
      command: executedCommand,
      hasError,
      executionTime,
      suggestions
    },
    runCommand,
    openResultDialog,
    setOpenResultDialog
  };
};
