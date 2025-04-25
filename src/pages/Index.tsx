
import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { CommandInput } from '@/components/CommandInput';
import { CommandOutput } from '@/components/CommandOutput';
import { NavigationBar } from '@/components/NavigationBar';
import { SettingsPanel } from '@/components/SettingsPanel';
import { AiWidget } from '@/components/AiWidget';
import { CommandProvider } from '@/context/CommandContext';

const Index = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  return (
    <CommandProvider>
      <div className="flex flex-col h-screen bg-rukod-dark">
        <Header />
        
        <main className="flex-1 flex flex-col overflow-hidden p-4">
          <CommandOutput />
          <div className="mt-4">
            <CommandInput />
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
