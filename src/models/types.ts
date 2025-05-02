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
