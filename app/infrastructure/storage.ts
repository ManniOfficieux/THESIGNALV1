import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getSignupDate(): Promise<string | null> {
  return AsyncStorage.getItem('signupDate');
}

export async function setSignupDate(date: string): Promise<void> {
  await AsyncStorage.setItem('signupDate', date);
}

export async function getSignalsReceived(): Promise<number[]> {
  const json = await AsyncStorage.getItem('signalsReceived');
  return json ? JSON.parse(json) : [];
}

export async function setSignalsReceived(signals: number[]): Promise<void> {
  await AsyncStorage.setItem('signalsReceived', JSON.stringify(signals));
}
