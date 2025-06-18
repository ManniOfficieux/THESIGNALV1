import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SignalContextValue {
  signupDate: string | null;
  activated: boolean;
  receivedSignals: number[];
  setSignupDate: (date: string | null) => Promise<void>;
  setReceivedSignals: (signals: number[]) => Promise<void>;
}

export const SignalContext = createContext<SignalContextValue | undefined>(undefined);

export const SignalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [signupDate, setSignupDateState] = useState<string | null>(null);
  const [receivedSignals, setReceivedSignalsState] = useState<number[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const storedDate = await AsyncStorage.getItem('signupDate');
        const receivedJson = await AsyncStorage.getItem('signalsReceived');
        setSignupDateState(storedDate);
        if (receivedJson) {
          setReceivedSignalsState(JSON.parse(receivedJson));
        }
      } catch (e) {
        console.warn('Failed to load user progress', e);
      }
    };
    load();
  }, []);

  const setSignupDate = async (date: string | null) => {
    setSignupDateState(date);
    if (date) {
      await AsyncStorage.setItem('signupDate', date);
    } else {
      await AsyncStorage.removeItem('signupDate');
    }
  };

  const setReceivedSignals = async (signals: number[]) => {
    setReceivedSignalsState(signals);
    await AsyncStorage.setItem('signalsReceived', JSON.stringify(signals));
  };

  const value: SignalContextValue = {
    signupDate,
    activated: !!signupDate,
    receivedSignals,
    setSignupDate,
    setReceivedSignals,
  };

  return (
    <SignalContext.Provider value={value}>{children}</SignalContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(SignalContext);
  if (!context) throw new Error('useUser must be used within SignalProvider');
  const { signupDate, activated, setSignupDate } = context;
  return { signupDate, activated, setSignupDate };
};

export const useSignals = () => {
  const context = useContext(SignalContext);
  if (!context) throw new Error('useSignals must be used within SignalProvider');
  const { receivedSignals, setReceivedSignals } = context;
  return { receivedSignals, setReceivedSignals };
};
