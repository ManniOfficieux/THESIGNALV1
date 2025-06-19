import { Signal, MinorSignal } from './types';

const START_DATE = new Date('2024-01-01T00:00:00Z');
const DAY = 24 * 60 * 60 * 1000;

export const MAJOR_SIGNALS: Signal[] = Array.from({ length: 9 }, (_, i) => ({
  id: i,
  releaseDate: new Date(START_DATE.getTime() + i * 21 * DAY),
  puzzle: {
    title: `Signal #${i + 1}`,
    riddle: `Énigme ${i + 1}...`,
    hint: `Indice ${i + 1}`,
    solutionCoordinates: [48.8566 + i * 0.01, 2.3522 + i * 0.01],
  },
}));

export const MINOR_SIGNALS: MinorSignal[] = Array.from({ length: 168 }, (_, i) => ({
  id: i,
  text: `Mini-signal ${i + 1}`,
  globallySynced: i % 10 === 0,
  releaseDate: new Date(START_DATE.getTime() + i * DAY),
}));
