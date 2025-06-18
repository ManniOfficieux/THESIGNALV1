import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Signal } from '@/context/SignalContext';

interface Props {
  signal: Signal;
}

export default function SignalCard({ signal }: Props) {
  const [showHint, setShowHint] = useState(false);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{signal.title}</Text>
      <Text style={styles.meta}>Phase : {signal.phase}</Text>
      <Text style={styles.meta}>Urgence : {signal.urgency}</Text>
      <Text style={styles.message}>{signal.content.mainMessage}</Text>
      {showHint && (
        <Text style={styles.hint}>{signal.content.crypticHint}</Text>
      )}
      <TouchableOpacity
        style={styles.hintToggle}
        onPress={() => setShowHint((v) => !v)}
      >
        <Text style={styles.hintToggleText}>
          {showHint ? 'Masquer indice' : 'Voir indice'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#333',
    padding: 16,
    borderRadius: 6,
    marginBottom: 12,
  },
  title: {
    fontFamily: 'Courier New',
    fontSize: 16,
    color: '#00ff41',
    marginBottom: 8,
  },
  meta: {
    fontFamily: 'Courier New',
    fontSize: 12,
    color: '#00ff41',
    marginBottom: 4,
  },
  message: {
    fontFamily: 'Courier New',
    fontSize: 12,
    color: '#ccc',
    marginBottom: 8,
  },
  hint: {
    fontFamily: 'Courier New',
    fontSize: 12,
    color: '#ffaa00',
    marginBottom: 8,
  },
  hintToggle: {
    backgroundColor: '#00ff41',
    paddingVertical: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  hintToggleText: {
    fontFamily: 'Courier New',
    fontSize: 12,
    color: '#000',
  },
});
