import React from 'react';
import { View, StyleSheet, ViewProps, ViewStyle, Text, Image } from 'react-native';
import SvgClockIcon from '@/components/icons/ClockIcon';
import SvgPinIcon from '@/components/icons/PinIcon';
import SvgSpeedIcon from '@/components/icons/SpeedIcon';
import {Colors, FontSize, Radius, Spacing} from '@/constants/theme';
import Card from '../card';
import { useFriendsStore } from '@/stores/friends';

type BorderRadiusSize = 'sm' | 'md' | 'lg';

interface CardMapProps extends ViewProps {
  radius?: BorderRadiusSize;
  style?: ViewStyle | ViewStyle[];
  image: { uri: string } | number;
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
}

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
  ...rest
}) => {
  const friends = useFriendsStore(state => state.friends);
  return (
    <View style={[styles.base, { borderRadius: radiusMap[radius] }, style]} {...rest}>
      <Card>
        <Image
          source={image}
          style={[
            styles.mapImage,
            {
              borderTopLeftRadius: radiusMap[radius],
              borderTopRightRadius: radiusMap[radius],
            },
          ]}
          resizeMethod='resize'
          resizeMode='cover'
          alt='Carte de la course'
        />

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
        <View style={styles.trophyContent}>
          <Text style={styles.trophyImg}>🏆</Text>
          <View style={styles.trophyText}>
            <Text style={styles.trophyTitle}>Record battu !</Text>
            <Text style={styles.trophySubtitle}>Nouvelle meilleure vitesse atteinte !
              Garde ce rythme et t’es inarrêtable.</Text>
          </View>
        </View>
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
  mapImage: {
    width: '100%',
    height: 107,
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
  trophyContent: {
    borderWidth: 1,
    borderColor: Colors.yellow,
    borderRadius: Radius.md,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    backgroundColor: Colors.yellow + '0D',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm
  },
  trophyImg: {
    fontSize: 32,
  },
  trophyText: {
    flex: 1,
    marginLeft: Spacing.sm,
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  trophyTitle: {
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  trophySubtitle: {
    fontSize: FontSize.xs,
  },
});

export default CardMap;
