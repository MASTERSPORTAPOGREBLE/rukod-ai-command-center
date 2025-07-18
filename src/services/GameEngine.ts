// Game Engine Core - C++ style architecture in TypeScript
import { 
  GameState, 
  Province, 
  Unit, 
  Player, 
  Battle, 
  BattleResult, 
  Resources, 
  UnitType,
  EventType,
  GameEvent,
  Building,
  BuildingType
} from '../models/game';

export class GameEngine {
  private gameState: GameState;
  private updateInterval: number;
  private isRunning: boolean = false;
  private eventHandlers: Map<EventType, ((event: GameEvent) => void)[]> = new Map();

  constructor(gameState: GameState) {
    this.gameState = gameState;
    this.updateInterval = gameState.speed * 60 * 1000; // Convert minutes to milliseconds
    this.initializeEventHandlers();
  }

  // Main game loop
  public start(): void {
    this.isRunning = true;
    this.gameLoop();
  }

  public stop(): void {
    this.isRunning = false;
  }

  private gameLoop(): void {
    if (!this.isRunning) return;

    this.update();
    setTimeout(() => this.gameLoop(), this.updateInterval);
  }

  private update(): void {
    this.gameState.day++;
    this.gameState.lastUpdate = new Date();

    // Update all game systems
    this.updateProduction();
    this.updateMovement();
    this.updateConstruction();
    this.updateResearch();
    this.updateMorale();
    this.processBattles();
    this.updateAI();
  }

  // Production system
  private updateProduction(): void {
    this.gameState.provinces.forEach(province => {
      this.produceResources(province);
      this.consumeResources(province);
    });
  }

  private produceResources(province: Province): void {
    const baseProduction = this.calculateBaseProduction(province);
    const buildingBonus = this.calculateBuildingBonus(province);
    const moraleModifier = province.morale / 100;

    province.resources.manpower += Math.floor(baseProduction.manpower * moraleModifier);
    province.resources.steel += Math.floor((baseProduction.steel + buildingBonus.steel) * moraleModifier);
    province.resources.oil += Math.floor((baseProduction.oil + buildingBonus.oil) * moraleModifier);
    province.resources.food += Math.floor((baseProduction.food + buildingBonus.food) * moraleModifier);
    province.resources.money += Math.floor((baseProduction.money + buildingBonus.money) * moraleModifier);
    province.resources.research += Math.floor(buildingBonus.research * moraleModifier);
  }

  private calculateBaseProduction(province: Province): Resources {
    const populationFactor = province.population / 1000;
    return {
      manpower: Math.floor(populationFactor * 0.1),
      steel: Math.floor(populationFactor * 0.05),
      oil: Math.floor(populationFactor * 0.03),
      food: Math.floor(populationFactor * 0.2),
      money: Math.floor(populationFactor * 0.15),
      research: 0
    };
  }

  private calculateBuildingBonus(province: Province): Resources {
    const bonus: Resources = { manpower: 0, steel: 0, oil: 0, food: 0, money: 0, research: 0 };
    
    province.buildings.forEach(building => {
      if (building.isUnderConstruction) return;

      switch (building.type) {
        case BuildingType.FACTORY:
          bonus.steel += building.level * 10;
          bonus.money += building.level * 5;
          break;
        case BuildingType.RESOURCE_EXTRACTOR:
          bonus.oil += building.level * 8;
          break;
        case BuildingType.RESEARCH_LAB:
          bonus.research += building.level * 15;
          break;
        case BuildingType.INFRASTRUCTURE:
          bonus.money += building.level * 8;
          break;
      }
    });

    return bonus;
  }

  // Movement system
  private updateMovement(): void {
    this.gameState.provinces.forEach(province => {
      province.units.forEach(unit => {
        if (unit.isMoving && unit.destination && unit.eta) {
          unit.eta--;
          if (unit.eta <= 0) {
            this.completeMovement(unit);
          }
        }
      });
    });
  }

  private completeMovement(unit: Unit): void {
    unit.isMoving = false;
    unit.position = unit.destination!;
    unit.destination = undefined;
    unit.eta = undefined;

    // Find new province
    const newProvince = this.findProvinceByPosition(unit.position);
    if (newProvince && newProvince.id !== unit.provinceId) {
      this.moveUnitToProvince(unit, newProvince.id);
    }
  }

  // Battle system
  public initiateBattle(attackerId: string, defenderId: string, provinceId: string): Battle {
    const attackerUnits = this.getPlayerUnitsInProvince(attackerId, provinceId);
    const defenderUnits = this.getPlayerUnitsInProvince(defenderId, provinceId);

    const battle: Battle = {
      id: this.generateId(),
      attackerId,
      defenderId,
      provinceId,
      attackerUnits: [...attackerUnits],
      defenderUnits: [...defenderUnits],
      isResolved: false,
      startTime: new Date()
    };

    this.processBattle(battle);
    return battle;
  }

