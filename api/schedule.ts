import { checkAndSendSignals, checkAndSendMinorSignals, User } from '../app/infrastructure/notification';

// Example user store. In a real application this would come from a database.
const users: User[] = [
  {
    id: 'user-1',
    signupDate: new Date().toISOString().slice(0, 10),
    receivedSignals: [],
  },
];

export async function runSchedule() {
  users.forEach((user) => {
    checkAndSendSignals(user);
    checkAndSendMinorSignals(user);
  });
}

// Execute immediately if run as a script
if (require.main === module) {
  runSchedule();
}
