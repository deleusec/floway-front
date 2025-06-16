import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

interface CheerMicButtonProps {
  isRecording: boolean;
  onStart: () => void;
  onStop: () => void;
  audioUri?: string;
  duration?: number;
  onPlay?: () => void;
  onDelete?: () => void;
}

export default function CheerMicButton({
  isRecording,
  onStart,
  onStop,
  audioUri,
  duration,
  onPlay,
  onDelete,
}: CheerMicButtonProps) {
  // Animation pulse (opacity only, no scale, two borders)
  const pulse1 = useRef(new Animated.Value(0)).current;
  const pulse2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let loop: Animated.CompositeAnimation;
    if (isRecording) {
      pulse1.setValue(0);
      pulse2.setValue(0);
      loop = Animated.loop(
        Animated.stagger(400, [
          Animated.sequence([
            Animated.timing(pulse1, {
              toValue: 1,
              duration: 1200,
              useNativeDriver: true,
            }),
            Animated.timing(pulse1, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(pulse2, {
              toValue: 1,
              duration: 1200,
              useNativeDriver: true,
            }),
            Animated.timing(pulse2, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
        ])
      );
      loop.start();
    } else {
      pulse1.setValue(0);
      pulse2.setValue(0);
    }
    return () => {
      if (loop) loop.stop();
    };
  }, [isRecording]);

  // Pas de card de relecture ici, juste le bouton
  return (
    <View style={styles.pulseContainer}>
      {/* Pulses (borders only, no scale) */}
      <Animated.View
        style={[
          styles.pulseBorder,
          {
            opacity: pulse1.interpolate({ inputRange: [0, 1], outputRange: [0, 0.5] }),
            borderColor: Colors.primary,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.pulseBorder,
          {
            opacity: pulse2.interpolate({ inputRange: [0, 1], outputRange: [0, 0.3] }),
            borderColor: Colors.primary,
          },
        ]}
      />
      <TouchableOpacity
        style={styles.micBtn}
        onPress={isRecording ? onStop : onStart}
        activeOpacity={0.8}
      >
        <Ionicons name={isRecording ? 'stop' : 'mic'} size={40} color={Colors.white} />
      </TouchableOpacity>
    </View>
  );
}

const BTN_SIZE = 80;
const BORDER_SIZE = BTN_SIZE + 18; // 6px border + 3px espace autour

const styles = StyleSheet.create({
  pulseContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: BORDER_SIZE,
    height: BORDER_SIZE,
  },
  pulseBorder: {
    position: 'absolute',
    width: BORDER_SIZE,
    height: BORDER_SIZE,
    borderRadius: BORDER_SIZE / 2,
    borderWidth: 6,
    borderColor: Colors.primary,
    zIndex: 0,
  },
  micBtn: {
    width: BTN_SIZE,
    height: BTN_SIZE,
    borderRadius: BTN_SIZE / 2,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    elevation: 2,
    shadowColor: Colors.primary,
    shadowOpacity: 0.18,
    shadowRadius: 6,
  },
});