
import React, { useState, useEffect } from 'react';
import { terminalService, TerminalLog } from '../services/terminalService';
import { useTheme } from '../context/ThemeContext';
import { AlertCircle, CheckCircle, Info, AlertTriangle, XCircle } from 'lucide-react';

interface TerminalLogsProps {
  maxHeight?: string;
}

export const TerminalLogs: React.FC<TerminalLogsProps> = ({ maxHeight = '400px' }) => {
  const { currentTheme } = useTheme();
  const [logs, setLogs] = useState<TerminalLog[]>([]);
  
  useEffect(() => {
    // Subscribe to terminal logs
    const unsubscribe = terminalService.addLogListener(newLogs => {
      setLogs(newLogs);
    });
    
    // Initialize with current logs
    setLogs(terminalService.getLogs());
    
    return () => {
      unsubscribe(); // Clean up on unmount
    };
  }, []);
  
  const getLogIcon = (level: TerminalLog['level']) => {
    switch (level) {
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'info':
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };
  
  const getLogClassName = (level: TerminalLog['level']) => {
    switch (level) {
      case 'error':
        return 'border-red-500 bg-red-500 bg-opacity-10';
      case 'warning':
        return 'border-yellow-500 bg-yellow-500 bg-opacity-10';
      case 'success':
        return 'border-green-500 bg-green-500 bg-opacity-10';
      case 'info':
      default:
        return 'border-blue-500 bg-blue-500 bg-opacity-5';
    }
  };
  
  return (
    <div 
      className="w-full overflow-y-auto border border-gray-800 rounded-md bg-slate-900"
      style={{ maxHeight }}
    >
      {logs.length > 0 ? (
        <div className="divide-y divide-gray-800">
          {logs.map((log) => (
            <div 
              key={log.id} 
              className={`p-2 border-l-4 ${getLogClassName(log.level)}`}
            >
              <div className="flex items-center">
                <div className="mr-2">
                  {getLogIcon(log.level)}
                </div>
                <div className="flex-grow">
                  <div className="text-sm">{log.message}</div>
                  <div className="text-xs text-gray-400">
                    {log.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 text-center text-gray-400">
          Нет доступных логов
        </div>
      )}
    </div>
  );
};
