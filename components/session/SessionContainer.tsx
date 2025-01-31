import React, { useRef, useState, useEffect } from 'react';
import { View, Animated, PanResponder, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Colors } from '@/constants/Colors';
import SessionControls from './SessionControls';

const { height } = Dimensions.get('window');
const COLLAPSED_HEIGHT = height; // Mode normal (aucune carte visible)
const EXPANDED_HEIGHT = height * 0.6; // Mode pause (écran divisé en 2 avec carte visible en haut)

interface SessionContainerProps {
  children: React.ReactNode;
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  onStopPress: () => void;
  location?: { latitude: number; longitude: number };
  onStopCountdownChange: (isPlaying: boolean) => void;
}

const SessionContainer = ({
  children,
  isPlaying,
  setIsPlaying,
  onStopPress,
  onStopCountdownChange,
  location,
}: SessionContainerProps) => {
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Dès qu'on met en pause, la carte apparaît en haut
    Animated.spring(translateY, {
      toValue: isPlaying ? 0 : -EXPANDED_HEIGHT + COLLAPSED_HEIGHT,
      useNativeDriver: true,
    }).start();
  }, [isPlaying]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dy > 50 && isPlaying) {
        setIsPlaying(false); // Swipe vers le bas → Pause
      } else if (gestureState.dy < -50 && !isPlaying) {
        setIsPlaying(true); // Swipe vers le haut → Reprise
      }
    },
  });
  return (
    <View style={styles.container}>
      {/* Carte affichée en haut quand on met en pause */}
      <Animated.View style={[styles.mapContainer, { transform: [{ translateY }] }]}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location?.latitude || 48.8566,
            longitude: location?.longitude || 2.3522,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}>
          {location && <Marker coordinate={location} />}
        </MapView>
      </Animated.View>

      {/* Contenu principal */}
      <Animated.View
        style={[styles.sessionContent, { transform: [{ translateY }] }]}
        {...panResponder.panHandlers}>
        {children}
      </Animated.View>

      {/* Boutons toujours visibles */}
      <View style={styles.controlsContainer}>
        {/* Controls */}
        <SessionControls
          isRunning={isPlaying}
          onPausePress={() => setIsPlaying(!isPlaying)}
          onStopPress={onStopPress}
          onStopCountdownChange={onStopCountdownChange}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: EXPANDED_HEIGHT,
  },
  map: {
    flex: 1,
  },
  sessionContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: COLLAPSED_HEIGHT,
    backgroundColor: Colors.dark.primaryDark,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 48,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});

export default SessionContainer;
