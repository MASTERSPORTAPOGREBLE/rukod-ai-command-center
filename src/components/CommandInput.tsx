
import React, { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { Play, Mic, MicOff, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCommandContext } from '@/context/CommandContext';
import { toast } from '@/hooks/use-toast';
import { CommandSuggestions } from './CommandSuggestions';

export const CommandInput: React.FC = () => {
  const [command, setCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isListening, setIsListening] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const { 
    addCommand, 
    isProcessing, 
    installedModules,
    language,
    setLanguage,
    userPreferences
  } = useCommandContext();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus input on component mount
    inputRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    if (!command.trim() || isProcessing) return;
    
    // Hide suggestions after submit
    setSuggestions([]);
    
    addCommand(command);
    // Add to command history
    setCommandHistory(prev => [command, ...prev.slice(0, 19)]);
    setHistoryIndex(-1);
    setCommand('');
  };

  const generateSuggestions = (input: string) => {
    if (!input.trim()) {
      setSuggestions([]);
      return;
    }
    
    const currentInput = input.toLowerCase();
    
    // Get all available commands from installed modules
    const availableCommands: string[] = [];
    
    // Add commands from installed modules
    installedModules.forEach(module => {
      Object.keys(module.commands).forEach(cmd => {
        availableCommands.push(cmd);
      });
    });
    
    // Add special commands
    const specialCommands = ['скачать:', 'запуск:', 'авторизация:', 'генерация:'];
    const specialPrefixes = ['код:', 'помощь:', 'язык:'];
    
    // Add recent commands from user preferences
    const recentCommands = userPreferences.recentCommands || [];
    
    // Combine all potential completions
    const allSuggestions = [
      ...availableCommands,
      ...specialCommands,
      ...specialPrefixes,
      ...recentCommands
    ];
    
    // Find matching commands
    const matchingSuggestions = allSuggestions
      .filter(cmd => cmd.toLowerCase().startsWith(currentInput) && cmd.toLowerCase() !== currentInput)
      .slice(0, 5); // Limit to 5 suggestions
    
    setSuggestions(matchingSuggestions);
    setActiveSuggestion(-1); // Reset active suggestion
  };

  // Handle input change with suggestion generation
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCommand = e.target.value;
    setCommand(newCommand);
    generateSuggestions(newCommand);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      
      if (activeSuggestion >= 0 && suggestions[activeSuggestion]) {
        // Use the selected suggestion
        setCommand(suggestions[activeSuggestion]);
        setSuggestions([]);
      } else {
        handleSubmit();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      
      if (suggestions.length > 0) {
        // Navigate suggestions upwards
        setActiveSuggestion(prevActive => 
          prevActive <= 0 ? suggestions.length - 1 : prevActive - 1
        );
      } else {
        // Navigate command history upwards
        if (historyIndex < commandHistory.length - 1) {
          const newIndex = historyIndex + 1;
          setHistoryIndex(newIndex);
          setCommand(commandHistory[newIndex]);
        }
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      
      if (suggestions.length > 0) {
        // Navigate suggestions downwards
        setActiveSuggestion(prevActive => 
          prevActive >= suggestions.length - 1 ? 0 : prevActive + 1
        );
      } else {
        // Navigate command history downwards
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          setHistoryIndex(newIndex);
          setCommand(commandHistory[newIndex]);
        } else if (historyIndex === 0) {
          setHistoryIndex(-1);
          setCommand('');
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
        
        // Get all available commands from installed modules
        const availableCommands = installedModules.flatMap(module => 
          Object.keys(module.commands)
        );
        
        // Special commands
        const specialCommands = ['скачать:', 'запуск:', 'авторизация:', 'генерация:', 'код:', 'помощь:', 'язык:'];
        const allCommands = [...availableCommands, ...specialCommands];
        
        // Find matching command
        const matchingCommand = allCommands.find(cmd => 
          cmd.startsWith(currentInput) && cmd !== currentInput
        );
        
        if (matchingCommand) {
          setCommand(matchingCommand + (specialCommands.includes(matchingCommand) ? ' ' : ''));
        }
      }
    }
  };

  // Toggle voice recognition with support for language detection
  const toggleVoiceRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "Голосовой ввод недоступен",
        description: "Распознавание голоса не поддерживается в вашем браузере"
      });
      return;
    }

    if (isListening) {
      setIsListening(false);
      toast({
        title: "Голосовой ввод отключен",
        description: "Режим голосового ввода выключен"
      });
    } else {
      setIsListening(true);
      toast({
        title: "Голосовой ввод включен",
        description: "Говорите команду..."
      });

      try {
        // Mock speech recognition for demo
        setTimeout(() => {
          const currentLang = language;
          
          // Select command based on current language
          const mockCommands = currentLang === 'ru' 
            ? ["привет", "скачать: Анимация", "помощь", "код: 2D анимация"] 
            : ["hello", "download: Animation", "help", "code: 2D animation"];
            
          const randomCommand = mockCommands[Math.floor(Math.random() * mockCommands.length)];
          setCommand(randomCommand);
          
          toast({
            title: "Распознано",
            description: `"${randomCommand}"`
          });
          
          setIsListening(false);
        }, 3000);
      } catch (error) {
        console.error('Error with speech recognition:', error);
        toast({
          title: "Ошибка",
          description: "Ошибка распознавания голоса"
        });
        setIsListening(false);
      }
    }
  };

  // Toggle language
  const toggleLanguage = () => {
    const newLang = language === 'ru' ? 'en' : 'ru';
    setLanguage(newLang);
    toast({
      title: newLang === 'ru' ? "Язык изменен" : "Language changed",
      description: newLang === 'ru' ? "Русский язык активирован" : "English language activated"
    });
  };

  return (
    <div className="relative">
      <div className="relative glass-panel p-2 flex items-center">
        <span className="text-rukod-purple mx-2 terminal-text">$</span>
        <input
          ref={inputRef}
          type="text"
          value={command}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={isProcessing || isListening}
          placeholder={isListening ? "Распознавание голоса..." : "Введите команду или запрос..."}
          className="command-input terminal-text py-2 flex-grow"
          autoComplete="off"
          spellCheck="false"
        />
        
        <Button 
          onClick={toggleLanguage}
          variant="ghost"
          size="icon"
          className="mr-1 hover:bg-rukod-purple hover:bg-opacity-20"
          title={language === 'ru' ? "Переключить на английский" : "Switch to Russian"}
        >
          <Languages className="h-4 w-4 text-rukod-purple" />
        </Button>
        
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
