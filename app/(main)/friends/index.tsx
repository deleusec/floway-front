import SvgAddFriend from '@/components/icons/AddFriend';
import { FontSize, Radius, Spacing } from '@/constants/theme';
import { router } from 'expo-router';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { SearchInput } from '@/components/ui/input';
import React, { useState, useEffect } from 'react';
import Tabs from '@/components/ui/tabs';
import BottomSheet from '@/components/ui/bottom-sheet';
import { useFriendsStore } from '@/stores/friends';
import FriendStatusAvatar from '@/components/friends/status-avatar';
import FriendCardSkeletonList from '@/components/ui/skeleton/friend-card-skeleton';
import { Colors } from '@/constants/theme';
import SvgHorizontalDots from '@/components/icons/HorizontalDots';
import SvgRunningShoeIcon from '@/components/icons/RunningShoeIcon';
import SvgEye from '@/components/icons/Eye';
import SvgCrossEye from '@/components/icons/CrossEye';
import SvgTrash from '@/components/icons/Trash';
import SvgCheck from '@/components/icons/Check';
import SvgX from '@/components/icons/X';
import SvgPlus from '@/components/icons/Plus';
import { useAuth } from '@/stores/auth';
import { fuzzySearch } from '@/utils/calculations';
import type { Friend } from '@/stores/friends';
import { API_URL } from '@/constants/env';
import { useStore } from '@/stores';

