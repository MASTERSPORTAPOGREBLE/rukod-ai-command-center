
import React, { useState } from 'react';
import { terminalService } from '../services/terminalService';
import { ContainerInfo, ProgrammingLanguage } from '../models/types';
import { Cpu, Memory, Play, Stop, Trash2, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RunButton } from './ui/terminal-button';

interface ContainersListProps {
  selectedLanguage?: ProgrammingLanguage | null;
}

export const ContainersList: React.FC<ContainersListProps> = ({
  selectedLanguage,
}) => {
  const [containers, setContainers] = useState<ContainerInfo[]>(
    terminalService.getContainers()
  );
  const [selectedContainer, setSelectedContainer] = useState<string | null>(null);

  // Subscribe to container updates
  React.useEffect(() => {
    const unsubscribe = terminalService.addContainerListener((updatedContainers) => {
      setContainers([...updatedContainers]);
    });
    
    return unsubscribe;
  }, []);
  
  const filteredContainers = selectedLanguage 
    ? containers.filter(c => c.language === selectedLanguage)
    : containers;

  // Start container function
  const handleStartContainer = (containerId: string) => {
    terminalService.startContainer(containerId);
  };
  
  // Stop container function
  const handleStopContainer = (containerId: string) => {
    terminalService.stopContainer(containerId);
  };
  
  // Remove container function
  const handleRemoveContainer = (containerId: string) => {
    terminalService.removeContainer(containerId);
  };
  
  // Create new container
  const handleCreateContainer = (language: ProgrammingLanguage) => {
    // Use the execute command function to create a new container
    terminalService.executeCommand(`container start ${language}`);
  };

  const getContainerStatus = (status: string) => {
    if (status === 'running') {
      return <Badge className="bg-green-600">Running</Badge>;
    } else {
      return <Badge variant="outline">Stopped</Badge>;
    }
  };

  const getProgrammingLanguageColor = (language: ProgrammingLanguage) => {
    switch(language) {
      case 'python': return 'bg-blue-500';
      case 'cpp': return 'bg-purple-500';
      case 'lua': return 'bg-yellow-500';
      case 'javascript': return 'bg-amber-500';
      case 'rust': return 'bg-orange-500';
      case 'ruby': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  // Get container runtime info
  const getContainerRuntime = (container: ContainerInfo) => {
    if (container.status !== 'running') return '—';
    
    const now = new Date();
    const startTime = new Date(container.startTime);
    const diffMs = now.getTime() - startTime.getTime();
    
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
        <RunButton
          onClick={() => handleCreateContainer('python')}
        >
          Start Python
        </RunButton>
        <RunButton
          onClick={() => handleCreateContainer('cpp')}
        >
          Start C++
        </RunButton>
        <RunButton
          onClick={() => handleCreateContainer('lua')}
        >
          Start Lua
        </RunButton>
        <RunButton
          onClick={() => handleCreateContainer('javascript')}
        >
          Start JavaScript
        </RunButton>
        <RunButton
          onClick={() => handleCreateContainer('rust')}
        >
          Start Rust
        </RunButton>
      </div>
      
      {filteredContainers.length > 0 ? (
        <div className="space-y-2">
          {filteredContainers.map((container) => (
            <div 
              key={container.id}
              className={`p-3 border rounded-md transition-colors ${
                selectedContainer === container.id 
                  ? 'border-rukod-purple bg-rukod-purple bg-opacity-10' 
                  : 'border-gray-800 hover:border-rukod-purple'
              }`}
              onClick={() => setSelectedContainer(
                selectedContainer === container.id ? null : container.id
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`rounded-md w-3 h-3 mr-2 ${getProgrammingLanguageColor(container.language)}`}></div>
                  <span className="font-medium">{container.name}</span>
                  <span className="text-xs text-gray-400 ml-2">{container.id}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {getContainerStatus(container.status)}
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                <div className="flex items-center">
                  <Cpu className="w-4 h-4 mr-2 text-gray-400" />
                  <span>CPU: {container.cpuUsage.toFixed(1)}%</span>
                </div>
                <div className="flex items-center">
                  <Memory className="w-4 h-4 mr-2 text-gray-400" />
                  <span>Memory: {container.memoryUsage.toFixed(1)} MB</span>
                </div>
                <div className="flex items-center">
                  <Play className="w-4 h-4 mr-2 text-gray-400" />
                  <span>Runtime: {getContainerRuntime(container)}</span>
                </div>
                {container.tags && (
                  <div className="flex items-center">
                    <Tag className="w-4 h-4 mr-2 text-gray-400" />
                    <div className="flex flex-wrap gap-1">
                      {container.tags.map((tag, i) => (
                        <span key={i} className="text-xs bg-gray-800 px-1.5 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-2 mt-3">
                {container.status === 'stopped' ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartContainer(container.id);
                    }}
                    className="text-green-500 border-green-500 hover:bg-green-900 hover:bg-opacity-20"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStopContainer(container.id);
                    }}
                    className="text-amber-500 border-amber-500 hover:bg-amber-900 hover:bg-opacity-20"
                  >
                    <Stop className="w-4 h-4 mr-2" />
                    Stop
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveContainer(container.id);
                  }}
                  className="text-red-500 border-red-500 hover:bg-red-900 hover:bg-opacity-20"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400">
          {selectedLanguage 
            ? `No ${selectedLanguage} containers found` 
            : 'No containers found'}
        </div>
      )}
    </div>
  );
};
