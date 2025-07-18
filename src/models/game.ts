// Game models for strategy game like Call of War

export interface Position {
  x: number;
  y: number;
}

export interface Country {
  id: string;
  name: string;
  color: string;
  capital: string;
  flag?: string;
}

export interface Province {
  id: string;
  name: string;
  countryId: string;
  position: Position;
  population: number;
  resources: Resources;
  buildings: Building[];
  units: Unit[];
  morale: number;
  infrastructure: number;
  isCapital: boolean;
  neighbors: string[]; // province IDs
}

export interface Resources {
  manpower: number;
  steel: number;
  oil: number;
  food: number;
  money: number;
  research: number;
}

export interface Building {
  id: string;
  type: BuildingType;
  level: number;
  provinceId: string;
  isUnderConstruction: boolean;
  constructionTimeLeft: number;
}

export enum BuildingType {
  BARRACKS = 'barracks',
  FACTORY = 'factory',
  AIRFIELD = 'airfield',
  PORT = 'port',
  FORT = 'fort',
  INFRASTRUCTURE = 'infrastructure',
  RESEARCH_LAB = 'research_lab',
  RESOURCE_EXTRACTOR = 'resource_extractor'
}

export interface Unit {
  id: string;
  type: UnitType;
  name: string;
  position: Position;
  provinceId: string;
  health: number;
  maxHealth: number;
  attack: number;
  defense: number;
  speed: number;
  range: number;
  isMoving: boolean;
  destination?: Position;
  eta?: number;
  experience: number;
  morale: number;
}

export enum UnitType {
  INFANTRY = 'infantry',
  ARMOR = 'armor',
  ARTILLERY = 'artillery',
  FIGHTER = 'fighter',
  BOMBER = 'bomber',
  NAVAL_SHIP = 'naval_ship',
  SUBMARINE = 'submarine',
  ANTI_AIR = 'anti_air'
}

export interface Player {
  id: string;
  name: string;
  countryId: string;
  isOnline: boolean;
  lastSeen: Date;
  research: Research;
  diplomacy: Map<string, DiplomaticStatus>;
  isAI: boolean;
}

export interface Research {
  infantry: number;
  armor: number;
  air: number;
  naval: number;
  industry: number;
  economy: number;
  currentResearch?: ResearchProject;
}

export interface ResearchProject {
  type: string;
  progress: number;
  totalCost: number;
  timeLeft: number;
}

export enum DiplomaticStatus {
  WAR = 'war',
  PEACE = 'peace',
  ALLIANCE = 'alliance',
  NON_AGGRESSION = 'non_aggression',
  TRADE_AGREEMENT = 'trade_agreement'
}

export interface GameState {
  id: string;
  name: string;
  day: number;
  isActive: boolean;
  speed: number; // minutes per game day
  provinces: Province[];
  players: Player[];
  countries: Country[];
  events: GameEvent[];
  startTime: Date;
  lastUpdate: Date;
}

export interface GameEvent {
  id: string;
  type: EventType;
  title: string;
  description: string;
  timestamp: Date;
  playerId?: string;
  provinceId?: string;
  data?: any;
}

export enum EventType {
  BATTLE = 'battle',
  PROVINCE_CAPTURED = 'province_captured',
  UNIT_PRODUCED = 'unit_produced',
  BUILDING_COMPLETED = 'building_completed',
  RESEARCH_COMPLETED = 'research_completed',
  DIPLOMATIC_CHANGE = 'diplomatic_change',
  RESOURCE_SHORTAGE = 'resource_shortage',
  NATURAL_DISASTER = 'natural_disaster'
}

export interface Battle {
  id: string;
  attackerId: string;
  defenderId: string;
  provinceId: string;
  attackerUnits: Unit[];
  defenderUnits: Unit[];
  isResolved: boolean;
  result?: BattleResult;
  startTime: Date;
  endTime?: Date;
}

export interface BattleResult {
  winnerId: string;
  attackerLosses: Unit[];
  defenderLosses: Unit[];
  moraleChange: number;
  experienceGained: number;
}