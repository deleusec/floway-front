// screens/session/TargetSession.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { SafeAreaView, View, StyleSheet, Pressable } from 'react-native';
import SessionMetrics from '@/components/session/SessionMetrics';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { useSessionContext } from '@/context/SessionContext';
import TimeInputField from '@/components/input/TimeInput';
import { ThemedText } from '@/components/ThemedText';
import ProgressDisplay from '@/components/session/ProgressDisplay';

export default function TargetSession() {
  const router = useRouter();
  const { sessionData, clearSession } = useSessionContext();
  const [isPaused, setIsPaused] = useState(false);
  const [currentMetrics, setCurrentMetrics] = useState({
    time: { hours: '00', minutes: '00', seconds: '00' },
    distance: '0,00',
    pace: '0\'00"',
    calories: '0',
  });

  // S'assurer qu'un objectif est défini
  useEffect(() => {
    if (!sessionData?.target) {
      router.replace('/session/target/select');
    }
  }, [sessionData?.target, router]);

  const handlePausePress = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  const handleStopPress = useCallback(() => {
    clearSession();
    router.replace('/');
  }, [clearSession, router]);

  // En cas d'absence de données de session, rediriger
  if (!sessionData?.target) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Métriques de la session */}
      <SessionMetrics
        time={currentMetrics.time}
        distance={currentMetrics.distance}
        pace={currentMetrics.pace}
        calories={currentMetrics.calories}
      />

      {/* Section objectif */}
      <View style={styles.targetSection}>
        <ThemedText style={styles.targetLabel}>Objectif de la session</ThemedText>
        <View style={styles.targetBox}>
          {sessionData.target.type === 'time' && sessionData.target.time && (
            <View style={styles.timeInputContainer}>
              <TimeInputField
                placeholder="00"
                unit="heures"
                value={sessionData.target.time.hours}
                onChange={() => {}}
                status="deactivate"
              />
              <TimeInputField
                placeholder="00"
                unit="min"
                value={sessionData.target.time.minutes}
                onChange={() => {}}
                status="deactivate"
              />
              <TimeInputField
                placeholder="00"
                unit="sec"
                value={sessionData.target.time.seconds}
                onChange={() => {}}
                status="deactivate"
              />
            </View>
          )}
          {sessionData.target.type === 'distance' && (
            <View style={styles.distanceContainer}>
              <ThemedText style={styles.distanceValue}>{sessionData.target.distance} km</ThemedText>
            </View>
          )}
        </View>
      </View>

      {/* Progression */}
      <View style={styles.progressSection}>
        <ProgressDisplay
          current={
            sessionData.target.type === 'distance'
              ? parseFloat(currentMetrics.distance)
              : parseInt(currentMetrics.time.minutes)
          }
          target={
            sessionData.target.type === 'distance'
              ? sessionData.target.distance
              : parseInt(sessionData.target.time?.minutes || '0')
          }
          type={sessionData.target.type}
        />
      </View>

      {/* Contrôles */}
      <View style={styles.controlsContainer}>
        <Pressable
          style={[styles.pauseButton, isPaused && styles.pauseButtonPaused]}
          onPress={handlePausePress}>
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
  targetSection: {
    padding: 24,
  },
  targetLabel: {
    color: Colors.light.white,
    fontSize: 16,
    marginBottom: 16,
    fontWeight: '500',
  },
  targetContainer: {
    backgroundColor: Colors.dark.secondaryDark,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  targetTimer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  targetTimeUnit: {
    alignItems: 'center',
    minWidth: 72,
  },
  targetTimeValue: {
    color: Colors.light.white,
    fontSize: 32,
    fontWeight: '600',
  },
  targetTimeLabel: {
    color: Colors.light.white,
    fontSize: 12,
    opacity: 0.7,
    marginTop: 4,
  },
  targetSeparator: {
    color: Colors.light.white,
    fontSize: 32,
    marginHorizontal: 8,
    opacity: 0.7,
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
  progressSection: {
    padding: 24,
  },
  pauseButtonPaused: {
    backgroundColor: Colors.light.error,
  },
});