  private processBattle(battle: Battle): void {
    const attackerPower = this.calculateCombatPower(battle.attackerUnits);
    const defenderPower = this.calculateCombatPower(battle.defenderUnits);
    
    // Add defensive bonus
    const province = this.getProvinceById(battle.provinceId);
    const defensiveBonus = this.calculateDefensiveBonus(province!);
    const totalDefenderPower = defenderPower * (1 + defensiveBonus);

    const totalPower = attackerPower + totalDefenderPower;
    const attackerWinChance = attackerPower / totalPower;

    const isAttackerWin = Math.random() < attackerWinChance;
    const winnerId = isAttackerWin ? battle.attackerId : battle.defenderId;

    // Calculate casualties
    const attackerLossRate = isAttackerWin ? 0.1 + Math.random() * 0.2 : 0.3 + Math.random() * 0.4;
    const defenderLossRate = isAttackerWin ? 0.3 + Math.random() * 0.4 : 0.1 + Math.random() * 0.2;

    const attackerLosses = this.calculateCasualties(battle.attackerUnits, attackerLossRate);
    const defenderLosses = this.calculateCasualties(battle.defenderUnits, defenderLossRate);

    battle.result = {
      winnerId,
      attackerLosses,
      defenderLosses,
      moraleChange: isAttackerWin ? 10 : -10,
      experienceGained: 5
    };

    battle.isResolved = true;
    battle.endTime = new Date();

    this.applyBattleResult(battle);
    this.emitEvent({
      id: this.generateId(),
      type: EventType.BATTLE,
      title: `Battle at ${province!.name}`,
      description: `${isAttackerWin ? 'Attacker' : 'Defender'} wins the battle`,
      timestamp: new Date(),
      provinceId: battle.provinceId,
      data: battle
    });
  }

  private calculateCombatPower(units: Unit[]): number {
    return units.reduce((total, unit) => {
      const healthFactor = unit.health / unit.maxHealth;
      const moraleFactor = unit.morale / 100;
      const experienceFactor = 1 + (unit.experience / 100);
      
      return total + (unit.attack * healthFactor * moraleFactor * experienceFactor);
    }, 0);
  }

  private calculateDefensiveBonus(province: Province): number {
    let bonus = 0;
    
    province.buildings.forEach(building => {
      if (building.type === BuildingType.FORT && !building.isUnderConstruction) {
        bonus += building.level * 0.1;
      }
    });

    return Math.min(bonus, 0.5); // Max 50% bonus
  }

  // AI System
  private updateAI(): void {
    const aiPlayers = this.gameState.players.filter(p => p.isAI);
    
    aiPlayers.forEach(player => {
      this.executeAILogic(player);
    });
  }

  private executeAILogic(player: Player): void {
    // Simple AI logic
    const playerProvinces = this.getPlayerProvinces(player.id);
    const totalResources = this.calculateTotalResources(playerProvinces);

    // Decide on actions based on resources and situation
    if (totalResources.money > 1000) {
      this.aiProduceUnits(player);
    }

    if (totalResources.steel > 500) {
      this.aiConstructBuildings(player);
    }

    // Simple expansion logic
    this.aiExpandTerritory(player);
  }

  // Utility methods
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private findProvinceByPosition(position: { x: number; y: number }): Province | undefined {
    return this.gameState.provinces.find(p => 
      Math.abs(p.position.x - position.x) < 50 && 
      Math.abs(p.position.y - position.y) < 50
    );
  }

  private getProvinceById(id: string): Province | undefined {
    return this.gameState.provinces.find(p => p.id === id);
  }

  private getPlayerUnitsInProvince(playerId: string, provinceId: string): Unit[] {
    const province = this.getProvinceById(provinceId);
    if (!province) return [];

    return province.units.filter(unit => {
      const unitOwner = this.gameState.players.find(p => p.countryId === province.countryId);
      return unitOwner?.id === playerId;
    });
  }

  private getPlayerProvinces(playerId: string): Province[] {
    const player = this.gameState.players.find(p => p.id === playerId);
    if (!player) return [];

    return this.gameState.provinces.filter(p => p.countryId === player.countryId);
  }

  private calculateTotalResources(provinces: Province[]): Resources {
    return provinces.reduce((total, province) => ({
      manpower: total.manpower + province.resources.manpower,
      steel: total.steel + province.resources.steel,
      oil: total.oil + province.resources.oil,
      food: total.food + province.resources.food,
      money: total.money + province.resources.money,
      research: total.research + province.resources.research
    }), { manpower: 0, steel: 0, oil: 0, food: 0, money: 0, research: 0 });
  }

  // Event system
  private initializeEventHandlers(): void {
    // Initialize event handlers for different event types
  }

  private emitEvent(event: GameEvent): void {
    this.gameState.events.push(event);
    
    const handlers = this.eventHandlers.get(event.type);
    if (handlers) {
      handlers.forEach(handler => handler(event));
    }
  }

  public addEventListener(eventType: EventType, handler: (event: GameEvent) => void): void {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, []);
    }
    this.eventHandlers.get(eventType)!.push(handler);
  }

  // Public API methods
  public getGameState(): GameState {
    return { ...this.gameState };
  }

  public moveUnit(unitId: string, destination: { x: number; y: number }): boolean {
    // Implementation for unit movement
    return true;
  }

  public produceUnit(provinceId: string, unitType: UnitType): boolean {
    // Implementation for unit production
    return true;
  }

  public constructBuilding(provinceId: string, buildingType: BuildingType): boolean {
    // Implementation for building construction
    return true;
  }

  // Placeholder methods for AI
  private aiProduceUnits(player: Player): void {
    // AI unit production logic
  }

  private aiConstructBuildings(player: Player): void {
    // AI building construction logic
  }

  private aiExpandTerritory(player: Player): void {
    // AI expansion logic
  }

  private processBattles(): void {
    // Process ongoing battles
  }

  private updateConstruction(): void {
    // Update building construction
  }

  private updateResearch(): void {
    // Update research progress
  }

  private updateMorale(): void {
    // Update province morale
  }

  private consumeResources(province: Province): void {
    // Resource consumption logic
  }

  private moveUnitToProvince(unit: Unit, provinceId: string): void {
    // Move unit between provinces
  }

  private calculateCasualties(units: Unit[], lossRate: number): Unit[] {
    // Calculate battle casualties
    return [];
  }

  private applyBattleResult(battle: Battle): void {
    // Apply battle results to game state
  }
}