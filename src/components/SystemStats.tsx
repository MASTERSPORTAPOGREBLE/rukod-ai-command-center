
import React, { useState, useEffect } from 'react';
import { SystemStats as SystemStatsType } from '../models/types';
import { useTheme } from '../context/ThemeContext';
import { Cpu, HardDrive, MemoryStick } from 'lucide-react';
import { StatItem } from './StatItem';

export const SystemStats: React.FC = () => {
  const { currentTheme } = useTheme();
  const [stats, setStats] = useState<SystemStatsType>({
    cpuUsage: 0,
    memoryUsage: 0,
    diskUsage: 0,
    activeContainers: 0,
    uptime: 0,
    ramUsage: 0,
    diskSpace: 100,
    diskFree: 26.4,
  });

  // Simulate updating stats
  useEffect(() => {
    const interval = setInterval(() => {
      setStats({
        ...stats,
        cpuUsage: Math.min(100, Math.max(0, stats.cpuUsage + (Math.random() * 10 - 5))),
        ramUsage: Math.min(100, Math.max(0, stats.ramUsage + (Math.random() * 8 - 4))),
        memoryUsage: Math.min(100, Math.max(0, stats.memoryUsage + (Math.random() * 8 - 4))),
        diskUsage: Math.min(100, Math.max(0, stats.diskUsage + (Math.random() * 1 - 0.5))),
        activeContainers: stats.activeContainers,
        uptime: stats.uptime + 3,
        diskSpace: stats.diskSpace,
        diskFree: Math.max(0, stats.diskFree - (Math.random() * 0.1)),
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [stats]);

  const formatPercentage = (value: number): string => {
    return `${Math.round(value)}%`;
  };

  const formatGigabytes = (value: number): string => {
    return `${value.toFixed(1)} GB`;
  };

  return (
    <div className="flex flex-col space-y-3">
      <div className="text-sm font-medium mb-2">Системные ресурсы</div>
      
      <StatItem 
        icon={<Cpu className="h-4 w-4" style={{ color: currentTheme.primaryColor }} />}
        label="CPU"
        value={formatPercentage(stats.cpuUsage)}
        percentage={stats.cpuUsage}
        theme={currentTheme}
      />
      
      <StatItem 
        icon={<MemoryStick className="h-4 w-4" style={{ color: currentTheme.secondaryColor }} />}
        label="RAM"
        value={formatPercentage(stats.ramUsage)}
        percentage={stats.ramUsage}
        theme={currentTheme}
      />
      
      <StatItem 
        icon={<HardDrive className="h-4 w-4" style={{ color: currentTheme.accentColor }} />}
        label="Диск"
        value={formatGigabytes(stats.diskFree) + " свободно"}
        percentage={(stats.diskSpace - stats.diskFree) / stats.diskSpace * 100}
        theme={currentTheme}
      />
    </div>
  );
};
