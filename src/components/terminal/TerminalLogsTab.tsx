
import React from 'react';
import { TerminalLogs } from '../TerminalLogs';
import { terminalService } from '../../services/terminalService';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface TerminalLogsTabProps {
  currentTheme: any;
}

export const TerminalLogsTab: React.FC<TerminalLogsTabProps> = ({ currentTheme }) => {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold" style={{ color: currentTheme.primaryColor }}>
        Системные логи
      </h3>
      <div className="w-full">
        <TerminalLogs maxHeight="calc(100vh - 250px)" />
      </div>
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          onClick={() => {
            terminalService.clearLogs();
            toast.success('Логи очищены');
          }}
        >
          Очистить логи
        </Button>
      </div>
    </div>
  );
};
