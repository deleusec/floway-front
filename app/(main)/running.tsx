import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useRunningSessionStore } from '../../stores/session';
import { RunningMetrics } from '../../components/RunningMetrics';
import { Colors, FontSize, FontFamily, Radius, Spacing } from '../../constants/theme';
import { useAuth } from '../../stores/auth';

export default function RunningScreen() {
  const router = useRouter();
  const { session, stopSession, saveSession } = useRunningSessionStore();
  const { user, token, getUserAndTokenFromStorage } = useAuth();

  useEffect(() => {
    if (!session.isActive) {
      console.log('🔄 Session inactive, redirecting to start screen');
      router.replace('/start');
    }
  }, [session.isActive]);

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
            router.replace('/start');
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
        <Text style={styles.title}>{session.title}</Text>
      </View>

      <RunningMetrics />

      <View style={styles.mapContainer}>
        {/* La carte sera ajoutée ici plus tard */}
        <Text style={styles.mapPlaceholder}>Carte en cours de chargement...</Text>
      </View>

      <TouchableOpacity style={styles.stopButton} onPress={handleStopSession}>
        <Text style={styles.stopButtonText}>Arrêter la course</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: FontSize.xl,
    fontFamily: FontFamily.semiBold,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  mapContainer: {
    flex: 1,
    backgroundColor: Colors.surface,
    margin: Spacing.lg,
    borderRadius: Radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  mapPlaceholder: {
    color: Colors.textSecondary,
    fontSize: FontSize.md,
    fontFamily: FontFamily.medium,
  },
  stopButton: {
    backgroundColor: Colors.error,
    margin: Spacing.lg,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  stopButtonText: {
    color: Colors.white,
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
  },
});
