export type Proficiency = 'GREEN' | 'ORANGE' | 'RED';

export enum Level {
  LEVEL_1 = 'LEVEL_1', // Home Row (ASDF)
  LEVEL_2 = 'LEVEL_2', // Top Row (QWERTY)
  LEVEL_3 = 'LEVEL_3', // Bottom Row (ZXCV)
  LEVEL_4 = 'LEVEL_4', // Kata Mutiara Pendek
  LEVEL_5 = 'LEVEL_5'  // Kutipan Inspiratif
}

export interface LetterStat {
  attempts: number;
  errors: number;
}

export interface SessionResult {
  id: number;
  wpm: number;
  accuracy: number;
  date: string;
}

export interface UserState {
  level: Level;
  history: SessionResult[];
  timeRemaining: number; // in seconds
  targetDuration: number; // in seconds
  letterStats: Record<string, LetterStat>;
  totalSessions: number;
}