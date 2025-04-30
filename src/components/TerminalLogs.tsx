
import React, { useState, useEffect } from 'react';
import { terminalService, TerminalLog } from '../services/terminalService';
import { useTheme } from '../context/ThemeContext';
import { AlertCircle, CheckCircle, Info, AlertTriangle, XCircle, Download, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';

interface TerminalLogsProps {
  maxHeight?: string;
  language?: 'en' | 'ru';
  autoscroll?: boolean;
  showTimestamps?: boolean;
  showClearButton?: boolean;
  onClear?: () => void;
}

export const TerminalLogs: React.FC<TerminalLogsProps> = ({ 
  maxHeight = '400px',
  language = 'ru',
  autoscroll = true,
  showTimestamps = true,
  showClearButton = false,
  onClear
}) => {
  const { currentTheme } = useTheme();
  const [logs, setLogs] = useState<TerminalLog[]>([]);
  const [filter, setFilter] = useState<TerminalLog['level'] | 'all'>('all');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const logsContainerRef = React.useRef<HTMLDivElement>(null);
  
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
  
  useEffect(() => {
    if (autoscroll && logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [logs, autoscroll]);
  
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
  
  const handleClearLogs = () => {
    terminalService.clearLogs();
    if (onClear) onClear();
    toast.success(language === 'ru' ? 'Логи очищены' : 'Logs cleared');
  };
  
  const handleExportLogs = () => {
    const logText = logs
      .filter(log => filter === 'all' || log.level === filter)
      .map(log => `[${log.timestamp.toLocaleTimeString()}] [${log.level.toUpperCase()}] ${log.message}`)
      .join('\n');
    
    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `terminal-logs-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success(language === 'ru' ? 'Логи экспортированы' : 'Logs exported');
  };
  
  const filteredLogs = filter === 'all' 
    ? logs 
    : logs.filter(log => log.level === filter);
  
  const renderEmptyState = () => (
    <div className="p-4 text-center text-gray-400">
      {language === 'ru' ? 'Нет доступных логов' : 'No logs available'}
    </div>
  );

  const refreshLogs = () => {
    // Re-fetch logs from service
    setLogs([...terminalService.getLogs()]);
    toast.info(language === 'ru' ? 'Логи обновлены' : 'Logs refreshed');
  };
  
  return (
    <div className="w-full flex flex-col">
      <div className="flex justify-between items-center mb-2 px-1">
        <div className="flex space-x-1">
          <Button 
            variant="outline" 
            size="sm" 
            className={filter === 'all' ? 'bg-slate-700' : ''}
            onClick={() => setFilter('all')}
          >
            {language === 'ru' ? 'Все' : 'All'}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className={filter === 'error' ? 'bg-red-900 bg-opacity-30' : ''}
            onClick={() => setFilter('error')}
          >
            {language === 'ru' ? 'Ошибки' : 'Errors'}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className={filter === 'warning' ? 'bg-yellow-900 bg-opacity-30' : ''}
            onClick={() => setFilter('warning')}
          >
            {language === 'ru' ? 'Предупреждения' : 'Warnings'}
          </Button>
        </div>
        <div className="flex space-x-1">
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8"
            onClick={refreshLogs}
            title={language === 'ru' ? 'Обновить' : 'Refresh'}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8"
            onClick={handleExportLogs}
            title={language === 'ru' ? 'Экспорт' : 'Export'}
          >
            <Download className="h-4 w-4" />
          </Button>
          
          {showClearButton && (
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8 text-red-400"
              onClick={handleClearLogs}
              title={language === 'ru' ? 'Очистить' : 'Clear'}
            >
              <XCircle className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      <div 
        ref={logsContainerRef}
        className="w-full overflow-y-auto border border-gray-800 rounded-md bg-slate-900"
        style={{ maxHeight }}
      >
        {filteredLogs.length > 0 ? (
          <div className="divide-y divide-gray-800">
            {filteredLogs.map((log) => (
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
                    {showTimestamps && (
                      <div className="text-xs text-gray-400">
                        {log.timestamp.toLocaleTimeString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          renderEmptyState()
        )}
      </div>
    </div>
  );
};
