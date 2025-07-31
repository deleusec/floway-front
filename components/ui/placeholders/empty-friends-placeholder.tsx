import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import SvgAddFriend from '@/components/icons/AddFriend';

export default function EmptyFriendsPlaceholder() {
  const router = useRouter();

  const handlePress = () => {
    router.push('/friends');
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.container} activeOpacity={0.8}>
      <View style={styles.avatarContainer}>
        <SvgAddFriend width={24} height={24} color={Colors.gray['400']} />
      </View>
      <Text style={styles.addText}>Ajouter</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: 56,
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#CCCCCC',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addText: {
    marginTop: 8,
    fontSize: FontSize.xs,
    color: Colors.gray['400'],
    textAlign: 'center',
  },
});