import AsyncStorage from '@react-native-async-storage/async-storage';
import * as MailComposer from 'expo-mail-composer';

function generateActivationCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const rnd = (len: number) => Array.from({ length: len })
    .map(() => chars[Math.floor(Math.random() * chars.length)])
    .join('');
  return `${rnd(4)}-${rnd(2)}9`;
}

export async function onPaymentSuccess(user: { email: string; name?: string }) {
  const code = generateActivationCode();
  await AsyncStorage.setItem('activationCode', code);
  await AsyncStorage.setItem('isActivated', 'false');

  const body = `Bonjour${user.name ? ' ' + user.name : ''},\n\nVoici votre code d'activation : ${code}`;
  if (await MailComposer.isAvailableAsync()) {
    await MailComposer.composeAsync({
      recipients: [user.email],
      subject: 'Code d\'activation',
      body,
    });
  }
  return code;
}
