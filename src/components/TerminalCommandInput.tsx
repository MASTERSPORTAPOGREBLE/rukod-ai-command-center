
import React, { useRef } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TerminalCommandInputProps {
  terminalInput: string;
  setTerminalInput: React.Dispatch<React.SetStateAction<string>>;
  handleSubmitCommand: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  currentTheme: any;
}

export const TerminalCommandInput: React.FC<TerminalCommandInputProps> = ({
  terminalInput,
  setTerminalInput,
  handleSubmitCommand,
  handleKeyDown,
  currentTheme
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="mt-auto flex">
      <div className="relative flex-grow">
        <input
          ref={inputRef}
          type="text"
          value={terminalInput}
          onChange={(e) => setTerminalInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-l-md focus:outline-none focus:border-rukod-purple"
          placeholder="Введите команду..."
        />
      </div>
      <Button 
        className="rounded-l-none"
        style={{ backgroundColor: currentTheme.primaryColor }}
        onClick={handleSubmitCommand}
      >
        <Send className="h-4 w-4 mr-2" />
        Выполнить
      </Button>
    </div>
  );
};
