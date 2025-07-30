import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors, Radius, Spacing } from '@/constants/theme';
import Card from '../card';
import Skeleton from './index';

const SessionSkeleton: React.FC = () => {
  return (
    <View style={styles.base}>
      <Card>
        {/* Map skeleton - fond gris clair simple */}
        <View style={styles.mapContainer}>
          <View style={styles.mapBackground} />
        </View>

        <View style={styles.content}>
          {/* Titre et date */}
          <View style={styles.titleRow}>
            <View style={styles.titleColumn}>
              <Skeleton width={120} height={16} borderRadius={4} />
              <View style={{ height: 4 }} />
              <Skeleton width={80} height={12} borderRadius={4} />
            </View>
            {/* Zone avatars */}
            <View style={styles.avatars}>
              <Skeleton width={24} height={24} borderRadius={12} />
            </View>
          </View>

          {/* Statistiques */}
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Skeleton width={12} height={12} borderRadius={2} />
              <Skeleton width={35} height={12} borderRadius={4} />
            </View>
            <View style={styles.stat}>
              <Skeleton width={12} height={12} borderRadius={2} />
              <Skeleton width={45} height={12} borderRadius={4} />
            </View>
            <View style={styles.stat}>
              <Skeleton width={12} height={12} borderRadius={2} />
              <Skeleton width={55} height={12} borderRadius={4} />
            </View>
          </View>
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    overflow: 'hidden',
  },
  mapContainer: {
    width: '100%',
    height: 107,
  },
  mapBackground: {
    flex: 1,
    backgroundColor: '#F9FAFB', // Gris très clair pour le fond de la map
  },
  content: {
    padding: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleColumn: {
    flex: 1,
  },
  avatars: {
    flexDirection: 'row-reverse',
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 12,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});

export default SessionSkeleton;