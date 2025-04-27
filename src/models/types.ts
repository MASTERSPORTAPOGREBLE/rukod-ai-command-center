
export interface Library {
  id: string;
  name: string;
  description: string;
  version: string;
  language: ProgrammingLanguage;
  source: string;
  popularity: number;
  tags: string[];
  isPaid: boolean;
  isGame: boolean;
}

export type ProgrammingLanguage = 'python' | 'cpp' | 'lua' | 'javascript';

export interface Theme {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
}

export interface SystemStats {
  cpuUsage: number;
  ramUsage: number;
  diskSpace: number;
}
