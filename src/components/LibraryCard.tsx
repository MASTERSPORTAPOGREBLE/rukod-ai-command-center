import React from 'react';
import { Card, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Download, ExternalLink, Info } from 'lucide-react';
import { Library } from '../models/types';

export interface LibraryCardProps {
  library: Library;
  onSelect: () => void;  // Add this missing prop
  onInstall: () => Promise<void>;
}

export const LibraryCard: React.FC<LibraryCardProps> = ({ library, onSelect, onInstall }) => {
  return (
    <Card className="bg-slate-900 border border-slate-800 shadow-sm rounded-lg">
      <CardContent className="p-4 space-y-2">
        <h3 className="text-lg font-semibold">{library.name}</h3>
        <p className="text-sm text-muted-foreground">{library.description.substring(0, 60)}...</p>
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <span>{library.language}</span>
          <span>v{library.version}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center p-4">
        <Button variant="outline" size="sm" onClick={onSelect}>
          <Info className="h-4 w-4 mr-2" />
          Подробнее
        </Button>
        <Button size="sm" onClick={onInstall}>
          <Download className="h-4 w-4 mr-2" />
          Установить
        </Button>
      </CardFooter>
    </Card>
  );
};
