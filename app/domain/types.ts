export interface Puzzle {
  id: string;
  question: string;
  answer: string;
  hints?: string[];
  solved?: boolean;
}

export interface MinorSignal {
  index: number;
  date: string;
  timestamp: number;
  daysSinceStart: number;
}

export interface Signal {
  title: string;
  phase: string;
  urgency: string;
  content: {
    mainMessage: string;
    crypticHint: string;
    technicalData: string;
    unlocks: string[];
  };
  transmissions: string[];
}
