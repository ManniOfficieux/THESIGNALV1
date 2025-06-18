// Simple analytics wrapper around Sentry and LogRocket
// This file centralizes calls so the rest of the app can remain
// agnostic of the underlying service implementations.
import * as Sentry from '@sentry/react-native';
import LogRocket from 'logrocket-react-native';

/**
 * Initialize analytics providers. Should be called once at app start.
 */
export function initAnalytics() {
  try {
    Sentry.init({ dsn: 'YOUR_SENTRY_DSN' });
  } catch (e) {
    // noop - analytics optional
  }
  try {
    LogRocket.init('YOUR_LOGROCKET_APP_ID');
  } catch (e) {
    // noop
  }
}

function capture(event: string, data?: Record<string, any>) {
  try {
    Sentry.captureMessage(event, { extra: data });
  } catch {}
  try {
    LogRocket.track(event, data);
  } catch {}
}

export function trackActivation() {
  capture('activation');
}

export function trackSignalReceived(index: number) {
  capture('signal_received', { index });
}

export function trackPuzzleSolved(id: string) {
  capture('puzzle_solved', { id });
}
