import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserState } from '../domain/types';

const PREFIX = 'the_signal_v1:';

export const keys = {
  signupDate: `${PREFIX}signupDate`,
  activationCode: `${PREFIX}activationCode`,
  receivedSignals: `${PREFIX}receivedSignals`,
  receivedMinor: `${PREFIX}receivedMinor`,
  grade: `${PREFIX}grade`,
  subscription: `${PREFIX}subscription`,
};

export async function saveUserState(state: UserState) {
  await AsyncStorage.multiSet([
    [keys.signupDate, state.signupDate?.toISOString() ?? ''],
    [keys.activationCode, state.activationCode ?? ''],
    [keys.receivedSignals, JSON.stringify(state.receivedSignals)],
    [keys.receivedMinor, JSON.stringify(state.receivedMinorSignals)],
    [keys.grade, state.grade.toString()],
    [keys.subscription, JSON.stringify(state.subscriptionActive)],
  ]);
}

export async function loadUserState(): Promise<UserState> {
  const values = await AsyncStorage.multiGet(Object.values(keys));
  const obj: Record<string, string | null> = {};
  values.forEach(([k, v]) => (obj[k] = v));
  return {
    signupDate: obj[keys.signupDate] ? new Date(obj[keys.signupDate]!) : null,
    activationCode: obj[keys.activationCode] ?? undefined,
    receivedSignals: obj[keys.receivedSignals]
      ? JSON.parse(obj[keys.receivedSignals]!)
      : [],
    receivedMinorSignals: obj[keys.receivedMinor]
      ? JSON.parse(obj[keys.receivedMinor]!)
      : [],
    grade: Number(obj[keys.grade]) || 0,
    perks: [],
    subscriptionActive: obj[keys.subscription]
      ? JSON.parse(obj[keys.subscription]!)
      : false,
  };
}
