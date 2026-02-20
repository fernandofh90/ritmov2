export interface UserConfig {
  daysPerWeek: number;
  dailyTargets: {
    contacts: number;
    conversations: number;
    meetings: number;
    sales: number;
  };
  focus: 'prospecting' | 'meetings' | 'conversion';
  isOnboarded: boolean;
  socialPreference: 'SOLITARY' | 'SOCIAL';
  peakProductivity: 'MORNING' | 'AFTERNOON' | 'NIGHT';
  sleepGoal: number;
}

export interface EnergyLog {
  date: string;
  physical: {
    sleepHours: number;
    restedLevel: 'TIRED' | 'OK' | 'ENERGIZED';
    hadBreakfast: boolean;
  };
  mental: {
    focusBlocks: number;
    decisionFatigue: number; // 0-100
  };
  emotional: {
    drainers: string[];
    energizers: string[];
    batteryLevel: number; // 0-100
  };
  social: {
    interactions: number;
    drained: boolean;
  };
}

export interface DailyLog {
  date: string; // ISO Date string YYYY-MM-DD
  contacts: number;
  conversations: number;
  meetings: number;
  sales: number;
  energy?: EnergyLog;
}

export enum RhythmStatus {
  LOW = 'BAIXO',
  MEDIUM = 'MÉDIO',
  HEALTHY = 'SAUDÁVEL',
}

export interface Lesson {
  id: number;
  pillar: string;
  title: string;
  content: string;
}

export type ViewState = 'dashboard' | 'log' | 'guidance' | 'settings' | 'morning-checkin' | 'evening-checkin' | 'focus-mode' | 'break-mode';
