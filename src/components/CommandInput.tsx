
import React, { useState, KeyboardEvent, useRef } from 'react';
import { useCommandContext } from '@/context/CommandContext';
import { CommandSuggestions } from './CommandSuggestions';
import { VoiceRecognitionButton } from './terminal/VoiceRecognitionButton';
import { LanguageToggleButton } from './terminal/LanguageToggleButton';
import { CommandSubmitButton } from './terminal/CommandSubmitButton';
import { CommandInputField } from './terminal/CommandInputField';
import { useCommandHistory } from './terminal/CommandHistoryManager';
import { useSuggestions } from './terminal/SuggestionsManager';

export const CommandInput: React.FC = () => {
  const [command, setCommand] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [translatedCommand, setTranslatedCommand] = useState<string | undefined>(undefined);
  
  const { 
    addCommand, 
    isProcessing, 
    installedModules,
    language,
    setLanguage,
    userPreferences
  } = useCommandContext();
  
  // Get all available commands from installed modules
  const availableCommands = installedModules.flatMap(module => 
    Object.keys(module.commands)
  );
  
  // Get recent commands from user preferences
  const recentCommands = userPreferences.recentCommands || [];
  
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Use our custom hooks
  const { 
    commandHistory, 
    historyIndex, 
    addToHistory, 
    navigateHistory, 
    resetHistoryIndex 
  } = useCommandHistory();
  
  const {
    suggestions,
    activeSuggestion,
    setSuggestions,
    setActiveSuggestion,
    navigateSuggestions,
    selectActiveSuggestion,
    generateSuggestions
  } = useSuggestions();

  const handleSubmit = () => {
    if (!command.trim() || isProcessing) return;
    
    // Hide suggestions after submit
    setSuggestions([]);
    
    // Add command to history
    addToHistory(command);
    
    // Process command
    addCommand(command);
    
    // Clear input
    setCommand('');
    resetHistoryIndex();
  };

  // Handle input change with suggestion generation
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCommand = e.target.value;
    setCommand(newCommand);
    generateSuggestions(newCommand, availableCommands, recentCommands);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      
      const selectedSuggestion = selectActiveSuggestion();
      if (selectedSuggestion) {
        // Use the selected suggestion
        setCommand(selectedSuggestion);
        setSuggestions([]);
      } else {
        handleSubmit();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      
      if (suggestions.length > 0) {
        // Navigate suggestions upwards
        navigateSuggestions('up');
      } else {
        // Navigate command history upwards
        const historyCommand = navigateHistory('up');
        if (historyCommand !== null) {
          setCommand(historyCommand);
        }
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      
      if (suggestions.length > 0) {
        // Navigate suggestions downwards
        navigateSuggestions('down');
      } else {
        // Navigate command history downwards
        const historyCommand = navigateHistory('down');
        if (historyCommand !== null) {
          setCommand(historyCommand);
        }
      }
    } else if (e.key === 'Escape') {
      // Hide suggestions
      setSuggestions([]);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      
      // Either use first suggestion or perform basic autocomplete
      if (suggestions.length > 0) {
        const suggestionToUse = activeSuggestion >= 0 
          ? suggestions[activeSuggestion] 
          : suggestions[0];
          
        setCommand(suggestionToUse);
        
        // If it's a command with colon, add a space after
        if (suggestionToUse.endsWith(':')) {
          setCommand(suggestionToUse + ' ');
        }
        
        setSuggestions([]);
      } else {
        // Basic auto-completion for commands
        const currentInput = command.toLowerCase();
        
        // Special commands
        const specialCommands = ['скачать:', 'запуск:', 'авторизация:', 'генерация:', 'код:', 'помощь:', 'язык:'];
        const allCommands = [...availableCommands, ...specialCommands];
        
        // Find matching command
        const matchingCommand = allCommands.find(cmd => 
          cmd.toLowerCase().startsWith(currentInput) && cmd.toLowerCase() !== currentInput
        );
        
        if (matchingCommand) {
          setCommand(matchingCommand + (specialCommands.includes(matchingCommand) ? ' ' : ''));
        }
      }
    }
  };

  return (
    <div className="relative">
      <div className="relative glass-panel p-2 flex items-center">
        <span className="text-rukod-purple mx-2 terminal-text">$</span>
        
        <CommandInputField
          command={command}
          setCommand={setCommand}
          handleKeyDown={handleKeyDown}
          handleInputChange={handleInputChange}
          isProcessing={isProcessing}
          isListening={isListening}
          translatedCommand={translatedCommand}
          inputRef={inputRef}
        />
        
        <LanguageToggleButton 
          language={language} 
          setLanguage={setLanguage} 
        />
        
        <VoiceRecognitionButton 
          isListening={isListening}
          setIsListening={setIsListening}
          setCommand={setCommand}
          language={language}
        />
        
        <CommandSubmitButton 
          command={command}
          isProcessing={isProcessing}
          handleSubmit={handleSubmit}
        />
      </div>
      
      {/* Command suggestions dropdown */}
      <CommandSuggestions 
        suggestions={suggestions}
        activeSuggestion={activeSuggestion}
        setCommand={setCommand}
        setSuggestions={setSuggestions}
        inputRef={inputRef}
      />
    </div>
  );
};
