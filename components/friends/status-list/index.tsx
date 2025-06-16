import React from 'react';
import { FlatList, View, StyleSheet, Text } from 'react-native';
import { Spacing, Colors, FontSize, FontFamily } from '@/constants/theme';
import FriendStatusAvatar from '../status-avatar';
import { useFriendsStore } from '@/stores/friends';
import { router } from 'expo-router';

export default function FriendsStatusList() {
  const friends = useFriendsStore(state => state.friends);

  const sortedFriends = [...friends].sort((a, b) => Number(b.isRunning) - Number(a.isRunning));

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
            onPress={() => item.isRunning && router.push(`/cheer`)}
          />
          <Text numberOfLines={1} ellipsizeMode='tail' style={styles.name}>
            {item.firstName}
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
});
