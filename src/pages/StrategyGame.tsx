import React, { useState, useEffect } from 'react';
import { GameInterface } from '../components/game/GameInterface';
import { GameEngine } from '../services/GameEngine';
import { WORLD_COUNTRIES, WORLD_PROVINCES, STARTING_UNITS } from '../data/worldData';
import { 
  GameState, 
  Player, 
  Country, 
  Province, 
  Unit, 
  Resources,
  UnitType,
  BuildingType,
  DiplomaticStatus,
  Research
} from '../models/game';

export const StrategyGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [gameEngine, setGameEngine] = useState<GameEngine | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize game with demo data
    initializeGame();
  }, []);

  const initializeGame = async () => {
    try {
      // Use world data
      const countries = WORLD_COUNTRIES;

      // Create demo players
      const players: Player[] = [
        {
          id: 'player1',
          name: 'Игрок 1',
          countryId: 'germany',
          isOnline: true,
          lastSeen: new Date(),
          research: {
            infantry: 1,
            armor: 0,
            air: 0,
            naval: 0,
            industry: 1,
            economy: 0
          },
          diplomacy: new Map([
            ['player2', DiplomaticStatus.PEACE],
            ['player3', DiplomaticStatus.ALLIANCE],
            ['player4', DiplomaticStatus.WAR]
          ]),
          isAI: false
        },
        {
          id: 'player2',
          name: 'ИИ Франция',
          countryId: 'france',
          isOnline: true,
          lastSeen: new Date(),
          research: {
            infantry: 1,
            armor: 1,
            air: 0,
            naval: 0,
            industry: 0,
            economy: 1
          },
          diplomacy: new Map([
            ['player1', DiplomaticStatus.PEACE],
            ['player3', DiplomaticStatus.TRADE_AGREEMENT]
          ]),
          isAI: true
        },
        {
          id: 'player3',
          name: 'ИИ Британия',
          countryId: 'uk',
          isOnline: false,
          lastSeen: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
          research: {
            infantry: 1,
            armor: 0,
            air: 1,
            naval: 1,
            industry: 0,
            economy: 0
          },
          diplomacy: new Map([
            ['player1', DiplomaticStatus.ALLIANCE],
            ['player2', DiplomaticStatus.TRADE_AGREEMENT]
          ]),
          isAI: true
        },
        {
          id: 'player4',
          name: 'ИИ Россия',
          countryId: 'russia',
          isOnline: true,
          lastSeen: new Date(),
          research: {
            infantry: 2,
            armor: 1,
            air: 0,
            naval: 0,
            industry: 1,
            economy: 0
          },
          diplomacy: new Map([
            ['player1', DiplomaticStatus.WAR]
          ]),
          isAI: true
        }
      ];

      // Create provinces with units
      const provinces: Province[] = WORLD_PROVINCES.map(provinceData => {
        const units: Unit[] = [];
        const startingUnits = STARTING_UNITS[provinceData.id] || [];
        
        startingUnits.forEach((unitData, index) => {
          const unit: Unit = {
            ...unitData,
            id: `${provinceData.id}-unit-${index}`,
            position: { 
              x: provinceData.position.x + (index * 10), 
              y: provinceData.position.y + (index * 10) 
            },
            provinceId: provinceData.id
          };
          units.push(unit);
        });

        return {
          ...provinceData,
          units
        };
      });

      // Create initial game state
      const initialGameState: GameState = {
        id: 'demo-game',
        name: 'Мировая Война - Демо',
        day: 1,
        isActive: true,
        speed: 10, // 10 minutes per game day
        provinces,
        players,
        countries,
        events: [
          {
            id: 'welcome-event',
            type: 'diplomatic_change' as any,
            title: 'Добро пожаловать в игру!',
            description: 'Новая эра началась. Управляйте своей страной мудро.',
            timestamp: new Date(),
            playerId: 'player1'
          }
        ],
        startTime: new Date(),
        lastUpdate: new Date()
      };

      // Initialize game engine
      const engine = new GameEngine(initialGameState);
      
      setGameState(initialGameState);
      setCurrentPlayer(players[0]); // First player is human player
      setGameEngine(engine);
      
      // Start the game engine
      engine.start();
      
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to initialize game:', error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <div className="text-lg">Инициализация игры...</div>
          <div className="text-sm text-gray-400 mt-2">Создание мира и загрузка ресурсов</div>
        </div>
      </div>
    );
  }

  if (!gameState || !currentPlayer || !gameEngine) {
    return (
      <div className="h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-lg text-red-400 mb-2">Ошибка загрузки игры</div>
          <div className="text-sm text-gray-400">Не удалось инициализировать игровое состояние</div>
          <button 
            onClick={initializeGame}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <GameInterface
      gameState={gameState}
      currentPlayer={currentPlayer}
      gameEngine={gameEngine}
    />
  );
};