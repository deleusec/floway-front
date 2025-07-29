import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import { Colors } from '@/constants/theme';

interface LocationPoint {
  latitude: number;
  longitude: number;
  timestamp: number;
}

interface FreeMapProps {
  locations: LocationPoint[];
  mapRegion: any;
  style: any;
  isVisible?: boolean;
}

export const FreeMap: React.FC<FreeMapProps> = ({
  locations,
  mapRegion,
  style,
  isVisible = true,
}) => {
  const routeCoordinates = locations.map(location => ({
    latitude: location.latitude,
    longitude: location.longitude,
  }));

  const currentPosition = locations.length > 0 ? locations[locations.length - 1] : null;

  if (!mapRegion) {
    return (
      <View style={[style, styles.mapPlaceholder]}>
        <Text style={styles.mapText}>🌍 Localisation en cours...</Text>
      </View>
    );
  }

  return (
    <MapView
      style={style}
      region={mapRegion}
      // PAS DE PROVIDER = utilise OpenStreetMap (gratuit)
      showsUserLocation={true}
      showsMyLocationButton={false}
      showsCompass={true}
      showsScale={true}
      mapType='standard'
      userInterfaceStyle='light'>
      {/* Tracé du parcours */}
      {routeCoordinates.length > 1 && (
        <Polyline
          coordinates={routeCoordinates}
          strokeColor={Colors.primary}
          strokeWidth={4}
          lineJoin='round'
          lineCap='round'
        />
      )}

      {/* Marqueur position actuelle */}
      {currentPosition && (
        <Marker
          coordinate={{
            latitude: currentPosition.latitude,
            longitude: currentPosition.longitude,
          }}
          title='Position actuelle'>
          <View style={styles.currentLocationMarker}>
            <View style={styles.currentLocationDot} />
          </View>
        </Marker>
      )}

      {/* Marqueur de départ */}
      {routeCoordinates.length > 0 && (
        <Marker
          coordinate={routeCoordinates[0]}
          title='Départ'
          description='Point de départ de votre course'>
          <View style={styles.startMarker}>
            <Text style={styles.startMarkerText}>🏁</Text>
          </View>
        </Marker>
      )}
    </MapView>
  );
};

const styles = StyleSheet.create({
  mapPlaceholder: {
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '500',
  },
  currentLocationMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    borderWidth: 3,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentLocationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  startMarker: {
    backgroundColor: 'white',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  startMarkerText: {
    fontSize: 16,
  },
});
