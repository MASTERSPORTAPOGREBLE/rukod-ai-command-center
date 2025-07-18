import React from 'react';
import { Unit } from '../../models/game';
import { Users, Truck, Target, Plane, Anchor, Shield, Move, Crosshair } from 'lucide-react';

interface UnitPanelProps {
  unit?: Unit;
  onUnitMove: (unit: Unit, destination: { x: number; y: number }) => void;
  canControl: boolean;
}

export const UnitPanel: React.FC<UnitPanelProps> = ({
  unit,
  onUnitMove,
  canControl
}) => {
  if (!unit) {
    return (
      <div className="p-4 text-gray-400 text-center">
        Выберите войска на карте
      </div>
    );
  }

  const getUnitIcon = (type: string) => {
    const icons: { [key: string]: React.ComponentType<any> } = {
      infantry: Users,
      armor: Truck,
      artillery: Target,
      fighter: Plane,
      bomber: Plane,
      naval_ship: Anchor,
      submarine: Anchor,
      anti_air: Shield
    };
    return icons[type] || Users;
  };

  const Icon = getUnitIcon(unit.type);

  const healthPercentage = (unit.health / unit.maxHealth) * 100;
  const moraleColor = unit.morale >= 70 ? 'text-green-400' : unit.morale >= 40 ? 'text-yellow-400' : 'text-red-400';
  const healthColor = healthPercentage >= 70 ? 'bg-green-500' : healthPercentage >= 40 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className="p-4">
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <Icon className="w-6 h-6" />
          <h2 className="text-lg font-bold">{unit.name}</h2>
        </div>
        <div className="text-sm text-gray-400 capitalize">
          {unit.type.replace('_', ' ')}
        </div>
      </div>

      {/* Unit Stats */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold mb-2">Состояние</h3>
          
          {/* Health */}
          <div className="mb-3">
            <div className="flex justify-between text-sm mb-1">
              <span>Здоровье</span>
              <span>{unit.health}/{unit.maxHealth}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${healthColor}`}
                style={{ width: `${healthPercentage}%` }}
              />
            </div>
          </div>

          {/* Morale */}
          <div className="mb-3">
            <div className="flex justify-between text-sm mb-1">
              <span>Мораль</span>
              <span className={moraleColor}>{unit.morale}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full" 
                style={{ width: `${unit.morale}%` }}
              />
            </div>
          </div>

          {/* Experience */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Опыт</span>
              <span>{unit.experience}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-purple-500 h-2 rounded-full" 
                style={{ width: `${Math.min(unit.experience, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Combat Stats */}
        <div>
          <h3 className="text-sm font-semibold mb-2">Боевые характеристики</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span>Атака:</span>
              <span className="text-red-400">{unit.attack}</span>
            </div>
            <div className="flex justify-between">
              <span>Защита:</span>
              <span className="text-blue-400">{unit.defense}</span>
            </div>
            <div className="flex justify-between">
              <span>Скорость:</span>
              <span className="text-green-400">{unit.speed}</span>
            </div>
            <div className="flex justify-between">
              <span>Дальность:</span>
              <span className="text-yellow-400">{unit.range}</span>
            </div>
          </div>
        </div>

        {/* Position */}
        <div>
          <h3 className="text-sm font-semibold mb-2">Расположение</h3>
          <div className="text-sm text-gray-300">
            <div>X: {unit.position.x}, Y: {unit.position.y}</div>
            {unit.isMoving && unit.destination && (
              <div className="text-yellow-400 mt-1">
                <div>Движется к: {unit.destination.x}, {unit.destination.y}</div>
                {unit.eta && <div>Прибытие через: {unit.eta} дней</div>}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        {canControl && (
          <div>
            <h3 className="text-sm font-semibold mb-2">Действия</h3>
            <div className="space-y-2">
              <button
                className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                disabled={unit.isMoving}
              >
                <Move className="w-4 h-4" />
                <span>{unit.isMoving ? 'Движется...' : 'Переместить'}</span>
              </button>
              
              <button
                className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-red-600 hover:bg-red-700 rounded text-sm"
                disabled={unit.isMoving}
              >
                <Crosshair className="w-4 h-4" />
                <span>Атаковать</span>
              </button>

              <button
                className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-gray-600 hover:bg-gray-700 rounded text-sm"
              >
                <Shield className="w-4 h-4" />
                <span>Укрепиться</span>
              </button>
            </div>
          </div>
        )}

        {/* Unit Type Info */}
        <div>
          <h3 className="text-sm font-semibold mb-2">Информация о типе</h3>
          <div className="text-xs text-gray-400">
            {getUnitTypeDescription(unit.type)}
          </div>
        </div>
      </div>

      {!canControl && (
        <div className="mt-4 p-3 bg-red-900/20 border border-red-500/20 rounded">
          <div className="text-red-400 text-sm">
            Вы не можете управлять этими войсками
          </div>
        </div>
      )}
    </div>
  );
};

function getUnitTypeDescription(type: string): string {
  const descriptions: { [key: string]: string } = {
    infantry: 'Основная пехота. Эффективна в обороне городов и против другой пехоты.',
    armor: 'Бронетанковые войска. Высокая атака и мобильность, слаба против авиации.',
    artillery: 'Артиллерия. Большая дальность и урон, но медленная и уязвимая.',
    fighter: 'Истребители. Контролируют воздушное пространство, эффективны против авиации.',
    bomber: 'Бомбардировщики. Наносят урон наземным целям, уязвимы для истребителей.',
    naval_ship: 'Военные корабли. Контролируют морские пути и прибрежные районы.',
    submarine: 'Подводные лодки. Скрытные атаки на флот противника.',
    anti_air: 'Зенитная артиллерия. Защищает от воздушных атак.'
  };
  
  return descriptions[type] || 'Неизвестный тип войск.';
}