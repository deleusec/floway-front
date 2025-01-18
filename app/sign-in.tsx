import { router } from 'expo-router';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';

import { useSession } from '@/context/ctx';
import { ThemedButton } from '@/components/button/ThemedButton';
import React from 'react';

import { useState } from 'react';

export default function SignIn() {
  const { signIn } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    try {
      setError(null);
      await signIn(email, password);
      router.replace('/');
    } catch (err) {
      setError('Échec de la connexion. Veuillez vérifier vos identifiants.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Se connecter</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            autoCapitalize={'none'}
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Mot de passe</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {error && <Text>{error}</Text>}

        <ThemedButton title="Se connecter" onPress={handleSignIn} style={styles.button} />
      </View>

      <TouchableOpacity
        onPress={() => router.push('/create-account')}
        style={styles.signUpContainer}>
        <Text style={styles.signUpText}>
          Pas encore de compte ?<Text style={styles.signUpLink}> S'inscrire</Text>
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1F26',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 26,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 30,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#2A2D36',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#FFFFFF',
  },
  forgotPassword: {
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'underline',
    color: '#FFFFFF',
    marginTop: 5,
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
  signUpContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 16,
  },
  signUpText: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  signUpLink: {
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});
