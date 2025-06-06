import React from 'react';
import { View, StyleSheet, ViewProps, ViewStyle, Text, Image } from 'react-native';
import SvgClockIcon from '@/components/icons/ClockIcon';
import SvgPinIcon from '@/components/icons/PinIcon';
import SvgSpeedIcon from '@/components/icons/SpeedIcon';
import { Colors, Radius } from '@/constants/theme';
import Card from '../card';
import { useFriendsStore } from '@/stores/friends';

type BorderRadiusSize = 'sm' | 'md' | 'lg';

interface CardMapProps extends ViewProps {
  radius?: BorderRadiusSize;
  style?: ViewStyle | ViewStyle[];
}

const radiusMap = {
  sm: Radius.sm,
  md: Radius.md,
  lg: Radius.lg,
};

const CardMap: React.FC<CardMapProps> = ({ radius = 'md', style, ...rest }) => {
  const friends = useFriendsStore(state => state.friends);
  return (
    <View style={[styles.base, { borderRadius: radiusMap[radius] }, style]} {...rest}>
      <Card>
        <Image
          source={require('@/assets/images/map.png')}
          style={[
            styles.mapImage,
            {
              borderTopLeftRadius: radiusMap[radius],
              borderTopRightRadius: radiusMap[radius],
            },
          ]}
          resizeMethod='resize'
          resizeMode='cover'

          alt="Carte de la course"
        />

        <View style={styles.content}>
          <View style={styles.titleRow}>
            <View style={styles.titleSubRow}>
              <Text style={styles.title}>Course du midi</Text>
              <Text style={styles.subtitle}>13/04/2025</Text>
            </View>
            <View style={styles.avatars}>
              {friends.slice(0,3).map((friend, index) => (
                <Image
                  key={friend.id}
                  source={{ uri: friend.avatar || 'https://via.placeholder.com/24' }}
                  alt= {`avatar de ${friend.firstName}`}
                  style={[styles.avatar, { marginLeft: index > 0 ? -9 : -9 }]}
                />
              ))}
            </View>
          </View>

          {/* Session guidée */}
          {/* <View style={styles.row}>
            <HeadsetIcon width={12} height={12} />
            <Text style={styles.guidedText}>Première session guidée</Text>
          </View> */}

          {/* Statistiques */}
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <SvgClockIcon width={12} height={12} />
              <Text style={styles.statText}>1h29</Text>
            </View>
            <View style={styles.stat}>
              <SvgPinIcon width={12} height={12} />
              <Text style={styles.statText}>10,2 km</Text>
            </View>
            <View style={styles.stat}>
              <SvgSpeedIcon width={12} height={12} />
              <Text style={styles.statText}>6,7 km/h</Text>
            </View>
          </View>
        </View>
        <View style={styles.trophyContent}>
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    overflow: 'hidden',
  },
  mapImage: {
    width: '100%',
    height: 200,
  },
  content: {
    padding: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleSubRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  subtitle: {
    fontSize: 10,
    marginLeft: 10,
    color: '#6E6E6E',
  },
  avatars: {
    flexDirection: 'row-reverse',
  },
  avatar: {
    width: 20,
    height: 20,
    borderRadius: 12,
    marginLeft: -8,
    borderWidth: 1,
    borderColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
  },
  guidedText: {
    fontSize: 12,
    marginLeft: 6,
    color: '#6E6E6E',
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap:12,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 13,
  },
  trophyContent: {
    borderWidth: 1,
    borderColor: '#FFE59B',
    borderRadius: 12,
    height: 64,
    marginTop: 12,
    marginLeft:16,
    marginRight: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
});

export default CardMap;
