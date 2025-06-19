export async function sendActivationEmail(email: string, code: string) {
  console.log(`sendActivationEmail to ${email} with code ${code}`);
}

export async function schedulePush(title: string, body: string, when: Date) {
  console.log(`schedulePush '${title}' at ${when.toISOString()}`);
}

export async function logAnalytics(event: string, payload?: Record<string, any>) {
  console.log(`analytics ${event}`, payload);
}

export async function simulatePurchase(productId: string) {
  console.log(`simulatePurchase ${productId}`);
  return { success: true };
}
