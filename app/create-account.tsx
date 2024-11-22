import { router } from 'expo-router';
import {StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView} from 'react-native';

import { useSession } from '@/context/ctx';
import { ThemedButton } from "@/components/ThemedButton";
import React, {useState} from "react";

export default function CreateAccount() {
  const { register } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    try {
      setError(null);
      await register(email, password, firstName, lastName);
      router.replace('/sign-in');
    } catch (err) {
      setError('Échec de l’inscription. Veuillez réessayer.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Créer un compte</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Prénom</Text>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nom</Text>
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            autoCapitalize={"none"}
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

        <ThemedButton
          title="S'inscrire"
          onPress={handleRegister}
          style={styles.button}
        />
      </View>

      <TouchableOpacity onPress={() => router.push('/sign-in')} style={styles.signUpContainer}>
        <Text style={styles.signUpText}>
          Déjà un compte ?
          <Text style={styles.signUpLink}> Se connecter</Text>
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
  button: {
    marginTop: 16
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