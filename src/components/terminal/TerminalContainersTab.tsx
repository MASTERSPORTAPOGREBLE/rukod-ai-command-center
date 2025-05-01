
import React from 'react';
import { ContainersList } from '../ContainersList';

interface TerminalContainersTabProps {
  currentTheme: any;
}

export const TerminalContainersTab: React.FC<TerminalContainersTabProps> = ({ currentTheme }) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold" style={{ color: currentTheme.primaryColor }}>
          Управление контейнерами
        </h3>
      </div>
      <ContainersList />
    </div>
  );
};
