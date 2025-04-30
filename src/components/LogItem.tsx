
import React from 'react';
import { LogEntry } from '../models/types';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

interface LogItemProps {
  log: LogEntry;
}

export const LogItem: React.FC<LogItemProps> = ({ log }) => {
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
    <div 
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
  );
};
