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
} from 'react-native';
import { SearchInput } from '@/components/ui/input';
import React, { useState } from 'react';
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

interface Friend {
  id: string;
  firstName: string;
  avatar: string;
  isRunning: boolean;
}

export default function FriendsScreen() {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('friends');
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [addFriendModalVisible, setAddFriendModalVisible] = useState(false);
  const [pendingRequests, setPendingRequests] = useState<string[]>(['1']);

  const friends = useFriendsStore(state => state.friends);
  const requests = useFriendsStore(state => state.requests);
  const allUsers = useFriendsStore(state => state.allUsers);

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
            {friends
              .filter(friend => friend.firstName.toLowerCase().includes(search.toLowerCase()))
              .map(friend => (
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
              ))}
          </View>
        </ScrollView>
      )}
      {tab === 'requests' && (
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={{ marginTop: 24 }}>
            {requests.length === 0 && (
              <Text style={{ textAlign: 'center', color: '#979799' }}>Aucune demande</Text>
            )}
            {requests
              .filter(request => request.firstName.toLowerCase().includes(search.toLowerCase()))
              .map(request => (
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
                      /* TODO: Supprimer la demande */
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
                      /* TODO: Accepter la demande */
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
          <SearchInput
            value={search}
            onChangeText={setSearch}
            placeholder="Nom d'utilisateur…"
            autoCorrect={false}
            autoCapitalize='none'
          />
          <ScrollView style={{ marginTop: 16 }}>
            {allUsers
              .filter(user => user.firstName.toLowerCase().includes(search.toLowerCase()))
              .map(user => {
                const isPending = pendingRequests.includes(user.id);
                return (
                  <View
                    key={user.id}
                    style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12 }}>
                    <FriendStatusAvatar image={user.avatar} />
                    <Text style={{ flex: 1, marginLeft: 12, fontSize: 16 }}>{user.firstName}</Text>
                    {isPending ? (
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
                        <SvgCheck width={24} height={24} color='#6C6C6C' />
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
                          /* TODO: Accepter la demande */
                        }}>
                        <SvgPlus width={18} height={18} color={Colors.white} />
                      </Pressable>
                    )}
                  </View>
                );
              })}
          </ScrollView>
        </View>
      </Drawer>
      <Drawer
        mode='fixed'
        height={300}
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}>
        {selectedFriend && (
          <View style={{ gap: 12 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                marginBottom: 8,
                borderBottomWidth: 1,
                borderBottomColor: Colors.border,
                paddingBottom: Spacing.lg,
                paddingHorizontal: Spacing.lg,
              }}>
              <FriendStatusAvatar
                image={selectedFriend.avatar}
                isRunning={selectedFriend.isRunning}
              />
              <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{selectedFriend.firstName}</Text>
            </View>

            <View style={{ gap: 12, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.lg }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <SvgRunningShoeIcon color={Colors.black} size={16} />
                <Text style={{ fontSize: 16 }}>Encourager maintenant</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <SvgEye color={Colors.black} />
                <Text style={{ fontSize: 16, color: '#979799' }}>
                  Ne pas le notifier de mes courses
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <SvgTrash color={Colors.error} />
                <Text style={{ fontSize: 16, color: Colors.error }}>Supprimer de mes amis</Text>
              </View>
            </View>
          </View>
        )}
      </Drawer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    paddingBottom: 100,
  },
  header: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerSection: {
    paddingTop: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  friendsSection: {
    paddingVertical: Spacing.md,
  },
  contentSection: {
    paddingHorizontal: Spacing.lg,
  },
});
