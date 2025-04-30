
import React, { ReactNode } from 'react';
import { Theme } from '../models/types';

interface StatItemProps {
  icon: ReactNode;
  label: string;
  value: string;
  percentage: number;
  theme: Theme;
}

export const StatItem: React.FC<StatItemProps> = ({ icon, label, value, percentage, theme }) => {
  const getProgressColor = (percentage: number): string => {
    if (percentage < 60) return theme.primaryColor;
    if (percentage < 80) return theme.secondaryColor;
    return "#ef4444"; // Red for high usage
  };

  return (
    <div className="flex items-center gap-2">
      {icon}
      <div className="flex-1">
        <div className="flex justify-between text-xs mb-1">
          <span>{label}</span>
          <span>{value}</span>
        </div>
        <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700">
          <div 
            className="h-full rounded-full transition-all duration-500" 
            style={{ 
              width: `${percentage}%`, 
              backgroundColor: getProgressColor(percentage) 
            }}
          />
        </div>
      </div>
    </div>
  );
};
