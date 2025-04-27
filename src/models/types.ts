
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

export type ProgrammingLanguage = 'python' | 'cpp' | 'lua' | 'javascript' | 'rust' | 'ruby';

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
  diskFree: number;
}

export interface VoiceCommand {
  name: string;
  description: string;
  command: string;
  action: () => Promise<void>;
}

export interface EditorSettings {
  fontSize: number;
  fontFamily: string;
  tabSize: number;
  insertSpaces: boolean;
  wordWrap: 'on' | 'off';
  theme: string;
}

export interface ContainerInfo {
  id: string;
  name: string;
  language: ProgrammingLanguage;
  status: 'running' | 'stopped' | 'error';
  memoryUsage: number;
  cpuUsage: number;
}
