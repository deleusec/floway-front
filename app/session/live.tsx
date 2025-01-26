import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import SessionMetrics from '@/components/session/SessionMetrics';
import SessionControls from '@/components/session/SessionControls';
import { useSessionContext } from '@/context/SessionContext';
import TimeDisplay from '@/components/session/TimeDisplay';
import AudioCard from '@/components/cards/AudioCard';
import { ThemedText } from '@/components/text/ThemedText';
import { secondsToTimeObject } from '@/utils/timeUtils';

export default function FreeSession() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [distance, setDistance] = useState(0.0);
  const [pace, setPace] = useState(0.0);
  const [calories, setCalories] = useState(0);

  const router = useRouter();
  const { clearSession, sessionData } = useSessionContext();

  useEffect(() => {
    if (!sessionData) {
      router.replace('/session');
    }

    return () => clearSession();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isPlaying) {
      interval = setInterval(() => {
        setTotalSeconds((prev) => {
          const newTime = prev + 1;
          return newTime;
        });
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
        <SessionMetrics distance={distance} pace={pace} calories={calories} />

        {/* Objectif de la session */}
        {(sessionData?.type === 'distance' || sessionData?.type === 'time') && (
          <View style={styles.targetSection}>
            <ThemedText style={styles.targetLabel}>Objectif de la session</ThemedText>
            <View style={styles.targetBox}>
              {/* Temps */}
              {sessionData?.type === 'time' && (
                <View>
                  <View style={styles.timeContainer}>
                    <View style={styles.timeUnit}>
                      <ThemedText style={styles.timeValue}>
                        {secondsToTimeObject(sessionData.time_objective!).hours.toString().padStart(2, '0')}
                      </ThemedText>
                      <ThemedText style={styles.timeLabel}>Heures</ThemedText>
                    </View>
                    <ThemedText style={styles.separator}>:</ThemedText>
                    <View style={styles.timeUnit}>
                      <ThemedText style={styles.timeValue}>
                        {secondsToTimeObject(sessionData.time_objective!).minutes.toString().padStart(2, '0')}
                      </ThemedText>
                      <ThemedText style={styles.timeLabel}>Minutes</ThemedText>
                    </View>
                    <ThemedText style={styles.separator}>:</ThemedText>
                    <View style={styles.timeUnit}>
                      <ThemedText style={styles.timeValue}>
                        {secondsToTimeObject(sessionData.time_objective!).seconds.toString().padStart(2, '0')}
                      </ThemedText>
                      <ThemedText style={styles.timeLabel}>Secondes</ThemedText>
                    </View>
                  </View>
                </View>
              )}

              {/* Distance */}
              {sessionData?.type === 'distance' && (
                <View style={styles.distanceContainer}>
                  <ThemedText style={styles.distanceValue}>km</ThemedText>
                </View>
              )}
            </View>
          </View>
        )}

        <SessionControls
          isRunning={isPlaying}
          onPausePress={() => {
            setIsPlaying(!isPlaying);
            console.log('Play/Pause pressed');
          }}
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
