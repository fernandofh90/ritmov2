import { DailyLog, UserConfig, RhythmStatus } from '../types';

export const getWeekStartAndEnd = () => {
  const curr = new Date();
  const first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
  const last = first + 6; // last day is the first day + 6

  const firstday = new Date(curr.setDate(first)).toISOString().split('T')[0];
  const lastday = new Date(curr.setDate(last)).toISOString().split('T')[0];
  
  return { start: firstday, end: lastday };
};

export const getWeeklyLogs = (logs: DailyLog[]): DailyLog[] => {
  const { start, end } = getWeekStartAndEnd();
  const startTs = new Date(start).getTime();
  const endTs = new Date(end).getTime();

  return logs.filter((log) => {
    const logTs = new Date(log.date).getTime();
    return logTs >= startTs && logTs <= endTs;
  });
};

export const calculateRhythmStatus = (
  weeklyLogs: DailyLog[], 
  config: UserConfig
): { status: RhythmStatus; message: string; totals: { contacts: number; conversations: number; meetings: number; sales: number } } => {
  
  const totals = weeklyLogs.reduce((acc, log) => ({
    contacts: acc.contacts + (log.contacts || 0),
    conversations: acc.conversations + (log.conversations || 0),
    meetings: acc.meetings + (log.meetings || 0),
    sales: acc.sales + (log.sales || 0),
  }), { contacts: 0, conversations: 0, meetings: 0, sales: 0 });

  // Calculate expected volume for a "Healthy" week based on days configured
  // We assume a linear week for simplicity of calculation in V1
  const weeklyTargetContacts = config.dailyTargets.contacts * config.daysPerWeek;
  
  // Scoring algorithm: 
  // We weight the metrics. Contacts are foundational (30%), Conversations are validation (40%), Meetings are advanced (30%).
  // However, simple volume check is often better for "Rhythm".
  
  // Let's use a percentage of the *expected* weekly goal to determine rhythm.
  const contactProgress = totals.contacts / (weeklyTargetContacts || 1);
  
  let status: RhythmStatus = RhythmStatus.LOW;
  let message = "";

  // The logic mimics the "Espelho Comercial" from the prompt
  if (contactProgress >= 0.8) {
    status = RhythmStatus.HEALTHY;
    message = "Com o volume desta semana, sua consistência está sólida para conversão.";
  } else if (contactProgress >= 0.5) {
    status = RhythmStatus.MEDIUM;
    message = "Com o volume atual, a chance estatística de fechamento é moderada.";
  } else {
    status = RhythmStatus.LOW;
    message = "Com o ritmo atual, sua chance estatística de fechamento é baixa.";
  }

  return { status, message, totals };
};
