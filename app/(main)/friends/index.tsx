import SvgAddFriend from '@/components/icons/AddFriend';
import Title from '@/components/ui/title';
import { Spacing } from '@/constants/theme';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Pressable,
  SafeAreaView,
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

interface Friend {
  id: string;
  firstName: string;
  avatar: string;
  isRunning: boolean;
  user_id?: number;
}

export default function FriendsScreen() {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('friends');
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [addFriendModalVisible, setAddFriendModalVisible] = useState(false);
  const [pendingRequests, setPendingRequests] = useState<string[]>(['1']);

  const { isAuthenticated } = useAuth();
  const {
    friends,
    requests,
    allUsers,
    isLoading,
    error,
    fetchFriends,
    fetchRequests,
    fetchAllUsers,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    removeFriend,
    clearError,
  } = useFriendsStore();

  // Charger les données au montage du composant
  useEffect(() => {
    if (isAuthenticated) {
      fetchFriends();
      fetchRequests();
      fetchAllUsers();
    }
  }, [isAuthenticated]);

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
      setPendingRequests(prev => [...prev, userId.toString()]);
      Alert.alert('Succès', "Demande d'ami envoyée !");
    } catch (error) {
      // L'erreur est déjà gérée dans le store
    }
  };

  const filteredFriends = fuzzySearch(friends, search, 'firstName', 0.3);

  const filteredRequests = fuzzySearch(requests, search, 'firstName', 0.3);

  const filteredAllUsers = fuzzySearch(allUsers, search, 'firstName', 0.3);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size='large' color={Colors.primary} />
        <Text style={{ marginTop: 16, color: Colors.textSecondary }}>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerSection}>
          <Title>Amis</Title>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => setAddFriendModalVisible(true)}>
              <SvgAddFriend width={32} height={32} />
            </TouchableOpacity>
          </View>
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
              filteredFriends.map(friend => (
                <View
                  key={friend.id}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                  }}>
                  <FriendStatusAvatar image={friend.avatar} isRunning={friend.isRunning} />
                  <Text style={{ flex: 1, marginLeft: 12, fontSize: 16 }}>{friend.firstName}</Text>
                  <Pressable
                    onPress={() => {
                      setSelectedFriend(friend);
                      setDrawerVisible(true);
                    }}
                    style={{ padding: 8 }}>
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
            {filteredRequests.map(request => (
              <View
                key={request.id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                }}>
                <FriendStatusAvatar image={request.avatar} />
                <Text style={{ flex: 1, marginLeft: 12, fontSize: 16 }}>{request.firstName}</Text>
                <Pressable
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 24,
                    borderWidth: 2,
                    borderColor: Colors.border,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                    backgroundColor: '#fff',
                  }}
                  onPress={() => {
                    if (request.request_id) {
                      handleDeclineRequest(request.request_id);
                    }
                  }}>
                  <SvgX width={24} height={24} color={Colors.gray[500]} />
                </Pressable>
                <Pressable
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 24,
                    backgroundColor: Colors.primary,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() => {
                    if (request.request_id) {
                      handleAcceptRequest(request.request_id);
                    }
                  }}>
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
        onClose={() => setAddFriendModalVisible(false)}>
        <View style={{ padding: 24 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 22, marginBottom: 16 }}>Ajoute un ami</Text>

          {/* Note temporaire */}
          <View style={styles.tempNote}>
            <Text style={styles.tempNoteText}>
              ⚠️ La recherche d'utilisateurs utilise des données temporaires en attendant la
              création de l'endpoint backend.
            </Text>
          </View>

          <SearchInput
            value={search}
            onChangeText={setSearch}
            placeholder="Nom d'utilisateur…"
            autoCorrect={false}
            autoCapitalize='none'
          />
          <ScrollView style={{ marginTop: 16 }}>
            {filteredAllUsers.length === 0 ? (
              <Text style={{ textAlign: 'center', color: '#979799', marginTop: 32 }}>
                Aucun utilisateur trouvé
              </Text>
            ) : (
              filteredAllUsers.map(user => {
                const isPending = pendingRequests.includes(user.id);
                const isAlreadyFriend = friends.some(friend => friend.id === user.id);

                return (
                  <View
                    key={user.id}
                    style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12 }}>
                    <FriendStatusAvatar image={user.avatar} />
                    <Text style={{ flex: 1, marginLeft: 12, fontSize: 16 }}>{user.firstName}</Text>
                    {isAlreadyFriend ? (
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          backgroundColor: Colors.primary + '20',
                          borderRadius: 20,
                          paddingHorizontal: 12,
                          paddingVertical: 4,
                        }}>
                        <Text style={{ color: Colors.primary, marginRight: 4 }}>Déjà ami</Text>
                        <SvgCheck width={16} height={16} color={Colors.primary} />
                      </View>
                    ) : isPending ? (
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          backgroundColor: '#E5E5E5',
                          borderRadius: 20,
                          paddingHorizontal: 12,
                          paddingVertical: 4,
                        }}>
                        <Text style={{ color: '#6C6C6C', marginRight: 4 }}>Demande envoyée</Text>
                        <SvgCheck width={16} height={16} color='#6C6C6C' />
                      </View>
                    ) : (
                      <Pressable
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 24,
                          backgroundColor: Colors.primary,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        onPress={() => {
                          if (user.user_id) {
                            handleSendFriendRequest(user.user_id);
                          }
                        }}>
                        <SvgPlus width={24} height={24} color={Colors.white} />
                      </Pressable>
                    )}
                  </View>
                );
              })
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
            {selectedFriend?.firstName}
          </Text>

          <Pressable
            style={styles.drawerOption}
            onPress={() => {
              setDrawerVisible(false);
              // TODO: Naviguer vers le profil de l'ami
            }}>
            <SvgEye width={24} height={24} color={Colors.textPrimary} />
            <Text style={styles.drawerOptionText}>Voir le profil</Text>
          </Pressable>

          <Pressable
            style={styles.drawerOption}
            onPress={() => {
              setDrawerVisible(false);
              // TODO: Bloquer/débloquer les notifications
            }}>
            <SvgRunningShoeIcon size={24} color={Colors.textPrimary} />
            <Text style={styles.drawerOptionText}>Paramètres de notification</Text>
          </Pressable>

          <Pressable
            style={[styles.drawerOption, styles.dangerOption]}
            onPress={() => {
              setDrawerVisible(false);
              if (selectedFriend?.user_id) {
                handleRemoveFriend(selectedFriend.user_id);
              }
            }}>
            <SvgTrash width={24} height={24} color={Colors.error} />
            <Text style={[styles.drawerOptionText, styles.dangerText]}>Supprimer l'ami</Text>
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
  tempNote: {
    backgroundColor: Colors.primary + '20',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  tempNoteText: {
    color: Colors.primary,
    fontSize: 14,
    textAlign: 'center',
  },
});
