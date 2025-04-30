
import React, { useState, useEffect } from 'react';
import { terminalService, ContainerInfo } from '../services/terminalService';
import { useTheme } from '../context/ThemeContext';
import { Server, Power, Trash2, RotateCw } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';

export const ContainersList: React.FC = () => {
  const { currentTheme } = useTheme();
  const [containers, setContainers] = useState<ContainerInfo[]>([]);
  
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
      toast.success('Контейнер остановлен');
    } else {
      toast.error('Не удалось остановить контейнер');
    }
  };
  
  const handleRemoveContainer = (containerId: string) => {
    const success = terminalService.removeContainer(containerId);
    if (success) {
      toast.success('Контейнер удален');
    } else {
      toast.error('Не удалось удалить контейнер');
    }
  };
  
  const getUptime = (startTime: Date) => {
    const diff = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
    
    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    const seconds = diff % 60;
    
    return `${hours}h ${minutes}m ${seconds}s`;
  };
  
  const handleRefresh = () => {
    // Just trigger a re-render
    setContainers([...containers]);
  };
  
  return (
    <div className="border border-gray-800 rounded-md bg-slate-900">
      <div className="p-2 border-b border-gray-800 flex justify-between items-center">
        <div className="flex items-center">
          <Server className="h-4 w-4 mr-2" style={{ color: currentTheme.primaryColor }} />
          <h3 className="text-sm font-semibold" style={{ color: currentTheme.primaryColor }}>
            Запущенные контейнеры ({containers.length})
          </h3>
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          className="h-7 w-7"
          onClick={handleRefresh}
        >
          <RotateCw className="h-4 w-4" />
        </Button>
      </div>
      
      {containers.length > 0 ? (
        <div className="divide-y divide-gray-800">
          {containers.map((container) => (
            <div key={container.id} className="p-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center">
                    <div className={`h-2 w-2 rounded-full mr-2 ${container.status === 'running' ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                    <h4 className="font-semibold">{container.name}</h4>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">ID: {container.id.substring(0, 8)}...</div>
                </div>
                
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7"
                    disabled={container.status !== 'running'}
                    onClick={() => handleStopContainer(container.id)}
                  >
                    <Power className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 text-red-400"
                    onClick={() => handleRemoveContainer(container.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-slate-300">
                <div>
                  <span className="text-slate-400">Language:</span> {container.language}
                </div>
                <div>
                  <span className="text-slate-400">Status:</span> {container.status}
                </div>
                <div>
                  <span className="text-slate-400">Memory:</span> {container.memoryUsage}
                </div>
                <div>
                  <span className="text-slate-400">CPU:</span> {container.cpuUsage}
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400">Uptime:</span> {getUptime(container.startTime)}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 text-center text-gray-400">
          Нет запущенных контейнеров
        </div>
      )}
    </div>
  );
};
