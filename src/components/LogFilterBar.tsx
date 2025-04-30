
import React from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface LogFilterBarProps {
  filter: string;
  setFilter: (value: string) => void;
  levelFilter: string | null;
  setLevelFilter: (value: string | null) => void;
}

export const LogFilterBar: React.FC<LogFilterBarProps> = ({ 
  filter, 
  setFilter, 
  levelFilter, 
  setLevelFilter 
}) => {
  return (
    <div className="flex space-x-2 items-center">
      <Input
        type="text"
        placeholder="Поиск по логам..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="flex-grow"
      />
      
      <div className="flex space-x-1">
        <Button
          size="sm"
          variant={levelFilter === null ? 'default' : 'outline'}
          onClick={() => setLevelFilter(null)}
          className="text-xs"
        >
          Все
        </Button>
        <Button
          size="sm"
          variant={levelFilter === 'info' ? 'default' : 'outline'}
          onClick={() => setLevelFilter('info')}
          className="text-xs text-blue-500"
        >
          Инфо
        </Button>
        <Button
          size="sm"
          variant={levelFilter === 'success' ? 'default' : 'outline'}
          onClick={() => setLevelFilter('success')}
          className="text-xs text-green-500"
        >
          Успех
        </Button>
        <Button
          size="sm"
          variant={levelFilter === 'warning' ? 'default' : 'outline'}
          onClick={() => setLevelFilter('warning')}
          className="text-xs text-yellow-500"
        >
          Предупр.
        </Button>
        <Button
          size="sm"
          variant={levelFilter === 'error' ? 'default' : 'outline'}
          onClick={() => setLevelFilter('error')}
          className="text-xs text-red-500"
        >
          Ошибка
        </Button>
      </div>
    </div>
  );
};
