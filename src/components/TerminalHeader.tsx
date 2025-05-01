
import React from 'react';
import { Cpu, Code, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface TerminalHeaderProps {
  currentTheme: any;
  terminalInfo: {
    version: string;
    status: string;
    activeEnvironment: string;
    memoryUsage: string;
  };
  setTerminalInfo: React.Dispatch<React.SetStateAction<any>>;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
}

export const TerminalHeader: React.FC<TerminalHeaderProps> = ({
  currentTheme,
  terminalInfo,
  setTerminalInfo,
  isFullscreen,
  toggleFullscreen
}) => {
  // Get library count
  const getLibraryCount = (language: string) => {
    const counts: Record<string, number> = {
      python: 18,
      cpp: 16,
      lua: 10,
      javascript: 6,
      rust: 3,
      ruby: 1
    };
    return counts[language] || 0;
  };

  const environmentOptions = [
    { id: 'python', name: 'Python 3.11', icon: <Code className="h-4 w-4" /> },
    { id: 'cpp', name: 'C++ 17', icon: <Code className="h-4 w-4" /> },
    { id: 'lua', name: 'Lua 5.4', icon: <Code className="h-4 w-4" /> },
    { id: 'javascript', name: 'Node.js', icon: <Code className="h-4 w-4" /> },
    { id: 'rust', name: 'Rust', icon: <Code className="h-4 w-4" /> }
  ];

  return (
    <header className="p-3 border-b border-gray-800">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Code 
            className="h-6 w-6 mr-2" 
            style={{ color: currentTheme.primaryColor }} 
          />
          <h1 className="text-xl font-bold" style={{ color: currentTheme.primaryColor }}>
            CodeVerse Terminal
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            {environmentOptions.map((env) => (
              <button
                key={env.id}
                className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs ${
                  terminalInfo.activeEnvironment === env.id 
                    ? 'bg-rukod-purple bg-opacity-20 text-rukod-purple' 
                    : 'text-slate-300 hover:bg-rukod-purple hover:bg-opacity-10'
                }`}
                onClick={() => {
                  setTerminalInfo(prev => ({ ...prev, activeEnvironment: env.id }));
                  toast.info(`Среда ${env.name} выбрана`);
                }}
              >
                {env.icon}
                <span>{env.name}</span>
                <span className="ml-1 opacity-70">({getLibraryCount(env.id)})</span>
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-1 ml-2">
            <Cpu className="h-4 w-4" style={{ color: currentTheme.accentColor }} />
            <span className="text-xs text-slate-400">v{terminalInfo.version}</span>
          </div>
          
          <div className="flex items-center gap-1 ml-2">
            <span className="h-2 w-2 rounded-full bg-green-500"></span>
            <span className="text-xs text-slate-400">{terminalInfo.status}</span>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="ml-2"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};
