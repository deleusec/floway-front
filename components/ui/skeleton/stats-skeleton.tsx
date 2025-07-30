import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors, Radius, Spacing } from '@/constants/theme';
import Card from '../card';
import Skeleton from './index';

const StatsSkeleton: React.FC = () => {
  return (
    <View style={styles.container}>
      <Card style={styles.weeklyCard}>
        <View style={styles.weeklyContent}>
          {/* Grille des statistiques */}
          <View style={styles.statsGrid}>
            {/* 4 statistiques */}
            {Array.from({ length: 4 }).map((_, index) => (
              <View key={index} style={styles.statItem}>
                {/* Valeur principale */}
                <Skeleton width={40} height={20} borderRadius={4} style={styles.statValue} />
                {/* Label */}
                <View style={{ height: 4 }} />
                <Skeleton width={60} height={14} borderRadius={4} />
              </View>
            ))}
          </View>

          {/* Séparateur */}
          <View style={styles.separator} />

          {/* Section vitesse moyenne */}
          <View style={styles.avgSpeedContainer}>
            <Skeleton width={120} height={16} borderRadius={4} />
            <Skeleton width={80} height={20} borderRadius={4} />
          </View>
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: Spacing.md,
  },
  weeklyCard: {
    padding: Spacing.lg,
  },
  weeklyContent: {
    gap: Spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  statItem: {
    alignItems: 'center',
    minWidth: '22%',
  },
  statValue: {
    backgroundColor: '#E5E7EB', // Un peu plus foncé pour les valeurs importantes
  },
  separator: {
    height: 1,
    backgroundColor: '#F3F4F6', // Très clair pour le séparateur
    marginVertical: Spacing.xs,
  },
  avgSpeedContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default StatsSkeleton;