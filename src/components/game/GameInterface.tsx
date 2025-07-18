import React, { useState, useEffect } from 'react';
import { GameMap } from './GameMap';
import { ProvincePanel } from './ProvincePanel';
import { UnitPanel } from './UnitPanel';
import { ResourcePanel } from './ResourcePanel';
import { GameEventsPanel } from './GameEventsPanel';
import { DiplomacyPanel } from './DiplomacyPanel';
import { 
  Province, 
  Unit, 
  Player, 
  GameState, 
  Resources, 
  UnitType, 
  BuildingType 
} from '../../models/game';
import { GameEngine } from '../../services/GameEngine';

interface GameInterfaceProps {
  gameState: GameState;
  currentPlayer: Player;
  gameEngine: GameEngine;
}

export const GameInterface: React.FC<GameInterfaceProps> = ({
  gameState,
  currentPlayer,
  gameEngine
}) => {
  const [selectedProvince, setSelectedProvince] = useState<Province | undefined>();
  const [selectedUnit, setSelectedUnit] = useState<Unit | undefined>();
  const [activePanel, setActivePanel] = useState<'province' | 'unit' | 'diplomacy' | 'events'>('province');
  const [playerResources, setPlayerResources] = useState<Resources>({
    manpower: 0,
    steel: 0,
    oil: 0,
    food: 0,
    money: 0,
    research: 0
  });

  // Calculate player's total resources
  useEffect(() => {
    const playerProvinces = gameState.provinces.filter(p => p.countryId === currentPlayer.countryId);
    const totalResources = playerProvinces.reduce((total, province) => ({
      manpower: total.manpower + province.resources.manpower,
      steel: total.steel + province.resources.steel,
      oil: total.oil + province.resources.oil,
      food: total.food + province.resources.food,
      money: total.money + province.resources.money,
      research: total.research + province.resources.research
    }), { manpower: 0, steel: 0, oil: 0, food: 0, money: 0, research: 0 });
    
    setPlayerResources(totalResources);
  }, [gameState, currentPlayer]);

  // Handle province selection
  const handleProvinceClick = (province: Province) => {
    setSelectedProvince(province);
    setSelectedUnit(undefined);
    setActivePanel('province');
  };

  // Handle unit selection
  const handleUnitClick = (unit: Unit) => {
    setSelectedUnit(unit);
    setActivePanel('unit');
  };

  // Handle unit movement
  const handleUnitMove = (unit: Unit, destination: { x: number; y: number }) => {
    gameEngine.moveUnit(unit.id, destination);
  };

  // Handle unit production
  const handleUnitProduction = (provinceId: string, unitType: UnitType) => {
    if (selectedProvince) {
      gameEngine.produceUnit(provinceId, unitType);
    }
  };

  // Handle building construction
  const handleBuildingConstruction = (provinceId: string, buildingType: BuildingType) => {
    if (selectedProvince) {
      gameEngine.constructBuilding(provinceId, buildingType);
    }
  };

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col">
      {/* Top bar with game info */}
      <div className="bg-gray-800 p-4 border-b border-gray-700">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">{gameState.name}</h1>
            <div className="text-sm text-gray-300">
              День {gameState.day} | Скорость: {gameState.speed} мин/день
            </div>
          </div>
          
          {/* Resource display */}
          <ResourcePanel resources={playerResources} />
          
          <div className="flex items-center space-x-2">
            <div className="text-sm text-gray-300">
              {currentPlayer.name}
            </div>
            <div 
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: gameState.countries.find(c => c.id === currentPlayer.countryId)?.color || '#555' }}
            />
          </div>
        </div>
      </div>

      {/* Main game area */}
      <div className="flex-1 flex">
        {/* Left sidebar */}
        <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
          {/* Panel tabs */}
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setActivePanel('province')}
              className={`flex-1 p-3 text-sm font-medium ${
                activePanel === 'province' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Провинция
            </button>
            <button
              onClick={() => setActivePanel('unit')}
              className={`flex-1 p-3 text-sm font-medium ${
                activePanel === 'unit' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Войска
            </button>
            <button
              onClick={() => setActivePanel('diplomacy')}
              className={`flex-1 p-3 text-sm font-medium ${
                activePanel === 'diplomacy' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Дипломатия
            </button>
            <button
              onClick={() => setActivePanel('events')}
              className={`flex-1 p-3 text-sm font-medium ${
                activePanel === 'events' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              События
            </button>
          </div>

          {/* Panel content */}
          <div className="flex-1 overflow-y-auto">
            {activePanel === 'province' && (
              <ProvincePanel 
                province={selectedProvince}
                onUnitProduction={handleUnitProduction}
                onBuildingConstruction={handleBuildingConstruction}
                canControl={selectedProvince?.countryId === currentPlayer.countryId}
              />
            )}
            
            {activePanel === 'unit' && (
              <UnitPanel 
                unit={selectedUnit}
                onUnitMove={handleUnitMove}
                canControl={selectedUnit ? isUnitControlledByPlayer(selectedUnit, currentPlayer, gameState) : false}
              />
            )}
            
            {activePanel === 'diplomacy' && (
              <DiplomacyPanel 
                currentPlayer={currentPlayer}
                players={gameState.players}
                countries={gameState.countries}
              />
            )}
            
            {activePanel === 'events' && (
              <GameEventsPanel 
                events={gameState.events.slice(-20)} // Show last 20 events
                playerId={currentPlayer.id}
              />
            )}
          </div>
        </div>

        {/* Map area */}
        <div className="flex-1 relative">
          <GameMap
            provinces={gameState.provinces}
            players={gameState.players}
            selectedProvince={selectedProvince}
            selectedUnit={selectedUnit}
            onProvinceClick={handleProvinceClick}
            onUnitClick={handleUnitClick}
          />
          
          {/* Map overlay UI */}
          <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white p-3 rounded">
            <div className="text-sm space-y-1">
              <div>Провинций: {gameState.provinces.filter(p => p.countryId === currentPlayer.countryId).length}</div>
              <div>Общее население: {
                gameState.provinces
                  .filter(p => p.countryId === currentPlayer.countryId)
                  .reduce((total, p) => total + p.population, 0)
                  .toLocaleString()
              }</div>
              <div>Игроков онлайн: {gameState.players.filter(p => p.isOnline).length}/{gameState.players.length}</div>
            </div>
          </div>

          {/* Mini-map (placeholder) */}
          <div className="absolute bottom-4 left-4 w-48 h-32 bg-black bg-opacity-70 border border-gray-600 rounded">
            <div className="p-2 text-xs text-gray-300">Мини-карта</div>
            {/* Mini-map implementation would go here */}
          </div>
        </div>

        {/* Right sidebar - Research and production */}
        <div className="w-64 bg-gray-800 border-l border-gray-700 p-4">
          <div className="space-y-4">
            {/* Research panel */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Исследования</h3>
              <div className="space-y-2">
                {Object.entries(currentPlayer.research).map(([tech, level]) => {
                  if (tech === 'currentResearch') return null;
                  return (
                    <div key={tech} className="flex justify-between items-center">
                      <span className="text-sm capitalize">{tech}</span>
                      <span className="text-sm text-blue-400">Ур. {level}</span>
                    </div>
                  );
                })}
              </div>
              
              {currentPlayer.research.currentResearch && (
                <div className="mt-3 p-2 bg-gray-700 rounded">
                  <div className="text-sm font-medium">
                    {currentPlayer.research.currentResearch.type}
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2 mt-1">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ 
                        width: `${(currentPlayer.research.currentResearch.progress / currentPlayer.research.currentResearch.totalCost) * 100}%` 
                      }}
                    />
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {currentPlayer.research.currentResearch.timeLeft} дней осталось
                  </div>
                </div>
              )}
            </div>

            {/* Production queue */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Производство</h3>
              <div className="space-y-2">
                {/* Show production queue for player's provinces */}
                {gameState.provinces
                  .filter(p => p.countryId === currentPlayer.countryId)
                  .filter(p => p.buildings.some(b => b.isUnderConstruction))
                  .map(province => (
                    <div key={province.id} className="text-sm">
                      <div className="font-medium">{province.name}</div>
                      {province.buildings
                        .filter(b => b.isUnderConstruction)
                        .map(building => (
                          <div key={building.id} className="ml-2 text-gray-400">
                            {building.type} ({building.constructionTimeLeft} дней)
                          </div>
                        ))}
                    </div>
                  ))}
              </div>
            </div>

            {/* Quick actions */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Быстрые действия</h3>
              <div className="space-y-2">
                <button className="w-full px-3 py-2 bg-green-600 hover:bg-green-700 rounded text-sm">
                  Авто-производство
                </button>
                <button className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm">
                  Управление армией
                </button>
                <button className="w-full px-3 py-2 bg-yellow-600 hover:bg-yellow-700 rounded text-sm">
                  Торговля
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to check if unit is controlled by player
const isUnitControlledByPlayer = (unit: Unit, player: Player, gameState: GameState): boolean => {
  const province = gameState.provinces.find(p => p.id === unit.provinceId);
  return province?.countryId === player.countryId;
};