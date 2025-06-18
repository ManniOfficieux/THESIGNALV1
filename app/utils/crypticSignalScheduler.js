/**
 * CONTENU NARRATIF DES SIGNAUX - LE SIGNAL
 * 
 * Ce module contient tous les contenus narratifs des 9 signaux majeurs.
 * Chaque signal révèle une partie de l'histoire et débloque du contenu.
 */

// Base de données des signaux narratifs
import signalsData from "../../config/signals.json";
export const SIGNAL_DATABASE = signalsData;

/**
 * Récupère le contenu d'un signal spécifique
 * @param {number} signalIndex - Index du signal (0-8)
 * @returns {Object} Contenu du signal
 */
export function getSignalContent(signalIndex) {
  return SIGNAL_DATABASE[signalIndex] || null;
}

/**
 * Génère une transmission aléatoire basée sur les signaux reçus
 * @param {Array} receivedSignals - Signaux déjà reçus
 * @returns {string} Transmission cryptique
 */
export function generateContextualTransmission(receivedSignals = []) {
  const maxSignal = Math.max(...receivedSignals, -1);
  let availableTransmissions = [];
  
  // Collecte toutes les transmissions des signaux reçus
  for (let i = 0; i <= maxSignal && i < 9; i++) {
    if (SIGNAL_DATABASE[i]) {
      availableTransmissions = [...availableTransmissions, ...SIGNAL_DATABASE[i].transmissions];
    }
  }
  
  // Si aucun signal reçu, utilise les transmissions de base
  if (availableTransmissions.length === 0) {
    availableTransmissions = [
      "🟡 Système en attente d'activation...",
      "🔒 Accès restreint. Autorisation requise.",
      "🟢 Terminal prêt pour première connexion.",
      "🟠 Signal faible détecté. Amplification en cours."
    ];
  }
  
  return availableTransmissions[Math.floor(Math.random() * availableTransmissions.length)];
}

/**
 * Détermine le message d'état basé sur la progression
 * @param {Array} receivedSignals - Signaux reçus
 * @param {Object} nextSignal - Prochain signal
 * @returns {string} Message d'état
 */
export function getStatusMessage(receivedSignals = [], nextSignal = null) {
  const signalCount = receivedSignals.length;
  
  if (signalCount === 0) {
    return ">>> En attente du signal d'activation...";
  }
  
  if (signalCount >= 9) {
    return ">>> MAÎTRE DU SIGNAL - Séquence terminée <<<";
  }
  
  if (!nextSignal) {
    return ">>> Tous les signaux disponibles ont été reçus <<<";
  }
  
  const phases = {
    0: "INITIALISATION",
    1: "IDENTIFICATION", 
    2: "DÉTECTION",
    3: "COMPRÉHENSION",
    4: "COMMUNICATION",
    5: "MENACE",
    6: "COMBAT",
    7: "DÉCISION",
    8: "RENAISSANCE"
  };
  
  const currentPhase = phases[signalCount] || "INCONNUE";
  return `>>> Phase ${currentPhase} - Prochain signal dans ${nextSignal.daysSinceStart - (signalCount * 21)} jours <<<`;
}

/**
 * Génère des indices cryptiques basés sur la progression
 * @param {Array} receivedSignals - Signaux reçus
 * @returns {Array} Liste d'indices
 */
export function getCrypticHints(receivedSignals = []) {
  const hints = [];
  
  receivedSignals.forEach(signalIndex => {
    const signal = SIGNAL_DATABASE[signalIndex];
    if (signal && signal.content.crypticHint) {
      hints.push(signal.content.crypticHint);
    }
  });
  
  return hints;
}

// Export des signaux pour compatibilité
export const signals = SIGNAL_DATABASE;