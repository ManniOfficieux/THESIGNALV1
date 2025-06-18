/**
 * SYSTÈME DE PLANIFICATION DES SIGNAUX - LE SIGNAL
 * 
 * Ce module gère la logique temporelle des 9 signaux majeurs
 * diffusés tous les 21 jours sur une période de 6 mois.
 * 
 * Architecture narrative :
 * - Signal 0 : Activation initiale (jour 0)
 * - Signaux 1-8 : Progression narrative (tous les 21 jours)
 * - Chaque signal débloque du contenu et fait progresser l'histoire
 */

// Configuration temporelle des signaux
import { MinorSignal } from '../domain/types';

export const SIGNAL_CONFIG = {
  INTERVAL_DAYS: 21,
  TOTAL_SIGNALS: 9,
  TOTAL_DURATION_DAYS: 168, // 8 * 21 jours = ~5.5 mois
};

/**
 * Calcule les dates de diffusion de tous les signaux
 * @param {string} signupDate - Date d'inscription au format YYYY-MM-DD
 * @returns {Array} Tableau des dates de signaux
 */
export function calculateSignalDates(signupDate: string): MinorSignal[] {
  const startDate = new Date(signupDate);
  const signalDates: MinorSignal[] = [];
  
  for (let i = 0; i < SIGNAL_CONFIG.TOTAL_SIGNALS; i++) {
    const signalDate = new Date(startDate);
    signalDate.setDate(startDate.getDate() + (i * SIGNAL_CONFIG.INTERVAL_DAYS));
    signalDates.push({
      index: i,
      date: signalDate.toISOString().slice(0, 10),
      timestamp: signalDate.getTime(),
      daysSinceStart: i * SIGNAL_CONFIG.INTERVAL_DAYS
    });
  }
  
  return signalDates;
}

/**
 * Détermine quels signaux sont dus aujourd'hui
 * @param {Array} receivedSignals - Indices des signaux déjà reçus
 * @param {string} signupDate - Date d'inscription
 * @returns {Array} Signaux dus aujourd'hui
 */
export function getDueSignals(
  receivedSignals: number[] = [],
  signupDate: string
): MinorSignal[] {
  const today = new Date().toISOString().slice(0, 10);
  const todayTimestamp = new Date(today).getTime();
  
  const allSignalDates = calculateSignalDates(signupDate);
  
  return allSignalDates.filter(signal => {
    // Signal pas encore reçu ET date atteinte ou dépassée
    return !receivedSignals.includes(signal.index) && 
           signal.timestamp <= todayTimestamp;
  });
}

/**
 * Calcule le prochain signal à venir
 * @param {Array} receivedSignals - Signaux déjà reçus
 * @param {string} signupDate - Date d'inscription
 * @returns {Object|null} Prochain signal ou null si terminé
 */
export function getNextSignal(
  receivedSignals: number[] = [],
  signupDate: string
): MinorSignal | null {
  const today = new Date().toISOString().slice(0, 10);
  const todayTimestamp = new Date(today).getTime();
  
  const allSignalDates = calculateSignalDates(signupDate);
  
  const nextSignal = allSignalDates.find(signal => {
    return !receivedSignals.includes(signal.index) && 
           signal.timestamp > todayTimestamp;
  });
  
  return nextSignal || null;
}

/**
 * Calcule le temps restant jusqu'au prochain signal
 * @param {Array} receivedSignals - Signaux déjà reçus
 * @param {string} signupDate - Date d'inscription
 * @returns {Object} Temps restant formaté
 */
export function getTimeUntilNextSignal(
  receivedSignals: number[] = [],
  signupDate: string
): { days?: number; hours?: number; minutes?: number; totalMs?: number; message: string; completed?: boolean; ready?: boolean } {
  const nextSignal = getNextSignal(receivedSignals, signupDate);
  
  if (!nextSignal) {
    return { completed: true, message: "Séquence terminée" };
  }
  
  const now = new Date().getTime();
  const timeLeft = nextSignal.timestamp - now;
  
  if (timeLeft <= 0) {
    return { ready: true, message: "Signal disponible" };
  }
  
  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  
  return {
    days,
    hours,
    minutes,
    totalMs: timeLeft,
    message: `${days}j ${hours}h ${minutes}min`
  };
}

/**
 * Détermine le niveau d'accès basé sur les signaux reçus
 * @param {Array} receivedSignals - Signaux reçus
 * @returns {Object} Niveau d'accès et permissions
 */
export function getAccessLevel(receivedSignals: number[] = []): {
  level: number;
  name: string;
  description: string;
  permissions: string[];
  nextUnlock: string | null;
} {
  const signalCount = receivedSignals.length;
  
  if (signalCount === 0) {
    return {
      level: 0,
      name: "PUBLIC",
      description: "Accès de base au réseau",
      permissions: ["view_basic", "receive_signals"],
      nextUnlock: "Recevoir le premier signal"
    };
  }
  
  if (signalCount >= 1 && signalCount < 3) {
    return {
      level: 1,
      name: "INITIÉ",
      description: "Accès aux transmissions cryptées",
      permissions: ["view_basic", "receive_signals", "decrypt_level1"],
      nextUnlock: "Recevoir 3 signaux au total"
    };
  }
  
  if (signalCount >= 3 && signalCount < 6) {
    return {
      level: 2,
      name: "OPÉRATEUR",
      description: "Accès aux nœuds distants",
      permissions: ["view_basic", "receive_signals", "decrypt_level1", "access_nodes", "view_metrics"],
      nextUnlock: "Recevoir 6 signaux au total"
    };
  }
  
  if (signalCount >= 6 && signalCount < 9) {
    return {
      level: 3,
      name: "ARCHITECTE",
      description: "Accès complet au réseau",
      permissions: ["view_basic", "receive_signals", "decrypt_level1", "access_nodes", "view_metrics", "deep_access"],
      nextUnlock: "Recevoir tous les signaux"
    };
  }
  
  return {
    level: 4,
    name: "MAÎTRE DU SIGNAL",
    description: "Contrôle total - Séquence terminée",
    permissions: ["all_access"],
    nextUnlock: null
  };
}

/**
 * Génère des statistiques sur la progression
 * @param {Array} receivedSignals - Signaux reçus
 * @param {string} signupDate - Date d'inscription
 * @returns {Object} Statistiques de progression
 */
export function getProgressStats(
  receivedSignals: number[] = [],
  signupDate: string
): {
  signalsReceived: number;
  totalSignals: number;
  percentage: number;
  daysSinceStart: number;
  accessLevel: number;
  accessName: string;
  nextSignalIndex: number | null;
  isComplete: boolean;
} {
  const totalSignals = SIGNAL_CONFIG.TOTAL_SIGNALS;
  const received = receivedSignals.length;
  const percentage = Math.round((received / totalSignals) * 100);
  
  const startDate = new Date(signupDate);
  const now = new Date();
  const daysSinceStart = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
  
  const accessLevel = getAccessLevel(receivedSignals);
  const nextSignal = getNextSignal(receivedSignals, signupDate);
  
  return {
    signalsReceived: received,
    totalSignals,
    percentage,
    daysSinceStart,
    accessLevel: accessLevel.level,
    accessName: accessLevel.name,
    nextSignalIndex: nextSignal ? nextSignal.index : null,
    isComplete: received >= totalSignals
  };
}
