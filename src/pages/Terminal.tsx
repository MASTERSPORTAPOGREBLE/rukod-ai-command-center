
import React, { useState } from 'react';
import { CommandInput } from '../components/CommandInput';
import { CommandOutput } from '../components/CommandOutput';
import { SystemStats } from '../components/SystemStats';
import { useTheme } from '../context/ThemeContext';
import { Cpu, Code, Terminal as TerminalIcon } from 'lucide-react';

const Terminal = () => {
  const { currentTheme } = useTheme();
  const [terminalInfo, setTerminalInfo] = useState({
    version: '1.0.0',
    status: 'active'
  });
  
  return (
    <div className="flex flex-col h-screen animate-fade-in bg-rukod-dark">
      <header className="p-4 border-b border-gray-800">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <TerminalIcon 
              className="h-6 w-6 mr-2" 
              style={{ color: currentTheme.primaryColor }} 
            />
            <h1 className="text-xl font-bold" style={{ color: currentTheme.primaryColor }}>
              CodeVerse Terminal
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Cpu className="h-4 w-4" style={{ color: currentTheme.accentColor }} />
              <span className="text-xs text-gray-400">v{terminalInfo.version}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              <span className="text-xs text-gray-400">{terminalInfo.status}</span>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col overflow-hidden p-4">
        <div className="mb-4">
          <SystemStats />
        </div>
        
        <CommandOutput />
        
        <div className="mt-4">
          <CommandInput />
        </div>
        
        <div className="w-full text-center mt-2">
          <span className="text-xs text-gray-500">
            Введите "помощь" для просмотра доступных команд
          </span>
        </div>
      </main>
    </div>
  );
};

export default Terminal;
