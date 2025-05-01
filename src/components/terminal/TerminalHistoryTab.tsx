
import React from 'react';
import { Button } from '@/components/ui/button';

interface TerminalHistoryTabProps {
  currentTheme: any;
  terminalHistory: string[];
  setTerminalInput: React.Dispatch<React.SetStateAction<string>>;
  handleSubmitCommand: () => void;
}

export const TerminalHistoryTab: React.FC<TerminalHistoryTabProps> = ({ 
  currentTheme, 
  terminalHistory, 
  setTerminalInput,
  handleSubmitCommand
}) => {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold" style={{ color: currentTheme.primaryColor }}>
        История команд
      </h3>
      <div className="space-y-1">
        {terminalHistory.length > 0 ? (
          [...terminalHistory].reverse().map((cmd, index) => (
            <div 
              key={index} 
              className="p-2 rounded bg-opacity-10 hover:bg-opacity-20 cursor-pointer transition-colors flex justify-between items-center"
              style={{ backgroundColor: currentTheme.primaryColor }}
              onClick={() => {
                setTerminalInput(cmd);
              }}
            >
              <span className="font-mono text-sm">{cmd}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  setTerminalInput(cmd);
                  handleSubmitCommand();
                }}
              >
                Повторить
              </Button>
            </div>
          ))
        ) : (
          <div className="text-center py-4 opacity-70">
            История команд пуста
          </div>
        )}
      </div>
    </div>
  );
};
