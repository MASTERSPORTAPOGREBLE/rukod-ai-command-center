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

export interface LibraryFiltersProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  selectedLanguage: ProgrammingLanguage;
  setSelectedLanguage: React.Dispatch<React.SetStateAction<ProgrammingLanguage>>;
  sortOption: string;
  setSortOption: React.Dispatch<React.SetStateAction<string>>;
  filterStable: boolean;
  setFilterStable: React.Dispatch<React.SetStateAction<boolean>>;
  filterPopular: boolean;
  setFilterPopular: React.Dispatch<React.SetStateAction<boolean>>;
  filterNew: boolean;
  setFilterNew: React.Dispatch<React.SetStateAction<boolean>>;
  showGameLibraries: boolean;
  setShowGameLibraries: React.Dispatch<React.SetStateAction<boolean>>;
}

export const LibraryFilters: React.FC<LibraryFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  selectedLanguage,
  setSelectedLanguage,
  sortOption,
  setSortOption,
  filterStable,
  setFilterStable,
  filterPopular,
  setFilterPopular,
  filterNew,
  setFilterNew,
  showGameLibraries,
  setShowGameLibraries
}) => {
  const { currentTheme } = useTheme();
  
  const handleReset = () => {
    setSearchTerm('');
    setSelectedLanguage('all');
    setSortOption('popular');
    setFilterStable(false);
    setFilterPopular(true);
    setFilterNew(false);
    setShowGameLibraries(false);
  };

  return (
    <div className="mb-6 space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Поиск библиотек..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
          style={{
            backgroundColor: currentTheme.backgroundColor,
            color: currentTheme.textColor,
            borderColor: currentTheme.primaryColor
          }}
        />
      </div>
      
      <Tabs defaultValue={selectedLanguage} onValueChange={(value) => setSelectedLanguage(value as ProgrammingLanguage)}>
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
      
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Switch 
            id="stable" 
            checked={filterStable} 
            onCheckedChange={setFilterStable}
          />
          <Label htmlFor="stable">Только стабильные</Label>
        </div>
        
        <div className="flex items-center gap-2">
          <Switch 
            id="popular" 
            checked={filterPopular} 
            onCheckedChange={setFilterPopular}
          />
          <Label htmlFor="popular">Только популярные</Label>
        </div>
        
        <div className="flex items-center gap-2">
          <Switch 
            id="new" 
            checked={filterNew} 
            onCheckedChange={setFilterNew}
          />
          <Label htmlFor="new">Только новые</Label>
        </div>
        
        <div className="flex items-center gap-2">
          <Switch 
            id="game-libraries" 
            checked={showGameLibraries} 
            onCheckedChange={setShowGameLibraries}
          />
          <Label htmlFor="game-libraries">Только для игр</Label>
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
