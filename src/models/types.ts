
// This file might not exist yet, so we're creating it 
export type Theme = {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
};

export type ProgrammingLanguage = 'python' | 'cpp' | 'javascript' | 'typescript' | 'rust' | 'ruby' | 'lua' | 'all';

export interface ContainerInfo {
  id: string;
  name: string;
  language: ProgrammingLanguage;
  status: string;
  memoryUsage: number;
  cpuUsage: number;
  tags?: string[];
  libraryId?: string;
  startTime: Date;
}

export interface Library {
  id: string;
  name: string;
  description: string;
  language: ProgrammingLanguage;
  version: string;
  author: string;
  isStable: boolean;
  downloadCount: number;
  lastUpdated: string;
  documentation?: string;
  repository?: string;
  license: string;
  size?: string;
  tags: string[];
  dependencies?: string[];
  // Add these properties to fix type errors
  source?: string;
  popularity?: number;
  isPaid?: boolean;
  isGame?: boolean;
}

export interface LogEntry {
  id: string;
  level: string;
  message: string;
  timestamp: Date;
}

export interface SystemStats {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  activeContainers: number;
  uptime: number;
  // Add these properties to fix the type errors
  ramUsage: number;
  diskSpace: number;
  diskFree: number;
}

// Interface for LibraryFilters props
export interface LibraryFiltersProps {
  searchTerm?: string;
  setSearchTerm?: (term: string) => void;
  selectedLanguage: ProgrammingLanguage | undefined;
  setSelectedLanguage: (language: ProgrammingLanguage | undefined) => void;
  sortOption?: string;
  setSortOption?: (option: string) => void;
  filterStable?: boolean;
  setFilterStable?: (stable: boolean) => void;
  filterPopular?: boolean;
  setFilterPopular?: (popular: boolean) => void;
  filterNew?: boolean;
  setFilterNew?: (isNew: boolean) => void;
  showGameLibraries?: boolean;
  setShowGameLibraries?: (show: boolean) => void;
  // Add these properties to fix errors
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onLanguageChange?: (language: ProgrammingLanguage | undefined) => void;
  showFreeOnly?: boolean;
  onFreeOnlyChange?: (showFree: boolean) => void;
  showGamesOnly?: boolean;
  onGamesOnlyChange?: (showGames: boolean) => void;
  selectedCategory?: string;
  onCategoryChange?: (category: string | undefined) => void;
}

// Update the LibraryCardProps interface to make onInstall props more flexible
export interface LibraryCardProps {
  library: Library;
  onSelect?: () => void;
  onInstall: () => Promise<void> | void;
  isSelected?: boolean;
  onToggleSelect?: () => void;
}
