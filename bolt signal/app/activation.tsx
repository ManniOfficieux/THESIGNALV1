import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function ActivationScreen() {
  const router = useRouter();
  const [inputCode, setInputCode] = useState('');
  const [storedCode, setStoredCode] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem('activationCode').then(setStoredCode);
  }, []);

  const verifyCode = async () => {
    if (!storedCode) {
      Alert.alert('Erreur', 'Aucun code enregistré.');
      return;
    }
    if (inputCode.trim().toUpperCase() === storedCode.toUpperCase()) {
      await AsyncStorage.setItem('isActivated', 'true');
      router.replace('(tabs)');
    } else {
      Alert.alert('Code invalide', 'Veuillez vérifier votre code.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ENTRER LE CODE D'ACTIVATION</Text>
      <TextInput
        style={styles.input}
        placeholder="XXXX-XX9"
        placeholderTextColor="#666"
        value={inputCode}
        onChangeText={setInputCode}
        autoCapitalize="characters"
      />
      <TouchableOpacity style={styles.button} onPress={verifyCode}>
        <Text style={styles.buttonText}>ACTIVER</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontFamily: 'Courier New',
    color: '#00ff41',
    marginBottom: 20,
    fontSize: 16,
    letterSpacing: 1,
  },
  input: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#00ff41',
    color: '#00ff41',
    padding: 10,
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Courier New',
  },
  button: {
    backgroundColor: '#00ff41',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
  buttonText: {
    color: '#000',
    fontFamily: 'Courier New',
    fontWeight: 'bold',
  },
});
