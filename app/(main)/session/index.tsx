import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useRunningSessionStore } from '@/stores/session';
import { Colors, FontSize, FontFamily, Radius, Spacing } from '@/constants/theme';
import { useAuth } from '@/stores/auth';
import Button from '@/components/ui/button';
import { RunningMetrics } from '@/components/ui/running/metrics';
import { useSpeechManager } from '@/hooks/useSpeechManager';

export default function SessionScreen() {
  const router = useRouter();
  const { session, stopSession, saveSession } = useRunningSessionStore();
  const { user, token, getUserAndTokenFromStorage } = useAuth();
  const { speak } = useSpeechManager();
  const lastAnnouncedKm = useRef(0);

  useEffect(() => {
    console.log('Session state changed:', { isActive: session.isActive });

    if (!session.isActive) {
      router.replace('/session/start');
    } else {
      console.log('Attempting to speak start message');
      speak({
        type: 'info',
        text: 'Début de la séance',
        priority: 1
      });
    }
  }, [session.isActive]);

  useEffect(() => {
    if (!session.isActive) return;

    const currentKm = Math.floor(session.metrics.distance / 1000);

    if (currentKm > lastAnnouncedKm.current) {
      const paceMinutes = Math.floor(session.metrics.pace / 60);
      const paceSeconds = Math.floor(session.metrics.pace % 60);

      speak({
        type: 'info',
        text: `${currentKm} kilomètres parcourus. Allure moyenne : ${paceMinutes} minutes et ${paceSeconds} secondes au kilomètre.`,
        priority: 2
      });

      lastAnnouncedKm.current = currentKm;
    }
  }, [session.metrics.distance, session.isActive]);

  const handleStopSession = () => {
    Alert.alert('Arrêter la course', 'Êtes-vous sûr de vouloir arrêter la course ?', [
      {
        text: 'Annuler',
        style: 'cancel',
        onPress: () => console.log('❌ Session stop cancelled by user'),
      },
      {
        text: 'Arrêter',
        style: 'destructive',
        onPress: async () => {
          try {
            let currentUser = user;
            let currentToken = token;
            if (!currentUser || !currentToken) {
              const { user: storedUser, token: storedToken } = await getUserAndTokenFromStorage();
              currentUser = storedUser;
              currentToken = storedToken;
            }
            if (currentUser && currentToken) {
              await saveSession(currentToken, currentUser.id);
            } else {
              console.warn('⚠️ Impossible de récupérer user/token pour la sauvegarde');
            }
            stopSession();
            router.replace('/session/start');
          } catch (error) {
            Alert.alert('Erreur', 'Impossible de sauvegarder la session');
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <RunningMetrics />
      </View>

      <View style={styles.content}>
        <View style={styles.mapContainer}>
          <Text style={styles.mapPlaceholder}>Carte en cours de chargement...</Text>
        </View>
        <View style={styles.stopButtonContainer}>
          <Button onPress={handleStopSession} title='Arrêter la course' variant='error' />
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  content: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  mapContainer: {
    flex: 1,
    margin: Spacing.lg,
    borderRadius: Radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholder: {
    color: Colors.textSecondary,
    fontSize: FontSize.md,
    fontFamily: FontFamily.medium,
  },
  stopButtonContainer: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  stopButton: {
    marginHorizontal: Spacing.lg,
  },
});
