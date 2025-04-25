
import React, { useEffect, useRef } from 'react';
import { useCommandContext, CommandOutput } from '@/context/CommandContext';
import { Loader2 } from 'lucide-react';

const CommandItem: React.FC<{ item: CommandOutput }> = ({ item }) => {
  return (
    <div className="mb-4 animate-fade-in">
      {item.command && (
        <div className="flex items-center mb-1">
          <span className="text-rukod-purple terminal-text mr-2">$</span>
          <span className="terminal-text">{item.command}</span>
        </div>
      )}
      
      <div className="pl-4 border-l-2 border-rukod-purple border-opacity-50">
        <div className="terminal-text whitespace-pre-wrap">
          {item.status === 'processing' ? (
            <div className="flex items-center text-muted-foreground">
              <Loader2 className="animate-spin h-3 w-3 mr-2" />
              {item.output}
            </div>
          ) : item.status === 'error' ? (
            <span className="text-red-400">{item.output}</span>
          ) : (
            <span>{item.output}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export const CommandOutput: React.FC = () => {
  const { history } = useCommandContext();
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto scroll to bottom when history changes
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [history]);

  return (
    <div 
      ref={outputRef}
      className="flex-1 overflow-y-auto p-4 terminal-text">
      {history.map((item) => (
        <CommandItem key={item.id} item={item} />
      ))}
    </div>
  );
};
