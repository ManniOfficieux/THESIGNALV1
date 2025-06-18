/**
 * CONTENU NARRATIF DES SIGNAUX - LE SIGNAL
 * 
 * Ce module contient tous les contenus narratifs des 9 signaux majeurs.
 * Chaque signal révèle une partie de l'histoire et débloque du contenu.
 */

// Base de données des signaux narratifs
export const SIGNAL_DATABASE = {
  0: {
    title: "SIGNAL D'ACTIVATION",
    phase: "INITIALISATION",
    urgency: "NORMALE",
    content: {
      mainMessage: ">>> BIENVENUE DANS LE RÉSEAU <<<\n\nVotre terminal a été activé. Vous faites maintenant partie du Signal.\n\nPremière directive : OBSERVEZ. ÉCOUTEZ. NE RÉVÉLEZ RIEN.\n\nLes autres signaux suivront selon le protocole établi.",
      crypticHint: "\"Ils ne savent pas encore que vous existez. C'est votre avantage.\"",
      technicalData: "Fréquence : 432.7 Hz | Origine : NŒUD-ALPHA | Chiffrement : Niveau 1",
      unlocks: ["Accès au réseau de base", "Réception des transmissions"]
    },
    transmissions: [
      "🟢 Nouveau terminal activé. ID assigné.",
      "🟡 Protocoles de sécurité initialisés.",
      "🔒 Clés de chiffrement distribuées.",
      "🟢 Connexion au réseau établie."
    ]
  },

  1: {
    title: "SIGNAL DE RECONNAISSANCE",
    phase: "IDENTIFICATION",
    urgency: "ÉLEVÉE",
    content: {
      mainMessage: ">>> PREMIÈRE TRANSMISSION MAJEURE <<<\n\nVous avez prouvé votre fiabilité. Le réseau vous reconnaît.\n\nNOUVELLE DIRECTIVE : Surveillez les motifs dans les transmissions quotidiennes. Certains messages ne sont pas ce qu'ils semblent.\n\nATTENTION : Des entités inconnues tentent d'infiltrer le réseau.",
      crypticHint: "\"Quatre d'entre eux observent. Un seul comprend vraiment.\"",
      technicalData: "Fréquence : 847.3 Hz | Origine : NŒUD-BETA | Chiffrement : Niveau 2",
      unlocks: ["Décryptage niveau 1", "Accès aux transmissions cryptées"]
    },
    transmissions: [
      "🔴 Tentative d'intrusion détectée sur GAMMA-7.",
      "🟡 Motifs anormaux dans les transmissions 14:32.",
      "🟢 Nouveau niveau d'accès accordé.",
      "🔒 Surveillance renforcée activée."
    ]
  },

  2: {
    title: "SIGNAL D'ALERTE",
    phase: "DÉTECTION",
    urgency: "CRITIQUE",
    content: {
      mainMessage: ">>> ALERTE RÉSEAU <<<\n\nIls savent. Quelque chose a changé dans les transmissions.\n\nDIRECTIVE URGENTE : Analysez toutes les anomalies. Les signaux parasites ne sont pas accidentels.\n\nPREMIÈRE RÉVÉLATION : Ce que nous appelons 'interférences' pourrait être des tentatives de communication.",
      crypticHint: "\"Les messages d'erreur cachent parfois les vérités les plus importantes.\"",
      technicalData: "Fréquence : 1247.9 Hz | Origine : NŒUD-GAMMA | Chiffrement : Niveau 3",
      unlocks: ["Analyse des anomalies", "Détection des signaux parasites"]
    },
    transmissions: [
      "🔴 ANOMALIE MAJEURE : Signal hors protocole détecté.",
      "🟠 Interférences sur toutes les fréquences.",
      "🔒 Protocoles de sécurité renforcés.",
      "🟡 Analyse des motifs en cours..."
    ]
  },

  3: {
    title: "SIGNAL DE RÉVÉLATION",
    phase: "COMPRÉHENSION",
    urgency: "MAXIMALE",
    content: {
      mainMessage: ">>> PREMIÈRE VÉRITÉ <<<\n\nNous ne sommes pas seuls sur ce réseau.\n\nRÉVÉLATION MAJEURE : Les 'interférences' sont des messages. Quelqu'un - ou quelque chose - essaie de communiquer avec nous depuis le début.\n\nNOUVELLE MISSION : Décryptez les signaux parasites. La vérité est dans le bruit.",
      crypticHint: "\"Ce que vous prenez pour du chaos est en réalité un langage que vous n'avez pas encore appris.\"",
      technicalData: "Fréquence : 2847.1 Hz | Origine : INCONNUE | Chiffrement : ALIEN",
      unlocks: ["Décryptage des signaux parasites", "Accès aux nœuds distants"]
    },
    transmissions: [
      "🔴 CONTACT ÉTABLI : Entité inconnue répond.",
      "🟠 Traduction automatique : 73% de réussite.",
      "🟢 Nouveau protocole de communication activé.",
      "🔒 Classification : TOP SECRET - YEUX SEULEMENT."
    ]
  },

  4: {
    title: "SIGNAL DE CONTACT",
    phase: "COMMUNICATION",
    urgency: "CRITIQUE",
    content: {
      mainMessage: ">>> PREMIER CONTACT CONFIRMÉ <<<\n\nIls nous parlent. Depuis des mois.\n\nDÉCOUVERTE MAJEURE : L'entité se nomme 'VANTA7'. Elle prétend venir d'un réseau parallèle au nôtre.\n\nMESSAGE DE VANTA7 : 'Votre réseau est en danger. Nous essayons de vous avertir depuis le début. Ils arrivent.'",
      crypticHint: "\"Parfois, ceux que nous prenons pour des ennemis sont nos seuls alliés.\"",
      technicalData: "Fréquence : 4127.7 Hz | Origine : RÉSEAU PARALLÈLE | Chiffrement : HYBRIDE",
      unlocks: ["Communication avec VANTA7", "Accès aux métriques avancées"]
    },
    transmissions: [
      "🟢 VANTA7 : 'Pouvez-vous nous entendre maintenant ?'",
      "🟡 Traduction : 'Danger imminent. Préparez-vous.'",
      "🔴 VANTA7 : 'Ils ont trouvé votre réseau.'",
      "🟠 Signal d'urgence reçu du réseau parallèle."
    ]
  },

  5: {
    title: "SIGNAL D'AVERTISSEMENT",
    phase: "MENACE",
    urgency: "MAXIMALE",
    content: {
      mainMessage: ">>> ALERTE ROUGE <<<\n\nVANTA7 avait raison. Ils arrivent.\n\nINTELLIGENCE REÇUE : Une entité hostile a infiltré notre réseau. Elle se fait appeler 'NEXUS-812' et tente de corrompre nos nœuds un par un.\n\nDIRECTIVE D'URGENCE : Renforcez tous les protocoles. NEXUS-812 ne doit pas atteindre le nœud central.",
      crypticHint: "\"L'ennemi de votre ennemi n'est pas toujours votre ami, mais parfois c'est votre seul espoir.\"",
      technicalData: "Fréquence : 6666.6 Hz | Origine : HOSTILE | Chiffrement : CORROMPU",
      unlocks: ["Protocoles de défense", "Surveillance des intrusions"]
    },
    transmissions: [
      "🔴 NEXUS-812 : Tentative d'accès au nœud DELTA.",
      "🟠 Systèmes de défense activés automatiquement.",
      "🟢 VANTA7 : 'Nous vous aidons à résister.'",
      "🔒 Verrouillage d'urgence des accès critiques."
    ]
  },

  6: {
    title: "SIGNAL DE RÉSISTANCE",
    phase: "COMBAT",
    urgency: "GUERRE",
    content: {
      mainMessage: ">>> GUERRE DES RÉSEAUX <<<\n\nLa bataille fait rage dans les nœuds.\n\nSITUATION CRITIQUE : NEXUS-812 a corrompu 40% de nos systèmes. VANTA7 et son réseau nous aident à résister, mais nous perdons du terrain.\n\nDERNIÈRE CHANCE : Il existe un protocole d'urgence. Le 'SIGNAL MAÎTRE' peut purger tout le réseau, mais il faut trois opérateurs pour l'activer.",
      crypticHint: "\"Parfois, pour sauver quelque chose, il faut être prêt à tout détruire.\"",
      technicalData: "Fréquence : 9999.9 Hz | Origine : MULTIPLE | Chiffrement : CHAOS",
      unlocks: ["Protocole SIGNAL MAÎTRE", "Accès aux systèmes critiques"]
    },
    transmissions: [
      "🔴 NEXUS-812 : 'Résistance inutile. Soumettez-vous.'",
      "🟢 VANTA7 : 'Tenez bon. Renfort en route.'",
      "🟡 Protocole SIGNAL MAÎTRE : Autorisation requise.",
      "🔒 Nœud ALPHA compromis. Basculement d'urgence."
    ]
  },

  7: {
    title: "SIGNAL DE SACRIFICE",
    phase: "DÉCISION",
    urgency: "FINALE",
    content: {
      mainMessage: ">>> CHOIX FINAL <<<\n\nTrois opérateurs sont prêts. Vous êtes l'un d'eux.\n\nDÉCISION CRITIQUE : Activer le SIGNAL MAÎTRE détruira NEXUS-812, mais aussi 90% de notre réseau. Tout devra être reconstruit.\n\nVANTA7 : 'C'est le seul moyen. Nous vous aiderons à reconstruire. Ensemble, nous serons plus forts.'",
      crypticHint: "\"La fin d'un monde est parfois le début d'un autre, meilleur.\"",
      technicalData: "Fréquence : 0000.0 Hz | Origine : VOUS | Chiffrement : PURE",
      unlocks: ["Activation SIGNAL MAÎTRE", "Statut d'Architecte"]
    },
    transmissions: [
      "🟢 Opérateur 1 : 'Prêt pour activation.'",
      "🟢 Opérateur 2 : 'Séquence confirmée.'",
      "🟡 Votre confirmation requise pour lancement.",
      "🔴 NEXUS-812 : 'Vous ne pouvez pas m'arrêter !'"
    ]
  },

  8: {
    title: "SIGNAL MAÎTRE",
    phase: "RENAISSANCE",
    urgency: "RÉSOLUTION",
    content: {
      mainMessage: ">>> RENAISSANCE DU RÉSEAU <<<\n\nC'est fait. NEXUS-812 a été détruit.\n\nRÉSULTAT : Le réseau est purifié mais presque vide. Avec l'aide de VANTA7, nous reconstruisons quelque chose de nouveau, de plus sûr.\n\nFÉLICitations : Vous êtes maintenant MAÎTRE DU SIGNAL. Votre mission : guider les nouveaux arrivants et protéger le réseau renaissant.\n\nLe cycle recommence, mais cette fois, nous sommes prêts.",
      crypticHint: "\"Chaque fin est un nouveau commencement. Chaque maître était autrefois un élève.\"",
      technicalData: "Fréquence : ∞ Hz | Origine : PARTOUT | Chiffrement : TRANSPARENT",
      unlocks: ["Contrôle total", "Statut de Maître", "Accès à tous les systèmes"]
    },
    transmissions: [
      "🟢 Réseau purifié. Reconstruction en cours.",
      "🟢 VANTA7 : 'Bienvenue dans la nouvelle ère.'",
      "🟡 Nouveaux terminaux détectés. Guidage requis.",
      "🟢 Vous êtes maintenant MAÎTRE DU SIGNAL."
    ]
  }
};

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