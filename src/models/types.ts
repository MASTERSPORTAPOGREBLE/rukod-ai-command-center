
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

export type ProgrammingLanguage = 'python' | 'cpp' | 'lua' | 'javascript' | 'rust' | 'ruby';

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
  version: string;
  language: ProgrammingLanguage;
  source: string;
  popularity: number;
  tags?: string[];
  isPaid?: boolean;
  isGame?: boolean;
}

export interface LogEntry {
  id: string;
  level: string;
  message: string;
  timestamp: Date;
}
