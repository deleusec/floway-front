import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import { Colors, Radius } from '@/constants/theme';

interface SessionMapProps {
  coordinates: number[][];
  height?: number;
  style?: any;
}

export default function SessionMap({ coordinates, height = 140, style }: SessionMapProps) {
  // Calcul des coordonnées valides
  const validCoordinates = coordinates
    .filter(point => Array.isArray(point) && point.length >= 2 && point[0] !== 0 && point[1] !== 0)
    .map(point => ({
      latitude: point[0],
      longitude: point[1],
    }));

  // Calcul de la région de carte
  let mapRegion = null;
  if (validCoordinates.length > 0) {
    const lats = validCoordinates.map(c => c.latitude);
    const lngs = validCoordinates.map(c => c.longitude);

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    mapRegion = {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: Math.max(maxLat - minLat, 0.01) * 1.5,
      longitudeDelta: Math.max(maxLng - minLng, 0.01) * 1.5,
    };
  }

  // Fallback si pas de coordonnées valides
  if (!mapRegion || validCoordinates.length === 0) {
    return (
      <View style={[styles.placeholder, { height }, style]}>
        <View style={styles.fakeMap}>
          <Text style={styles.mapTitle}>��️ Course en cours</Text>
          <View style={styles.fakeRoute} />
          <View style={styles.fakeRoute2} />
          <View style={styles.fakeLoop} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { height }, style]}>
      <MapView
        style={styles.map}
        region={mapRegion}
        scrollEnabled={false}
        zoomEnabled={false}
        rotateEnabled={false}
        pitchEnabled={false}
        showsUserLocation={false}
        showsMyLocationButton={false}
        showsCompass={false}
        showsScale={false}
        showsPointsOfInterest={false}
        showsBuildings={false}
        showsTraffic={false}
        showsIndoors={false}
        toolbarEnabled={false}
        moveOnMarkerPress={false}
        liteMode={true}
        mapType='standard'
        userInterfaceStyle='light'>
        {/* Tracé principal */}
        <Polyline
          coordinates={validCoordinates}
          strokeColor={Colors.primary}
          strokeWidth={4}
          lineJoin='round'
          lineCap='round'
        />
        {/* Marqueur de départ */}
        {validCoordinates.length > 0 && (
          <Marker coordinate={validCoordinates[0]} anchor={{ x: 0.5, y: 0.5 }}>
            <View style={styles.startMarker}>
              <Text style={styles.startMarkerText}>🏁</Text>
            </View>
          </Marker>
        )}
        {/* Marqueur d'arrivée */}
        {validCoordinates.length > 1 && (
          <Marker
            coordinate={validCoordinates[validCoordinates.length - 1]}
            anchor={{ x: 0.5, y: 0.5 }}>
            <View style={styles.endMarker}>
              <Text style={styles.endMarkerText}>🏃‍♂️</Text>
            </View>
          </Marker>
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: Radius.md,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  placeholder: {
    backgroundColor: '#E8F1F0',
    borderRadius: Radius.md,
  },
  fakeMap: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#E8F4F8',
  },
  mapTitle: {
    position: 'absolute',
    top: 16,
    left: 16,
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  fakeRoute: {
    position: 'absolute',
    top: 50,
    left: 30,
    width: 80,
    height: 3,
    backgroundColor: Colors.primary,
    borderRadius: 2,
    transform: [{ rotate: '25deg' }],
  },
  fakeRoute2: {
    position: 'absolute',
    top: 90,
    left: 60,
    width: 60,
    height: 3,
    backgroundColor: Colors.primary,
    borderRadius: 2,
    transform: [{ rotate: '-15deg' }],
  },
  fakeLoop: {
    position: 'absolute',
    top: 70,
    right: 50,
    width: 30,
    height: 30,
    borderWidth: 3,
    borderColor: Colors.primary,
    borderRadius: 15,
  },
  startMarker: {
    backgroundColor: 'white',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  startMarkerText: {
    fontSize: 12,
  },
  endMarker: {
    backgroundColor: 'white',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  endMarkerText: {
    fontSize: 12,
  },
});
