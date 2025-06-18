import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet } from 'react-native';
import { Lock, Shield, Eye, Zap, Radio, Globe } from 'lucide-react-native';

import { getDueSignals, getAccessLevel, getProgressStats, getTimeUntilNextSignal } from '../utils/signalScheduler';
import { getSignalContent, generateContextualTransmission, getStatusMessage } from '../utils/crypticSignalScheduler';

export default function AccessScreen() {
  const [transmission, setTransmission] = useState<string>('>>> Initialisation du terminal...');
  const [dueSignals, setDueSignals] = useState<{ index: number; date: string }[]>([]);
  const [accessLevel, setAccessLevel] = useState({ level: 0, name: "PUBLIC", description: "", permissions: [] });
  const [progressStats, setProgressStats] = useState({ signalsReceived: 0, totalSignals: 9, percentage: 0 });
  const [timeUntilNext, setTimeUntilNext] = useState({ message: "Calcul en cours..." });
  const [newSignalAvailable, setNewSignalAvailable] = useState(false);
  const [signalContent, setSignalContent] = useState(null);
  const { t } = useTranslation();

  const loadSystemState = async () => {
    try {
      // Récupérer les données stockées
      let signupDate = await AsyncStorage.getItem('signupDate');
      let receivedJson = await AsyncStorage.getItem('signalsReceived');
      let received: number[] = receivedJson ? JSON.parse(receivedJson) : [];

      // Première initialisation
      if (!signupDate) {
        signupDate = new Date().toISOString().slice(0, 10);
        await AsyncStorage.setItem('signupDate', signupDate);
        await AsyncStorage.setItem('signalsReceived', JSON.stringify([]));
        received = [];
      }

      // Vérifier les signaux dus
      const due = getDueSignals(received, signupDate);
      setDueSignals(due);
      setNewSignalAvailable(due.length > 0);

      // Calculer les statistiques
      const stats = getProgressStats(received, signupDate);
      setProgressStats(stats);

      // Niveau d'accès
      const access = getAccessLevel(received);
      setAccessLevel(access);

      // Temps jusqu'au prochain signal
      const timeLeft = getTimeUntilNextSignal(received, signupDate);
      setTimeUntilNext(timeLeft);

      // Transmission contextuelle
      const contextTransmission = generateContextualTransmission(received);
      const statusMsg = getStatusMessage(received, timeLeft.ready ? null : { daysSinceStart: stats.daysSinceStart });
      setTransmission(`${statusMsg}\n\n${contextTransmission}`);

    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setTransmission('>>> Erreur système. Redémarrage requis.');
    }
  };

  const receiveSignal = async (signalIndex: number) => {
    try {
      // Récupérer les signaux déjà reçus
      const receivedJson = await AsyncStorage.getItem('signalsReceived');
      const received: number[] = receivedJson ? JSON.parse(receivedJson) : [];

      // Ajouter le nouveau signal
      const newReceived = [...received, signalIndex].sort((a, b) => a - b);
      await AsyncStorage.setItem('signalsReceived', JSON.stringify(newReceived));

      // Récupérer le contenu du signal
      const content = getSignalContent(signalIndex);
      setSignalContent(content);

      // Recharger l'état
      await loadSystemState();

      // Afficher une alerte avec le contenu du signal
      if (content) {
        Alert.alert(
          `${content.title}`,
          `Phase: ${content.phase}\nUrgence: ${content.urgency}\n\n${content.content.mainMessage}`,
          [
            {
              text: "ACCUSÉ DE RÉCEPTION",
              onPress: () => setSignalContent(null)
            }
          ]
        );
      }

    } catch (error) {
      console.error('Erreur lors de la réception du signal:', error);
      Alert.alert('Erreur', 'Impossible de recevoir le signal. Réessayez.');
    }
  };

  useEffect(() => {
    loadSystemState();
    
    // Actualiser toutes les minutes
    const interval = setInterval(loadSystemState, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* En-tête */}
        <View style={styles.header}>
          <Lock size={32} color="#00ff41" />
          <Text style={styles.headerText}>{t('access.header')}</Text>
        </View>
        
        {/* Transmission système */}
        <View style={styles.transmissionBox}>
          <Text style={styles.transmissionText}>
            {transmission}
          </Text>
        </View>

        {/* Signaux disponibles */}
        {newSignalAvailable && (
          <View style={styles.signalAlert}>
            <Zap size={24} color="#00ff41" />
            <View style={styles.signalAlertContent}>
              <Text style={styles.signalAlertTitle}>
                {t('access.newSignal')}
              </Text>
              <Text style={styles.signalAlertText}>
                {t('access.signalsPending', { count: dueSignals.length })}
              </Text>
              {dueSignals.map((signal) => (
                <TouchableOpacity
                  key={signal.index}
                  style={styles.receiveButton}
                  onPress={() => receiveSignal(signal.index)}
                >
                  <Text style={styles.receiveButtonText}>
                    {t('access.receiveSignal', { index: signal.index })}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Statistiques de progression */}
        <View style={styles.progressSection}>
          <Text style={styles.sectionTitle}>{t('access.signalProgress')}</Text>
          
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${progressStats.percentage}%` }
              ]} 
            />
          </View>
          
          <View style={styles.progressStats}>
            <Text style={styles.progressText}>
              {t('access.signalsReceived', {received: progressStats.signalsReceived, total: progressStats.totalSignals})}
            </Text>
            <Text style={styles.progressText}>
              {t('access.progress', {percent: progressStats.percentage})}
            </Text>
            <Text style={styles.progressText}>
              {t('access.daysActive', {days: progressStats.daysSinceStart})}
            </Text>
          </View>
        </View>

        {/* Niveau d'accès actuel */}
        <View style={styles.accessSection}>
          <Text style={styles.sectionTitle}>{t('access.accessLevel')}</Text>
          
          <View style={styles.currentAccess}>
            <View style={styles.accessBadge}>
              <Text style={styles.accessLevel}>NIVEAU {accessLevel.level}</Text>
              <Text style={styles.accessName}>{accessLevel.name}</Text>
            </View>
            <Text style={styles.accessDescription}>
              {accessLevel.description}
            </Text>
          </View>

          {/* Permissions */}
          <View style={styles.permissionsSection}>
            <Text style={styles.permissionsTitle}>{t('access.activePermissions')}</Text>
            {accessLevel.permissions.map((permission, index) => (
              <Text key={index} style={styles.permissionItem}>
                • {permission.replace(/_/g, ' ').toUpperCase()}
              </Text>
            ))}
          </View>
        </View>

        {/* Niveaux d'accès */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('access.accessHierarchy')}</Text>
          
          <View style={[styles.levelItem, progressStats.signalsReceived >= 0 ? styles.levelActive : styles.levelLocked]}>
            <Text style={progressStats.signalsReceived >= 0 ? styles.levelText : styles.levelTextLocked}>
              NIVEAU 0 : PUBLIC
            </Text>
            <Text style={progressStats.signalsReceived >= 0 ? styles.levelStatus : styles.levelStatusLocked}>
              {progressStats.signalsReceived >= 0 ? '[ ACTUEL ]' : '[ VERROUILLÉ ]'}
            </Text>
          </View>
          
          <View style={[styles.levelItem, progressStats.signalsReceived >= 1 ? styles.levelActive : styles.levelLocked]}>
            <Text style={progressStats.signalsReceived >= 1 ? styles.levelText : styles.levelTextLocked}>
              NIVEAU 1 : INITIÉ
            </Text>
            <Text style={progressStats.signalsReceived >= 1 ? styles.levelStatus : styles.levelStatusLocked}>
              {progressStats.signalsReceived >= 1 ? '[ DÉBLOQUÉ ]' : '[ VERROUILLÉ ]'}
            </Text>
          </View>
          
          <View style={[styles.levelItem, progressStats.signalsReceived >= 3 ? styles.levelActive : styles.levelLocked]}>
            <Text style={progressStats.signalsReceived >= 3 ? styles.levelText : styles.levelTextLocked}>
              NIVEAU 2 : OPÉRATEUR
            </Text>
            <Text style={progressStats.signalsReceived >= 3 ? styles.levelStatus : styles.levelStatusLocked}>
              {progressStats.signalsReceived >= 3 ? '[ DÉBLOQUÉ ]' : '[ VERROUILLÉ ]'}
            </Text>
          </View>
          
          <View style={[styles.levelItem, progressStats.signalsReceived >= 6 ? styles.levelActive : styles.levelLocked]}>
            <Text style={progressStats.signalsReceived >= 6 ? styles.levelText : styles.levelTextLocked}>
              NIVEAU 3 : ARCHITECTE
            </Text>
            <Text style={progressStats.signalsReceived >= 6 ? styles.levelStatus : styles.levelStatusLocked}>
              {progressStats.signalsReceived >= 6 ? '[ DÉBLOQUÉ ]' : '[ CLASSIFIÉ ]'}
            </Text>
          </View>

          <View style={[styles.levelItem, progressStats.signalsReceived >= 9 ? styles.levelActive : styles.levelLocked]}>
            <Text style={progressStats.signalsReceived >= 9 ? styles.levelText : styles.levelTextLocked}>
              NIVEAU 4 : MAÎTRE DU SIGNAL
            </Text>
            <Text style={progressStats.signalsReceived >= 9 ? styles.levelStatus : styles.levelStatusLocked}>
              {progressStats.signalsReceived >= 9 ? '[ MAÎTRE ]' : '[ LÉGENDAIRE ]'}
            </Text>
          </View>
        </View>

        {/* Prochain signal */}
        <View style={styles.nextSignalSection}>
          <Text style={styles.sectionTitle}>{t('access.nextSignal')}</Text>
          
          {timeUntilNext.completed ? (
            <Text style={styles.nextSignalCompleted}>
              {t('access.sequenceComplete')}
            </Text>
          ) : timeUntilNext.ready ? (
            <Text style={styles.nextSignalReady}>
              {t('access.signalAvailable')}
            </Text>
          ) : (
            <Text style={styles.nextSignalTime}>
              {t('access.timeRemaining', { time: timeUntilNext.message })}
            </Text>
          )}
        </View>

        {/* Avis de sécurité */}
        <View style={styles.securitySection}>
          <Shield size={24} color="#ff4444" />
          <Text style={styles.securityText}>
            {t('access.surveillance')}
          </Text>
        </View>

        {/* Statut de surveillance */}
        <View style={styles.monitorSection}>
          <Eye size={20} color="#00ff41" />
          <Text style={styles.monitorText}>
            {t('access.securityLevel')}: {accessLevel.level >= 3 ? 'MAXIMUM' : 'ÉLEVÉ'} |{' '}
            Dernière activité: {new Date().toLocaleTimeString()}
          </Text>
        </View>
      </ScrollView>
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
  transmissionBox: {
    backgroundColor: 'rgba(0, 255, 65, 0.05)',
    padding: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 65, 0.2)',
    marginBottom: 25,
  },
  transmissionText: {
    color: '#00ff41',
    fontFamily: 'Courier New',
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 0.5,
  },
  signalAlert: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(0, 255, 65, 0.1)',
    padding: 15,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#00ff41',
    marginBottom: 25,
  },
  signalAlertContent: {
    flex: 1,
    marginLeft: 15,
  },
  signalAlertTitle: {
    fontFamily: 'Courier New',
    fontSize: 14,
    color: '#00ff41',
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 5,
  },
  signalAlertText: {
    fontFamily: 'Courier New',
    fontSize: 12,
    color: '#00ff41',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  receiveButton: {
    backgroundColor: '#00ff41',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 3,
    marginTop: 5,
  },
  receiveButtonText: {
    fontFamily: 'Courier New',
    fontSize: 12,
    color: '#000000',
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'center',
  },
  progressSection: {
    marginBottom: 30,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#333333',
    borderRadius: 4,
    marginBottom: 15,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00ff41',
    borderRadius: 4,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  progressText: {
    fontFamily: 'Courier New',
    fontSize: 11,
    color: '#999999',
    letterSpacing: 0.5,
  },
  accessSection: {
    marginBottom: 30,
  },
  currentAccess: {
    backgroundColor: '#111111',
    padding: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#333333',
    marginBottom: 15,
  },
  accessBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  accessLevel: {
    fontFamily: 'Courier New',
    fontSize: 14,
    color: '#00ff41',
    fontWeight: 'bold',
    letterSpacing: 1,
    marginRight: 15,
  },
  accessName: {
    fontFamily: 'Courier New',
    fontSize: 14,
    color: '#00ff41',
    letterSpacing: 2,
  },
  accessDescription: {
    fontFamily: 'Courier New',
    fontSize: 12,
    color: '#999999',
    letterSpacing: 0.5,
  },
  permissionsSection: {
    backgroundColor: '#0a0a0a',
    padding: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#333333',
  },
  permissionsTitle: {
    fontFamily: 'Courier New',
    fontSize: 12,
    color: '#00ff41',
    letterSpacing: 1,
    marginBottom: 8,
  },
  permissionItem: {
    fontFamily: 'Courier New',
    fontSize: 11,
    color: '#999999',
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  section: {
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
  levelItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
    borderRadius: 3,
    marginBottom: 5,
  },
  levelActive: {
    backgroundColor: 'rgba(0, 255, 65, 0.05)',
    borderColor: 'rgba(0, 255, 65, 0.2)',
  },
  levelLocked: {
    backgroundColor: 'rgba(102, 102, 102, 0.05)',
  },
  levelText: {
    fontFamily: 'Courier New',
    fontSize: 12,
    color: '#00ff41',
    letterSpacing: 1,
  },
  levelTextLocked: {
    fontFamily: 'Courier New',
    fontSize: 12,
    color: '#666666',
    letterSpacing: 1,
  },
  levelStatus: {
    fontFamily: 'Courier New',
    fontSize: 10,
    color: '#00ff41',
    letterSpacing: 1,
  },
  levelStatusLocked: {
    fontFamily: 'Courier New',
    fontSize: 10,
    color: '#666666',
    letterSpacing: 1,
  },
  nextSignalSection: {
    backgroundColor: '#111111',
    padding: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#333333',
    marginBottom: 25,
  },
  nextSignalCompleted: {
    fontFamily: 'Courier New',
    fontSize: 12,
    color: '#00ff41',
    textAlign: 'center',
    letterSpacing: 1,
  },
  nextSignalReady: {
    fontFamily: 'Courier New',
    fontSize: 12,
    color: '#00ff41',
    textAlign: 'center',
    letterSpacing: 1,
  },
  nextSignalTime: {
    fontFamily: 'Courier New',
    fontSize: 12,
    color: '#ffaa00',
    textAlign: 'center',
    letterSpacing: 1,
  },
  securitySection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a0000',
    padding: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ff4444',
    marginBottom: 20,
  },
  securityText: {
    fontFamily: 'Courier New',
    fontSize: 12,
    color: '#ff4444',
    marginLeft: 10,
    letterSpacing: 1,
    flex: 1,
  },
  monitorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    opacity: 0.8,
  },
  monitorText: {
    fontFamily: 'Courier New',
    fontSize: 11,
    color: '#00ff41',
    marginLeft: 10,
    letterSpacing: 0.5,
    flex: 1,
  },
});