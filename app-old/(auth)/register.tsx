import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, SafeAreaView, View } from 'react-native';

import { ThemedButton } from '@/components/button/ThemedButton';
import TextInputField from '@/components/input/TextInputField';
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function CreateAccount() {
  const { register } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newFieldErrors = {
      firstName: !firstName ? 'Ce champs est obligatoire.' : '',
      lastName: !lastName ? 'Ce champs est obligatoire.' : '',
      email: !email
        ? 'Ce champs est obligatoire.'
        : !isValidEmail(email)
          ? 'Veuillez respecter le format du courriel.'
          : '',
      password: !password ? 'Ce champs est obligatoire.' : '',
    };

    setFieldErrors(newFieldErrors);

    return !Object.values(newFieldErrors).some((error) => error !== '');
  };

  const handleRegister = async () => {
    try {
      setError(null);
      setFieldErrors({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
      });

      if (!validateForm()) {
        setError("Merci de remplir tous les champs correctement afin de procéder à l'inscription.");
        return;
      }

      setIsLoading(true);
      await register(email, password, firstName, lastName);
      router.replace('/login');
    } catch (err) {
      setError("Merci de remplir tous les champs correctement afin de procéder à l'inscription.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Créer un compte</Text>

        <TextInputField
          label="Prénom"
          value={firstName}
          onChange={setFirstName}
          status={fieldErrors.firstName ? 'error' : 'default'}
          errorMessage={fieldErrors.firstName}
          style={styles.input}
        />

        <TextInputField
          label="Nom"
          value={lastName}
          onChange={setLastName}
          status={fieldErrors.lastName ? 'error' : 'default'}
          errorMessage={fieldErrors.lastName}
          style={styles.input}
        />

        <TextInputField
          label="Email"
          value={email}
          onChange={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          status={fieldErrors.email ? 'error' : 'default'}
          errorMessage={fieldErrors.email}
          style={styles.input}
        />

        <TextInputField
          label="Mot de passe"
          value={password}
          onChange={setPassword}
          secureTextEntry
          status={fieldErrors.password ? 'error' : 'default'}
          errorMessage={fieldErrors.password}
          style={styles.input}
        />

        <ThemedButton
          title="S'inscrire"
          onPress={handleRegister}
          style={styles.button}
          buttonState={isLoading ? 'loading' : 'default'}
        />

        {error && <Text style={styles.error}>{error}</Text>}
      </View>

      <TouchableOpacity onPress={() => router.push('/login')} style={styles.signUpContainer}>
        <Text style={styles.signUpText}>
          Déjà un compte ?<Text style={styles.signUpLink}> Se connecter</Text>
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
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 30,
  },
  input: {
    marginBottom: 24,
  },
  button: {
    marginTop: 16,
    marginBottom: 14,
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
  error: {
    fontSize: 14,
    color: '#D13F11',
    textAlign: 'center',
  },
});
