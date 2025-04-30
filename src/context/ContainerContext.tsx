import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { ContainerInfo, ProgrammingLanguage } from '../models/types';
import { v4 as uuidv4 } from 'uuid';

interface ContainerContextType {
  containers: ContainerInfo[];
  activeContainer: ContainerInfo | null;
  loadContainer: (language: ProgrammingLanguage) => Promise<ContainerInfo>;
  stopContainer: (containerId: string) => Promise<boolean>;
  restartContainer: (containerId: string) => Promise<boolean>;
  getContainerStatus: (language: ProgrammingLanguage) => ContainerInfo | null;
}

const ContainerContext = createContext<ContainerContextType | undefined>(undefined);

// Mock function to simulate container operations
const mockContainerOperation = async (delay: number = 1000): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), delay);
  });
};

export function ContainerProvider({ children }: { children: ReactNode }) {
  const [containers, setContainers] = useState<ContainerInfo[]>([]);
  const [activeContainer, setActiveContainer] = useState<ContainerInfo | null>(null);

  // Mock implementation of container management
  const loadContainer = async (language: ProgrammingLanguage): Promise<ContainerInfo> => {
    console.log(`[Container] Loading container for ${language}...`);
    
    // Check if container already exists
    const existing = containers.find(c => c.language === language);
    if (existing) {
      setActiveContainer(existing);
      return existing;
    }
    
    // Mock container creation
    await mockContainerOperation(2000);
    
    const createContainer = (name: string, language: ProgrammingLanguage) => {
      const newContainer: ContainerInfo = {
        id: uuidv4(),
        name,
        language,
        status: 'ready',
        memoryUsage: 0,
        cpuUsage: 0,
        startTime: new Date() // Add this line
      };
      
      setContainers(prev => [...prev, newContainer]);
      setActiveContainer(newContainer);
      
      return newContainer;
    };
    
    const newContainer = createContainer(`${language}-container`, language);
    
    return newContainer;
  };
  
  const stopContainer = async (containerId: string): Promise<boolean> => {
    console.log(`[Container] Stopping container ${containerId}...`);
    await mockContainerOperation();
    
    setContainers(prev => 
      prev.map(c => c.id === containerId ? { ...c, status: 'stopped' } : c)
    );
    
    if (activeContainer?.id === containerId) {
      setActiveContainer(null);
    }
    
    return true;
  };
  
  const restartContainer = async (containerId: string): Promise<boolean> => {
    console.log(`[Container] Restarting container ${containerId}...`);
    await mockContainerOperation();
    
    setContainers(prev => 
      prev.map(c => c.id === containerId ? { ...c, status: 'running' } : c)
    );
    
    return true;
  };
  
  const getContainerStatus = (language: ProgrammingLanguage): ContainerInfo | null => {
    return containers.find(c => c.language === language) || null;
  };
  
  // Simulate resource monitoring for running containers
  useEffect(() => {
    const interval = setInterval(() => {
      setContainers(prev => 
        prev.map(c => {
          if (c.status === 'running') {
            return {
              ...c,
              memoryUsage: Math.min(100, c.memoryUsage + (Math.random() * 10 - 5)),
              cpuUsage: Math.min(100, c.cpuUsage + (Math.random() * 10 - 5))
            };
          }
          return c;
        })
      );
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <ContainerContext.Provider 
      value={{ 
        containers, 
        activeContainer, 
        loadContainer, 
        stopContainer, 
        restartContainer, 
        getContainerStatus 
      }}>
      {children}
    </ContainerContext.Provider>
  );
}

export function useContainer() {
  const context = useContext(ContainerContext);
  if (context === undefined) {
    throw new Error('useContainer must be used within a ContainerProvider');
  }
  return context;
}
