
import React, { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { Play, Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCommandContext } from '@/context/CommandContext';
import { toast } from 'sonner';

export const CommandInput: React.FC = () => {
  const [command, setCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isListening, setIsListening] = useState(false);
  const { addCommand, isProcessing, installedModules } = useCommandContext();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus input on component mount
    inputRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    if (!command.trim() || isProcessing) return;
    
    addCommand(command);
    // Add to command history
    setCommandHistory(prev => [command, ...prev.slice(0, 19)]);
    setHistoryIndex(-1);
    setCommand('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      // Navigate command history upwards
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCommand(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      // Navigate command history downwards
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCommand(commandHistory[newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCommand('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Simple auto-completion for commands
      const currentInput = command.toLowerCase();
      
      // Get all available commands from installed modules
      const availableCommands = installedModules.flatMap(module => 
        Object.keys(module.commands)
      );
      
      // Special commands
      const specialCommands = ['скачать:', 'запуск:', 'авторизация:', 'генерация:'];
      const allCommands = [...availableCommands, ...specialCommands];
      
      // Find matching command
      const matchingCommand = allCommands.find(cmd => 
        cmd.startsWith(currentInput) && cmd !== currentInput
      );
      
      if (matchingCommand) {
        setCommand(matchingCommand + (specialCommands.includes(matchingCommand) ? ' ' : ''));
      }
    }
  };

  // Toggle voice recognition
  const toggleVoiceRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Распознавание голоса не поддерживается в вашем браузере');
      return;
    }

    if (isListening) {
      setIsListening(false);
      toast.info('Голосовой ввод отключен');
    } else {
      setIsListening(true);
      toast.success('Голосовой ввод включен! Говорите команду...');

      try {
        // Mock speech recognition for demo
        setTimeout(() => {
          const mockCommands = [
            "привет",
            "скачать: Анимация",
            "help",
            "генерация: 2D анимация"
          ];
          const randomCommand = mockCommands[Math.floor(Math.random() * mockCommands.length)];
          setCommand(randomCommand);
          toast.info(`Распознано: "${randomCommand}"`);
          setIsListening(false);
        }, 3000);
      } catch (error) {
        console.error('Error with speech recognition:', error);
        toast.error('Ошибка распознавания голоса');
        setIsListening(false);
      }
    }
  };

  return (
    <div className="relative glass-panel p-2 flex items-center">
      <span className="text-rukod-purple mx-2 terminal-text">$</span>
      <input
        ref={inputRef}
        type="text"
        value={command}
        onChange={(e) => setCommand(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isProcessing || isListening}
        placeholder={isListening ? "Распознавание голоса..." : "Введите команду или запрос..."}
        className="command-input terminal-text py-2 flex-grow"
        autoComplete="off"
        spellCheck="false"
      />
      
      <Button 
        onClick={toggleVoiceRecognition}
        variant="ghost"
        size="icon"
        className="mr-1 hover:bg-rukod-purple hover:bg-opacity-20"
        title={isListening ? "Остановить голосовой ввод" : "Включить голосовой ввод"}
      >
        {isListening ? 
          <MicOff className="h-4 w-4 text-red-400 animate-pulse" /> : 
          <Mic className="h-4 w-4 text-rukod-purple" />
        }
      </Button>
      
      <Button 
        onClick={handleSubmit}
        disabled={!command.trim() || isProcessing}
        variant="ghost"
        size="icon"
        className="ml-1 hover:bg-rukod-purple hover:bg-opacity-20"
      >
        <Play className="h-4 w-4 text-rukod-purple" />
      </Button>
    </div>
  );
};
