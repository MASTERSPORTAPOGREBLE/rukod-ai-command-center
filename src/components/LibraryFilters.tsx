
import React from 'react';
import { ProgrammingLanguage } from '../models/types';
import { useTheme } from '../context/ThemeContext';
import { Search, Flame, Code, Filter, BookOpen, Globe, Gamepad2, ChartBar, Layout } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Badge } from './ui/badge';

interface LibraryFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedLanguage: ProgrammingLanguage | undefined;
  onLanguageChange: (language?: ProgrammingLanguage) => void;
  showFreeOnly: boolean;
  onFreeOnlyChange: (value: boolean) => void;
  showGamesOnly: boolean;
  onGamesOnlyChange: (value: boolean) => void;
  selectedCategory?: string;
  onCategoryChange?: (category?: string) => void;
}

export const LibraryFilters: React.FC<LibraryFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedLanguage,
  onLanguageChange,
  showFreeOnly,
  onFreeOnlyChange,
  showGamesOnly,
  onGamesOnlyChange,
  selectedCategory,
  onCategoryChange
}) => {
  const { currentTheme } = useTheme();
  
  const handleReset = () => {
    onSearchChange('');
    onLanguageChange(undefined);
    onFreeOnlyChange(false);
    onGamesOnlyChange(false);
    if (onCategoryChange) onCategoryChange(undefined);
  };

  const categories = [
    { id: 'machine-learning', name: 'Машинное обучение', icon: ChartBar },
    { id: 'web-dev', name: 'Веб-разработка', icon: Globe },
    { id: 'game-dev', name: 'Игровая разработка', icon: Gamepad2 },
    { id: 'data-science', name: 'Обработка данных', icon: BookOpen },
    { id: 'gui', name: 'Интерфейсы', icon: Layout }
  ];
  
  return (
    <div className="mb-6 space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Поиск библиотек..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
          style={{
            backgroundColor: currentTheme.backgroundColor,
            color: currentTheme.textColor,
            borderColor: currentTheme.primaryColor
          }}
        />
      </div>
      
      <Tabs defaultValue={selectedLanguage || "all"} onValueChange={(value) => 
        onLanguageChange(value === "all" ? undefined : value as ProgrammingLanguage)}>
        <TabsList className="w-full grid grid-cols-8">
          <TabsTrigger value="all">Все</TabsTrigger>
          <TabsTrigger value="python">Python</TabsTrigger>
          <TabsTrigger value="cpp">C++</TabsTrigger>
          <TabsTrigger value="lua">Lua</TabsTrigger>
          <TabsTrigger value="javascript">JS</TabsTrigger>
          <TabsTrigger value="rust">Rust</TabsTrigger>
          <TabsTrigger value="ruby">Ruby</TabsTrigger>
          <TabsTrigger value="more">Ещё...</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <Badge 
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            className="cursor-pointer flex items-center gap-1 px-3 py-1"
            onClick={() => onCategoryChange && onCategoryChange(
              selectedCategory === category.id ? undefined : category.id
            )}
          >
            <category.icon className="h-3 w-3" />
            <span>{category.name}</span>
          </Badge>
        ))}
      </div>
      
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Switch 
            id="free-only" 
            checked={showFreeOnly} 
            onCheckedChange={onFreeOnlyChange}
          />
          <Label htmlFor="free-only">Только бесплатные</Label>
        </div>
        
        <div className="flex items-center gap-2">
          <Switch 
            id="games-only" 
            checked={showGamesOnly} 
            onCheckedChange={onGamesOnlyChange}
          />
          <Label htmlFor="games-only">Для игр</Label>
        </div>
      </div>
      
      <div className="flex justify-between gap-2">
        <Button variant="outline" className="w-1/2"
                onClick={handleReset}
                style={{ borderColor: currentTheme.primaryColor, color: currentTheme.primaryColor }}>
          <Filter className="h-4 w-4 mr-2" />
          Сбросить
        </Button>
        
        <Button className="w-1/2"
                style={{ backgroundColor: currentTheme.primaryColor, color: currentTheme.backgroundColor }}>
          <Search className="h-4 w-4 mr-2" />
          Найти все
        </Button>
      </div>
    </div>
  );
};
