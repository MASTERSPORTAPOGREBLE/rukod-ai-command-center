
import React, { useState, useEffect } from 'react';
import { terminalService, TerminalLog } from '../services/terminalService';
import { useTheme } from '../context/ThemeContext';
import { AlertCircle, CheckCircle, Info, AlertTriangle, XCircle, Download, RefreshCw, Filter, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card } from './ui/card';
import { ScrollArea } from './ui/scroll-area';

interface TerminalLogsProps {
  maxHeight?: string;
  language?: 'en' | 'ru';
  autoscroll?: boolean;
  showTimestamps?: boolean;
  showClearButton?: boolean;
  onClear?: () => void;
  viewMode?: 'simple' | 'detailed' | 'compact';
}

export const TerminalLogs: React.FC<TerminalLogsProps> = ({ 
  maxHeight = '400px',
  language = 'ru',
  autoscroll = true,
  showTimestamps = true,
  showClearButton = false,
  onClear,
  viewMode = 'detailed'
}) => {
  const { currentTheme } = useTheme();
  const [logs, setLogs] = useState<TerminalLog[]>([]);
  const [filter, setFilter] = useState<TerminalLog['level'] | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [timeFilter, setTimeFilter] = useState<'all' | '1h' | '24h' | '7d'>('all');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('logs');
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

  const getTimeFilteredLogs = (logs: TerminalLog[]) => {
    if (timeFilter === 'all') return logs;
    
    const now = new Date();
    let threshold: Date;
    
    switch (timeFilter) {
      case '1h':
        threshold = new Date(now.getTime() - 3600000); // 1 hour ago
        break;
      case '24h':
        threshold = new Date(now.getTime() - 86400000); // 24 hours ago
        break;
      case '7d':
        threshold = new Date(now.getTime() - 604800000); // 7 days ago
        break;
      default:
        return logs;
    }
    
    return logs.filter(log => log.timestamp >= threshold);
  };
  
  const handleClearLogs = () => {
    terminalService.clearLogs();
    if (onClear) onClear();
    toast.success(language === 'ru' ? 'Логи очищены' : 'Logs cleared');
  };
  
  const handleExportLogs = () => {
    const filteredLogs = getTimeFilteredLogs(
      filter === 'all' ? logs : logs.filter(log => log.level === filter)
    );
    
    const logText = filteredLogs
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
  
  const filteredLogs = getTimeFilteredLogs(
    filter === 'all' ? logs : logs.filter(log => log.level === filter)
  );
  
  const renderEmptyState = () => (
    <div className="p-4 text-center text-gray-400">
      {language === 'ru' ? 'Нет доступных логов' : 'No logs available'}
    </div>
  );

  const getLogCount = (level: TerminalLog['level'] | 'all') => {
    if (level === 'all') return logs.length;
    return logs.filter(log => log.level === level).length;
  };

  const refreshLogs = () => {
    // Re-fetch logs from service
    setLogs([...terminalService.getLogs()]);
    toast.info(language === 'ru' ? 'Логи обновлены' : 'Logs refreshed');
  };

  const renderFilters = () => (
    <div className={`mb-2 ${showFilters ? 'block' : 'hidden'}`}>
      <div className="flex flex-wrap gap-2 p-2 bg-slate-800 rounded-md">
        <div>
          <span className="text-xs text-gray-400 mr-2">{language === 'ru' ? 'Время:' : 'Time:'}</span>
          <div className="flex space-x-1">
            {['all', '1h', '24h', '7d'].map((time) => (
              <Button 
                key={time}
                variant="ghost" 
                size="sm"
                className={`text-xs py-1 px-2 h-7 ${timeFilter === time ? 'bg-blue-900 bg-opacity-30' : ''}`}
                onClick={() => setTimeFilter(time as 'all' | '1h' | '24h' | '7d')}
              >
                {time === 'all' ? (language === 'ru' ? 'Все' : 'All') : time}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
  
  const renderLogEntry = (log: TerminalLog) => {
    switch (viewMode) {
      case 'compact':
        return (
          <div className="flex items-center text-xs p-1">
            <span className="mr-1">{getLogIcon(log.level)}</span>
            <span className="flex-grow truncate">{log.message}</span>
            {showTimestamps && (
              <span className="text-gray-400 ml-2">
                {log.timestamp.toLocaleTimeString()}
              </span>
            )}
          </div>
        );
      case 'simple':
        return (
          <div className="flex items-center p-1.5">
            <span className="mr-2">{getLogIcon(log.level)}</span>
            <span className="flex-grow">{log.message}</span>
          </div>
        );
      case 'detailed':
      default:
        return (
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
        );
    }
  };
  
  return (
    <div className="w-full flex flex-col">
      <Tabs defaultValue="logs" className="w-full" onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-2">
          <TabsList>
            <TabsTrigger value="logs">
              {language === 'ru' ? 'Логи' : 'Logs'}
              <Badge className="ml-1 bg-slate-700">{logs.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="stats">
              {language === 'ru' ? 'Статистика' : 'Stats'}
            </TabsTrigger>
            <TabsTrigger value="settings">
              {language === 'ru' ? 'Настройки' : 'Settings'}
            </TabsTrigger>
          </TabsList>
          
          <div className="flex space-x-1">
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8"
              onClick={() => setShowFilters(!showFilters)}
              title={language === 'ru' ? 'Фильтры' : 'Filters'}
            >
              <Filter className="h-4 w-4" />
            </Button>
            
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
        
        {renderFilters()}
        
        <TabsContent value="logs" className="mt-0">
          <div className="flex space-x-1 mb-2">
            <Button 
              variant="outline" 
              size="sm" 
              className={filter === 'all' ? 'bg-slate-700' : ''}
              onClick={() => setFilter('all')}
            >
              {language === 'ru' ? 'Все' : 'All'}
              <Badge className="ml-1 bg-slate-600">{getLogCount('all')}</Badge>
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className={filter === 'error' ? 'bg-red-900 bg-opacity-30' : ''}
              onClick={() => setFilter('error')}
            >
              {language === 'ru' ? 'Ошибки' : 'Errors'}
              <Badge className="ml-1 bg-red-900">{getLogCount('error')}</Badge>
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className={filter === 'warning' ? 'bg-yellow-900 bg-opacity-30' : ''}
              onClick={() => setFilter('warning')}
            >
              {language === 'ru' ? 'Предупреждения' : 'Warnings'}
              <Badge className="ml-1 bg-yellow-900">{getLogCount('warning')}</Badge>
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className={filter === 'success' ? 'bg-green-900 bg-opacity-30' : ''}
              onClick={() => setFilter('success')}
            >
              {language === 'ru' ? 'Успехи' : 'Success'}
              <Badge className="ml-1 bg-green-900">{getLogCount('success')}</Badge>
            </Button>
          </div>

          <ScrollArea 
            className="w-full border border-gray-800 rounded-md bg-slate-900"
            style={{ height: maxHeight }}
          >
            <div ref={logsContainerRef}>
              {filteredLogs.length > 0 ? (
                <div className="divide-y divide-gray-800">
                  {filteredLogs.map((log) => (
                    <div 
                      key={log.id} 
                      className={`p-2 border-l-4 ${getLogClassName(log.level)}`}
                    >
                      {renderLogEntry(log)}
                    </div>
                  ))}
                </div>
              ) : (
                renderEmptyState()
              )}
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="stats" className="mt-0">
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-3">
              {language === 'ru' ? 'Статистика логов' : 'Log Statistics'}
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>{language === 'ru' ? 'Всего логов:' : 'Total logs:'}</span>
                <span className="font-mono">{logs.length}</span>
              </div>
              <div className="flex justify-between">
                <span>{language === 'ru' ? 'Ошибки:' : 'Errors:'}</span>
                <span className="font-mono text-red-400">{getLogCount('error')}</span>
              </div>
              <div className="flex justify-between">
                <span>{language === 'ru' ? 'Предупреждения:' : 'Warnings:'}</span>
                <span className="font-mono text-yellow-400">{getLogCount('warning')}</span>
              </div>
              <div className="flex justify-between">
                <span>{language === 'ru' ? 'Успехи:' : 'Success:'}</span>
                <span className="font-mono text-green-400">{getLogCount('success')}</span>
              </div>
              <div className="flex justify-between">
                <span>{language === 'ru' ? 'Информация:' : 'Info:'}</span>
                <span className="font-mono text-blue-400">{getLogCount('info')}</span>
              </div>
              <div className="mt-4 pt-2 border-t border-gray-700">
                <span className="text-sm text-gray-400">
                  {language === 'ru' 
                    ? `Последнее обновление: ${new Date().toLocaleTimeString()}`
                    : `Last updated: ${new Date().toLocaleTimeString()}`
                  }
                </span>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="mt-0">
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-3">
              {language === 'ru' ? 'Настройки отображения' : 'Display Settings'}
            </h3>
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="text-sm font-medium">
                  {language === 'ru' ? 'Режим отображения:' : 'Display Mode:'}
                </div>
                <div className="flex flex-wrap gap-2">
                  {['detailed', 'simple', 'compact'].map((mode) => (
                    <Button 
                      key={mode}
                      variant={viewMode === mode ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        // In a real implementation, this would update the viewMode prop
                        toast.info(`${mode} view selected. This would be saved in a real implementation.`);
                      }}
                    >
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="text-sm font-medium">
                  {language === 'ru' ? 'Автопрокрутка:' : 'Auto-scroll:'}
                </div>
                <Button
                  variant={autoscroll ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    // In a real implementation, this would toggle the autoscroll prop
                    toast.info(`Auto-scroll would be ${!autoscroll ? 'enabled' : 'disabled'} in a real implementation.`);
                  }}
                >
                  {autoscroll 
                    ? (language === 'ru' ? 'Включено' : 'Enabled') 
                    : (language === 'ru' ? 'Выключено' : 'Disabled')
                  }
                </Button>
              </div>
              
              <div className="space-y-1">
                <div className="text-sm font-medium">
                  {language === 'ru' ? 'Показывать метки времени:' : 'Show timestamps:'}
                </div>
                <Button
                  variant={showTimestamps ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    // In a real implementation, this would toggle the showTimestamps prop
                    toast.info(`Timestamps would be ${!showTimestamps ? 'shown' : 'hidden'} in a real implementation.`);
                  }}
                >
                  {showTimestamps 
                    ? (language === 'ru' ? 'Включено' : 'Enabled') 
                    : (language === 'ru' ? 'Выключено' : 'Disabled')
                  }
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
