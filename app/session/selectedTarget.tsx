// screens/session/TargetSession.tsx
import React, { useEffect } from 'react';
import { SafeAreaView, View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import SessionMetrics from '@/components/session/SessionMetrics';
import SessionControls from '@/components/session/SessionControls';
import { useSessionContext } from '@/context/SessionContext';
import { useSessionTimer } from '@/hooks/useSessionTimer';
import { ThemedText } from '@/components/ThemedText';
import ProgressDisplay from '@/components/session/ProgressDisplay';
import TimeDisplay from '@/components/session/TimeDisplay';

export default function TargetSession() {
  const router = useRouter();
  const { sessionData, clearSession, setSessionData } = useSessionContext();
  const { isRunning, currentMetrics, handlePlayPause, handleStop } = useSessionTimer();

  // Initialiser la session et vérifier l'objectif
  useEffect(() => {
    if (!sessionData?.target) {
      router.replace('/session/target');
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
    router.replace('/session/summary');
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
            <View>
              <View style={styles.timeContainer}>
                <View style={styles.timeUnit}>
                  <ThemedText style={styles.timeValue}>{sessionData.target.time.hours}</ThemedText>
                  <ThemedText style={styles.timeLabel}>Heures</ThemedText>
                </View>
                <ThemedText style={styles.separator}>:</ThemedText>
                <View style={styles.timeUnit}>
                  <ThemedText style={styles.timeValue}>{sessionData.target.time.minutes}</ThemedText>
                  <ThemedText style={styles.timeLabel}>Minutes</ThemedText>
                </View>
                <ThemedText style={styles.separator}>:</ThemedText>
                <View style={styles.timeUnit}>
                  <ThemedText style={styles.timeValue}>{sessionData.target.time.seconds}</ThemedText>
                  <ThemedText style={styles.timeLabel}>Secondes</ThemedText>
                </View>
              </View>
            </View>
          )}
          {sessionData.target.type === 'distance' && (
            <View style={styles.distanceContainer}>
              <ThemedText style={styles.distanceValue}>{sessionData.target.distance} km</ThemedText>
            </View>
          )}
        </View>
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
    borderWidth: 1,
    padding: 12,
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
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: '100%',
  },
  timeUnit: {
    alignItems: 'center',
    fontFamily: 'Poppins-Light',
    minWidth: 80,
    paddingHorizontal: 4,
  },
  timeValue: {
    fontSize: 38,
    fontFamily: 'Poppins-Medium',
    color: Colors.light.white,
    lineHeight: 64,
    includeFontPadding: false,
    textAlign: 'center',
  },
  separator: {
    fontSize: 38,
    fontWeight: '600',
    color: Colors.light.white,
    opacity: 0.7,
    lineHeight: 64,
    alignSelf: 'flex-start',
    includeFontPadding: false,
    marginBottom: 0,
    paddingHorizontal: 4,
  },
  timeLabel: {
    fontSize: 16,
    color: Colors.light.white,
    opacity: 0.7,
  },
});
