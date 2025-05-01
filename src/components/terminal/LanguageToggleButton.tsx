
import React from 'react';
import { Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface LanguageToggleButtonProps {
  language: string;
  setLanguage: (lang: string) => void;
}

export const LanguageToggleButton: React.FC<LanguageToggleButtonProps> = ({
  language,
  setLanguage
}) => {
  const toggleLanguage = () => {
    const newLang = language === 'ru' ? 'en' : 'ru';
    setLanguage(newLang);
    toast({
      title: newLang === 'ru' ? "Язык изменен" : "Language changed",
      description: newLang === 'ru' ? "Русский язык активирован" : "English language activated"
    });
  };

  return (
    <Button 
      onClick={toggleLanguage}
      variant="ghost"
      size="icon"
      className="mr-1 hover:bg-rukod-purple hover:bg-opacity-20"
      title={language === 'ru' ? "Переключить на английский" : "Switch to Russian"}
    >
      <Languages className="h-4 w-4 text-rukod-purple" />
    </Button>
  );
};
