
import React, { KeyboardEvent, useRef, useEffect } from 'react';
import { Globe } from 'lucide-react';

interface CommandInputFieldProps {
  command: string;
  setCommand: React.Dispatch<React.SetStateAction<string>>;
  handleKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  isProcessing: boolean;
  isListening: boolean;
  translatedCommand?: string;
  inputRef: React.RefObject<HTMLInputElement>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CommandInputField: React.FC<CommandInputFieldProps> = ({
  command,
  setCommand,
  handleKeyDown,
  isProcessing,
  isListening,
  translatedCommand,
  inputRef,
  handleInputChange
}) => {
  // Focus input on component mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="flex-grow relative">
      <input
        ref={inputRef}
        type="text"
        value={command}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        disabled={isProcessing || isListening}
        placeholder={isListening ? "Распознавание голоса..." : "Введите команду или запрос..."}
        className="command-input terminal-text py-2 w-full bg-transparent dark:text-white text-black"
        autoComplete="off"
        spellCheck="false"
      />
      
      {/* Translation indicator */}
      {translatedCommand && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center text-xs text-gray-400">
          <Globe className="h-3 w-3 mr-1" />
          <span className="hidden md:inline">{translatedCommand}</span>
        </div>
      )}
    </div>
  );
};
