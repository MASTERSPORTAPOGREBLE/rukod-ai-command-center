
import React from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface VoiceRecognitionButtonProps {
  isListening: boolean;
  setIsListening: React.Dispatch<React.SetStateAction<boolean>>;
  setCommand: React.Dispatch<React.SetStateAction<string>>;
  language: string;
}

export const VoiceRecognitionButton: React.FC<VoiceRecognitionButtonProps> = ({
  isListening,
  setIsListening,
  setCommand,
  language
}) => {
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

  return (
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
  );
};
