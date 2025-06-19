import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { sendActivationEmail } from '../infrastructure/boltApi';

export default function ActivationScreen() {
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const handle = async () => {
    await sendActivationEmail(email, code);
  };
  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text>Activation</Text>
      <TextInput accessibilityLabel="email" placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput accessibilityLabel="code" placeholder="Code" value={code} onChangeText={setCode} />
      <Button title="Activer" onPress={handle} />
    </View>
  );
}
