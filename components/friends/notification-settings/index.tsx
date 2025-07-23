import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Colors, Spacing, FontSize } from '@/constants/theme';
import { useFriendsStore } from '@/stores/friends';
import FriendStatusAvatar from '../status-avatar';
import Title from '@/components/ui/title';

interface NotificationSettingsProps {
  visible: boolean;
  onClose: () => void;
}

export default function NotificationSettings({ visible, onClose }: NotificationSettingsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { friends, blockedNotifications, toggleNotificationBlock, fetchNotificationSettings } =
    useFriendsStore();

  useEffect(() => {
    if (visible) {
      loadNotificationSettings();
    }
  }, [visible]);

  const loadNotificationSettings = async () => {
    setIsLoading(true);
    try {
      await fetchNotificationSettings();
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger les paramètres de notification');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleNotification = async (userId: number, friendName: string) => {
    try {
      await toggleNotificationBlock(userId);
      const isBlocked = blockedNotifications.includes(userId);
      Alert.alert(
        'Paramètres mis à jour',
        isBlocked
          ? `Les notifications de ${friendName} sont maintenant bloquées`
          : `Les notifications de ${friendName} sont maintenant activées`
      );
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de modifier les paramètres de notification');
    }
  };

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title>Paramètres de notification</Title>
        <Text style={styles.subtitle}>Gérez qui peut voir quand vous courez</Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size='large' color={Colors.primary} />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {friends.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Vous n'avez pas encore d'amis</Text>
            </View>
          ) : (
            friends.map(friend => {
              const isBlocked = friend.user_id
                ? blockedNotifications.includes(friend.user_id)
                : false;

              return (
                <View key={friend.id} style={styles.friendItem}>
                  <View style={styles.friendInfo}>
                    <FriendStatusAvatar image={friend.avatar} isRunning={friend.isRunning} />
                    <View style={styles.friendDetails}>
                      <Text style={styles.friendName}>{friend.firstName}</Text>
                      <Text style={styles.friendStatus}>
                        {isBlocked ? 'Notifications bloquées' : 'Notifications activées'}
                      </Text>
                    </View>
                  </View>

                  <Switch
                    value={!isBlocked}
                    onValueChange={() => {
                      if (friend.user_id) {
                        handleToggleNotification(friend.user_id, friend.firstName);
                      }
                    }}
                    trackColor={{ false: Colors.border, true: Colors.primary + '40' }}
                    thumbColor={isBlocked ? Colors.gray[400] : Colors.primary}
                  />
                </View>
              );
            })
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  subtitle: {
    marginTop: 8,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  friendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  friendDetails: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  friendName: {
    fontSize: FontSize.md,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  friendStatus: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
