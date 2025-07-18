import { Country, Province, Unit, Resources, BuildingType, UnitType } from '../models/game';

export const WORLD_COUNTRIES: Country[] = [
  { id: 'germany', name: 'Германия', color: '#2C3E50', capital: 'Berlin' },
  { id: 'france', name: 'Франция', color: '#3498DB', capital: 'Paris' },
  { id: 'uk', name: 'Великобритания', color: '#E74C3C', capital: 'London' },
  { id: 'russia', name: 'Россия', color: '#27AE60', capital: 'Moscow' },
  { id: 'italy', name: 'Италия', color: '#F39C12', capital: 'Rome' },
  { id: 'austria', name: 'Австро-Венгрия', color: '#8E44AD', capital: 'Vienna' },
  { id: 'ottoman', name: 'Османская империя', color: '#D35400', capital: 'Constantinople' },
  { id: 'spain', name: 'Испания', color: '#C0392B', capital: 'Madrid' }
];

export const WORLD_PROVINCES: Omit<Province, 'units'>[] = [
  // Germany
  {
    id: 'berlin',
    name: 'Берлин',
    countryId: 'germany',
    position: { x: 520, y: 280 },
    population: 2500000,
    resources: { manpower: 400, steel: 200, oil: 30, food: 200, money: 1000, research: 120 },
    buildings: [
      { id: 'berlin-1', type: BuildingType.BARRACKS, level: 3, provinceId: 'berlin', isUnderConstruction: false, constructionTimeLeft: 0 },
      { id: 'berlin-2', type: BuildingType.FACTORY, level: 4, provinceId: 'berlin', isUnderConstruction: false, constructionTimeLeft: 0 }
    ],
    morale: 90,
    infrastructure: 95,
    isCapital: true,
    neighbors: ['hamburg', 'munich', 'cologne']
  },
  {
    id: 'hamburg',
    name: 'Гамбург',
    countryId: 'germany',
    position: { x: 500, y: 220 },
    population: 1200000,
    resources: { manpower: 200, steel: 80, oil: 20, food: 150, money: 600, research: 40 },
    buildings: [
      { id: 'hamburg-1', type: BuildingType.PORT, level: 3, provinceId: 'hamburg', isUnderConstruction: false, constructionTimeLeft: 0 }
    ],
    morale: 85,
    infrastructure: 80,
    isCapital: false,
    neighbors: ['berlin', 'cologne']
  },
  {
    id: 'munich',
    name: 'Мюнхен',
    countryId: 'germany',
    position: { x: 550, y: 360 },
    population: 1000000,
    resources: { manpower: 180, steel: 100, oil: 15, food: 120, money: 400, research: 60 },
    buildings: [],
    morale: 82,
    infrastructure: 78,
    isCapital: false,
    neighbors: ['berlin', 'vienna']
  },
  {
    id: 'cologne',
    name: 'Кёльн',
    countryId: 'germany',
    position: { x: 460, y: 300 },
    population: 800000,
    resources: { manpower: 150, steel: 120, oil: 10, food: 100, money: 350, research: 30 },
    buildings: [
      { id: 'cologne-1', type: BuildingType.FACTORY, level: 2, provinceId: 'cologne', isUnderConstruction: false, constructionTimeLeft: 0 }
    ],
    morale: 80,
    infrastructure: 75,
    isCapital: false,
    neighbors: ['berlin', 'hamburg', 'paris']
  },

  // France
  {
    id: 'paris',
    name: 'Париж',
    countryId: 'france',
    position: { x: 320, y: 350 },
    population: 3000000,
    resources: { manpower: 500, steel: 150, oil: 25, food: 250, money: 900, research: 150 },
    buildings: [
      { id: 'paris-1', type: BuildingType.RESEARCH_LAB, level: 4, provinceId: 'paris', isUnderConstruction: false, constructionTimeLeft: 0 },
      { id: 'paris-2', type: BuildingType.BARRACKS, level: 3, provinceId: 'paris', isUnderConstruction: false, constructionTimeLeft: 0 }
    ],
    morale: 88,
    infrastructure: 92,
    isCapital: true,
    neighbors: ['lyon', 'lille', 'cologne']
  },
  {
    id: 'lyon',
    name: 'Лион',
    countryId: 'france',
    position: { x: 380, y: 420 },
    population: 900000,
    resources: { manpower: 150, steel: 80, oil: 15, food: 120, money: 300, research: 40 },
    buildings: [],
    morale: 84,
    infrastructure: 70,
    isCapital: false,
    neighbors: ['paris', 'marseille']
  },
  {
    id: 'lille',
    name: 'Лилль',
    countryId: 'france',
    position: { x: 380, y: 290 },
    population: 600000,
    resources: { manpower: 120, steel: 60, oil: 10, food: 80, money: 250, research: 20 },
    buildings: [],
    morale: 80,
    infrastructure: 68,
    isCapital: false,
    neighbors: ['paris', 'london']
  },
  {
    id: 'marseille',
    name: 'Марсель',
    countryId: 'france',
    position: { x: 400, y: 480 },
    population: 800000,
    resources: { manpower: 140, steel: 40, oil: 20, food: 100, money: 280, research: 25 },
    buildings: [
      { id: 'marseille-1', type: BuildingType.PORT, level: 2, provinceId: 'marseille', isUnderConstruction: false, constructionTimeLeft: 0 }
    ],
    morale: 82,
    infrastructure: 72,
    isCapital: false,
    neighbors: ['lyon', 'rome']
  },

  // United Kingdom
  {
    id: 'london',
    name: 'Лондон',
    countryId: 'uk',
    position: { x: 250, y: 280 },
    population: 4500000,
    resources: { manpower: 600, steel: 180, oil: 40, food: 300, money: 1200, research: 200 },
    buildings: [
      { id: 'london-1', type: BuildingType.PORT, level: 4, provinceId: 'london', isUnderConstruction: false, constructionTimeLeft: 0 },
      { id: 'london-2', type: BuildingType.AIRFIELD, level: 3, provinceId: 'london', isUnderConstruction: false, constructionTimeLeft: 0 }
    ],
    morale: 92,
    infrastructure: 98,
    isCapital: true,
    neighbors: ['manchester', 'lille']
  },
  {
    id: 'manchester',
    name: 'Манчестер',
    countryId: 'uk',
    position: { x: 220, y: 240 },
    population: 1200000,
    resources: { manpower: 200, steel: 150, oil: 20, food: 100, money: 400, research: 60 },
    buildings: [
      { id: 'manchester-1', type: BuildingType.FACTORY, level: 3, provinceId: 'manchester', isUnderConstruction: false, constructionTimeLeft: 0 }
    ],
    morale: 86,
    infrastructure: 82,
    isCapital: false,
    neighbors: ['london', 'glasgow']
  },
  {
    id: 'glasgow',
    name: 'Глазго',
    countryId: 'uk',
    position: { x: 200, y: 180 },
    population: 800000,
    resources: { manpower: 150, steel: 100, oil: 30, food: 80, money: 250, research: 30 },
    buildings: [],
    morale: 84,
    infrastructure: 76,
    isCapital: false,
    neighbors: ['manchester']
  },

  // Russia
  {
    id: 'moscow',
    name: 'Москва',
    countryId: 'russia',
    position: { x: 800, y: 250 },
    population: 1800000,
    resources: { manpower: 600, steel: 200, oil: 80, food: 400, money: 600, research: 100 },
    buildings: [
      { id: 'moscow-1', type: BuildingType.FORT, level: 4, provinceId: 'moscow', isUnderConstruction: false, constructionTimeLeft: 0 },
      { id: 'moscow-2', type: BuildingType.BARRACKS, level: 3, provinceId: 'moscow', isUnderConstruction: false, constructionTimeLeft: 0 }
    ],
    morale: 90,
    infrastructure: 80,
    isCapital: true,
    neighbors: ['st_petersburg', 'kiev', 'stalingrad']
  },
  {
    id: 'st_petersburg',
    name: 'Санкт-Петербург',
    countryId: 'russia',
    position: { x: 750, y: 150 },
    population: 1400000,
    resources: { manpower: 300, steel: 120, oil: 40, food: 200, money: 400, research: 80 },
    buildings: [
      { id: 'spb-1', type: BuildingType.PORT, level: 3, provinceId: 'st_petersburg', isUnderConstruction: false, constructionTimeLeft: 0 }
    ],
    morale: 85,
    infrastructure: 75,
    isCapital: false,
    neighbors: ['moscow']
  },
  {
    id: 'kiev',
    name: 'Киев',
    countryId: 'russia',
    position: { x: 720, y: 350 },
    population: 900000,
    resources: { manpower: 250, steel: 80, oil: 30, food: 180, money: 250, research: 40 },
    buildings: [],
    morale: 82,
    infrastructure: 65,
    isCapital: false,
    neighbors: ['moscow', 'vienna']
  },
  {
    id: 'stalingrad',
    name: 'Сталинград',
    countryId: 'russia',
    position: { x: 900, y: 350 },
    population: 600000,
    resources: { manpower: 200, steel: 100, oil: 60, food: 120, money: 200, research: 20 },
    buildings: [
      { id: 'stalingrad-1', type: BuildingType.RESOURCE_EXTRACTOR, level: 2, provinceId: 'stalingrad', isUnderConstruction: false, constructionTimeLeft: 0 }
    ],
    morale: 88,
    infrastructure: 60,
    isCapital: false,
    neighbors: ['moscow']
  },

  // Italy
  {
    id: 'rome',
    name: 'Рим',
    countryId: 'italy',
    position: { x: 520, y: 520 },
    population: 1200000,
    resources: { manpower: 250, steel: 60, oil: 20, food: 150, money: 400, research: 60 },
    buildings: [
      { id: 'rome-1', type: BuildingType.RESEARCH_LAB, level: 2, provinceId: 'rome', isUnderConstruction: false, constructionTimeLeft: 0 }
    ],
    morale: 85,
    infrastructure: 78,
    isCapital: true,
    neighbors: ['milan', 'naples', 'marseille']
  },
  {
    id: 'milan',
    name: 'Милан',
    countryId: 'italy',
    position: { x: 480, y: 460 },
    population: 800000,
    resources: { manpower: 180, steel: 100, oil: 15, food: 100, money: 350, research: 40 },
    buildings: [
      { id: 'milan-1', type: BuildingType.FACTORY, level: 2, provinceId: 'milan', isUnderConstruction: false, constructionTimeLeft: 0 }
    ],
    morale: 82,
    infrastructure: 75,
    isCapital: false,
    neighbors: ['rome', 'vienna']
  },
  {
    id: 'naples',
    name: 'Неаполь',
    countryId: 'italy',
    position: { x: 560, y: 580 },
    population: 700000,
    resources: { manpower: 150, steel: 40, oil: 10, food: 120, money: 200, research: 25 },
    buildings: [
      { id: 'naples-1', type: BuildingType.PORT, level: 2, provinceId: 'naples', isUnderConstruction: false, constructionTimeLeft: 0 }
    ],
    morale: 80,
    infrastructure: 65,
    isCapital: false,
    neighbors: ['rome']
  },

  // Austria-Hungary
  {
    id: 'vienna',
    name: 'Вена',
    countryId: 'austria',
    position: { x: 600, y: 380 },
    population: 1500000,
    resources: { manpower: 300, steel: 120, oil: 25, food: 180, money: 500, research: 80 },
    buildings: [
      { id: 'vienna-1', type: BuildingType.BARRACKS, level: 2, provinceId: 'vienna', isUnderConstruction: false, constructionTimeLeft: 0 }
    ],
    morale: 83,
    infrastructure: 82,
    isCapital: true,
    neighbors: ['budapest', 'prague', 'munich', 'milan', 'kiev']
  },
  {
    id: 'budapest',
    name: 'Будапешт',
    countryId: 'austria',
    position: { x: 650, y: 420 },
    population: 900000,
    resources: { manpower: 200, steel: 80, oil: 20, food: 140, money: 300, research: 40 },
    buildings: [],
    morale: 80,
    infrastructure: 70,
    isCapital: false,
    neighbors: ['vienna', 'constantinople']
  },
  {
    id: 'prague',
    name: 'Прага',
    countryId: 'austria',
    position: { x: 580, y: 320 },
    population: 700000,
    resources: { manpower: 150, steel: 100, oil: 15, food: 100, money: 250, research: 50 },
    buildings: [
      { id: 'prague-1', type: BuildingType.FACTORY, level: 1, provinceId: 'prague', isUnderConstruction: false, constructionTimeLeft: 0 }
    ],
    morale: 78,
    infrastructure: 68,
    isCapital: false,
    neighbors: ['vienna']
  }
];

