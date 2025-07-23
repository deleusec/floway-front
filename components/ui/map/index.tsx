import React from 'react';
import { View, StyleSheet, ViewProps, ViewStyle, Text, Image } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import SvgClockIcon from '@/components/icons/ClockIcon';
import SvgPinIcon from '@/components/icons/PinIcon';
import SvgSpeedIcon from '@/components/icons/SpeedIcon';
import {Colors, FontSize, Radius, Spacing} from '@/constants/theme';
import Card from '../card';
import { useFriendsStore } from '@/stores/friends';
import { Achievement } from '@/utils/achievements';

type BorderRadiusSize = 'sm' | 'md' | 'lg';

interface CardMapProps extends ViewProps {
  radius?: BorderRadiusSize;
  style?: ViewStyle | ViewStyle[];
  image?: { uri: string } | number; // Made optional for backward compatibility
  runData?: {
    title: string;
    date: string;
    duration: string;
    distance: string;
    speed: string;
  };
  participants?: Array<{
    id: string;
    avatar: string;
    firstName: string;
  }>;
  achievement?: Achievement;
  sessionTps?: number[][]; // GPS coordinates from session [latitude, longitude, timestamp]
}

// Mini map component for displaying GPS tracks in cards
const MiniMap: React.FC<{
  sessionTps: number[][],
  radius: BorderRadiusSize
}> = ({ sessionTps, radius }) => {
  // Filter out invalid coordinates and convert to proper format
  const validCoordinates = sessionTps
    .filter(point =>
      Array.isArray(point) &&
      point.length >= 2 &&
      typeof point[0] === 'number' &&
      typeof point[1] === 'number' &&
      point[0] !== 0 &&
      point[1] !== 0
    )
    .map(point => ({
      latitude: point[0],
      longitude: point[1],
    }));

  if (validCoordinates.length === 0) {
    return (
      <View style={[styles.mapContainer, styles.mapPlaceholder]}>
        <Text style={styles.placeholderText}>📍 Pas de données GPS</Text>
      </View>
    );
  }

  // Calculate region to fit all coordinates
  const latitudes = validCoordinates.map(coord => coord.latitude);
  const longitudes = validCoordinates.map(coord => coord.longitude);

  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLng = Math.min(...longitudes);
  const maxLng = Math.max(...longitudes);

  const centerLat = (minLat + maxLat) / 2;
  const centerLng = (minLng + maxLng) / 2;

  // Calculate dynamic padding based on track size
  const baseDeltaLat = maxLat - minLat;
  const baseDeltaLng = maxLng - minLng;

  // Minimum zoom level to avoid too close zoom
  const minDelta = 0.005;

  // Dynamic padding: more padding for smaller tracks, less for larger ones
  const paddingFactor = Math.max(0.3, Math.min(0.8, 1 / Math.max(baseDeltaLat, baseDeltaLng) * 0.01));

  const deltaLat = Math.max(baseDeltaLat * (1 + paddingFactor), minDelta);
  const deltaLng = Math.max(baseDeltaLng * (1 + paddingFactor), minDelta);

  const mapRegion = {
    latitude: centerLat,
    longitude: centerLng,
    latitudeDelta: deltaLat,
    longitudeDelta: deltaLng,
  };

  const radiusMap = {
    sm: Radius.sm,
    md: Radius.md,
    lg: Radius.lg,
  };

  return (
    <MapView
      style={[
        styles.mapContainer,
        {
          borderTopLeftRadius: radiusMap[radius],
          borderTopRightRadius: radiusMap[radius],
        },
      ]}
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
    >
      {/* Route polyline */}
      {validCoordinates.length > 1 && (
        <Polyline
          coordinates={validCoordinates}
          strokeColor={Colors.primary}
          strokeWidth={3}
          lineJoin='round'
          lineCap='round'
        />
      )}

      {/* Start marker */}
      {validCoordinates.length > 0 && (
        <Marker
          coordinate={validCoordinates[0]}
          anchor={{ x: 0.5, y: 0.5 }}
        >
          <View style={styles.startMarker}>
            <Text style={styles.startMarkerText}>🏁</Text>
          </View>
        </Marker>
      )}

      {/* End marker */}
      {validCoordinates.length > 1 && (
        <Marker
          coordinate={validCoordinates[validCoordinates.length - 1]}
          anchor={{ x: 0.5, y: 0.5 }}
        >
          <View style={styles.endMarker}>
            <Text style={styles.endMarkerText}>🏃‍♂️</Text>
          </View>
        </Marker>
      )}
    </MapView>
  );
};

