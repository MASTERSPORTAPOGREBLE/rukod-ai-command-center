import React, { useState, useEffect } from 'react';
import { terminalService } from '../services/terminalService';
import { ContainerInfo, ProgrammingLanguage } from '../models/types';
import { useTheme } from '../context/ThemeContext';
import { Server, Power, Trash2, RotateCw, Info, Play, Terminal, FileCode, RefreshCw, Package, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';

interface ContainersListProps {
  language?: 'en' | 'ru';
  showControls?: boolean;
  maxHeight?: string;
  onContainerSelect?: (container: ContainerInfo) => void;
}

export const ContainersList: React.FC<ContainersListProps> = ({ 
  language = 'ru',
  showControls = true,
  maxHeight = '400px',
  onContainerSelect
}) => {
  const { currentTheme } = useTheme();
  const [containers, setContainers] = useState<ContainerInfo[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'running' | 'stopped'>('all');
  const [selectedContainer, setSelectedContainer] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'status' | 'memory' | 'cpu'>('status');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  useEffect(() => {
    // Subscribe to container updates
    const unsubscribe = terminalService.addContainerListener(newContainers => {
      setContainers(newContainers);
    });
    
    // Initialize with current containers
    setContainers(terminalService.getContainers());
    
    return () => {
      unsubscribe(); // Clean up on unmount
    };
  }, []);
  
  const handleStopContainer = (containerId: string) => {
    const success = terminalService.stopContainer(containerId);
    if (success) {
      toast.success(language === 'ru' ? 'Контейнер остановлен' : 'Container stopped');
    } else {
      toast.error(language === 'ru' ? 'Не удалось остановить контейнер' : 'Failed to stop container');
    }
  };
  
  const handleStartContainer = (containerId: string) => {
    // Assuming terminalService has a startContainer method
    const success = terminalService.startContainer?.(containerId) ?? false;
    if (success) {
      toast.success(language === 'ru' ? 'Контейнер запущен' : 'Container started');
    } else {
      toast.error(language === 'ru' ? 'Не удалось запустить контейнер' : 'Failed to start container');
    }
  };
  
  const handleRemoveContainer = (containerId: string) => {
    const success = terminalService.removeContainer(containerId);
    if (success) {
      toast.success(language === 'ru' ? 'Контейнер удален' : 'Container removed');
    } else {
      toast.error(language === 'ru' ? 'Не удалось удалить контейнер' : 'Failed to remove container');
    }
  };
  
  const handleInspectContainer = (containerId: string) => {
    const container = containers.find(c => c.id === containerId);
    if (container && onContainerSelect) {
      onContainerSelect(container);
    }
    
    setSelectedContainer(containerId);
    toast.info(language === 'ru' ? `Просмотр контейнера: ${container?.name}` : `Inspecting container: ${container?.name}`);
  };
  
  const getUptime = (startTime: Date) => {
    const diff = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
    
    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    const seconds = diff % 60;
    
    return `${hours}h ${minutes}m ${seconds}s`;
  };
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    
    // Simulate refresh delay
    setTimeout(() => {
      // Just trigger a re-render with current containers
      setContainers([...terminalService.getContainers()]);
      setIsRefreshing(false);
      toast.success(language === 'ru' ? 'Контейнеры обновлены' : 'Containers refreshed');
    }, 300);
  };
  
  const toggleSort = (field: 'name' | 'status' | 'memory' | 'cpu') => {
    if (sortBy === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to ascending
      setSortBy(field);
      setSortDirection('asc');
    }
  };
  
  const renderStatusBadge = (status: string) => {
    let color = '';
    
    switch (status) {
      case 'running':
        color = 'bg-green-500';
        break;
      case 'stopped':
        color = 'bg-red-500';
        break;
      case 'paused':
        color = 'bg-yellow-500';
        break;
      default:
        color = 'bg-gray-500';
    }
    
    return (
      <div className="flex items-center">
        <div className={`h-2 w-2 rounded-full mr-2 ${color}`}></div>
        <span>{status}</span>
      </div>
    );
  };
  
  const filteredContainers = containers.filter(container => {
    if (activeTab === 'all') return true;
    if (activeTab === 'running' && container.status === 'running') return true;
    if (activeTab === 'stopped' && container.status !== 'running') return true;
    return false;
  });
  
  const sortedContainers = [...filteredContainers].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'status':
        comparison = a.status.localeCompare(b.status);
        break;
      case 'memory':
        const memoryA = parseFloat(a.memoryUsage);
        const memoryB = parseFloat(b.memoryUsage);
        comparison = memoryA - memoryB;
        break;
      case 'cpu':
        const cpuA = parseFloat(a.cpuUsage.toString());
        const cpuB = parseFloat(b.cpuUsage.toString());
        comparison = cpuA - cpuB;
        break;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });
  
  return (
    <div className="border border-gray-800 rounded-md bg-slate-900">
      <div className="p-2 border-b border-gray-800">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <Server className="h-4 w-4 mr-2" style={{ color: currentTheme.primaryColor }} />
            <h3 className="text-sm font-semibold" style={{ color: currentTheme.primaryColor }}>
              {language === 'ru' ? 'Контейнеры' : 'Containers'} ({containers.length})
            </h3>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon"
            className="h-7 w-7"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? 
              <RefreshCw className="h-4 w-4 animate-spin" /> : 
              <RefreshCw className="h-4 w-4" />
            }
          </Button>
        </div>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={(value) => setActiveTab(value as 'all' | 'running' | 'stopped')}>
          <TabsList className="grid grid-cols-3 h-8">
            <TabsTrigger value="all" className="text-xs">
              {language === 'ru' ? 'Все' : 'All'}
            </TabsTrigger>
            <TabsTrigger value="running" className="text-xs">
              {language === 'ru' ? 'Запущенны��' : 'Running'}
            </TabsTrigger>
            <TabsTrigger value="stopped" className="text-xs">
              {language === 'ru' ? 'Остановленные' : 'Stopped'}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="overflow-y-auto" style={{ maxHeight }}>
        {sortedContainers.length > 0 ? (
          <div className="divide-y divide-gray-800">
            {sortedContainers.map((container) => (
              <div 
                key={container.id} 
                className={`p-3 cursor-pointer hover:bg-slate-800 ${selectedContainer === container.id ? 'bg-slate-800' : ''}`}
                onClick={() => handleInspectContainer(container.id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <div className={`h-2 w-2 rounded-full mr-2 ${container.status === 'running' ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                      <h4 className="font-semibold">{container.name}</h4>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">ID: {container.id.substring(0, 8)}...</div>
                  </div>
                  
                  {showControls && (
                    <div className="flex gap-1">
                      {container.status !== 'running' ? (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 text-green-400"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartContainer(container.id);
                          }}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStopContainer(container.id);
                          }}
                        >
                          <Power className="h-4 w-4" />
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 text-red-400"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveContainer(container.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-slate-300">
                  <div>
                    <span className="text-slate-400">{language === 'ru' ? 'Язык:' : 'Language:'}</span> {container.language}
                  </div>
                  <div>
                    <span className="text-slate-400">{language === 'ru' ? 'Статус:' : 'Status:'}</span> {container.status}
                  </div>
                  <div>
                    <span className="text-slate-400">{language === 'ru' ? 'Память:' : 'Memory:'}</span> {container.memoryUsage}
                  </div>
                  <div>
                    <span className="text-slate-400">{language === 'ru' ? 'CPU:' : 'CPU:'}</span> {container.cpuUsage.toString()}
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400">{language === 'ru' ? 'Время работы:' : 'Uptime:'}</span> {getUptime(container.startTime)}
                  </div>
                </div>
                
                <div className="flex mt-2 space-x-1">
                  <Badge variant="outline" className="text-xs">{container.language}</Badge>
                  {container.tags?.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-gray-400">
            {language === 'ru' ? 'Нет контейнеров' : 'No containers'}
          </div>
        )}
      </div>
    </div>
  );
};