export const STARTING_UNITS: { [provinceId: string]: Omit<Unit, 'id' | 'position' | 'provinceId'>[] } = {
  berlin: [
    {
      type: UnitType.INFANTRY,
      name: '1-я Гвардейская дивизия',
      health: 100,
      maxHealth: 100,
      attack: 30,
      defense: 35,
      speed: 3,
      range: 1,
      isMoving: false,
      experience: 20,
      morale: 90
    },
    {
      type: UnitType.ARMOR,
      name: '1-я Танковая дивизия',
      health: 100,
      maxHealth: 100,
      attack: 50,
      defense: 45,
      speed: 5,
      range: 2,
      isMoving: false,
      experience: 15,
      morale: 85
    }
  ],
  paris: [
    {
      type: UnitType.INFANTRY,
      name: '1ère Division',
      health: 100,
      maxHealth: 100,
      attack: 28,
      defense: 32,
      speed: 3,
      range: 1,
      isMoving: false,
      experience: 18,
      morale: 88
    }
  ],
  london: [
    {
      type: UnitType.FIGHTER,
      name: 'RAF Squadron 1',
      health: 100,
      maxHealth: 100,
      attack: 40,
      defense: 30,
      speed: 8,
      range: 4,
      isMoving: false,
      experience: 25,
      morale: 95
    },
    {
      type: UnitType.NAVAL_SHIP,
      name: 'HMS Dreadnought',
      health: 100,
      maxHealth: 100,
      attack: 70,
      defense: 60,
      speed: 4,
      range: 5,
      isMoving: false,
      experience: 30,
      morale: 92
    }
  ],
  moscow: [
    {
      type: UnitType.INFANTRY,
      name: '1-я Гвардейская дивизия',
      health: 100,
      maxHealth: 100,
      attack: 32,
      defense: 38,
      speed: 3,
      range: 1,
      isMoving: false,
      experience: 22,
      morale: 92
    },
    {
      type: UnitType.ARTILLERY,
      name: '1-я Артиллерийская бригада',
      health: 100,
      maxHealth: 100,
      attack: 65,
      defense: 20,
      speed: 2,
      range: 3,
      isMoving: false,
      experience: 18,
      morale: 88
    }
  ],
  rome: [
    {
      type: UnitType.INFANTRY,
      name: 'Bersaglieri',
      health: 100,
      maxHealth: 100,
      attack: 26,
      defense: 30,
      speed: 4,
      range: 1,
      isMoving: false,
      experience: 15,
      morale: 82
    }
  ],
  vienna: [
    {
      type: UnitType.INFANTRY,
      name: 'K.u.K. Regiment',
      health: 100,
      maxHealth: 100,
      attack: 25,
      defense: 30,
      speed: 3,
      range: 1,
      isMoving: false,
      experience: 12,
      morale: 80
    }
  ]
};