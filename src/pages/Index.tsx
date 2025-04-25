
import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { CommandInput } from '@/components/CommandInput';
import { CommandOutput } from '@/components/CommandOutput';
import { NavigationBar } from '@/components/NavigationBar';
import { SettingsPanel } from '@/components/SettingsPanel';
import { AiWidget } from '@/components/AiWidget';
import { CommandProvider } from '@/context/CommandContext';

const Index = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Loading screen
  if (isLoading) {
    return (
      <div className="flex flex-col h-screen bg-rukod-dark items-center justify-center">
        <div className="text-rukod-purple text-4xl font-bold mb-4 animate-pulse">РУКОД</div>
        <div className="text-white text-xl mb-8">AI Command Center</div>
        <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-rukod-purple animate-[slide-in-right_1.5s_ease-in-out]"></div>
        </div>
      </div>
    );
  }
  
  // Main application
  return (
    <CommandProvider>
      <div className="flex flex-col h-screen bg-rukod-dark animate-fade-in">
        <Header />
        
        <main className="flex-1 flex flex-col overflow-hidden p-4">
          <div className="mb-2 px-2 flex items-center">
            <span className="text-xs text-gray-400">РУКОД IDE v0.1.0</span>
            <span className="mx-2 text-gray-600">|</span>
            <span className="text-xs text-green-500">● Система активна</span>
          </div>
          
          <CommandOutput />
          <div className="mt-4">
            <CommandInput />
          </div>
          
          <div className="w-full text-center mt-2">
            <span className="text-xs text-gray-500">Нажмите Tab для автодополнения, используйте стрелки вверх/вниз для истории команд</span>
          </div>
        </main>
        
        <NavigationBar />
        
        <SettingsPanel isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
        <AiWidget />
      </div>
    </CommandProvider>
  );
};

export default Index;
