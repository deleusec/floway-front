// screens/session/TargetSession.tsx
import React, { useEffect } from 'react';
import { SafeAreaView, View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import SessionMetrics from '@/components/session/SessionMetrics';
import SessionControls from '@/components/session/SessionControls';
import { useSessionContext } from '@/context/SessionContext';
import { useSessionTimer } from '@/hooks/useSessionTimer';
import TimeInputField from '@/components/input/TimeInput';
import { ThemedText } from '@/components/ThemedText';
import ProgressDisplay from '@/components/session/ProgressDisplay';

export default function TargetSession() {
  const router = useRouter();
  const { sessionData, clearSession, setSessionData } = useSessionContext();
  const { isRunning, currentMetrics, handlePlayPause, handleStop } = useSessionTimer();

  // Initialiser la session et vérifier l'objectif
  useEffect(() => {
    if (!sessionData?.target) {
      router.replace('/session/target/select');
      return;
    }

    // Initialiser l'état de la session si pas déjà fait
    if (!sessionData.status) {
      setSessionData({
        ...sessionData,
        status: 'ready',
        currentMetrics: {
          time: { hours: '00', minutes: '00', seconds: '00' },
          distance: '0,00',
          pace: '0\'00"',
          calories: '0',
        },
      });
    }
  }, [sessionData?.target, router]);

  const onStopPress = () => {
    handleStop();
    clearSession();
    router.replace('/');
  };

  // En cas d'absence de données de session, rediriger
  if (!sessionData?.target) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <SessionMetrics
        time={currentMetrics?.time}
        distance={currentMetrics?.distance}
        pace={currentMetrics?.pace}
        calories={currentMetrics?.calories}
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
              ? parseFloat(currentMetrics?.distance || '0')
              : parseInt(currentMetrics?.time.minutes || '0')
          }
          target={
            sessionData.target.type === 'distance'
              ? sessionData.target.distance || 0
              : parseInt(sessionData.target.time?.minutes || '0')
          }
          type={sessionData.target.type}
        />
      </View>

      <SessionControls
        isRunning={isRunning}
        onPausePress={handlePlayPause}
        onStopPress={onStopPress}
        style={styles.controlsContainer}
      />
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
    fontSize: 16,
    marginBottom: 16,
    fontWeight: '500',
  },
  targetBox: {
    backgroundColor: Colors.dark.secondaryDark,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  timeInputContainer: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  distanceContainer: {
    alignItems: 'center',
    padding: 8,
  },
  distanceValue: {
    fontSize: 32,
    fontWeight: '600',
  },
  progressSection: {
    padding: 24,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 48,
    left: 0,
    right: 0,
  },
});
