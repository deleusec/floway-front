// screens/session/GuidedSession.tsx
import React, { useState, useCallback } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Pressable } from 'react-native';
import SessionMetrics from '@/components/session/SessionMetrics';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { useSessionContext } from '@/context/SessionContext';
import { PictureCard } from '@/components/ThemedPictureCard';

export default function GuidedSession() {
  const router = useRouter();
  const { sessionData, clearSession } = useSessionContext();
  const [isPaused, setIsPaused] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    time: { hours: '00', minutes: '00', seconds: '00' },
    distance: '0,00',
    pace: '0\'00"',
    calories: '0',
  });

  const handlePausePress = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  const handleStopPress = useCallback(() => {
    clearSession();
    router.replace('/');
  }, [clearSession, router]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Métriques de la session */}
      <SessionMetrics
        time={sessionStats.time}
        distance={sessionStats.distance}
        pace={sessionStats.pace}
        calories={sessionStats.calories}
      />

      {/* Section run guidée */}
      <View style={styles.guidedSection}>
        <Text style={styles.guidedLabel}>Run Guidée</Text>
        {sessionData?.guidedRun && (
          <PictureCard
            title={sessionData.guidedRun.title}
            metrics={[sessionData.guidedRun.duration]}
            subtitle={sessionData.guidedRun.description}
            image={require('@/assets/images/start.jpg')}
            isSelected={false}
            onPress={() => {}} // Désactivé pendant la session
          />
        )}
      </View>

      {/* Contrôles */}
      <View style={styles.controlsContainer}>
        <Pressable style={styles.pauseButton} onPress={handlePausePress}>
          <MaterialIcons
            name={isPaused ? 'play-arrow' : 'pause'}
            size={32}
            color={Colors.light.white}
          />
        </Pressable>

        <Pressable style={styles.stopButton} onPress={handleStopPress}>
          <MaterialIcons name="stop" size={24} color={Colors.light.white} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.primaryDark,
  },
  guidedSection: {
    padding: 24,
  },
  guidedLabel: {
    color: Colors.light.white,
    fontSize: 16,
    marginBottom: 16,
    fontWeight: '500',
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 48,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  pauseButton: {
    height: 64,
    width: 64,
    borderRadius: 32,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.light.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  stopButton: {
    height: 48,
    width: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.secondaryDark,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
