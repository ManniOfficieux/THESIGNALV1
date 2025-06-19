export interface Puzzle {
  title: string;
  riddle: string;
  hint: string;
  solutionCoordinates: [number, number];
}

export interface Signal {
  id: number;
  releaseDate: Date;
  puzzle: Puzzle;
}

export interface MinorSignal {
  id: number;
  text: string;
  gif?: string;
  sound?: string;
  globallySynced?: boolean;
  releaseDate: Date;
}

export interface UserState {
  signupDate: Date | null;
  activationCode?: string;
  receivedSignals: number[];
  receivedMinorSignals: number[];
  cohort?: 'A' | 'B';
  grade: number;
  perks: string[];
  subscriptionActive: boolean;
}
