
import { useState, useEffect } from 'react';

interface UseCommandHistoryResult {
  commandHistory: string[];
  historyIndex: number;
  addToHistory: (command: string) => void;
  navigateHistory: (direction: 'up' | 'down') => string | null;
  resetHistoryIndex: () => void;
}

export const useCommandHistory = (maxHistorySize: number = 50): UseCommandHistoryResult => {
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const addToHistory = (command: string) => {
    if (!command.trim()) return;
    
    // Don't add duplicates in a row
    if (commandHistory[0] === command) return;
    
    setCommandHistory(prev => [command, ...prev.slice(0, maxHistorySize - 1)]);
    setHistoryIndex(-1);
  };

  const navigateHistory = (direction: 'up' | 'down'): string | null => {
    if (commandHistory.length === 0) return null;
    
    if (direction === 'up') {
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        return commandHistory[newIndex];
      }
    } else { // direction === 'down'
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        return commandHistory[newIndex];
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        return '';
      }
    }
    
    return null;
  };

  const resetHistoryIndex = () => {
    setHistoryIndex(-1);
  };

  return {
    commandHistory,
    historyIndex,
    addToHistory,
    navigateHistory,
    resetHistoryIndex
  };
};
