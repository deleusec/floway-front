import React, { useRef, useEffect } from 'react';
import { View, Animated, PanResponder, StyleSheet, Dimensions, SafeAreaView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import SessionControls from './SessionControls';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const { height } = Dimensions.get('window');

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
  location,
  onStopCountdownChange,
}: SessionContainerProps) => {
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: isPlaying ? -height * 0.4 : 0,
      useNativeDriver: true,
    }).start();
  }, [isPlaying]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dy > 50 && isPlaying) {
        setIsPlaying(false);
      } else if (gestureState.dy < -50 && !isPlaying) {
        setIsPlaying(true);
      }
    },
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.mainContent,
          {
            transform: [{ translateY: slideAnim }],
          },
        ]}>
        {/* Section carte */}
        <View style={styles.mapSection}>
          {location && (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}>
              <Marker coordinate={location} />
            </MapView>
          )}
        </View>

        {/* Section métrique */}
        <View {...panResponder.panHandlers} style={styles.metricsSection}>
          <SafeAreaView style={styles.safeArea}>
            <View style={[styles.metricsContent, isPlaying && styles.metricsContentPadding]}>
              {children}
            </View>
          </SafeAreaView>
        </View>
      </Animated.View>

      <View style={styles.controlsContainer}>
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
    backgroundColor: Colors.dark.primaryDark,
  },
  mainContent: {
    height: height * 1.5,
    backgroundColor: Colors.dark.primaryDark,
  },
  mapSection: {
    height: height * 0.4,
    backgroundColor: Colors.dark.secondaryDark,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  metricsSection: {
    flex: 1,
    backgroundColor: Colors.dark.primaryDark,
  },
  safeArea: {
    flex: 1,
    backgroundColor: Colors.dark.primaryDark,
  },
  metricsContent: {
    flex: 1,
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
