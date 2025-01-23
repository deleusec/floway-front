import React, { useRef, useState } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import StopCountdown from './StopCountdown';

interface SessionControlsProps {
  isRunning: boolean;
  onPausePress: () => void;
  onStopPress: () => void;
  style?: object;
}

export default function SessionControls({
  isRunning,
  onPausePress,
  onStopPress,
  style
}: SessionControlsProps) {
  const [showStopCountdown, setShowStopCountdown] = useState(false);
  const longPressTimeout = useRef<NodeJS.Timeout>();

  const handleStopPressIn = () => {
    longPressTimeout.current = setTimeout(() => {
      setShowStopCountdown(true);
    }, 200);
  };

  const handleStopPressOut = () => {
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
    }
    setShowStopCountdown(false);
  };

  return (
    <>
      <View style={[styles.controlsContainer, style]}>
        <Pressable 
          style={[styles.pauseButton, !isRunning && styles.pauseButtonPaused]}
          onPress={onPausePress}
        >
          <MaterialIcons 
            name={isRunning ? "pause" : "play-arrow"} 
            size={32} 
            color={Colors.light.white} 
          />
        </Pressable>

        <Pressable 
          style={styles.stopButton}
          onPressIn={handleStopPressIn}
          onPressOut={handleStopPressOut}
        >
          <MaterialIcons 
            name="stop" 
            size={24} 
            color={Colors.light.white} 
          />
        </Pressable>
      </View>

      <StopCountdown
        isVisible={showStopCountdown}
        onCancel={() => setShowStopCountdown(false)}
        onComplete={onStopPress}
      />
    </>
  );
}

const styles = StyleSheet.create({
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    padding: 24,
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
  pauseButtonPaused: {
    backgroundColor: Colors.light.error,
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
