import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import SignalCard from '@/ui/components/SignalCard';
import { useSignalContext } from '@/context/SignalContext';

export default function ActivationScreen() {
  const { getSignal } = useSignalContext();
  const signal = getSignal(0);
  if (!signal) return null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <SignalCard signal={signal} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
});
