import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, SafeAreaView } from 'react-native';
import {
  getSignupDate,
  getSignalsReceived,
} from '../infrastructure/storage';
import { getProgressStats, getTimeUntilNextSignal } from '../utils/signalScheduler';
import { generateContextualTransmission } from '../utils/crypticSignalScheduler';

const { width, height } = Dimensions.get('window');

// Générateur de nom de code aléatoire
const generateCodeName = () => {
  const prefixes = ['SIGMA', 'ALPHA', 'OMEGA', 'DELTA', 'GAMMA', 'THETA', 'KAPPA', 'ZETA'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const number = Math.floor(Math.random() * 900) + 100; // 100-999
  return `${prefix}-${number}`;
};

export default function SignalScreen() {
  const [codeName] = useState(generateCodeName());
  const [screenData, setScreenData] = useState({ width, height });
  const [systemStatus, setSystemStatus] = useState('>>> Initialisation...');
  const [nextSignalInfo, setNextSignalInfo] = useState('>>> Calcul en cours...');
  const [progressInfo, setProgressInfo] = useState({ signalsReceived: 0, percentage: 0 });
  
  // Animations existantes
  const glitchAnim = useRef(new Animated.Value(1)).current;
  const flickerAnim = useRef(new Animated.Value(1)).current;
  const logoAnim = useRef(new Animated.Value(0.3)).current;
  const terminalAnim = useRef(new Animated.Value(0)).current;
  
  // Nouvelles animations
  const radarPulseAnim = useRef(new Animated.Value(1)).current;
  const quoteBlink = useRef(new Animated.Value(1)).current;
  const scanlineAnim = useRef(new Animated.Value(0)).current;
  const fadeInAnim = useRef(new Animated.Value(0)).current;

  // Charger l'état du système
  const loadSystemState = async () => {
    try {
      const signupDate = await getSignupDate();
      const received = await getSignalsReceived();

      if (signupDate) {
        // Calculer les statistiques
        const stats = getProgressStats(received, signupDate);
        setProgressInfo(stats);

        // Temps jusqu'au prochain signal
        const timeLeft = getTimeUntilNextSignal(received, signupDate);
        
        if (timeLeft.completed) {
          setNextSignalInfo('>>> MAÎTRE DU SIGNAL - Séquence terminée');
        } else if (timeLeft.ready) {
          setNextSignalInfo('>>> Signal disponible maintenant !');
        } else {
          setNextSignalInfo(`>>> Prochain signal : ${timeLeft.message}`);
        }

        // Transmission contextuelle
        const transmission = generateContextualTransmission(received);
        setSystemStatus(transmission);
      } else {
        setSystemStatus('>>> Terminal non activé. Première connexion requise.');
        setNextSignalInfo('>>> En attente d\'activation...');
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setSystemStatus('>>> Erreur système. Redémarrage requis.');
    }
  };

  useEffect(() => {
    // Écouter les changements d'orientation
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenData({ width: window.width, height: window.height });
    });

    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    // Charger l'état initial
    loadSystemState();

    // Actualiser toutes les 30 secondes
    const interval = setInterval(loadSystemState, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Animation de pulsation du radar (logo)
    const radarPulse = Animated.loop(
      Animated.sequence([
        Animated.timing(radarPulseAnim, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(radarPulseAnim, {
          toValue: 0.9,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(radarPulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );

    // Clignotement subtil de la citation mystérieuse
    const quoteFlicker = Animated.loop(
      Animated.sequence([
        Animated.timing(quoteBlink, {
          toValue: 1,
          duration: 8000,
          useNativeDriver: true,
        }),
        Animated.timing(quoteBlink, {
          toValue: 0.7,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.timing(quoteBlink, {
          toValue: 1,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.timing(quoteBlink, {
          toValue: 0.9,
          duration: 60,
          useNativeDriver: true,
        }),
        Animated.timing(quoteBlink, {
          toValue: 1,
          duration: 12000,
          useNativeDriver: true,
        }),
      ])
    );

    // Animation de ligne de balayage
    const scanline = Animated.loop(
      Animated.sequence([
        Animated.timing(scanlineAnim, {
          toValue: 1,
          duration: 15000,
          useNativeDriver: true,
        }),
        Animated.timing(scanlineAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ])
    );

    // Animation de glitch du logo améliorée
    const logoGlitch = Animated.loop(
      Animated.sequence([
        Animated.timing(logoAnim, {
          toValue: 0.4,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(logoAnim, {
          toValue: 0.3,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(logoAnim, {
          toValue: 0.35,
          duration: 500,
          useNativeDriver: true,
        }),
        // Glitch soudain
        Animated.timing(logoAnim, {
          toValue: 0.1,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(logoAnim, {
          toValue: 0.4,
          duration: 100,
          useNativeDriver: true,
        }),
      ])
    );

    // Scintillement du texte terminal amélioré
    const terminalFlicker = Animated.loop(
      Animated.sequence([
        Animated.timing(flickerAnim, {
          toValue: 0.8,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(flickerAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(flickerAnim, {
          toValue: 0.9,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(flickerAnim, {
          toValue: 1,
          duration: 5000,
          useNativeDriver: true,
        }),
        // Glitch occasionnel
        Animated.timing(flickerAnim, {
          toValue: 0.3,
          duration: 30,
          useNativeDriver: true,
        }),
        Animated.timing(flickerAnim, {
          toValue: 1,
          duration: 70,
          useNativeDriver: true,
        }),
      ])
    );

    // Effet de glitch aléatoire global
    const randomGlitch = Animated.loop(
      Animated.sequence([
        Animated.timing(glitchAnim, {
          toValue: 1,
          duration: 10000,
          useNativeDriver: true,
        }),
        Animated.timing(glitchAnim, {
          toValue: 0.7,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(glitchAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(glitchAnim, {
          toValue: 0.9,
          duration: 25,
          useNativeDriver: true,
        }),
        Animated.timing(glitchAnim, {
          toValue: 1,
          duration: 15000,
          useNativeDriver: true,
        }),
      ])
    );

    // Apparition du terminal avec effet de frappe
    Animated.sequence([
      Animated.timing(terminalAnim, {
        toValue: 0.7,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(terminalAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
    ]).start();

    // Apparition lente du message du bas
    Animated.timing(fadeInAnim, {
      toValue: 1,
      duration: 3000,
      delay: 2000,
      useNativeDriver: true,
    }).start();

    // Démarrage des animations
    radarPulse.start();
    quoteFlicker.start();
    scanline.start();
    logoGlitch.start();
    terminalFlicker.start();
    randomGlitch.start();

    return () => {
      radarPulse.stop();
      quoteFlicker.stop();
      scanline.stop();
      logoGlitch.stop();
      terminalFlicker.stop();
      randomGlitch.stop();
    };
  }, []);

  // Calculs responsifs basés sur les dimensions actuelles
  const isSmallScreen = screenData.height < 700;
  const logoSize = isSmallScreen ? 100 : 120;
  const logoInnerSize = isSmallScreen ? 65 : 80;
  const logoPulseSize = isSmallScreen ? 32 : 40;

  // Messages dynamiques basés sur la progression
  const getQuoteMessage = () => {
    if (progressInfo.signalsReceived === 0) {
      return "\"Ils observent. Vous n'avez pas encore été sélectionné.\"";
    } else if (progressInfo.signalsReceived < 3) {
      return "\"Vous commencez à comprendre. Continuez d'écouter.\"";
    } else if (progressInfo.signalsReceived < 6) {
      return "\"La vérité se révèle lentement. Restez vigilant.\"";
    } else if (progressInfo.signalsReceived < 9) {
      return "\"Vous êtes proche de la révélation finale.\"";
    } else {
      return "\"Vous êtes maintenant l'un des nôtres. Guidez les autres.\"";
    }
  };

  const getAccessMessage = () => {
    if (progressInfo.signalsReceived === 0) {
      return "[ Accès aux niveaux verrouillé. Activation requise. ]";
    } else if (progressInfo.signalsReceived < 9) {
      return `[ Progression : ${progressInfo.percentage}% - ${9 - progressInfo.signalsReceived} signaux restants ]`;
    } else {
      return "[ MAÎTRE DU SIGNAL - Accès total débloqué ]";
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Nom de code généré aléatoirement */}
        <Animated.View style={[styles.codeName, { opacity: glitchAnim }]}>
          <Text style={styles.codeNameText}>NOM-DE-CODE : {codeName}</Text>
        </Animated.View>

        {/* Logo avec pulsation radar - Centre */}
        <Animated.View style={[
          styles.logoContainer, 
          { 
            opacity: logoAnim,
            transform: [{ scale: radarPulseAnim }],
            top: screenData.height * (isSmallScreen ? 0.12 : 0.15),
          }
        ]}>
          <View style={styles.logo}>
            <View style={[styles.logoRing, { width: logoSize, height: logoSize, borderRadius: logoSize / 2 }]}>
              <View style={[
                styles.logoInner, 
                { 
                  width: logoInnerSize, 
                  height: logoInnerSize, 
                  borderRadius: logoInnerSize / 2 
                }
              ]}>
                <Animated.View style={[
                  styles.logoPulse,
                  { 
                    width: logoPulseSize,
                    height: logoPulseSize,
                    borderRadius: logoPulseSize / 2,
                    transform: [{ scale: radarPulseAnim }]
                  }
                ]} />
              </View>
            </View>
            <Text style={[styles.logoText, { fontSize: isSmallScreen ? 14 : 16 }]}>LE SIGNAL</Text>
          </View>
        </Animated.View>

        {/* Zone Terminal avec ligne de balayage - Milieu */}
        <Animated.View style={[
          styles.terminalContainer, 
          { 
            opacity: terminalAnim,
            top: screenData.height * (isSmallScreen ? 0.4 : 0.45),
          }
        ]}>
          <View style={styles.terminalWrapper}>
            <Animated.Text style={[
              styles.terminalText, 
              { 
                opacity: flickerAnim,
                fontSize: isSmallScreen ? 14 : 16,
              }
            ]}>
              {systemStatus}
            </Animated.Text>
            <Animated.Text style={[
              styles.terminalText, 
              styles.terminalSecondary, 
              { 
                opacity: flickerAnim,
                fontSize: isSmallScreen ? 12 : 14,
              }
            ]}>
              {nextSignalInfo}
            </Animated.Text>
            
            {/* Ligne de balayage horizontale */}
            <Animated.View style={[
              styles.scanline,
              {
                opacity: scanlineAnim,
                transform: [{
                  translateY: scanlineAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, isSmallScreen ? 50 : 60]
                  })
                }]
              }
            ]} />
          </View>
        </Animated.View>

        {/* Citation mystérieuse avec clignotement */}
        <Animated.View style={[
          styles.quoteContainer, 
          { 
            opacity: quoteBlink,
            bottom: screenData.height * (isSmallScreen ? 0.28 : 0.25),
          }
        ]}>
          <Text style={[
            styles.quoteText,
            { fontSize: isSmallScreen ? 12 : 14 }
          ]}>
            {getQuoteMessage()}
          </Text>
        </Animated.View>

        {/* Statut d'accès - Ajusté pour la nouvelle hauteur du menu */}
        <Animated.View style={[
          styles.accessContainer, 
          { 
            opacity: fadeInAnim,
            bottom: isSmallScreen ? 117 : 107,
          }
        ]}>
          <Text style={[
            styles.accessText,
            { fontSize: isSmallScreen ? 10 : 12 }
          ]}>
            {getAccessMessage()}
          </Text>
        </Animated.View>

        {/* Effet de grille d'arrière-plan subtil */}
        <View style={styles.backgroundGrid} />
        
        {/* Effet de vignette pour l'immersion */}
        <View style={styles.vignette} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingHorizontal: 20,
    position: 'relative',
  },
  codeName: {
    position: 'absolute',
    top: 85,
    left: 20,
    zIndex: 10,
  },
  codeNameText: {
    fontFamily: 'Courier New',
    fontSize: 12,
    color: '#00ff41',
    letterSpacing: 1,
    textShadowColor: '#00ff41',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 3,
  },
  logoContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 5,
  },
  logo: {
    alignItems: 'center',
  },
  logoRing: {
    borderWidth: 2,
    borderColor: '#00ff41',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#00ff41',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  logoInner: {
    borderWidth: 1,
    borderColor: '#00ff41',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoPulse: {
    backgroundColor: '#00ff41',
    opacity: 0.3,
    shadowColor: '#00ff41',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
  },
  logoText: {
    fontFamily: 'Courier New',
    color: '#00ff41',
    letterSpacing: 3,
    fontWeight: 'bold',
    textShadowColor: '#00ff41',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },
  terminalContainer: {
    position: 'absolute',
    left: 20,
    right: 20,
    zIndex: 8,
  },
  terminalWrapper: {
    position: 'relative',
    backgroundColor: 'rgba(0, 255, 65, 0.02)',
    padding: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 65, 0.1)',
  },
  terminalText: {
    fontFamily: 'Courier New',
    color: '#00ff41',
    letterSpacing: 1,
    marginBottom: 8,
    textShadowColor: '#00ff41',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 2,
  },
  terminalSecondary: {
    opacity: 0.8,
  },
  scanline: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#00ff41',
    opacity: 0.3,
    shadowColor: '#00ff41',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 5,
  },
  quoteContainer: {
    position: 'absolute',
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 7,
  },
  quoteText: {
    fontFamily: 'Courier New',
    color: '#00ff41',
    textAlign: 'center',
    letterSpacing: 0.5,
    opacity: 0.9,
    fontStyle: 'italic',
    textShadowColor: '#00ff41',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 3,
  },
  accessContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 6,
  },
  accessText: {
    fontFamily: 'Courier New',
    color: '#999999',
    letterSpacing: 1,
  },
  backgroundGrid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.03,
    backgroundColor: 'transparent',
  },
  vignette: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderColor: 'rgba(0, 0, 0, 0.8)',
    pointerEvents: 'none',
    zIndex: 1,
  },
});