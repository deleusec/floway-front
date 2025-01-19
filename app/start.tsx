import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedButton } from '@/components/button/ThemedButton';

export default function StartScreen() {
  const router = useRouter();

  return (
    <ImageBackground source={require('@/assets/images/start.jpg')} style={styles.background}>
      <SafeAreaView style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>Dépasse tes limites à chaque foulée !</Text>
          <Text style={styles.subtitle}>
            Transforme chaque course en séance de coaching personnalisée
          </Text>

          <ThemedButton
            title="Créer un compte"
            onPress={() => router.push('/create-account')}
            style={styles.button}
          />

          <TouchableOpacity onPress={() => router.push('/sign-in')}>
            <Text style={styles.signInText}>
              Déjà un compte ? <Text style={styles.signInLink}>Se connecter</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 16,
    color: '#e3e3e3',
    textAlign: 'center',
    marginBottom: 35,
  },
  button: {
    marginBottom: 30,
  },
  signInText: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  signInLink: {
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});
