import React from 'react';
import { FlatList, View, StyleSheet, Text } from 'react-native';
import { Spacing, Colors, FontSize, FontFamily } from '@/constants/theme';
import FriendStatusAvatar from '../status-avatar';
import { useFriendsStore } from '@/stores/friends';
import { router } from 'expo-router';

export default function FriendsStatusList() {
  const { friends, blockedNotifications } = useFriendsStore();

  // Récupérer les amis en excluant ceux qui ont bloqué les notifications
  const activeFriends = friends.filter(
    friend => friend.user_id && !blockedNotifications.includes(friend.user_id)
  );

  const sortedFriends = [...activeFriends].sort(
    (a, b) => Number(b.isRunning) - Number(a.isRunning)
  );

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
            name={item.firstName}
            image={item.avatar}
            isRunning={item.isRunning}
            onPress={() => {
              if (item.isRunning) {
                // TODO: Naviguer vers la page de course en direct de l'ami
                router.push(`/cheer?friendId=${item.user_id}`);
              }
            }}
          />
          <Text numberOfLines={1} ellipsizeMode='tail' style={styles.name}>
            {item.firstName}
          </Text>
          {item.isRunning && (
            <View style={styles.liveIndicator}>
              <Text style={styles.liveText}>En direct</Text>
            </View>
          )}
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
