import React, { useEffect } from 'react';
import { FlatList, View, StyleSheet, Text } from 'react-native';
import { Spacing, Colors, FontSize } from '@/constants/theme';
import FriendStatusAvatar from '../status-avatar';
import FriendsSkeleton from '@/components/ui/skeleton/friends-skeleton';
import { useFriendsStore } from '@/stores/friends';
import { useAuth } from '@/stores/auth';
import { API_URL } from '@/constants/env';
import { router } from 'expo-router';

export default function FriendsStatusList() {
  const { friends, isLoading, startPolling, stopPolling } = useFriendsStore();
  const { token } = useAuth();

  useEffect(() => {
    startPolling();

    return () => {
      stopPolling();
    };
  }, [startPolling, stopPolling]);

  const sortedFriends = [...friends].sort((a, b) => Number(b.isRunning) - Number(a.isRunning));

  // Afficher le skeleton pendant le chargement
  if (isLoading) {
    return <FriendsSkeleton />;
  }

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
            image={`${API_URL}/api/user/picture/${item.id}?bearer=${token}`}
            name={`${item.first_name} ${item.last_name}`}
            isRunning={item.isRunning}
            size={56}
            showStatus={true}
            onPress={() => {
              if (item.isRunning) {
                router.push({
                  pathname: '/cheer',
                  params: {
                    id: String(item.id),
                    firstName: item.first_name,
                  },
                });
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
    fontWeight: '500',
  },
});
