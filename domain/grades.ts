import { MAJOR_SIGNALS } from './signals';

export interface GradeInfo {
  level: number;
  name: string;
  perks: string[];
}

const GRADE_TABLE: GradeInfo[] = [
  { level: 0, name: 'Initié', perks: [] },
  { level: 3, name: 'Adepte', perks: ['indice_supplémentaire'] },
  { level: 6, name: 'Architecte', perks: ['mini_bonus'] },
  { level: 9, name: 'Maître', perks: ['avatars', 'candidature_secrète'] },
];

export function calculateGrade(resolvedSignals: number): GradeInfo {
  for (let i = GRADE_TABLE.length - 1; i >= 0; i--) {
    if (resolvedSignals >= GRADE_TABLE[i].level) {
      return GRADE_TABLE[i];
    }
  }
  return GRADE_TABLE[0];
}

export function getTotalSignals() {
  return MAJOR_SIGNALS.length;
}
