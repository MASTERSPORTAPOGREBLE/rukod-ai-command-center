
import React from 'react';

interface CommandSuggestionsProps {
  suggestions: string[];
  activeSuggestion: number;
  setCommand: (command: string) => void;
  setSuggestions: React.Dispatch<React.SetStateAction<string[]>>;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const CommandSuggestions: React.FC<CommandSuggestionsProps> = ({
  suggestions,
  activeSuggestion,
  setCommand,
  setSuggestions,
  inputRef
}) => {
  if (!suggestions.length) return null;
  
  return (
    <div 
      className="absolute z-10 mt-1 w-full bg-rukod-dark border border-rukod-purple border-opacity-30 rounded-md overflow-hidden shadow-lg"
    >
      {suggestions.map((suggestion, index) => (
        <div
          key={index}
          className={`px-4 py-2 cursor-pointer hover:bg-rukod-purple hover:bg-opacity-20 terminal-text ${
            index === activeSuggestion ? 'bg-rukod-purple bg-opacity-20' : ''
          }`}
          onClick={() => {
            setCommand(suggestion);
            setSuggestions([]);
            inputRef.current?.focus();
          }}
        >
          {suggestion}
        </div>
      ))}
    </div>
  );
};
