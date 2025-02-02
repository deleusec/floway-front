import React, { useRef, useEffect } from 'react';
import { View, Animated, PanResponder, StyleSheet, Dimensions, SafeAreaView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import SessionControls from './SessionControls';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import StartPointMapSvg from '@/assets/icons/start_point_map.svg';

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
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    Animated.spring(slideAnimation, {
      toValue: isPlaying ? -height * 0.4 : 0,
      useNativeDriver: true,
    }).start();
  }, [isPlaying]);

  useEffect(() => {
    if (location && mapRef.current) {
      setTimeout(() => {
        mapRef.current?.animateToRegion(
          {
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          },
          1000
        );
      }, 500);
    }
  }, [location]);

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
      <View style={styles.mapContainer}>
        {location && (
          <MapView
            ref={mapRef}
            style={styles.map}
            customMapStyle={mapDarkStyle}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker coordinate={location}>
              <View style={styles.markerWrapper}>
                <StartPointMapSvg width={32} height={32} />
              </View>
            </Marker>
          </MapView>
        )}
      </View>

      <Animated.View
        style={[styles.contentContainer, { transform: [{ translateY: slideAnimation }] }]}
      >
        <View {...panResponder.panHandlers} style={styles.gestureContainer}>
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.metricsContent}>{children}</View>
          </SafeAreaView>
        </View>
      </Animated.View>

      <View style={styles.controlsWrapper}>
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
  mapContainer: {
    height: height * 0.4,
    backgroundColor: Colors.dark.secondaryDark,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    height: height * 1.5,
    backgroundColor: Colors.dark.primaryDark,
  },
  gestureContainer: {
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
  controlsWrapper: {
    position: 'absolute',
    bottom: 48,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  markerWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
  },
});

const mapDarkStyle = [
  { elementType: 'geometry', stylers: [{ color: '#212121' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#212121' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#38414e' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#212a37' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0f172a' }] },
];

export default SessionContainer;
