import React from 'react';
import { GameEvent, EventType } from '../../models/game';
import { 
  Sword, 
  Flag, 
  Wrench, 
  FlaskConical, 
  Users, 
  AlertTriangle, 
  Zap, 
  MessageSquare,
  Clock
} from 'lucide-react';

interface GameEventsPanelProps {
  events: GameEvent[];
  playerId: string;
}

export const GameEventsPanel: React.FC<GameEventsPanelProps> = ({
  events,
  playerId
}) => {
  const getEventIcon = (type: EventType) => {
    const icons = {
      [EventType.BATTLE]: Sword,
      [EventType.PROVINCE_CAPTURED]: Flag,
      [EventType.UNIT_PRODUCED]: Users,
      [EventType.BUILDING_COMPLETED]: Wrench,
      [EventType.RESEARCH_COMPLETED]: FlaskConical,
      [EventType.DIPLOMATIC_CHANGE]: MessageSquare,
      [EventType.RESOURCE_SHORTAGE]: AlertTriangle,
      [EventType.NATURAL_DISASTER]: Zap
    };
    return icons[type] || MessageSquare;
  };

  const getEventColor = (type: EventType) => {
    const colors = {
      [EventType.BATTLE]: 'text-red-500',
      [EventType.PROVINCE_CAPTURED]: 'text-orange-500',
      [EventType.UNIT_PRODUCED]: 'text-green-500',
      [EventType.BUILDING_COMPLETED]: 'text-blue-500',
      [EventType.RESEARCH_COMPLETED]: 'text-purple-500',
      [EventType.DIPLOMATIC_CHANGE]: 'text-yellow-500',
      [EventType.RESOURCE_SHORTAGE]: 'text-red-400',
      [EventType.NATURAL_DISASTER]: 'text-orange-400'
    };
    return colors[type] || 'text-gray-400';
  };

  const getEventBgColor = (type: EventType) => {
    const colors = {
      [EventType.BATTLE]: 'bg-red-900/20',
      [EventType.PROVINCE_CAPTURED]: 'bg-orange-900/20',
      [EventType.UNIT_PRODUCED]: 'bg-green-900/20',
      [EventType.BUILDING_COMPLETED]: 'bg-blue-900/20',
      [EventType.RESEARCH_COMPLETED]: 'bg-purple-900/20',
      [EventType.DIPLOMATIC_CHANGE]: 'bg-yellow-900/20',
      [EventType.RESOURCE_SHORTAGE]: 'bg-red-900/20',
      [EventType.NATURAL_DISASTER]: 'bg-orange-900/20'
    };
    return colors[type] || 'bg-gray-900/20';
  };

  const getEventTypeName = (type: EventType) => {
    const names = {
      [EventType.BATTLE]: 'Битва',
      [EventType.PROVINCE_CAPTURED]: 'Захват провинции',
      [EventType.UNIT_PRODUCED]: 'Производство войск',
      [EventType.BUILDING_COMPLETED]: 'Строительство',
      [EventType.RESEARCH_COMPLETED]: 'Исследование',
      [EventType.DIPLOMATIC_CHANGE]: 'Дипломатия',
      [EventType.RESOURCE_SHORTAGE]: 'Нехватка ресурсов',
      [EventType.NATURAL_DISASTER]: 'Стихийное бедствие'
    };
    return names[type] || 'Событие';
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}д назад`;
    if (hours > 0) return `${hours}ч назад`;
    if (minutes > 0) return `${minutes}м назад`;
    return 'Только что';
  };

  // Filter events relevant to the player
  const relevantEvents = events.filter(event => 
    !event.playerId || event.playerId === playerId
  );

  // Sort events by timestamp (newest first)
  const sortedEvents = [...relevantEvents].sort((a, b) => 
    b.timestamp.getTime() - a.timestamp.getTime()
  );

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-lg font-bold mb-2">События</h2>
        <div className="text-sm text-gray-400">
          Последние игровые события
        </div>
      </div>

      {sortedEvents.length === 0 ? (
        <div className="text-center text-gray-400 py-8">
          <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <div>Нет событий</div>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedEvents.map(event => {
            const Icon = getEventIcon(event.type);
            const iconColor = getEventColor(event.type);
            const bgColor = getEventBgColor(event.type);

            return (
              <div
                key={event.id}
                className={`p-3 rounded-lg border border-opacity-20 ${bgColor}`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`flex-shrink-0 ${iconColor}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-medium text-white truncate">
                        {event.title}
                      </h3>
                      <div className="flex items-center text-xs text-gray-400 ml-2">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatTimestamp(event.timestamp)}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-300 mb-2">
                      {event.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-2 py-1 rounded ${iconColor} bg-opacity-20`}>
                        {getEventTypeName(event.type)}
                      </span>
                      
                      {event.provinceId && (
                        <span className="text-xs text-gray-400">
                          Провинция: {event.provinceId}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Event Statistics */}
      <div className="mt-6 pt-4 border-t border-gray-600">
        <h3 className="text-sm font-semibold mb-3">Статистика событий</h3>
        <div className="grid grid-cols-2 gap-3 text-xs">
          {Object.values(EventType).map(type => {
            const count = sortedEvents.filter(e => e.type === type).length;
            const Icon = getEventIcon(type);
            const color = getEventColor(type);
            
            return (
              <div key={type} className="flex items-center space-x-2">
                <Icon className={`w-3 h-3 ${color}`} />
                <span className="text-gray-300">{getEventTypeName(type)}:</span>
                <span className="text-white font-medium">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Clear Events Button */}
      <div className="mt-4">
        <button className="w-full px-3 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded text-gray-300">
          Очистить старые события
        </button>
      </div>
    </div>
  );
};