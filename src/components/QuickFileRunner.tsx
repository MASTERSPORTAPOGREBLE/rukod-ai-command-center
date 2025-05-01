
import React from 'react';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { terminalService } from '../services/terminalService';
import { toast } from 'sonner';

interface QuickFileRunnerProps {
  selectedFile: string;
  setSelectedFile: React.Dispatch<React.SetStateAction<string>>;
  isRunning: boolean;
  setIsRunning: React.Dispatch<React.SetStateAction<boolean>>;
}

export const QuickFileRunner: React.FC<QuickFileRunnerProps> = ({
  selectedFile,
  setSelectedFile,
  isRunning,
  setIsRunning
}) => {
  // Sample files for quick access
  const sampleFiles = [
    { name: 'main.py', language: 'python' },
    { name: 'app.js', language: 'javascript' },
    { name: 'main.cpp', language: 'cpp' },
    { name: 'game.lua', language: 'lua' },
    { name: 'src/utils.rs', language: 'rust' }
  ];
  
  // Run the selected file
  const handleRunFile = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    try {
      terminalService.addLog(`Запуск файла: ${selectedFile}`, 'info');
      
      // Simulating execution
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Add some mock output
      if (selectedFile.includes('.py')) {
        terminalService.addLog('Python interpreter started', 'info');
        terminalService.addLog('Importing dependencies...', 'info');
        await new Promise((resolve) => setTimeout(resolve, 1000));
        terminalService.addLog('Dependencies loaded successfully', 'success');
        terminalService.addLog('Running main function...', 'info');
        await new Promise((resolve) => setTimeout(resolve, 1000));
        terminalService.addLog('Output: Hello, РУКОД Terminal!', 'success');
      } else if (selectedFile.includes('.cpp')) {
        terminalService.addLog('Compiling C++ code...', 'info');
        await new Promise((resolve) => setTimeout(resolve, 1500));
        terminalService.addLog('Compilation successful', 'success');
        terminalService.addLog('Running executable...', 'info');
        await new Promise((resolve) => setTimeout(resolve, 1000));
        terminalService.addLog('Output: Hello, C++ World!', 'success');
      } else {
        terminalService.addLog(`Executing ${selectedFile}...`, 'info');
        await new Promise((resolve) => setTimeout(resolve, 1000));
        terminalService.addLog('Execution completed successfully', 'success');
      }
      
      toast.success(`Файл ${selectedFile} успешно выполнен`);
    } catch (error) {
      console.error('Error running file:', error);
      terminalService.addLog(`Ошибка выполнения файла: ${error}`, 'error');
      toast.error(`Ошибка выполнения файла ${selectedFile}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="flex items-center gap-2 p-2 bg-slate-900 rounded border border-slate-800">
      <span className="text-xs text-slate-400">Быстрый запуск:</span>
      <select 
        className="bg-slate-800 text-sm p-1 rounded border border-slate-700"
        value={selectedFile}
        onChange={(e) => setSelectedFile(e.target.value)}
      >
        {sampleFiles.map((file, idx) => (
          <option key={idx} value={file.name}>{file.name}</option>
        ))}
      </select>
      
      <Button 
        className={`ml-auto ${isRunning ? 'bg-amber-600' : 'bg-green-600'}`}
        size="sm"
        onClick={handleRunFile}
        disabled={isRunning}
      >
        <Play className="h-4 w-4 mr-1" />
        {isRunning ? 'Выполняется...' : 'Запустить'}
      </Button>
    </div>
  );
};
