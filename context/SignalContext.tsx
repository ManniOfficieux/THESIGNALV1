import React, { createContext, useContext } from 'react';
import { signals as SIGNALS } from '@/app/utils/crypticSignalScheduler';

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

interface SignalContextValue {
  signals: Record<number, Signal>;
  getSignal: (index: number) => Signal | undefined;
}

const SignalContext = createContext<SignalContextValue | null>(null);

export const SignalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value: SignalContextValue = {
    signals: SIGNALS as unknown as Record<number, Signal>,
    getSignal: (index) => (SIGNALS as any)[index],
  };

  return <SignalContext.Provider value={value}>{children}</SignalContext.Provider>;
};

export function useSignalContext() {
  const ctx = useContext(SignalContext);
  if (!ctx) throw new Error('SignalContext not found');
  return ctx;
}
