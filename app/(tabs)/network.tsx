import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, ScrollView, Animated, RefreshControl } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import ReanimatedAnimated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  runOnJS
} from 'react-native-reanimated';
import { Wifi, Radio, Zap, Globe, Server, Shield, Activity } from 'lucide-react-native';

// Pool de messages cryptiques (réduit)
const CRYPTIC_MESSAGES = [
  { status: '🔴', message: 'Signal détecté hors périmètre. Trace: GAMMA-3B1' },
  { status: '🟡', message: 'Fragment audio: "Il y en a quatre..."' },
  { status: '🔒', message: 'Connexion non autorisée: ID NEXUS–812' },
  { status: '🟢', message: 'Nœud BETA reconnecté' },
  { status: '🟡', message: 'Protocole PANOPTICON activé' },
  { status: '🔴', message: 'VANTA7 refusé par DELTA' },
  { status: '🟢', message: 'Séquence codée reçue. Décryptage...' },
  { status: '🔴', message: 'Fragment: "Nous sommes déjà là."' },
  { status: '🟠', message: 'Entrée inconnue détectée' },
  { status: '🔴', message: 'Utilisateur hors motif. Obfuscation active' }
];

// Générateur de timestamp aléatoire
const generateTimestamp = () => {
  const hours = Math.floor(Math.random() * 24).toString().padStart(2, '0');
  const minutes = Math.floor(Math.random() * 60).toString().padStart(2, '0');
  const seconds = Math.floor(Math.random() * 60).toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

// Sélectionner seulement 4 messages aléatoires
const generateTransmissions = () => {
  const shuffled = [...CRYPTIC_MESSAGES].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 4).map(msg => ({
    ...msg,
    timestamp: generateTimestamp(),
    id: Math.random().toString(36).substr(2, 9)
  }));
};

