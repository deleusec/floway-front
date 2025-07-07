import { useRef, useEffect } from 'react';
import MapView from 'react-native-maps';

interface LocationPoint {
  latitude: number;
  longitude: number;
  timestamp: number;
}

interface UseMapViewProps {
  locations: LocationPoint[];
  mapRegion: any;
  isVisible: boolean;
}

export const useMapView = ({ locations, mapRegion, isVisible }: UseMapViewProps) => {
  const mapRef = useRef<MapView>(null);

  // Animer vers la nouvelle position quand la région change
  useEffect(() => {
    if (mapRef.current && mapRegion && isVisible) {
      mapRef.current.animateToRegion(mapRegion, 1000);
    }
  }, [mapRegion, isVisible]);

  // Préparer les coordonnées pour la polyline
  const routeCoordinates = locations.map(location => ({
    latitude: location.latitude,
    longitude: location.longitude,
  }));

  // Position actuelle (dernière position)
  const currentPosition = locations.length > 0 ? locations[locations.length - 1] : null;

  // Centrer la carte sur tout le parcours
  const fitToRoute = () => {
    if (mapRef.current && routeCoordinates.length > 1) {
      mapRef.current.fitToCoordinates(routeCoordinates, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  };

  return {
    mapRef,
    routeCoordinates,
    currentPosition,
    fitToRoute,
  };
};
