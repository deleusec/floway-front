import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors, Radius, Spacing, FontSize } from '@/constants/theme';
import Skeleton from './index';

const FriendCardSkeleton: React.FC = () => {
  return (
    <View style={styles.friendItem}>
      {/* Avatar skeleton */}
      <View style={styles.avatarContainer}>
        <Skeleton 
          width={54} 
          height={54} 
          borderRadius={Radius.full} 
          style={styles.avatar}
        />
      </View>
      
      {/* Informations de l'ami */}
      <View style={styles.friendInfo}>
        <Skeleton width={120} height={16} borderRadius={4} />
      </View>
      
      {/* Icône des trois points */}
      <View style={styles.dotsButton}>
        <Skeleton width={24} height={24} borderRadius={4} />
      </View>
    </View>
  );
};

// Composant pour afficher plusieurs skeletons de cartes d'amis
const FriendCardSkeletonList: React.FC<{ count?: number }> = ({ count = 5 }) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, index) => (
        <FriendCardSkeleton key={`friend-skeleton-${index}`} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: Spacing.lg,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    backgroundColor: '#E5E7EB', // Gris un peu plus foncé pour l'avatar
  },
  friendInfo: {
    flex: 1,
    marginLeft: 12,
  },
  dotsButton: {
    padding: 8,
    borderRadius: Radius.full,
    minWidth: 40,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export { FriendCardSkeleton, FriendCardSkeletonList };
export default FriendCardSkeletonList;