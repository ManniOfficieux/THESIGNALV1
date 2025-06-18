import { getDueSignals } from '../utils/signalScheduler';
import { generateContextualTransmission } from '../utils/crypticSignalScheduler';

export interface User {
  id: string;
  signupDate: string;
  receivedSignals: number[];
  deviceToken?: string;
}

function sendNotification(user: User, message: string) {
  // Placeholder implementation. In a real app, integrate with Expo or another
  // push notification service.
  console.log(`Sending notification to ${user.id}: ${message}`);
}

export function checkAndSendSignals(user: User) {
  const dueSignals = getDueSignals(user.receivedSignals, user.signupDate);

  if (dueSignals.length === 0) {
    return;
  }

  dueSignals.forEach((signal) => {
    sendNotification(user, `Signal #${signal.index} disponible`);
    if (!user.receivedSignals.includes(signal.index)) {
      user.receivedSignals.push(signal.index);
    }
  });
}

export function checkAndSendMinorSignals(user: User) {
  const message = generateContextualTransmission(user.receivedSignals);
  sendNotification(user, message);
}
