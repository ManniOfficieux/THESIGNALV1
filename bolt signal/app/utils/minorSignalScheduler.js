export const MINOR_CONFIG = {
  TOTAL_DAYS: 168,
};

import { THE_SIGNAL_TRANSMISSIONS } from '../../assets/data/the_signal_transmissions';

export const MINOR_MESSAGES = THE_SIGNAL_TRANSMISSIONS.trim().split('\n');

export function calculateMinorDates(signupDate) {
  const startDate = new Date(signupDate);
  const dates = [];
  for (let i = 0; i < MINOR_CONFIG.TOTAL_DAYS; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    dates.push({
      index: i,
      date: date.toISOString().slice(0, 10),
      timestamp: date.getTime(),
    });
  }
  return dates;
}

export function getDueMinorSignals(received = [], signupDate) {
  const todayTimestamp = new Date(new Date().toISOString().slice(0, 10)).getTime();
  return calculateMinorDates(signupDate).filter(
    (d) => !received.includes(d.index) && d.timestamp <= todayTimestamp
  );
}

export function getNextMinorSignal(received = [], signupDate) {
  const todayTimestamp = new Date(new Date().toISOString().slice(0, 10)).getTime();
  return (
    calculateMinorDates(signupDate).find(
      (d) => !received.includes(d.index) && d.timestamp > todayTimestamp
    ) || null
  );
}

export function getMinorSignalContent(index) {
  return MINOR_MESSAGES[index % MINOR_MESSAGES.length] || '';
}
