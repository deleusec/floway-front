import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import {Colors, Radius, Spacing} from "@/theme";
import SvgEditIcon from "@/components/icons/EditIcon";
import SvgLogoutIcon from "@/components/icons/LogoutIcon";
import { useAuth } from "@/stores/auth";
import { API_URL } from '@/constants/env';
import { Linking } from 'react-native';
import {router} from "expo-router";
import {useStore} from "@/stores";
import SvgTrash from "@/components/icons/Trash";
import FriendStatusAvatar from "@/components/friends/status-avatar";

export default function ProfileScreen() {
  const logout = useAuth(state => state.logout);
  const { user, token } = useAuth();
  const { setBackgroundColor } = useStore()

  useEffect(() => {
    setBackgroundColor(Colors.white)
  }, []);

  const [imageError, setImageError] = useState(false);

  const handleEditProfile = () => {
    router.push('(main)/profile/edit' as any);
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
          },
        },
      ],
      { cancelable: true }
    );
  };

  const confirmDelete = () => {
    Alert.alert(
      "Suppression de compte",
      "Êtes-vous sûr de vouloir demander la suppression de votre compte ? Un email sera ouvert pour finaliser la demande.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Continuer",
          style: "destructive",
          onPress: () => {
            const email = "floway.dev@gmail.com";
            const subject = encodeURIComponent("Demande de suppression de compte Floway");
            const body = encodeURIComponent(
              `Bonjour,\n\nJe souhaite supprimer mon compte Floway associé à l'adresse email suivante : ${user?.email}.\n\nMerci d'en accuser réception.\n\nCordialement,`
            );
            const mailtoUrl = `mailto:${email}?subject=${subject}&body=${body}`;
            Linking.openURL(mailtoUrl).catch(err =>
              Alert.alert("Erreur", "Impossible d’ouvrir votre application mail.")
            );
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
        <FriendStatusAvatar
          image={imageError || !user ? undefined : profilePictureUrl}
          name={`${user?.firstName || ''} ${user?.lastName || ''}`}
          size={74}
          showStatus={false}
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
          <SvgLogoutIcon color={Colors.black} width={20} height={20} />
          <Text style={styles.logoutText}>Me déconnecter</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteAccountButton} onPress={confirmDelete}>
          <SvgTrash color={Colors.error} width={20} height={20} />
          <Text style={styles.deleteAccountText}>Supprimer mon compte</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 29,
    paddingHorizontal: 34,
    backgroundColor: Colors.white,
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
    marginHorizontal: Spacing.xl
  },
  logoutButton: {
    flexDirection: 'row',
    borderColor: Colors.borderHigh,
    borderWidth: 1,
    paddingVertical: 13,
    borderRadius: Radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    gap: 8,
  },
  logoutText: {
    color: Colors.black,
    fontWeight: '500',
  },
  deleteAccountButton: {
    flexDirection: 'row',
    marginTop: Spacing.md,
    borderColor: Colors.error,
    borderWidth: 1,
    paddingVertical: 13,
    borderRadius: Radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    gap: 8,
  },
  deleteAccountText: {
    color: Colors.error,
    fontWeight: '500',
  },
});
