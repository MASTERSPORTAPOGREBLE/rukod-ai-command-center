
// Оригинальный файл является read-only, поэтому мы создаем новую версию
import React, { useState, useEffect } from 'react';
import { Play, FileCode, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';
import { toast } from 'sonner';

interface QuickFileRunnerProps {
  selectedFile: string;
  setSelectedFile: React.Dispatch<React.SetStateAction<string>>;
  isRunning: boolean;
  setIsRunning: React.Dispatch<React.SetStateAction<boolean>>;
  onFileRun?: (output: string, command: string) => void;
}

export const QuickFileRunner: React.FC<QuickFileRunnerProps> = ({
  selectedFile,
  setSelectedFile,
  isRunning,
  setIsRunning,
  onFileRun
}) => {
  const [files, setFiles] = useState<string[]>(['main.py', 'utils.py', 'app.js', 'main.cpp', 'game.lua']);
  const [popoverOpen, setPopoverOpen] = useState(false);

  useEffect(() => {
    // В реальном приложении здесь будет запрос к бэкенду для получения файлов
    // Имитируем динамическую загрузку файлов с задержкой
    const timer = setTimeout(() => {
      setFiles([
        'main.py', 
        'utils.py', 
        'data_processing.py', 
        'app.js', 
        'index.html', 
        'main.cpp', 
        'game.lua',
        'calculator.js',
        'neural_net.py'
      ]);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleRunFile = async () => {
    if (!selectedFile) {
      toast.error("Выберите файл для запуска");
      return;
    }
    
    setIsRunning(true);
    
    try {
      // Имитация выполнения файла
      toast.success(`Запуск файла ${selectedFile}...`);
      
      // Создадим вывод на основе расширения файла
      const fileExtension = selectedFile.split('.').pop()?.toLowerCase();
      let output = "";
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      switch (fileExtension) {
        case 'py':
          output = "Python 3.11.0\nHello, World from Python!\nLevel: 42";
          break;
        case 'js':
          output = "Node.js v16.14.2\nHello, World from JavaScript!\n> { status: 'success' }";
          break;
        case 'cpp':
          output = "C++ (g++ 11.2)\nCompiling...\nBuild successful!\nHello, World from C++!\nExecution finished with exit code 0";
          break;
        case 'lua':
          output = "Lua 5.4.4\nHello, World from Lua!\n> Running game loop...";
          break;
        default:
          output = `Running ${selectedFile}...\nExecution completed successfully.`;
      }
      
      // Передаем результат, если функция обратного вызова предоставлена
      if (onFileRun) {
        onFileRun(output, `run ${selectedFile}`);
      }
      
      toast.success(`Файл ${selectedFile} выполнен успешно`);
    } catch (error) {
      console.error('Ошибка выполнения файла:', error);
      toast.error(`Ошибка при запуске ${selectedFile}`);
      
      // Передаем сообщение об ошибке
      if (onFileRun) {
        onFileRun(`Ошибка выполнения: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`, 
                 `run ${selectedFile}`);
      }
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="rounded-md bg-slate-800 p-2 flex gap-2 items-center">
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="flex gap-1 items-center justify-between w-[200px]">
            <div className="flex items-center">
              <FileCode className="h-4 w-4 mr-1" />
              <span className="truncate">{selectedFile || "Выберите файл"}</span>
            </div>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" side="bottom" align="start">
          <Command>
            <CommandInput placeholder="Поиск файла..." />
            <CommandList>
              <CommandEmpty>Файлы не найдены</CommandEmpty>
              <CommandGroup heading="Файлы проекта">
                {files.map((file) => (
                  <CommandItem
                    key={file}
                    onSelect={() => {
                      setSelectedFile(file);
                      setPopoverOpen(false);
                    }}
                  >
                    <FileCode className="h-4 w-4 mr-2" />
                    {file}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      
      <Button 
        size="sm" 
        onClick={handleRunFile} 
        disabled={isRunning || !selectedFile}
      >
        <Play className="h-4 w-4 mr-1" />
        {isRunning ? 'Выполняется...' : 'Запустить'}
      </Button>
    </div>
  );
};
