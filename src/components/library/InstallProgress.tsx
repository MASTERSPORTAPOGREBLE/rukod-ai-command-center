
import React from 'react';
import { Progress } from '../ui/progress';

interface InstallProgressProps {
  installProgress: number;
}

export const InstallProgress: React.FC<InstallProgressProps> = ({ installProgress }) => {
  if (installProgress <= 0) return null;
  
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span>Прогресс установки</span>
        <span>{installProgress}%</span>
      </div>
      <Progress value={installProgress} className="h-2" />
    </div>
  );
};
