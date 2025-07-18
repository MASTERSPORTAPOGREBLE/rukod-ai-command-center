import React, { useState } from 'react';
import { Player, Country, DiplomaticStatus } from '../../models/game';
import { 
  Sword, 
  Heart, 
  Shield, 
  HandHeart, 
  Coins, 
  Flag,
  Users,
  MessageCircle 
} from 'lucide-react';

interface DiplomacyPanelProps {
  currentPlayer: Player;
  players: Player[];
  countries: Country[];
}

export const DiplomacyPanel: React.FC<DiplomacyPanelProps> = ({
  currentPlayer,
  players,
  countries
}) => {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const getDiplomaticStatusIcon = (status: DiplomaticStatus) => {
    const icons = {
      [DiplomaticStatus.WAR]: Sword,
      [DiplomaticStatus.PEACE]: Heart,
      [DiplomaticStatus.ALLIANCE]: Shield,
      [DiplomaticStatus.NON_AGGRESSION]: HandHeart,
      [DiplomaticStatus.TRADE_AGREEMENT]: Coins
    };
    return icons[status] || Heart;
  };

  const getDiplomaticStatusColor = (status: DiplomaticStatus) => {
    const colors = {
      [DiplomaticStatus.WAR]: 'text-red-500',
      [DiplomaticStatus.PEACE]: 'text-gray-400',
      [DiplomaticStatus.ALLIANCE]: 'text-green-500',
      [DiplomaticStatus.NON_AGGRESSION]: 'text-blue-500',
      [DiplomaticStatus.TRADE_AGREEMENT]: 'text-yellow-500'
    };
    return colors[status] || 'text-gray-400';
  };

  const getDiplomaticStatusName = (status: DiplomaticStatus) => {
    const names = {
      [DiplomaticStatus.WAR]: 'Война',
      [DiplomaticStatus.PEACE]: 'Мир',
      [DiplomaticStatus.ALLIANCE]: 'Союз',
      [DiplomaticStatus.NON_AGGRESSION]: 'Пакт о ненападении',
      [DiplomaticStatus.TRADE_AGREEMENT]: 'Торговое соглашение'
    };
    return names[status] || 'Неизвестно';
  };

  const otherPlayers = players.filter(p => p.id !== currentPlayer.id);

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-lg font-bold mb-2">Дипломатия</h2>
        <div className="text-sm text-gray-400">
          Управляйте отношениями с другими странами
        </div>
      </div>

      {/* Player List */}
      <div className="space-y-2 mb-4">
        <h3 className="text-sm font-semibold">Страны</h3>
        {otherPlayers.map(player => {
          const country = countries.find(c => c.id === player.countryId);
          const diplomaticStatus = currentPlayer.diplomacy.get(player.id) || DiplomaticStatus.PEACE;
          const StatusIcon = getDiplomaticStatusIcon(diplomaticStatus);
          const statusColor = getDiplomaticStatusColor(diplomaticStatus);

          return (
            <div
              key={player.id}
              className={`p-3 rounded border cursor-pointer transition-colors ${
                selectedPlayer?.id === player.id
                  ? 'border-blue-500 bg-blue-900/20'
                  : 'border-gray-600 bg-gray-700 hover:bg-gray-600'
              }`}
              onClick={() => setSelectedPlayer(player)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: country?.color || '#555' }}
                  />
                  <div>
                    <div className="text-sm font-medium">{player.name}</div>
                    <div className="text-xs text-gray-400">{country?.name}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <StatusIcon className={`w-4 h-4 ${statusColor}`} />
                  {player.isOnline && (
                    <div className="w-2 h-2 bg-green-500 rounded-full" title="Онлайн" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Player Details */}
      {selectedPlayer && (
        <div className="border-t border-gray-600 pt-4">
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <Flag className="w-5 h-5" />
              <h3 className="text-lg font-semibold">{selectedPlayer.name}</h3>
              {selectedPlayer.isOnline && (
                <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">
                  Онлайн
                </span>
              )}
            </div>
            
            <div className="text-sm text-gray-400">
              {countries.find(c => c.id === selectedPlayer.countryId)?.name}
            </div>
          </div>

          {/* Current Status */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold mb-2">Текущие отношения</h4>
            <div className="flex items-center space-x-2">
              {(() => {
                const status = currentPlayer.diplomacy.get(selectedPlayer.id) || DiplomaticStatus.PEACE;
                const StatusIcon = getDiplomaticStatusIcon(status);
                const statusColor = getDiplomaticStatusColor(status);
                
                return (
                  <>
                    <StatusIcon className={`w-5 h-5 ${statusColor}`} />
                    <span className={`font-medium ${statusColor}`}>
                      {getDiplomaticStatusName(status)}
                    </span>
                  </>
                );
              })()}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Дипломатические действия</h4>
            
            <button className="w-full flex items-center space-x-2 px-3 py-2 bg-red-600 hover:bg-red-700 rounded text-sm">
              <Sword className="w-4 h-4" />
              <span>Объявить войну</span>
            </button>
            
            <button className="w-full flex items-center space-x-2 px-3 py-2 bg-green-600 hover:bg-green-700 rounded text-sm">
              <Shield className="w-4 h-4" />
              <span>Предложить союз</span>
            </button>
            
            <button className="w-full flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm">
              <HandHeart className="w-4 h-4" />
              <span>Пакт о ненападении</span>
            </button>
            
            <button className="w-full flex items-center space-x-2 px-3 py-2 bg-yellow-600 hover:bg-yellow-700 rounded text-sm">
              <Coins className="w-4 h-4" />
              <span>Торговое соглашение</span>
            </button>
            
            <button className="w-full flex items-center space-x-2 px-3 py-2 bg-gray-600 hover:bg-gray-700 rounded text-sm">
              <MessageCircle className="w-4 h-4" />
              <span>Отправить сообщение</span>
            </button>
          </div>

          {/* Player Stats */}
          <div className="mt-4">
            <h4 className="text-sm font-semibold mb-2">Информация</h4>
            <div className="text-xs text-gray-400 space-y-1">
              <div>
                Последний визит: {selectedPlayer.isOnline ? 'Сейчас онлайн' : selectedPlayer.lastSeen.toLocaleDateString()}
              </div>
              <div>
                Тип игрока: {selectedPlayer.isAI ? 'ИИ' : 'Человек'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Diplomacy Summary */}
      {!selectedPlayer && (
        <div className="border-t border-gray-600 pt-4">
          <h3 className="text-sm font-semibold mb-2">Сводка отношений</h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center space-x-2">
              <Sword className="w-3 h-3 text-red-500" />
              <span>Войн: {Array.from(currentPlayer.diplomacy.values()).filter(s => s === DiplomaticStatus.WAR).length}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-3 h-3 text-green-500" />
              <span>Союзов: {Array.from(currentPlayer.diplomacy.values()).filter(s => s === DiplomaticStatus.ALLIANCE).length}</span>
            </div>
            <div className="flex items-center space-x-2">
              <HandHeart className="w-3 h-3 text-blue-500" />
              <span>Пактов: {Array.from(currentPlayer.diplomacy.values()).filter(s => s === DiplomaticStatus.NON_AGGRESSION).length}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Coins className="w-3 h-3 text-yellow-500" />
              <span>Торговых: {Array.from(currentPlayer.diplomacy.values()).filter(s => s === DiplomaticStatus.TRADE_AGREEMENT).length}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};