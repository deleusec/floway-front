import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Colors, Radius, Spacing } from '@/constants/theme';
import Skeleton from './index';

const FriendSkeleton: React.FC = () => {
  return (
    <View style={styles.itemWrapper}>
      {/* Avatar skeleton - pastille grise simple */}
      <View style={styles.avatarContainer}>
        <Skeleton 
          width={56} 
          height={56} 
          borderRadius={Radius.full} 
          style={styles.avatar}
        />
      </View>
      
      {/* Nom skeleton */}
      <View style={styles.nameContainer}>
        <Skeleton width={40} height={12} borderRadius={4} />
      </View>
    </View>
  );
};

const FriendsSkeleton: React.FC = () => {
  // Créer un tableau de 5 éléments pour simuler une liste d'amis
  const skeletonData = Array.from({ length: 5 }, (_, index) => ({ id: index }));

  return (
    <FlatList
      data={skeletonData}
      keyExtractor={item => item.id.toString()}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
      renderItem={({ index }) => (
        <View style={[index === 0 && { marginLeft: 0 }]}>
          <FriendSkeleton />
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: Spacing.xs
  },
  itemWrapper: {
    marginLeft: Spacing.lg,
    alignItems: 'center',
    width: 56,
  },
  avatarContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    backgroundColor: '#E5E7EB', // Gris un peu plus foncé pour l'avatar
  },
  nameContainer: {
    marginTop: 8,
    alignItems: 'center',
  },
});

export default FriendsSkeleton;