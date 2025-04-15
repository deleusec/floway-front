import { router } from 'expo-router';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';

import { useAuth } from '@/context/AuthContext';
import { ThemedButton } from '@/components/button/ThemedButton';
import React, { useState } from 'react';
import TextInputField from '@/components/input/TextInputField';
import { Colors } from '@/constants/Colors';

export default function SignIn() {
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    email: '',
    password: '',
  });

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newFieldErrors = {
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

  const handleSignIn = async () => {
    try {
      setError(null);
      setFieldErrors({ email: '', password: '' });

      if (!validateForm()) {
        setError('Merci de remplir tous les champs correctement.');
        return;
      }

      setIsLoading(true);
      await signIn(email, password);
      router.replace('/');
    } catch (err) {
      setError('Votre email ou mot de passe est incorrect.');
      setFieldErrors({ email: ' ', password: ' ' });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Se connecter</Text>

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
          title="Se connecter"
          onPress={handleSignIn}
          style={styles.button}
          buttonState={isLoading ? 'loading' : 'default'}
        />

        {error && <Text style={styles.error}>{error}</Text>}
      </View>

      <TouchableOpacity
        onPress={() => router.push('/register')}
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
    backgroundColor: Colors.dark.primaryDark,
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
