import SvgAddFriend from '@/components/icons/AddFriend';
import Title from '@/components/ui/title';
import { Spacing } from '@/constants/theme';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SearchInput } from '@/components/ui/input';
import React, { useState } from 'react';

export default function FriendsScreen() {
  const [search, setSearch] = useState('');
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
