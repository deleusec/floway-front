import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Colors } from "@/theme";
import SvgEditIcon from "@/components/icons/EditIcon";
import SvgLogoutIcon from "@/components/icons/LogoutIcon";
import { useAuth } from "@/stores/auth";
import { API_URL } from '@/constants/env';

export default function ProfileScreen() {
  const logout = useAuth(state => state.logout);
  const { user, token } = useAuth();

  const [imageError, setImageError] = useState(false);

  const handleEditProfile = () => {
    console.log('Modifier le profil');
  };

  const confirmLogout = () => {
    Alert.alert(
      "Déconnexion",
      "Voulez-vous vraiment vous déconnecter ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Se déconnecter",
          style: "destructive",
          onPress: () => {
            logout();
            console.log("Déconnecté");
          },
        },
      ],
      { cancelable: true }
    );
  };

  const profilePictureUrl = `${API_URL}/api/user/picture/${user?.id}?bearer=${token}`;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={
            imageError || !user
              ? { uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.firstName + ' ' + user?.lastName)}` }
              : { uri: profilePictureUrl }
          }
          style={styles.avatar}
          onError={() => setImageError(true)}
        />
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{user?.firstName} {user?.lastName}</Text>
          <Text style={styles.username}>@{user?.alias}</Text>
        </View>
        <TouchableOpacity onPress={handleEditProfile}>
          <SvgEditIcon />
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
          <SvgLogoutIcon width={20} height={20} />
          <Text style={styles.logoutText}>Me déconnecter</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 29,
    paddingHorizontal: 34,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  avatar: {
    width: 74,
    height: 74,
    borderRadius: 99,
    marginRight: 18,
    borderWidth: 1,
    borderColor: Colors.border
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 4,
  },
  username: {
    color: Colors.gray["500"],
    fontSize: 14
  },
  logoutContainer: {
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 40,
  },
  logoutButton: {
    flexDirection: 'row',
    borderColor: '#EB6564',
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 39,
    borderRadius: 99,
    alignItems: 'center',
    gap: 8,
  },
  logoutText: {
    color: '#EB6564',
    fontWeight: '500',
  }
});