export default function NetworkScreen() {
  const pulseAnim = useRef(new Animated.Value(0.5)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const flickerAnim = useRef(new Animated.Value(1)).current;

  const [transmissions, setTransmissions] = useState(generateTransmissions());
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date().toLocaleTimeString());
  const { t } = useTranslation();

  // Reanimated values for swipe gestures
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simuler le rechargement des données
    setTimeout(() => {
      setTransmissions(generateTransmissions());
      setLastRefresh(new Date().toLocaleTimeString());
      setRefreshing(false);
    }, 1500);
  }, []);

  // Gesture pour swipe vers le bas
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) {
        translateY.value = event.translationY * 0.5;
        scale.value = 1 + (event.translationY * 0.0005);
      }
    })
    .onEnd((event) => {
      if (event.translationY > 100) {
        runOnJS(onRefresh)();
      }
      translateY.value = withSpring(0);
      scale.value = withSpring(1);
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: translateY.value },
        { scale: scale.value }
      ],
    };
  });

  useEffect(() => {
    // Animation de pulsation pour le statut réseau
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.5,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );

    // Animation d'apparition
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();

    // Animation de scintillement pour les transmissions
    const flicker = Animated.loop(
      Animated.sequence([
        Animated.timing(flickerAnim, {
          toValue: 1,
          duration: 8000,
          useNativeDriver: true,
        }),
        Animated.timing(flickerAnim, {
          toValue: 0.7,
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
          duration: 12000,
          useNativeDriver: true,
        }),
      ])
    );

    pulse.start();
    flicker.start();

    // Régénérer les transmissions toutes les 45 secondes
    const interval = setInterval(() => {
      setTransmissions(generateTransmissions());
      setLastRefresh(new Date().toLocaleTimeString());
    }, 45000);

    return () => {
      pulse.stop();
      flicker.stop();
      clearInterval(interval);
    };
  }, []);

  return (
    <View style={styles.container}>
      <GestureDetector gesture={panGesture}>
        <ReanimatedAnimated.View style={[{ flex: 1 }, animatedStyle]}>
          <ScrollView 
            contentContainerStyle={styles.content}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#00ff41"
                colors={['#00ff41']}
                progressBackgroundColor="#111111"
              />
            }
            showsVerticalScrollIndicator={false}
          >
            {/* Indicateur de dernière mise à jour */}
            <View style={styles.refreshIndicator}>
              <Text style={styles.refreshText}>
                Dernière mise à jour: {lastRefresh}
              </Text>
            </View>

            {/* En-tête */}
            <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
              <Animated.View style={{ opacity: pulseAnim }}>
                <Radio size={32} color="#00ff41" />
              </Animated.View>
              <Text style={styles.headerText}>{t('network.header')}</Text>
            </Animated.View>

            {/* Statut de connexion */}
            <View style={styles.statusSection}>
              <View style={styles.statusItem}>
                <Wifi size={20} color="#00ff41" />
                <Text style={styles.statusLabel}>{t('network.primarySignal')}</Text>
                <Text style={styles.statusValue}>{t('network.active')}</Text>
              </View>
              
              <View style={styles.statusItem}>
                <Globe size={20} color="#ffaa00" />
                <Text style={styles.statusLabel}>{t('network.globalNetwork')}</Text>
                <Text style={styles.statusValueWarning}>{t('network.unstable')}</Text>
              </View>
              
              <View style={styles.statusItem}>
                <Zap size={20} color="#ff4444" />
                <Text style={styles.statusLabel}>{t('network.deepChannels')}</Text>
                <Text style={styles.statusValueError}>{t('network.encrypted')}</Text>
              </View>
            </View>

            {/* Nœuds du réseau */}
            <View style={styles.nodesSection}>
              <Text style={styles.sectionTitle}>{t('network.activeNodes')}</Text>
              
              <View style={styles.nodeGrid}>
                <View style={styles.nodeItem}>
                  <View style={[styles.nodeIndicator, { backgroundColor: '#00ff41' }]} />
                  <Text style={styles.nodeText}>{t('network.nodeAlpha')}</Text>
                  <Text style={styles.nodeLocation}>AMSTERDAM</Text>
                </View>
                
                <View style={styles.nodeItem}>
                  <View style={[styles.nodeIndicator, { backgroundColor: '#ffaa00' }]} />
                  <Text style={styles.nodeText}>{t('network.nodeBeta')}</Text>
                  <Text style={styles.nodeLocation}>SINGAPOUR</Text>
                </View>
                
                <View style={styles.nodeItem}>
                  <View style={[styles.nodeIndicator, { backgroundColor: '#ff4444' }]} />
                  <Text style={styles.nodeText}>{t('network.nodeGamma')}</Text>
                  <Text style={styles.nodeLocation}>CLASSIFIÉ</Text>
                </View>
                
                <View style={styles.nodeItem}>
                  <View style={[styles.nodeIndicator, { backgroundColor: '#666666' }]} />
                  <Text style={styles.nodeTextInactive}>{t('network.nodeDelta')}</Text>
                  <Text style={styles.nodeLocationInactive}>{t('network.offline')}</Text>
                </View>
              </View>
            </View>

            {/* Force du signal */}
            <View style={styles.signalSection}>
              <Text style={styles.sectionTitle}>{t('network.signalAnalysis')}</Text>
              
              <View style={styles.signalBars}>
                <View style={[styles.signalBar, { height: 20, backgroundColor: '#00ff41' }]} />
                <View style={[styles.signalBar, { height: 35, backgroundColor: '#00ff41' }]} />
                <View style={[styles.signalBar, { height: 25, backgroundColor: '#ffaa00' }]} />
                <View style={[styles.signalBar, { height: 15, backgroundColor: '#ff4444' }]} />
                <View style={[styles.signalBar, { height: 30, backgroundColor: '#00ff41' }]} />
              </View>
              
              <Text style={styles.signalText}>
                Motifs d'interférence détectés. Prochaine fenêtre : 13:41:27
              </Text>
            </View>

            {/* Serveurs distants */}
            <View style={styles.serversSection}>
              <Text style={styles.sectionTitle}>{t('network.remoteServers')}</Text>
              
              <View style={styles.serverItem}>
                <Shield size={18} color="#00ff41" />
                <View style={styles.serverInfo}>
                  <Text style={styles.serverName}>{t('network.serverPrime')}</Text>
                  <Text style={styles.serverStatus}>Opérationnel • 99.7% uptime</Text>
                </View>
                <Text style={styles.serverLoad}>12%</Text>
              </View>

              <View style={styles.serverItem}>
                <Shield size={18} color="#ffaa00" />
                <View style={styles.serverInfo}>
                  <Text style={styles.serverName}>{t('network.serverBackup')}</Text>
                  <Text style={styles.serverStatusWarning}>Maintenance • 87.2% uptime</Text>
                </View>
                <Text style={styles.serverLoadWarning}>67%</Text>
              </View>

              <View style={styles.serverItem}>
                <Shield size={18} color="#ff4444" />
                <View style={styles.serverInfo}>
                  <Text style={styles.serverNameError}>{t('network.serverShadow')}</Text>
                  <Text style={styles.serverStatusError}>Inaccessible • Statut inconnu</Text>
                </View>
                <Text style={styles.serverLoadError}>???</Text>
              </View>
            </View>

            {/* Métriques de performance */}
            <View style={styles.metricsSection}>
              <Text style={styles.sectionTitle}>{t('network.realTimeMetrics')}</Text>
              
              <View style={styles.metricGrid}>
                <View style={styles.metricItem}>
                  <Text style={styles.metricValue}>2.3ms</Text>
                  <Text style={styles.metricLabel}>{t('network.latency')}</Text>
                </View>
                <View style={styles.metricItem}>
                  <Text style={styles.metricValue}>847MB/s</Text>
                  <Text style={styles.metricLabel}>{t('network.throughput')}</Text>
                </View>
                <View style={styles.metricItem}>
                  <Text style={styles.metricValueWarning}>0.02%</Text>
                  <Text style={styles.metricLabel}>{t('network.loss')}</Text>
                </View>
                <View style={styles.metricItem}>
                  <Text style={styles.metricValue}>99.97%</Text>
                  <Text style={styles.metricLabel}>{t('network.reliability')}</Text>
                </View>
              </View>
            </View>

            {/* Activité réseau */}
            <View style={styles.activitySection}>
              <Text style={styles.sectionTitle}>{t('network.networkActivity')}</Text>
              <View style={styles.activityGraph}>
                {[...Array(20)].map((_, i) => (
                  <View 
                    key={i} 
                    style={[
                      styles.activityBar, 
                      { height: Math.random() * 40 + 10 }
                    ]} 
                  />
                ))}
              </View>
            </View>

            {/* Transmissions cryptiques */}
            <Animated.View style={[styles.transmissionsSection, { opacity: flickerAnim }]}>
              <Text style={styles.sectionTitle}>{t('network.recentTransmissions')}</Text>
              
              <View style={styles.transmissionContainer}>
                {transmissions.map((transmission) => (
                  <View key={transmission.id} style={styles.transmissionItem}>
                    <Text style={styles.transmissionTime}>
                      {transmission.timestamp}
                    </Text>
                    <Text style={styles.transmissionStatus}>
                      {transmission.status}
                    </Text>
                    <Text style={styles.transmissionText}>
                      {transmission.message}
                    </Text>
                  </View>
                ))}
              </View>
            </Animated.View>

            {/* Analyse des signaux */}
            <View style={styles.analysisSection}>
              <Text style={styles.sectionTitle}>{t('network.signalAnalysisSection')}</Text>
              
              <View style={styles.analysisItem}>
                <Text style={styles.analysisLabel}>{t('network.dominantFrequency')}</Text>
                <Text style={styles.analysisValue}>432.7 Hz</Text>
              </View>
              
              <View style={styles.analysisItem}>
                <Text style={styles.analysisLabel}>{t('network.detectedModulation')}</Text>
                <Text style={styles.analysisValue}>AM/FM hybride</Text>
              </View>
              
              <View style={styles.analysisItem}>
                <Text style={styles.analysisLabel}>{t('network.estimatedOrigin')}</Text>
                <Text style={styles.analysisValueWarning}>Coordonnées inconnues</Text>
              </View>
              
              <View style={styles.analysisItem}>
                <Text style={styles.analysisLabel}>{t('network.encryptionLevel')}</Text>
                <Text style={styles.analysisValueError}>Militaire (AES-256)</Text>
              </View>
            </View>

            {/* Prochaine fenêtre */}
            <View style={styles.nextWindowSection}>
              <Text style={styles.sectionTitle}>{t('network.nextWindow')}</Text>
              <Text style={styles.nextWindowText}>
                {t('network.openingScheduled', { time: '13h 41min 27s' })}
              </Text>
              <Text style={styles.nextWindowSubtext}>
                {t('network.preparingReception')}
              </Text>
            </View>
          </ScrollView>
        </ReanimatedAnimated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 140,
  },
  refreshIndicator: {
    alignItems: 'center',
    marginBottom: 10,
  },
  refreshText: {
    fontFamily: 'Courier New',
    fontSize: 10,
    color: '#666666',
    letterSpacing: 0.5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  headerText: {
    fontFamily: 'Courier New',
    fontSize: 18,
    color: '#00ff41',
    marginLeft: 15,
    letterSpacing: 2,
    fontWeight: 'bold',
  },
  statusSection: {
    marginBottom: 30,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  statusLabel: {
    fontFamily: 'Courier New',
    fontSize: 12,
    color: '#999999',
    marginLeft: 15,
    flex: 1,
    letterSpacing: 1,
  },
  statusValue: {
    fontFamily: 'Courier New',
    fontSize: 12,
    color: '#00ff41',
    letterSpacing: 1,
  },
  statusValueWarning: {
    fontFamily: 'Courier New',
    fontSize: 12,
    color: '#ffaa00',
    letterSpacing: 1,
  },
  statusValueError: {
    fontFamily: 'Courier New',
    fontSize: 12,
    color: '#ff4444',
    letterSpacing: 1,
  },
  nodesSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontFamily: 'Courier New',
    fontSize: 14,
    color: '#00ff41',
    marginBottom: 15,
    letterSpacing: 1,
    textDecorationLine: 'underline',
  },
  nodeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  nodeItem: {
    width: '48%',
    backgroundColor: '#111111',
    padding: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#333333',
    marginBottom: 10,
    alignItems: 'center',
  },
  nodeIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  nodeText: {
    fontFamily: 'Courier New',
    fontSize: 12,
    color: '#00ff41',
    marginBottom: 4,
    letterSpacing: 1,
  },
  nodeTextInactive: {
    fontFamily: 'Courier New',
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
    letterSpacing: 1,
  },
  nodeLocation: {
    fontFamily: 'Courier New',
    fontSize: 10,
    color: '#999999',
    letterSpacing: 0.5,
  },
  nodeLocationInactive: {
    fontFamily: 'Courier New',
    fontSize: 10,
    color: '#444444',
    letterSpacing: 0.5,
  },
  signalSection: {
    marginBottom: 30,
  },
  signalBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 50,
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  signalBar: {
    width: 8,
    borderRadius: 2,
  },
  signalText: {
    fontFamily: 'Courier New',
    fontSize: 11,
    color: '#999999',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  // Serveurs distants
  serversSection: {
    marginBottom: 30,
  },
  serverItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#111111',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#333333',
    marginBottom: 10,
  },
  serverInfo: {
    flex: 1,
    marginLeft: 12,
  },
  serverName: {
    fontFamily: 'Courier New',
    fontSize: 12,
    color: '#00ff41',
    letterSpacing: 1,
    marginBottom: 2,
  },
  serverNameError: {
    fontFamily: 'Courier New',
    fontSize: 12,
    color: '#ff4444',
    letterSpacing: 1,
    marginBottom: 2,
  },
  serverStatus: {
    fontFamily: 'Courier New',
    fontSize: 10,
    color: '#999999',
    letterSpacing: 0.5,
  },
  serverStatusWarning: {
    fontFamily: 'Courier New',
    fontSize: 10,
    color: '#ffaa00',
    letterSpacing: 0.5,
  },
  serverStatusError: {
    fontFamily: 'Courier New',
    fontSize: 10,
    color: '#ff4444',
    letterSpacing: 0.5,
  },
  serverLoad: {
    fontFamily: 'Courier New',
    fontSize: 12,
    color: '#00ff41',
    letterSpacing: 1,
  },
  serverLoadWarning: {
    fontFamily: 'Courier New',
    fontSize: 12,
    color: '#ffaa00',
    letterSpacing: 1,
  },
  serverLoadError: {
    fontFamily: 'Courier New',
    fontSize: 12,
    color: '#ff4444',
    letterSpacing: 1,
  },
  // Métriques
  metricsSection: {
    marginBottom: 30,
  },
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricItem: {
    width: '48%',
    backgroundColor: '#0a0a0a',
    padding: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#333333',
    marginBottom: 10,
    alignItems: 'center',
  },
  metricValue: {
    fontFamily: 'Courier New',
    fontSize: 16,
    color: '#00ff41',
    letterSpacing: 1,
    marginBottom: 5,
  },
  metricValueWarning: {
    fontFamily: 'Courier New',
    fontSize: 16,
    color: '#ffaa00',
    letterSpacing: 1,
    marginBottom: 5,
  },
  metricLabel: {
    fontFamily: 'Courier New',
    fontSize: 10,
    color: '#666666',
    letterSpacing: 1,
  },
  // Activité réseau
  activitySection: {
    marginBottom: 30,
  },
  activityGraph: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 60,
    paddingHorizontal: 10,
  },
  activityBar: {
    width: 6,
    backgroundColor: '#00ff41',
    borderRadius: 1,
    opacity: 0.7,
  },
  // Transmissions
  transmissionsSection: {
    marginBottom: 30,
  },
  transmissionContainer: {
    backgroundColor: '#0a0a0a',
    borderRadius: 5,
    padding: 12,
    borderWidth: 1,
    borderColor: '#333333',
  },
  transmissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  transmissionTime: {
    fontFamily: 'Courier New',
    fontSize: 10,
    color: '#666666',
    width: 60,
    letterSpacing: 1,
    marginRight: 8,
  },
  transmissionStatus: {
    fontSize: 11,
    width: 16,
    marginRight: 8,
  },
  transmissionText: {
    fontFamily: 'Courier New',
    fontSize: 10,
    color: '#00ff41',
    flex: 1,
    letterSpacing: 0.5,
  },
  // Analyse des signaux
  analysisSection: {
    marginBottom: 30,
  },
  analysisItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  analysisLabel: {
    fontFamily: 'Courier New',
    fontSize: 12,
    color: '#999999',
    letterSpacing: 0.5,
  },
  analysisValue: {
    fontFamily: 'Courier New',
    fontSize: 12,
    color: '#00ff41',
    letterSpacing: 1,
  },
  analysisValueWarning: {
    fontFamily: 'Courier New',
    fontSize: 12,
    color: '#ffaa00',
    letterSpacing: 1,
  },
  analysisValueError: {
    fontFamily: 'Courier New',
    fontSize: 12,
    color: '#ff4444',
    letterSpacing: 1,
  },
  // Prochaine fenêtre
  nextWindowSection: {
    borderTopWidth: 1,
    borderTopColor: '#333333',
    paddingTop: 20,
  },
  nextWindowText: {
    fontFamily: 'Courier New',
    fontSize: 14,
    color: '#00ff41',
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: 10,
  },
  nextWindowSubtext: {
    fontFamily: 'Courier New',
    fontSize: 11,
    color: '#666666',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});