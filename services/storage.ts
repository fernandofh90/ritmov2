import { DailyLog, UserConfig } from '../types';
import { INITIAL_CONFIG } from '../constants';

const KEYS = {
  CONFIG: 'ritmo_config',
  LOGS: 'ritmo_logs',
};

export const StorageService = {
  getConfig: (): UserConfig => {
    try {
      const data = localStorage.getItem(KEYS.CONFIG);
      return data ? JSON.parse(data) : INITIAL_CONFIG;
    } catch {
      return INITIAL_CONFIG;
    }
  },

  saveConfig: (config: UserConfig): void => {
    localStorage.setItem(KEYS.CONFIG, JSON.stringify(config));
  },

  getLogs: (): DailyLog[] => {
    try {
      const data = localStorage.getItem(KEYS.LOGS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveLog: (log: DailyLog): void => {
    const logs = StorageService.getLogs();
    const existingIndex = logs.findIndex((l) => l.date === log.date);

    if (existingIndex >= 0) {
      logs[existingIndex] = log;
    } else {
      logs.push(log);
    }
    
    // Sort logs by date descending
    logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    localStorage.setItem(KEYS.LOGS, JSON.stringify(logs));
  },

  getLogForDate: (date: string): DailyLog | null => {
    const logs = StorageService.getLogs();
    return logs.find((l) => l.date === date) || null;
  }
};
