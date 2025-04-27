
import React, { useState, useEffect } from 'react';
import { SystemStats as SystemStatsType } from '../models/types';
import { useTheme } from '../context/ThemeContext';
import { Cpu, HardDrive, MemoryStick } from 'lucide-react';

export const SystemStats: React.FC = () => {
  const { currentTheme } = useTheme();
  const [stats, setStats] = useState<SystemStatsType>({
    cpuUsage: 0,
    ramUsage: 0,
    diskSpace: 100,
    diskFree: 26.4,
  });

  // Simulate updating stats
  useEffect(() => {
    const interval = setInterval(() => {
      setStats({
        cpuUsage: Math.min(100, Math.max(0, stats.cpuUsage + (Math.random() * 10 - 5))),
        ramUsage: Math.min(100, Math.max(0, stats.ramUsage + (Math.random() * 8 - 4))),
        diskSpace: stats.diskSpace,
        diskFree: Math.max(0, stats.diskFree - (Math.random() * 0.1)),
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [stats]);

  const getProgressColor = (percentage: number): string => {
    if (percentage < 60) return currentTheme.primaryColor;
    if (percentage < 80) return currentTheme.secondaryColor;
    return "#ef4444"; // Red for high usage
  };

  const formatPercentage = (value: number): string => {
    return `${Math.round(value)}%`;
  };

  const formatGigabytes = (value: number): string => {
    return `${value.toFixed(1)} GB`;
  };

  return (
    <div className="flex flex-col space-y-3">
      <div className="text-sm font-medium mb-2">Системные ресурсы</div>
      
      <div className="flex items-center gap-2">
        <Cpu className="h-4 w-4" style={{ color: currentTheme.primaryColor }} />
        <div className="flex-1">
          <div className="flex justify-between text-xs mb-1">
            <span>CPU</span>
            <span>{formatPercentage(stats.cpuUsage)}</span>
          </div>
          <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700">
            <div 
              className="h-full rounded-full transition-all duration-500" 
              style={{ 
                width: `${stats.cpuUsage}%`, 
                backgroundColor: getProgressColor(stats.cpuUsage) 
              }}
            />
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <MemoryStick className="h-4 w-4" style={{ color: currentTheme.secondaryColor }} />
        <div className="flex-1">
          <div className="flex justify-between text-xs mb-1">
            <span>RAM</span>
            <span>{formatPercentage(stats.ramUsage)}</span>
          </div>
          <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700">
            <div 
              className="h-full rounded-full transition-all duration-500" 
              style={{ 
                width: `${stats.ramUsage}%`, 
                backgroundColor: getProgressColor(stats.ramUsage) 
              }}
            />
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <HardDrive className="h-4 w-4" style={{ color: currentTheme.accentColor }} />
        <div className="flex-1">
          <div className="flex justify-between text-xs mb-1">
            <span>Диск</span>
            <span>{formatGigabytes(stats.diskFree)} свободно</span>
          </div>
          <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700">
            <div 
              className="h-full rounded-full transition-all duration-500" 
              style={{ 
                width: `${(stats.diskSpace - stats.diskFree) / stats.diskSpace * 100}%`, 
                backgroundColor: getProgressColor((stats.diskSpace - stats.diskFree) / stats.diskSpace * 100) 
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
