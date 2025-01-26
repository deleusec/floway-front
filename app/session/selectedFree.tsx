import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import SessionMetrics from '@/components/session/SessionMetrics';
import SessionControls from '@/components/session/SessionControls';
import { useSessionContext } from '@/context/SessionContext';
import { useSessionTimer } from '@/hooks/useSessionTimer';

export default function FreeSession() {
  const router = useRouter();
  const { clearSession, setSessionData } = useSessionContext();
  const { isRunning, currentMetrics, handlePlayPause, handleStop } = useSessionTimer();

  useEffect(() => {
    setSessionData({
      id: '', // Add unique ID
      type: 'free',
      status: 'ready',
      startTime: Date.now(),
      totalPauseTime: 0,
      locations: [], // Initialize empty locations array
      currentMetrics: {
        time: { hours: '00', minutes: '00', seconds: '00' },
        distance: '0,00',
        pace: '0\'00"',
        calories: '0',
      },
    });

    return () => clearSession();
  }, []);

  const onStopPress = () => {
    handleStop();
    clearSession();
    router.replace('/session/summary');
  };

  console.log('Current session status:', isRunning); // Debug log

  return (
    <SafeAreaView style={styles.container}>
      <SessionMetrics
        time={currentMetrics?.time}
        distance={currentMetrics?.distance}
        pace={currentMetrics?.pace}
        calories={currentMetrics?.calories}
      />

      <SessionControls
        isRunning={isRunning}
        onPausePress={() => {
          console.log('Play/Pause pressed'); // Debug log
          handlePlayPause();
        }}
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
  controlsContainer: {
    position: 'absolute',
    bottom: 48,
    left: 0,
    right: 0,
  },
});
