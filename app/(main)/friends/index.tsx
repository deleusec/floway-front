import SvgAddFriend from '@/components/icons/AddFriend';
import Title from '@/components/ui/title';
import { Spacing } from '@/constants/theme';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SearchInput } from '@/components/ui/input';
import React, { useState, useEffect } from 'react';
import Tabs from '@/components/ui/tabs';
import Drawer from '@/components/ui/drawer';
import { useFriendsStore } from '@/stores/friends';
import FriendStatusAvatar from '@/components/friends/status-avatar';
import { Colors } from '@/constants/theme';
import SvgHorizontalDots from '@/components/icons/HorizontalDots';
import SvgRunningShoeIcon from '@/components/icons/RunningShoeIcon';
import SvgEye from '@/components/icons/Eye';
import SvgTrash from '@/components/icons/Trash';
import SvgCheck from '@/components/icons/Check';
import SvgX from '@/components/icons/X';
import SvgPlus from '@/components/icons/Plus';
import { useAuth } from '@/stores/auth';
import { fuzzySearch } from '@/utils/calculations';
import { useRouter } from 'expo-router';
import type { Friend } from '@/stores/friends';

export default function FriendsScreen() {
  const [search, setSearch] = useState('');
  const [searchAddFriend, setSearchAddFriend] = useState('');
  const [tab, setTab] = useState('friends');
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [addFriendModalVisible, setAddFriendModalVisible] = useState(false);

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
    fetchNotificationSettings,
  } = useFriendsStore();

  const router = useRouter();

  // Charger les données au montage du composant
  useEffect(() => {
    if (isAuthenticated) {
      fetchFriends();
      fetchRequests();
    }
  }, [isAuthenticated]);

  // Charger les paramètres de notification au montage
  useEffect(() => {
    fetchNotificationSettings();
    console.log('fetchNotificationSettings');
  }, []);

  // Gérer les erreurs
  useEffect(() => {
    if (error) {
      Alert.alert('Erreur', error, [{ text: 'OK', onPress: clearError }]);
    }
  }, [error]);

  const handleAcceptRequest = async (requestId: number) => {
    try {
      await acceptFriendRequest(requestId);
      Alert.alert('Succès', "Demande d'ami acceptée !");
    } catch (error) {
      // L'erreur est déjà gérée dans le store
    }
  };

  const handleDeclineRequest = async (requestId: number) => {
    try {
      await declineFriendRequest(requestId);
      Alert.alert('Succès', "Demande d'ami refusée");
    } catch (error) {
      // L'erreur est déjà gérée dans le store
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
            // L'erreur est déjà gérée dans le store
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
      // L'erreur est déjà gérée dans le store
    }
  };

  const filteredFriends = fuzzySearch(friends, search, 'first_name', 0.3);
  const filteredRequests = fuzzySearch(requests, search, 'first_name', 0.3);

  // Debounce la recherche d'amis dans le Drawer
  useEffect(() => {
    const handler = setTimeout(() => {
      if (addFriendModalVisible && searchAddFriend.trim()) {
        useFriendsStore.getState().searchUsers(searchAddFriend);
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [searchAddFriend, addFriendModalVisible]);

  // Helper pour savoir si un ami est bloqué pour les notifications
  const isNotificationBlocked = (userId?: number) => {
    if (!userId) return false;
    return blockedNotifications.includes(userId);
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size='large' color={Colors.primary} />
        <Text style={{ marginTop: 16, color: Colors.textSecondary }}>Chargement...</Text>
      </View>
    );
  }

  const isBlocked = isNotificationBlocked(selectedFriend?.id);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerSection}>
          <Title>Amis</Title>
          <TouchableOpacity onPress={() => setAddFriendModalVisible(true)}>
            <SvgAddFriend width={32} height={32} />
          </TouchableOpacity>
        </View>

        <View style={{ paddingHorizontal: Spacing.lg, marginTop: 16 }}>
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
          <View style={{ marginTop: 24 }}>
            {filteredFriends.length === 0 ? (
              <Text style={{ textAlign: 'center', color: '#979799', marginTop: 32 }}>
                {search ? 'Aucun ami trouvé' : "Vous n'avez pas encore d'amis"}
              </Text>
            ) : (
              filteredFriends.map((friend, index) => (
                <View key={`friend-${friend.id}-${index}`} style={styles.friendItem}>
                  <FriendStatusAvatar
                    image={
                      friend.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(friend.first_name + ' ' + friend.last_name)}`
                    }
                    isRunning={friend.isRunning}
                  />
                  <View style={styles.friendInfo}>
                    <View style={styles.nameRow}>
                      <Text style={styles.friendName}>
                        {friend.first_name} {friend.last_name}
                      </Text>
                      {isNotificationBlocked(friend.id) && (
                        <SvgEye width={14} height={14} color={Colors.textSecondary} />
                      )}
                    </View>
                    {isNotificationBlocked(friend.id) && (
                      <Text style={styles.notificationBlockedText}>Notifications désactivées</Text>
                    )}
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
        </ScrollView>
      )}

      {tab === 'requests' && (
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={{ marginTop: 24 }}>
            {filteredRequests.length === 0 && (
              <Text style={{ textAlign: 'center', color: '#979799' }}>Aucune demande</Text>
            )}
            {filteredRequests.map((request, index) => (
              <View key={`request-${request.request_id}-${index}`} style={styles.requestItem}>
                <FriendStatusAvatar
                  image={
                    request.avatar ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(request.first_name + ' ' + request.last_name)}`
                  }
                />
                <Text style={styles.friendName}>
                  {request.first_name} {request.last_name}
                </Text>
                <Pressable
                  style={styles.declineButton}
                  onPress={() => handleDeclineRequest(request.request_id)}>
                  <SvgX width={24} height={24} color={Colors.gray[500]} />
                </Pressable>
                <Pressable
                  style={styles.acceptButton}
                  onPress={() => handleAcceptRequest(request.request_id)}>
                  <SvgCheck width={24} height={24} color={Colors.white} />
                </Pressable>
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      <Drawer
        mode='fixed'
        height={700}
        visible={addFriendModalVisible}
        onClose={() => {
          setAddFriendModalVisible(false);
          setSearchAddFriend('');
        }}>
        <View style={{ padding: 24 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 22, marginBottom: 16 }}>Ajoute un ami</Text>
          <SearchInput
            value={searchAddFriend}
            onChangeText={setSearchAddFriend}
            placeholder="Nom d'utilisateur…"
            autoCorrect={false}
            autoCapitalize='none'
          />
          <ScrollView style={{ marginTop: 16 }}>
            {searchResults.length === 0 ? (
              <Text style={{ textAlign: 'center', color: '#979799', marginTop: 32 }}>
                {searchAddFriend.trim() === ''
                  ? 'Commencez à taper pour rechercher des utilisateurs'
                  : 'Aucun utilisateur trouvé'}
              </Text>
            ) : (
              searchResults.map((user, index) => (
                <View key={`search-user-${user.id}-${index}`} style={styles.searchUserItem}>
                  <FriendStatusAvatar
                    image={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.first_name + ' ' + user.last_name)}`}
                    isRunning={false}
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
      </Drawer>

      {/* Drawer pour les actions sur un ami */}
      <Drawer
        mode='fixed'
        height={300}
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}>
        <View style={{ padding: 24 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 22, marginBottom: 16 }}>
            {selectedFriend?.first_name || 'Ami'}
          </Text>
          {/* Bouton Encourager maintenant */}
          <Pressable
            style={[styles.drawerOption, !selectedFriend?.isRunning && { opacity: 0.5 }]}
            onPress={() => {
              if (selectedFriend?.isRunning && selectedFriend.id !== undefined) {
                setDrawerVisible(false);
                router.push({ pathname: '/cheer', params: { id: String(selectedFriend.id) } });
              }
            }}
            disabled={!selectedFriend?.isRunning || selectedFriend?.id === undefined}>
            <SvgRunningShoeIcon size={24} color={Colors.textPrimary} />
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
            <SvgEye width={24} height={24} color={Colors.textPrimary} />
            <Text style={styles.drawerOptionText}>
              {isBlocked ? 'Notifier de mes courses' : 'Ne pas le notifier de mes courses'}
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
            <SvgTrash width={24} height={24} color={Colors.error} />
            <Text style={[styles.drawerOptionText, styles.dangerText]}>Supprimer de mes amis</Text>
          </Pressable>
        </View>
      </Drawer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#fff',
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
    paddingHorizontal: 16,
  },
  requestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
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
    fontSize: 16,
    color: Colors.textPrimary,
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationBlockedText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  dotsButton: {
    padding: 8,
    borderRadius: 20,
    minWidth: 40,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  declineButton: {
    width: 32,
    height: 32,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: '#fff',
  },
  acceptButton: {
    width: 32,
    height: 32,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alreadyFriendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary + '20',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  waitingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E5E5',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  drawerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  drawerOptionText: {
    marginLeft: 12,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  dangerOption: {
    borderBottomColor: Colors.error + '20',
  },
  dangerText: {
    color: Colors.error,
  },
});
