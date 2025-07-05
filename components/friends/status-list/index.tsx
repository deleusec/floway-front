import React from 'react';
import { FlatList, View, StyleSheet, Text } from 'react-native';
import { Spacing, Colors, FontSize, FontFamily } from '@/constants/theme';
import FriendStatusAvatar from '../status-avatar';
import { useLiveFriends } from '@/hooks/useLiveFriends';
import { router } from 'expo-router';

export default function FriendsStatusList() {
  const { getFriendsWithLiveStatus } = useLiveFriends();

  // Récupérer tous les amis (vrais + fictifs) avec leur statut en direct
  const allFriends = getFriendsWithLiveStatus();

  const sortedFriends = [...allFriends].sort((a, b) => Number(b.isRunning) - Number(a.isRunning));

  return (
    <FlatList
      data={sortedFriends}
      keyExtractor={item => item.id.toString()}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
      renderItem={({ item, index }) => (
        <View style={[styles.itemWrapper, index === 0 && { marginLeft: 0 }]}>
          <FriendStatusAvatar
            image={
              item.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(item.first_name || 'Ami')}`
            }
            isRunning={item.isRunning}
            onPress={() => {
              if (item.isRunning) {
                // TODO: Naviguer vers la page de course en direct de l'ami
                router.push(`/cheer?friendId=${item.id}`);
              }
            }}
          />
          <Text numberOfLines={1} ellipsizeMode='tail' style={styles.name}>
            {item.first_name}
          </Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.lg,
  },
  itemWrapper: {
    marginLeft: Spacing.md,
    alignItems: 'center',
    width: 56,
  },
  name: {
    marginTop: 8,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    fontFamily: FontFamily.regular,
    maxWidth: 56,
    textAlign: 'center',
  },
  liveIndicator: {
    marginTop: 4,
    backgroundColor: Colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  liveText: {
    fontSize: FontSize.xs - 2,
    color: Colors.white,
    fontFamily: FontFamily.medium,
  },
});
