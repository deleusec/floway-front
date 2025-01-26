import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import SessionMetrics from '@/components/session/SessionMetrics';
import SessionControls from '@/components/session/SessionControls';
import { useSessionContext } from '@/context/SessionContext';
import TimeDisplay from '@/components/session/TimeDisplay';
import { ThemedText } from '@/components/text/ThemedText';
import SessionTarget from '@/components/session/SessionTarget';

export default function FreeSession() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [distance, setDistance] = useState(0.0);
  const [pace, setPace] = useState(0.0);
  const [calories, setCalories] = useState(0);

  const router = useRouter();
  const { clearSession, sessionData } = useSessionContext();

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isPlaying) {
      interval = setInterval(() => {
        setTotalSeconds((prev) => prev + 1);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  const onStopPress = () => {
    clearSession();
    router.replace('/session/summary');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Timer */}
        <TimeDisplay time={totalSeconds} />

        {/* Metrics */}
        <SessionMetrics distance={distance} pace={pace} calories={calories} />

        {/* Session Target */}
        {(sessionData?.type === 'time' || sessionData?.type === 'distance') && (
          <View style={styles.targetSection}>
            <ThemedText style={styles.targetLabel}>Objectif de la session</ThemedText>
            <View style={styles.targetBox}>
              <SessionTarget
                type={sessionData.type}
                timeObjective={sessionData.time_objective}
                distanceObjective={sessionData.distance_objective}
              />
            </View>
          </View>
        )}

        {/* Controls */}
        <SessionControls
          isRunning={isPlaying}
          onPausePress={() => setIsPlaying(!isPlaying)}
          onStopPress={onStopPress}
          style={styles.controlsContainer}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.dark.primaryDark,
  },
  container: {
    flex: 1,
    padding: 24,
  },
  targetSection: {
    marginVertical: 16,
  },
  targetLabel: {
    fontSize: 16,
    marginBottom: 12,
    fontWeight: '500',
    color: Colors.light.white,
  },
  targetBox: {
    height: 100,
    backgroundColor: Colors.dark.secondaryDark,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 48,
    left: 0,
    right: 0,
  },
});
