import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { useRunningSessionStore } from '@/stores/session';
import { Colors, FontSize, FontFamily, Radius, Spacing } from '@/constants/theme';
import Button from '@/components/ui/button';

export default function StartScreen() {
  const router = useRouter();
  const [sessionType, setSessionType] = useState<'time' | 'distance'>('time');
  const [objective, setObjective] = useState('');
  const { session, startSession, updateLocation } = useRunningSessionStore();

  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null;

    if (session.isActive) {
      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        location => {
          updateLocation(location);
        }
      ).then(subscription => {
        locationSubscription = subscription;
      });
    }

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [session.isActive]);

  const handleStartSession = async () => {
    try {
      const objectiveValue = parseFloat(objective);
      if (isNaN(objectiveValue) || objectiveValue <= 0) {
        alert('Veuillez entrer un objectif valide');
        return;
      }

      await startSession(sessionType, objectiveValue);
      router.push('/(main)/session' as any);
    } catch (error: any) {
      alert('Erreur lors du démarrage de la session: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nouvelle Course</Text>

      <View style={styles.configContainer}>
        <View style={styles.typeSelector}>
          <TouchableOpacity
            style={[styles.typeButton, sessionType === 'time' && styles.selectedType]}
            onPress={() => setSessionType('time')}>
            <Text style={[styles.typeText, sessionType === 'time' && styles.selectedTypeText]}>
              Temps
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeButton, sessionType === 'distance' && styles.selectedType]}
            onPress={() => setSessionType('distance')}>
            <Text style={[styles.typeText, sessionType === 'distance' && styles.selectedTypeText]}>
              Distance
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>
            Objectif {sessionType === 'time' ? '(minutes)' : '(kilomètres)'}
          </Text>
          <TextInput
            style={styles.input}
            value={objective}
            onChangeText={setObjective}
            keyboardType='numeric'
            placeholder={`Entrez votre objectif en ${sessionType === 'time' ? 'minutes' : 'km'}`}
          />
        </View>

        <Button onPress={handleStartSession} title='Démarrer la course' variant='primary' />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.lg,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: FontSize.xxl,
    fontFamily: FontFamily.bold,
    textAlign: 'center',
    marginVertical: Spacing.lg,
    color: Colors.textPrimary,
  },
  configContainer: {
    borderRadius: Radius.lg,
    padding: Spacing.lg,
  },
  typeSelector: {
    flexDirection: 'row',
    marginBottom: Spacing.lg,
    borderRadius: Radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  typeButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    backgroundColor: Colors.surface,
  },
  selectedType: {
    backgroundColor: Colors.primary,
  },
  typeText: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.medium,
    color: Colors.textPrimary,
  },
  selectedTypeText: {
    color: Colors.white,
  },
  inputContainer: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.medium,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  input: {
    borderWidth: 1,
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: Spacing.md,
    fontSize: FontSize.md,
    fontFamily: FontFamily.regular,
    color: Colors.textPrimary,
  },
  startButton: {
    backgroundColor: Colors.primary,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    alignItems: 'center',
  },
  startButtonText: {
    color: Colors.white,
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
  },
});
