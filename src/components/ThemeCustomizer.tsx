
import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from './ui/dialog';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from './ui/tabs';
import { 
  Palette, 
  Save, 
  RefreshCw, 
  Check, 
  Copy, 
  Eye, 
  EyeOff,
  Plus,
  X,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';
import { Theme } from '../models/types';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange, label }) => {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input 
          type="text" 
          value={color} 
          onChange={(e) => onChange(e.target.value)} 
          className="font-mono"
        />
        <Input 
          type="color" 
          value={color} 
          onChange={(e) => onChange(e.target.value)} 
          className="w-12 p-1 cursor-pointer"
        />
      </div>
    </div>
  );
};

export const ThemeCustomizer: React.FC = () => {
  const { currentTheme, setTheme, themes } = useTheme();
  const [customTheme, setCustomTheme] = useState<Theme>({ ...currentTheme });
  const [themeName, setThemeName] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const [customThemes, setCustomThemes] = useState<Theme[]>([]);
  
  const updateThemeProperty = (property: keyof Theme, value: string) => {
    setCustomTheme({
      ...customTheme,
      [property]: value,
    });
  };
  
  const saveTheme = () => {
    if (!themeName.trim()) {
      toast.error('Пожалуйста, введите название темы');
      return;
    }
    
    const newTheme: Theme = {
      ...customTheme,
      id: `custom-${Date.now()}`,
      name: themeName,
    };
    
    // In a real app, this would save to localStorage or backend
    setCustomThemes([...customThemes, newTheme]);
    toast.success(`Тема "${themeName}" сохранена`);
    setThemeName('');
  };
  
  const applyTheme = (theme: Theme) => {
    setTheme(theme.id);
    toast.success(`Тема "${theme.name}" применена`);
  };
  
  const deleteCustomTheme = (themeId: string) => {
    setCustomThemes(customThemes.filter(theme => theme.id !== themeId));
    toast.success('Тема удалена');
  };

  const previewTheme = () => {
    // Apply temporary theme for preview
    document.documentElement.style.setProperty('--primary-color', customTheme.primaryColor);
    document.documentElement.style.setProperty('--secondary-color', customTheme.secondaryColor);
    document.documentElement.style.setProperty('--background-color', customTheme.backgroundColor);
    document.documentElement.style.setProperty('--text-color', customTheme.textColor);
    document.documentElement.style.setProperty('--accent-color', customTheme.accentColor);
    
    setPreviewMode(true);
    toast.info('Предварительный просмотр активирован');
  };

  const exitPreview = () => {
    // Restore current theme
    document.documentElement.style.setProperty('--primary-color', currentTheme.primaryColor);
    document.documentElement.style.setProperty('--secondary-color', currentTheme.secondaryColor);
    document.documentElement.style.setProperty('--background-color', currentTheme.backgroundColor);
    document.documentElement.style.setProperty('--text-color', currentTheme.textColor);
    document.documentElement.style.setProperty('--accent-color', currentTheme.accentColor);
    
    setPreviewMode(false);
    toast.info('Предварительный просмотр отключен');
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Palette className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Настройка тем</DialogTitle>
          <DialogDescription>
            Создайте свою пользовательскую тему или выберите из готовых
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="customize" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="customize">Создать</TabsTrigger>
            <TabsTrigger value="preset">Предустановки</TabsTrigger>
            <TabsTrigger value="saved">Сохраненные</TabsTrigger>
          </TabsList>
          
          <TabsContent value="customize" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <ColorPicker 
                label="Основной цвет" 
                color={customTheme.primaryColor} 
                onChange={(v) => updateThemeProperty('primaryColor', v)} 
              />
              <ColorPicker 
                label="Вторичный цвет" 
                color={customTheme.secondaryColor} 
                onChange={(v) => updateThemeProperty('secondaryColor', v)} 
              />
              <ColorPicker 
                label="Цвет фона" 
                color={customTheme.backgroundColor} 
                onChange={(v) => updateThemeProperty('backgroundColor', v)} 
              />
              <ColorPicker 
                label="Цвет текста" 
                color={customTheme.textColor} 
                onChange={(v) => updateThemeProperty('textColor', v)} 
              />
              <ColorPicker 
                label="Акцентный цвет" 
                color={customTheme.accentColor} 
                onChange={(v) => updateThemeProperty('accentColor', v)} 
              />
            </div>
            
            <div className="flex space-x-2 pt-4">
              <Input 
                placeholder="Название темы" 
                value={themeName} 
                onChange={(e) => setThemeName(e.target.value)} 
              />
              <Button onClick={saveTheme} disabled={!themeName.trim()}>
                <Save className="h-4 w-4 mr-2" />
                Сохранить
              </Button>
            </div>
            
            <div className="flex space-x-2 pt-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={previewMode ? exitPreview : previewTheme}
              >
                {previewMode ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" />
                    Отключить просмотр
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Предпросмотр
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setCustomTheme({ ...currentTheme })}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Сбросить
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="preset">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[300px] overflow-y-auto p-1">
              {Object.values(themes).map((theme) => (
                <div 
                  key={theme.id}
                  className="border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors"
                  style={{
                    backgroundColor: theme.backgroundColor,
                    color: theme.textColor,
                    borderColor: currentTheme.id === theme.id ? theme.primaryColor : 'transparent'
                  }}
                  onClick={() => applyTheme(theme)}
                >
                  <div className="text-center mb-2 font-medium">{theme.name}</div>
                  <div className="flex justify-center space-x-2 mb-3">
                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: theme.primaryColor }}></div>
                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: theme.secondaryColor }}></div>
                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: theme.accentColor }}></div>
                  </div>
                  {currentTheme.id === theme.id && (
                    <div className="flex justify-center">
                      <span className="bg-opacity-80 px-2 py-0.5 rounded text-xs flex items-center" style={{ backgroundColor: theme.accentColor }}>
                        <Check className="h-3 w-3 mr-1" /> Активна
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="saved">
            {customThemes.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[300px] overflow-y-auto p-1">
                {customThemes.map((theme) => (
                  <div 
                    key={theme.id}
                    className="border rounded-lg p-3 relative hover:border-primary transition-colors"
                    style={{
                      backgroundColor: theme.backgroundColor,
                      color: theme.textColor,
                      borderColor: currentTheme.id === theme.id ? theme.primaryColor : 'transparent'
                    }}
                  >
                    <button 
                      className="absolute top-1 right-1 p-1 rounded-full bg-black bg-opacity-30 hover:bg-opacity-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteCustomTheme(theme.id);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </button>
                    
                    <div className="text-center mb-2 font-medium">{theme.name}</div>
                    <div className="flex justify-center space-x-2 mb-2">
                      <div className="w-5 h-5 rounded-full" style={{ backgroundColor: theme.primaryColor }}></div>
                      <div className="w-5 h-5 rounded-full" style={{ backgroundColor: theme.secondaryColor }}></div>
                      <div className="w-5 h-5 rounded-full" style={{ backgroundColor: theme.accentColor }}></div>
                    </div>
                    
                    <div className="flex justify-center space-x-2 mt-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full text-xs py-1 h-7"
                        style={{ borderColor: theme.accentColor, color: theme.textColor }}
                        onClick={() => applyTheme(theme)}
                      >
                        Применить
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <p>У вас пока нет сохраненных тем</p>
                <p className="text-sm mt-2">Создайте свою тему во вкладке "Создать"</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => document.querySelector('[data-state="open"] button[aria-label="Close"]')?.dispatchEvent(new MouseEvent('click'))}>
            Закрыть
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
