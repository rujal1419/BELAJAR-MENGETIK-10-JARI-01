export type Proficiency = 'GREEN' | 'ORANGE' | 'RED';

export enum Level {
  PEMULA = 'PEMULA',
  MENENGAH = 'MENENGAH',
  MAHIR = 'MAHIR'
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