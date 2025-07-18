import React from 'react';
import { Resources } from '../../models/game';
import { Users, Zap, Fuel, Utensils, DollarSign, BookOpen } from 'lucide-react';

interface ResourcePanelProps {
  resources: Resources;
}

export const ResourcePanel: React.FC<ResourcePanelProps> = ({ resources }) => {
  const resourceItems = [
    {
      icon: Users,
      label: 'Людские ресурсы',
      value: resources.manpower,
      color: 'text-green-400',
      bgColor: 'bg-green-900/20'
    },
    {
      icon: Zap,
      label: 'Сталь',
      value: resources.steel,
      color: 'text-gray-400',
      bgColor: 'bg-gray-900/20'
    },
    {
      icon: Fuel,
      label: 'Нефть',
      value: resources.oil,
      color: 'text-orange-400',
      bgColor: 'bg-orange-900/20'
    },
    {
      icon: Utensils,
      label: 'Продовольствие',
      value: resources.food,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-900/20'
    },
    {
      icon: DollarSign,
      label: 'Деньги',
      value: resources.money,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-900/20'
    },
    {
      icon: BookOpen,
      label: 'Исследования',
      value: resources.research,
      color: 'text-blue-400',
      bgColor: 'bg-blue-900/20'
    }
  ];

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <div className="flex items-center space-x-4">
      {resourceItems.map(({ icon: Icon, label, value, color, bgColor }) => (
        <div
          key={label}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${bgColor} border border-opacity-20`}
          title={label}
        >
          <Icon className={`w-4 h-4 ${color}`} />
          <span className={`text-sm font-medium ${color}`}>
            {formatNumber(value)}
          </span>
        </div>
      ))}
    </div>
  );
};