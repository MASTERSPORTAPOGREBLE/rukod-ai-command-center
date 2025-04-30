
import React, { useState, useEffect } from 'react';
import { terminalService } from '../services/terminalService';
import { LogEntry } from '../models/types';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { LogItem } from './LogItem';
import { LogFilterBar } from './LogFilterBar';

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

  return (
    <div className="space-y-2">
      <LogFilterBar 
        filter={filter}
        setFilter={setFilter}
        levelFilter={levelFilter}
        setLevelFilter={setLevelFilter}
      />
      
      <div 
        className="space-y-2 overflow-y-auto" 
        style={{ maxHeight }}
      >
        {filteredLogs.length > 0 ? (
          [...filteredLogs].reverse().map(log => (
            <LogItem key={log.id} log={log} />
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
