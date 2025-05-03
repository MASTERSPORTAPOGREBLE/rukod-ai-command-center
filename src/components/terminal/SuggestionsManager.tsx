
import { useState, useEffect } from 'react';

interface UseSuggestionsResult {
  suggestions: string[];
  activeSuggestion: number;
  setSuggestions: React.Dispatch<React.SetStateAction<string[]>>;
  setActiveSuggestion: React.Dispatch<React.SetStateAction<number>>;
  navigateSuggestions: (direction: 'up' | 'down') => void;
  selectActiveSuggestion: () => string | null;
  generateSuggestions: (input: string, availableCommands: string[], recentCommands: string[]) => void;
}

export const useSuggestions = (): UseSuggestionsResult => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);

  const navigateSuggestions = (direction: 'up' | 'down') => {
    if (suggestions.length === 0) return;
    
    if (direction === 'up') {
      setActiveSuggestion(prev => 
        prev <= 0 ? suggestions.length - 1 : prev - 1
      );
    } else { // direction === 'down'
      setActiveSuggestion(prev => 
        prev >= suggestions.length - 1 ? 0 : prev + 1
      );
    }
  };

  const selectActiveSuggestion = (): string | null => {
    if (activeSuggestion >= 0 && suggestions[activeSuggestion]) {
      return suggestions[activeSuggestion];
    }
    return null;
  };

  const generateSuggestions = (
    input: string, 
    availableCommands: string[], 
    recentCommands: string[]
  ) => {
    if (!input.trim()) {
      setSuggestions([]);
      return;
    }
    
    const currentInput = input.toLowerCase();
    
    // Special commands
    const specialCommands = ['скачать:', 'запуск:', 'авторизация:', 'генерация:', 'код:', 'помощь:', 'язык:'];
    
    // Combine all potential completions
    const allSuggestions = [
      ...availableCommands,
      ...specialCommands,
      ...recentCommands
    ];
    
    // Find matching commands
    const matchingSuggestions = allSuggestions
      .filter(cmd => cmd.toLowerCase().startsWith(currentInput) && cmd.toLowerCase() !== currentInput)
      .slice(0, 5); // Limit to 5 suggestions
    
    setSuggestions(matchingSuggestions);
    setActiveSuggestion(-1); // Reset active suggestion
  };

  return {
    suggestions,
    activeSuggestion,
    setSuggestions,
    setActiveSuggestion,
    navigateSuggestions,
    selectActiveSuggestion,
    generateSuggestions
  };
};
