import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { LocationData } from '@/constants/SessionData';
import { Colors } from '@/constants/Colors';
import StartPointMapSvg from '@/assets/icons/start_point_map.svg';
import EndPointMapSvg from '@/assets/icons/end_point_map.svg';

interface RouteMapProps {
  locations: LocationData[];
}

export default function RouteMap({ locations }: RouteMapProps) {
  const [isMapReady, setIsMapReady] = useState(false);
  const [animatedLocations, setAnimatedLocations] = useState<LocationData[]>([]);
  const mapRef = useRef<MapView | null>(null); // Référence à la MapView

  // Calculer les limites géographiques pour inclure tout le tracé
  const calculateBoundingRegion = (locations: LocationData[]) => {
    if (!locations.length) return null;

    let minLat = locations[0].latitude;
    let maxLat = locations[0].latitude;
    let minLng = locations[0].longitude;
    let maxLng = locations[0].longitude;

    locations.forEach((loc) => {
      if (loc.latitude < minLat) minLat = loc.latitude;
      if (loc.latitude > maxLat) maxLat = loc.latitude;
      if (loc.longitude < minLng) minLng = loc.longitude;
      if (loc.longitude > maxLng) maxLng = loc.longitude;
    });

    return {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: (maxLat - minLat) * 1.2, // Ajouter une marge
      longitudeDelta: (maxLng - minLng) * 1.2, // Ajouter une marge
    };
  };

  const boundingRegion = calculateBoundingRegion(locations);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMapReady(true);

      // Dézoomer la carte pour inclure tout le tracé dès le départ
      if (mapRef.current && boundingRegion) {
        mapRef.current.animateToRegion(boundingRegion, 500);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [boundingRegion]);

  useEffect(() => {
    if (!isMapReady || !locations.length) return;

    let currentIndex = 0;
    const animationInterval = setInterval(() => {
      if (currentIndex >= locations.length) {
        clearInterval(animationInterval);
        return;
      }

      const nextLocation = locations[currentIndex];
      setAnimatedLocations((prevLocations) => [...prevLocations, nextLocation]);
      currentIndex++;
    }, 50);

    return () => clearInterval(animationInterval);
  }, [isMapReady, locations]);

  if (!locations.length || !boundingRegion) return null;

  return (
    <View style={styles.mapContainer}>
      <MapView
        ref={mapRef} // Associe la référence à la MapView
        style={{ flex: 1 }}
        initialRegion={boundingRegion}
        customMapStyle={mapDarkStyle}>
        <Polyline
          coordinates={animatedLocations.map((loc) => ({
            latitude: loc.latitude,
            longitude: loc.longitude,
          }))}
          strokeColor={Colors.dark.primary}
          strokeWidth={4}
        />

        {/* Marqueur de départ avec SVG */}
        <Marker coordinate={locations[0]} title="Départ">
          <StartPointMapSvg width={24} height={24} />
        </Marker>

        {/* Marqueur d'arrivée avec SVG */}

        {animatedLocations.length === locations.length && (
          <Marker coordinate={locations[locations.length - 1]} title="Arrivée">
            <EndPointMapSvg width={24} height={24} />
          </Marker>
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    height: 300,
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
  },
});

const mapDarkStyle = [
  {
    elementType: 'geometry',
    stylers: [{ color: '#212121' }],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#212121' }],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [{ color: '#757575' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#38414e' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#212a37' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#0f172a' }],
  },
];
