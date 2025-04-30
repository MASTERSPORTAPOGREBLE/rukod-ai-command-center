
import React, { useState, useEffect } from 'react';
import { terminalService } from '../services/terminalService';
import { LogEntry } from '../models/types';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface TerminalLogsProps {
  maxHeight?: string;
}

export const TerminalLogs: React.FC<TerminalLogsProps> = ({ maxHeight = '400px' }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [filter, setFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState<string | null>(null);

  useEffect(() => {
    // Initial load
    setLogs(terminalService.getLogs());
    
    // Subscribe to logs updates
    const unsubscribe = terminalService.addLogListener(updatedLogs => {
      setLogs([...updatedLogs]);
    });
    
    return unsubscribe;
  }, []);
  
  // Apply filters whenever logs or filters change
  useEffect(() => {
    let result = [...logs];
    
    // Apply level filter
    if (levelFilter) {
      result = result.filter(log => log.level === levelFilter);
    }
    
    // Apply text filter
    if (filter) {
      const lowerFilter = filter.toLowerCase();
      result = result.filter(log => 
        log.message.toLowerCase().includes(lowerFilter) || 
        log.level.toLowerCase().includes(lowerFilter)
      );
    }
    
    setFilteredLogs(result);
  }, [logs, filter, levelFilter]);

  const getLogIcon = (level: string) => {
    switch(level) {
      case 'error': 
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'warning': 
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'success': 
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'info': 
      default: 
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };
  
  const getLogColor = (level: string) => {
    switch(level) {
      case 'error': return 'border-red-500 bg-red-500 bg-opacity-10';
      case 'warning': return 'border-yellow-500 bg-yellow-500 bg-opacity-10';
      case 'success': return 'border-green-500 bg-green-500 bg-opacity-10';
      case 'info': 
      default: return 'border-blue-500 bg-blue-500 bg-opacity-10';
    }
  };

  return (
    <div className="space-y-2">
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
      
      <div 
        className="space-y-2 overflow-y-auto" 
        style={{ maxHeight }}
      >
        {filteredLogs.length > 0 ? (
          [...filteredLogs].reverse().map(log => (
            <div 
              key={log.id}
              className={`p-2 rounded-md border ${getLogColor(log.level)} flex items-start`}
            >
              <div className="mr-2 mt-1">
                {getLogIcon(log.level)}
              </div>
              <div className="flex-grow">
                <div className="font-medium">{log.message}</div>
                <div className="text-xs text-gray-400">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-400">
            {logs.length === 0 ? 'Нет доступных логов' : 'Нет логов, соответствующих фильтрам'}
          </div>
        )}
      </div>
      
      <div className="text-xs text-gray-400">
        Всего логов: {logs.length}, Отображено: {filteredLogs.length}
      </div>
    </div>
  );
};
