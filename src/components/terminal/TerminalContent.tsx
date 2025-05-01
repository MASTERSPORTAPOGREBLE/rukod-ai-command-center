
import React from 'react';
import { CommandOutput } from '../CommandOutput';
import { SystemStats } from '../SystemStats';
import { TerminalCommandInput } from '../TerminalCommandInput';
import { QuickFileRunner } from '../QuickFileRunner';

interface TerminalContentProps {
  terminalInput: string;
  setTerminalInput: React.Dispatch<React.SetStateAction<string>>;
  handleSubmitCommand: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  currentTheme: any;
  selectedFile: string;
  setSelectedFile: React.Dispatch<React.SetStateAction<string>>;
  isRunning: boolean;
  setIsRunning: React.Dispatch<React.SetStateAction<boolean>>;
}

export const TerminalContent: React.FC<TerminalContentProps> = ({
  terminalInput,
  setTerminalInput,
  handleSubmitCommand,
  handleKeyDown,
  currentTheme,
  selectedFile,
  setSelectedFile,
  isRunning,
  setIsRunning
}) => {
  return (
    <div className="flex-grow flex flex-col space-y-2 m-0">
      <div>
        <SystemStats />
      </div>
      
      <QuickFileRunner 
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        isRunning={isRunning}
        setIsRunning={setIsRunning}
      />
      
      <div className="flex-grow overflow-auto">
        <CommandOutput />
      </div>
      
      <TerminalCommandInput 
        terminalInput={terminalInput}
        setTerminalInput={setTerminalInput}
        handleSubmitCommand={handleSubmitCommand}
        handleKeyDown={handleKeyDown}
        currentTheme={currentTheme}
      />
      
      <div className="w-full text-center">
        <span className="text-xs text-slate-500">
          Введите "помощь" для просмотра доступных команд
        </span>
      </div>
    </div>
  );
};
