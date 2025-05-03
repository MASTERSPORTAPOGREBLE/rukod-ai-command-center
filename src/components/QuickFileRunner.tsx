
// Оригинальный файл является read-only, поэтому мы создаем новую версию
import React, { useState, useEffect } from 'react';
import { Play, FileCode, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';
import { toast } from 'sonner';
import { executeCode } from '@/utils/codeUtils';
import { ProgrammingLanguage } from '@/models/types';

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
  const [fileContents, setFileContents] = useState<Record<string, string>>({
    'main.py': 'print("Hello, World from Python!")\n\ndef calculate():\n    level = 42\n    print(f"Level: {level}")\n\ncalculate()',
    'utils.py': 'def get_data():\n    return {"status": "success"}\n\nprint("Utils module loaded")',
    'app.js': 'console.log("Hello from JavaScript!");\n\nconst data = { status: "success" };\nconsole.log(data);',
    'main.cpp': '#include <iostream>\n\nint main() {\n    std::cout << "Hello, World from C++!" << std::endl;\n    return 0;\n}',
    'game.lua': 'function love.draw()\n    love.graphics.print("Hello World!", 400, 300)\nend\n\nprint("Game initialized")',
    'calculator.js': 'function add(a, b) {\n    return a + b;\n}\n\nconsole.log("Sum:", add(5, 3));',
    'neural_net.py': 'import tensorflow as tf\n\ndef create_model():\n    model = tf.keras.Sequential()\n    model.add(tf.keras.layers.Dense(10))\n    return model\n\nprint("Model created")',
    'data_processing.py': 'def process_data(data):\n    print("Processing data...")\n    return data\n\nresult = process_data([1, 2, 3])\nprint("Result:", result)'
  });

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
      // Получаем содержимое файла
      const fileContent = fileContents[selectedFile] || '';
      if (!fileContent) {
        toast.error(`Файл ${selectedFile} пуст или не существует`);
        setIsRunning(false);
        return;
      }

      // Определяем язык программирования на основе расширения
      const fileExtension = selectedFile.split('.').pop()?.toLowerCase();
      let language: ProgrammingLanguage = 'python';
      
      switch (fileExtension) {
        case 'py': 
          language = 'python';
          break;
        case 'js':
          language = 'javascript';
          break;
        case 'cpp':
        case 'h':
          language = 'cpp';
          break;
        case 'lua':
          language = 'lua';
          break;
        default:
          language = 'python';
      }

      toast.info(`Запуск файла ${selectedFile}...`);
      
      // Выполняем код с помощью нашего интерпретатора
      const result = await executeCode(fileContent, language);
      
      // Формируем вывод для отображения
      let output = '';
      
      if (result.success) {
        output = result.output;
        toast.success(`Файл ${selectedFile} выполнен успешно`);
      } else {
        output = `Ошибка выполнения:\n${result.error}`;
        toast.error(`Ошибка при запуске ${selectedFile}`);
      }
      
      // Передаем результат, если функция обратного вызова предоставлена
      if (onFileRun) {
        onFileRun(output, `run ${selectedFile}`);
      }
    } catch (error) {
      console.error('Ошибка выполнения файла:', error);
      
      // Передаем сообщение об ошибке
      if (onFileRun) {
        onFileRun(`Ошибка выполнения: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`, 
                 `run ${selectedFile}`);
      }
      
      toast.error(`Ошибка при запуске ${selectedFile}`);
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