const radiusMap = {
  sm: Radius.sm,
  md: Radius.md,
  lg: Radius.lg,
};

const CardMap: React.FC<CardMapProps> = ({
  radius = 'md',
  style,
  image,
  runData,
  participants,
  achievement,
  sessionTps,
  ...rest
}) => {
  const friends = useFriendsStore(state => state.friends);

  return (
    <View style={[styles.base, { borderRadius: radiusMap[radius] }, style]} {...rest}>
      <Card>
        {/* Show map if GPS data available, otherwise fallback to image */}
        {sessionTps && sessionTps.length > 0 ? (
          <MiniMap sessionTps={sessionTps} radius={radius} />
        ) : image ? (
          <Image
            source={image}
            style={[
              styles.mapContainer,
              {
                borderTopLeftRadius: radiusMap[radius],
                borderTopRightRadius: radiusMap[radius],
              },
            ]}
            resizeMethod='resize'
            resizeMode='cover'
            alt='Carte de la course'
          />
        ) : (
          <View style={[styles.mapContainer, styles.mapPlaceholder]}>
            <Text style={styles.placeholderText}>📍 Pas de données</Text>
          </View>
        )}

        <View style={styles.content}>
          <View style={styles.titleRow}>
            <View style={styles.titleSubRow}>
              <Text style={styles.title}>{runData?.title || 'Course du midi'}</Text>
              <Text style={styles.subtitle}>{runData?.date || '13/04/2025'}</Text>
            </View>
            <View style={styles.avatars}>
              {(participants || []).slice(0, 3).map((participant, index) => (
                <Image
                  key={participant.id}
                  source={{ uri: participant.avatar || 'https://via.placeholder.com/24' }}
                  alt={`avatar de ${participant.firstName}`}
                  style={[styles.avatar, { marginLeft: index > 0 ? -9 : -9 }]}
                />
              ))}
            </View>
          </View>

          {/* Statistiques */}
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <SvgClockIcon width={12} height={12} />
              <Text style={styles.statText}>{runData?.duration || '1h29'}</Text>
            </View>
            <View style={styles.stat}>
              <SvgPinIcon width={12} height={12} />
              <Text style={styles.statText}>{runData?.distance || '10,2 km'}</Text>
            </View>
            <View style={styles.stat}>
              <SvgSpeedIcon width={12} height={12} />
              <Text style={styles.statText}>{runData?.speed || '6,7 km/h'}</Text>
            </View>
          </View>
        </View>

        {/* Section d'accomplissement conditionnelle */}
        {achievement && (
          <View
            style={[
              styles.achievementContent,
              {
                borderColor: achievement.color,
                backgroundColor: `${achievement.color}15`,
              },
            ]}
          >
            <Text style={styles.achievementEmoji}>
              {achievement.emoji}
            </Text>
            <View style={styles.achievementText}>
              <Text style={styles.achievementTitle}>
                {achievement.title}
              </Text>
              <Text style={styles.achievementSubtitle}>
                {achievement.subtitle}
              </Text>
            </View>
          </View>
        )}
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  mapContainer: {
    width: '100%',
    height: 107,
  },
  mapPlaceholder: {
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#6B7280',
    fontSize: FontSize.sm,
    fontWeight: '500',
  },
  startMarker: {
    backgroundColor: 'white',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.border,
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
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  endMarkerText: {
    fontSize: 12,
  },
  content: {
    padding: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleSubRow: {
    flexDirection: 'column',
    gap: 4
  },
  title: {
    fontWeight: '600',
    fontSize: FontSize.md,
  },
  subtitle: {
    fontSize: FontSize.xs,
    color: Colors.gray["500"],
  },
  avatars: {
    flexDirection: 'row-reverse',
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  guidedText: {
    fontSize: FontSize.xs,
    marginLeft: 6,
    color: Colors.gray["500"],
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 12,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  statText: {
    fontSize: FontSize.xs,
    fontWeight: '600'
  },
  achievementContent: {
    borderWidth: 1,
    borderRadius: Radius.md,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm
  },
  achievementEmoji: {
    fontSize: 32,
  },
  achievementText: {
    flex: 1,
    marginLeft: Spacing.sm,
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  achievementTitle: {
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  achievementSubtitle: {
    fontSize: FontSize.xs,
  },
});

export default CardMap;
