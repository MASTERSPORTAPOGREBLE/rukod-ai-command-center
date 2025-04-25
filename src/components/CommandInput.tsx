
import React, { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCommandContext } from '@/context/CommandContext';

export const CommandInput: React.FC = () => {
  const [command, setCommand] = useState('');
  const { addCommand, isProcessing } = useCommandContext();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus input on component mount
    inputRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    if (!command.trim() || isProcessing) return;
    
    addCommand(command);
    setCommand('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
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
