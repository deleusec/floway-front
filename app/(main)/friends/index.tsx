import SvgAddFriend from '@/components/icons/AddFriend';
import Title from '@/components/ui/title';
import { Spacing } from '@/constants/theme';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { SearchInput } from '@/components/ui/input';
import React, { useState } from 'react';
import Tabs from '@/components/ui/tabs';
import Drawer from '@/components/ui/drawer';

export default function FriendsScreen() {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('friends');
  const [drawerVisible, setDrawerVisible] = useState(false);
  return (
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <View style={styles.headerSection}>
        <Title>Amis</Title>
        <SvgAddFriend width={32} height={32} />
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
          { label: 'Mes demandes', value: 'requests' },
        ]}
        value={tab}
        onChange={setTab}
      />
      <TouchableOpacity
        style={{ margin: 32, backgroundColor: '#624AF6', borderRadius: 12, padding: 16, alignItems: 'center' }}
        onPress={() => setDrawerVisible(true)}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Ouvrir Drawer exemple</Text>
      </TouchableOpacity>
      <Drawer mode='fit' visible={drawerVisible} onClose={() => setDrawerVisible(false)}>
        <View style={{ gap: 12, padding: Spacing.lg }}>
          <Text style={{ fontSize: 16 }}>Encourager maintenant</Text>
          <Text style={{ fontSize: 16, color: '#979799' }}>Notifier de mes courses</Text>
          <Text style={{ fontSize: 16, color: '#EF4444' }}>Supprimer de mes amis</Text>
        </View>
      </Drawer>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: 100,
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
