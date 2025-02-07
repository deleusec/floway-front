import React, { useRef, useState } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import StopCountdown from './StopCountdown';
import PlayButtonIcon from '@/assets/icons/play-button.svg';
import PauseButtonIcon from '@/assets/icons/pause-button.svg';
import StopButtonIcon from '@/assets/icons/stop-button.svg';
import {Colors} from "@/constants/Colors";

interface SessionControlsProps {
  isRunning: boolean;
  onPausePress: () => void;
  onStopPress: () => void;
  onStopCountdownChange: (isCountingDown: boolean) => void;
  style?: object;
}

export default function SessionControls({
  isRunning,
  onPausePress,
  onStopPress,
  onStopCountdownChange,
  style,
}: SessionControlsProps) {
  const [showStopCountdown, setShowStopCountdown] = useState(false);
  const longPressTimeout = useRef<NodeJS.Timeout>();

  const handleStopPressIn = () => {
    longPressTimeout.current = setTimeout(() => {
      setShowStopCountdown(true);
      onStopCountdownChange(true); // Informer le parent
    }, 200);
  };

  const handleStopPressOut = () => {
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
    }
    setShowStopCountdown(false);
    onStopCountdownChange(false); // Informer le parent
  };

  return (
    <>
      <View style={[styles.controlsContainer, style]}>
        <View style={styles.stopButton}></View>
        <Pressable style={styles.pauseButton} onPress={onPausePress}>
          {!isRunning || showStopCountdown ? (
            <PlayButtonIcon width={80} height={80} />
          ) : (
            <PauseButtonIcon width={80} height={80} />
          )}
        </Pressable>

        <Pressable
          style={styles.stopButton}
          onPressIn={handleStopPressIn}
          onPressOut={handleStopPressOut}>
          <StopButtonIcon width={51} height={51} />
        </Pressable>
      </View>

      <StopCountdown
        isVisible={showStopCountdown}
        onCancel={() => {
          setShowStopCountdown(false);
          onStopCountdownChange(false);
        }}
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
    gap: 32,
    padding: 24,
    paddingBottom: 48, // Ajouter le padding bottom ici
    backgroundColor: Colors.dark.primaryDark, // Assurer que le background est le même
  },
  pauseButton: {
    height: 64,
    width: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stopButton: {
    height: 48,
    width: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
