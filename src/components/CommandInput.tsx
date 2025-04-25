
import React, { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCommandContext } from '@/context/CommandContext';

export const CommandInput: React.FC = () => {
  const [command, setCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
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
      const specialCommands = ['скачать:', 'запуск:', 'авторизация:'];
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

  return (
    <div className="relative glass-panel p-2 flex items-center">
      <span className="text-rukod-purple mx-2 terminal-text">$</span>
      <input
        ref={inputRef}
        type="text"
        value={command}
        onChange={(e) => setCommand(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isProcessing}
        placeholder="Введите команду или запрос..."
        className="command-input terminal-text py-2 flex-grow"
        autoComplete="off"
        spellCheck="false"
      />
      
      <Button 
        onClick={handleSubmit}
        disabled={!command.trim() || isProcessing}
        variant="ghost"
        size="icon"
        className="ml-2 hover:bg-rukod-purple hover:bg-opacity-20"
      >
        <Play className="h-4 w-4 text-rukod-purple" />
      </Button>
    </div>
  );
};