export default function FriendsScreen() {
  const [search, setSearch] = useState('');
  const [searchAddFriend, setSearchAddFriend] = useState('');
  const [tab, setTab] = useState('friends');
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<Friend>();
  const [addFriendModalVisible, setAddFriendModalVisible] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null);

  const { isAuthenticated } = useAuth();
  const {
    friends,
    requests,
    isLoading,
    error,
    fetchFriends,
    fetchRequests,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    removeFriend,
    clearError,
    searchResults,
    blockedNotifications,
    toggleNotificationBlock,
    startPolling,
    stopPolling,
  } = useFriendsStore();

  const { setBackgroundColor } = useStore();

  useEffect(() => {
    setBackgroundColor(Colors.white);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchFriends();
      fetchRequests();
      startPolling();
    }

    return () => {
      stopPolling();
    };
  }, [isAuthenticated, fetchFriends, fetchRequests, startPolling, stopPolling]);

  useEffect(() => {
    if (error) {
      Alert.alert('Erreur', error, [{ text: 'OK', onPress: clearError }]);
    }
  }, [error]);

  // Synchroniser selectedFriend avec le store quand friends change
  useEffect(() => {
    if (selectedFriend) {
      const updatedFriend = friends.find(f => f.id === selectedFriend.id);
      if (updatedFriend) {
        setSelectedFriend(updatedFriend);
      }
    }
  }, [friends, selectedFriend?.id]);

  const handleAcceptRequest = async (requestId: number) => {
    try {
      await acceptFriendRequest(requestId);
      Alert.alert('Succès', "Demande d'ami acceptée !");
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeclineRequest = async (requestId: number) => {
    try {
      await declineFriendRequest(requestId);
      Alert.alert('Succès', "Demande d'ami refusée");
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveFriend = async (friendId: number) => {
    Alert.alert("Supprimer l'ami", 'Êtes-vous sûr de vouloir supprimer cet ami ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          try {
            await removeFriend(friendId);
            Alert.alert('Succès', 'Ami supprimé');
          } catch (error) {
            console.log(error);
          }
        },
      },
    ]);
  };

  const handleSendFriendRequest = async (userId: number) => {
    try {
      await sendFriendRequest(userId);
      Alert.alert('Succès', "Demande d'ami envoyée !");
    } catch (error) {
      console.log(error);
    }
  };

  const filteredFriends = fuzzySearch(friends, search, 'first_name', 0.3);
  const filteredRequests = fuzzySearch(requests, search, 'first_name', 0.3);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (addFriendModalVisible && searchAddFriend.trim()) {
        useFriendsStore.getState().searchUsers(searchAddFriend);
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [searchAddFriend, addFriendModalVisible]);

  // Helper pour savoir si un ami est bloqué pour les notifications
  const isNotificationBlocked = (friend?: Friend) => {
    if (!friend) return false;
    return friend.notification_block === 1;
  };

  // Fonction pour gérer la navigation différée après fermeture du bottom sheet
  const handlePendingNavigation = () => {
    if (pendingNavigation) {
      pendingNavigation();
      setPendingNavigation(null);
    }
  };

  // Fonction pour fermer le drawer et programmer une navigation
  const closeDrawerAndNavigate = (navigationFn: () => void) => {
    setPendingNavigation(() => navigationFn);
    setDrawerVisible(false);
  };



  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerSection}>
          <Text style={styles.title}>Amis</Text>
          <TouchableOpacity onPress={() => setAddFriendModalVisible(true)}>
            <SvgAddFriend />
          </TouchableOpacity>
        </View>

        <View style={{ paddingHorizontal: Spacing.lg, marginTop: 26 }}>
          <SearchInput
            value={search}
            onChangeText={setSearch}
            placeholder="Nom d'utilisateur..."
            autoCorrect={false}
            autoCapitalize='none'
          />
        </View>
        <Tabs
          tabs={[
            { label: 'Mes amis', value: 'friends' },
            { label: `Mes demandes (${requests.length})`, value: 'requests' },
          ]}
          value={tab}
          onChange={setTab}
        />
      </View>

      {tab === 'friends' && (
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {isLoading ? (
            <FriendCardSkeletonList count={6} />
          ) : (
            <View style={{ marginTop: 24 }}>
              {filteredFriends.length === 0 ? (
                <Text style={{ textAlign: 'center', color: Colors.gray['400'], marginTop: 12 }}>
                  {search ? 'Aucun ami trouvé' : "Vous n'avez pas encore d'amis"}
                </Text>
              ) : (
                filteredFriends.map((friend, index) => (
                  <View key={`friend-${friend.id}-${index}`} style={styles.friendItem}>
                    <FriendStatusAvatar
                      image={`${API_URL}/api/user/picture/${friend.id}?bearer=${useAuth.getState().token}`}
                      name={`${friend.first_name} ${friend.last_name}`}
                      isRunning={friend.isRunning}
                      size={46}
                      showStatus={true}
                      onPress={() => {
                        if (friend.isRunning) {
                          router.push({
                            pathname: '/cheer',
                            params: {
                              id: String(friend.id),
                              firstName: friend.first_name,
                            },
                          });
                        }
                      }}
                    />
                    <View style={styles.friendInfo}>
                      <View style={styles.nameRow}>
                        <Text style={styles.friendName}>
                          {friend.first_name} {friend.last_name}
                        </Text>
                      </View>
                    </View>
                    <Pressable
                      onPress={() => {
                        setSelectedFriend(friend);
                        setDrawerVisible(true);
                      }}
                      style={styles.dotsButton}>
                      <SvgHorizontalDots width={24} height={24} />
                    </Pressable>
                  </View>
                ))
              )}
            </View>
          )}
        </ScrollView>
      )}

      {tab === 'requests' && (
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {isLoading ? (
            <FriendCardSkeletonList count={4} />
          ) : (
            <View style={{ marginTop: 24 }}>
              {filteredRequests.length === 0 && (
                <Text style={{ textAlign: 'center', color: Colors.gray['400'], marginTop: 12 }}>
                  Aucune demande
                </Text>
              )}
              {filteredRequests.map((request, index) => (
                <View key={`request-${request.request_id}-${index}`} style={styles.requestItem}>
                  <FriendStatusAvatar
                    image={request.avatar}
                    name={`${request.first_name} ${request.last_name}`}
                    size={46}
                    showStatus={false}
                  />
                  <Text style={styles.friendName}>
                    {request.first_name} {request.last_name}
                  </Text>
                  <Pressable
                    style={styles.declineButton}
                    onPress={() => handleDeclineRequest(request.request_id)}>
                    <SvgX width={22} height={22} color={Colors.gray[500]} />
                  </Pressable>
                  <Pressable
                    style={styles.acceptButton}
                    onPress={() => handleAcceptRequest(request.request_id)}>
                    <SvgCheck width={24} height={24} color={Colors.white} />
                  </Pressable>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      )}

      <BottomSheet
        visible={addFriendModalVisible}
        onClose={() => {
          setAddFriendModalVisible(false);
          setSearchAddFriend('');
          searchResults.length = 0;
        }}
        height={700}
        enableDrag={true}
        enableBackdropDismiss={true}
      >
        <View>
          <Text style={styles.addFriendTitle}>Ajoute un ami</Text>
          <View style={{ paddingHorizontal: Spacing.lg }}>
            <SearchInput
              value={searchAddFriend}
              onChangeText={setSearchAddFriend}
              placeholder="Nom d'utilisateur…"
              autoCorrect={false}
              autoCapitalize='none'
            />
          </View>
          <ScrollView 
            style={{ paddingHorizontal: Spacing.lg, paddingVertical: Spacing.lg }}
            contentContainerStyle={{ paddingBottom: 120 }} // Padding bottom pour voir tous les éléments
            showsVerticalScrollIndicator={false}
          >
            {searchResults.length === 0 ? (
              <Text
                style={{ textAlign: 'center', color: Colors.gray['400'], marginTop: Spacing.xl }}>
                {searchAddFriend.trim() === ''
                  ? 'Commencez à taper pour rechercher des utilisateurs'
                  : 'Aucun utilisateur trouvé'}
              </Text>
            ) : (
              searchResults.map((user, index) => (
                <View key={`search-user-${user.id}-${index}`} style={styles.searchUserItem}>
                  <FriendStatusAvatar
                    name={`${user.first_name} ${user.last_name}`}
                    size={46}
                    showStatus={false}
                  />
                  <Text style={styles.friendName}>
                    {user.first_name} {user.last_name}
                  </Text>
                  {user.friend_status === 'friend' ? (
                    <View style={styles.alreadyFriendBadge}>
                      <Text style={{ color: Colors.primary, marginRight: 4 }}>Déjà ami</Text>
                      <SvgCheck width={16} height={16} color={Colors.primary} />
                    </View>
                  ) : user.friend_status === 'need_response' ? (
                    <View style={styles.waitingBadge}>
                      <Text style={{ color: '#6C6C6C', marginRight: 4 }}>Demande envoyée</Text>
                      <SvgCheck width={16} height={16} color='#6C6C6C' />
                    </View>
                  ) : (
                    <Pressable
                      style={styles.addButton}
                      onPress={() => handleSendFriendRequest(user.id)}>
                      <SvgPlus width={16} height={16} color={Colors.white} />
                    </Pressable>
                  )}
                </View>
              ))
            )}
          </ScrollView>
        </View>
      </BottomSheet>

      {/* Bottom Sheet pour les actions sur un ami */}
      <BottomSheet
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        onClosed={handlePendingNavigation}
        height={300}
        enableDrag={true}
        enableBackdropDismiss={true}
      >
        <View>
          <Text style={styles.drawerTitle}>{selectedFriend?.first_name || 'Ami'}</Text>
          {/* Bouton Encourager maintenant */}
          <Pressable
            style={[styles.drawerOption, !selectedFriend?.isRunning && { opacity: 0.5 }]}
            onPress={() => {
              if (selectedFriend?.isRunning && selectedFriend.id !== undefined) {
                closeDrawerAndNavigate(() => {
                  router.push({
                    pathname: '/cheer',
                    params: {
                      id: String(selectedFriend.id),
                      firstName: selectedFriend.first_name,
                    },
                  });
                });
              }
            }}
            disabled={!selectedFriend?.isRunning || selectedFriend?.id === undefined}>
            <SvgRunningShoeIcon width={20} height={20} color={Colors.textPrimary} />
            <Text style={styles.drawerOptionText}>Encourager maintenant</Text>
          </Pressable>
          {/* Bouton Notifier/Ne pas notifier */}
          <Pressable
            style={styles.drawerOption}
            onPress={async () => {
              if (selectedFriend?.id) {
                await toggleNotificationBlock(selectedFriend.id);
              }
            }}>
            {isNotificationBlocked(selectedFriend) ? (
              <SvgCrossEye width={20} height={20} />
            ) : (
              <SvgEye width={20} height={20} color={Colors.textPrimary} />
            )}
            <Text
              style={[
                styles.drawerOptionText,
                isNotificationBlocked(selectedFriend) && { color: Colors.textSecondary },
              ]}>
              {isNotificationBlocked(selectedFriend)
                ? 'Notifier de mes courses'
                : 'Ne pas le notifier de mes courses'}
            </Text>
          </Pressable>
          {/* Bouton Supprimer */}
          <Pressable
            style={[styles.drawerOption, styles.dangerOption]}
            onPress={() => {
              setDrawerVisible(false);
              if (selectedFriend?.id) {
                handleRemoveFriend(selectedFriend.id);
              }
            }}>
            <SvgTrash width={20} height={20} color={Colors.error} />
            <Text style={[styles.drawerOptionText, styles.dangerText]}>Supprimer de mes amis</Text>
          </Pressable>
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  header: {
    paddingTop: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  scroll: {
    flexGrow: 1,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: Spacing.lg,
  },
  requestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: Spacing.lg,
  },
  searchUserItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  friendInfo: {
    flex: 1,
    marginLeft: 12,
  },
  friendName: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    flex: 1,
    marginLeft: 12,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationBlockedText: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  dotsButton: {
    padding: 8,
    borderRadius: Radius.full,
    minWidth: 40,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  declineButton: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    borderWidth: 2,
    borderColor: '#DBDBDB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  acceptButton: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alreadyFriendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary + '20',
    borderRadius: Radius.full,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  waitingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E5E5',
    borderRadius: Radius.full,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  drawerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  drawerOptionText: {
    marginLeft: 12,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  dangerOption: {
    borderBottomColor: Colors.error + '20',
  },
  dangerText: {
    color: Colors.error,
  },
  addFriendTitle: {
    fontWeight: '600',
    fontSize: FontSize.lg,
    marginBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  drawerTitle: {
    fontWeight: '600',
    fontSize: FontSize.lg,
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: '600',
    color: Colors.textPrimary,
  }
});
