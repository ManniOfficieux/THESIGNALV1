import { MAJOR_SIGNALS, MINOR_SIGNALS } from './signals';
import { calculateGrade } from './grades';
import { loadUserState, saveUserState } from '../infrastructure/asyncStorage';
import { schedulePush } from '../infrastructure/boltApi';

export async function checkAndSendSignals() {
  const state = await loadUserState();
  if (!state.signupDate) return;
  const now = new Date();
  const due = MAJOR_SIGNALS.filter(
    s => s.releaseDate <= now && !state.receivedSignals.includes(s.id)
  );
  for (const s of due) {
    await schedulePush('Nouveau Signal', s.puzzle.title, s.releaseDate);
    state.receivedSignals.push(s.id);
  }
  const gradeInfo = calculateGrade(state.receivedSignals.length);
  state.grade = gradeInfo.level;
  state.perks = gradeInfo.perks;
  await saveUserState(state);
}

export async function checkAndSendMinorSignals() {
  const state = await loadUserState();
  if (!state.signupDate) return;
  const now = new Date();
  const due = MINOR_SIGNALS.filter(
    m => m.releaseDate <= now && !state.receivedMinorSignals.includes(m.id)
  );
  for (const m of due) {
    await schedulePush('Mini Signal', m.text, m.releaseDate);
    state.receivedMinorSignals.push(m.id);
  }
  await saveUserState(state);
}
