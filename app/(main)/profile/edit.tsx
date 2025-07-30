import React, {useEffect, useState} from 'react';
import * as ImagePicker from 'expo-image-picker';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, FontSize, Radius, Spacing } from '@/theme';
import { useAuth } from '@/stores/auth';
import { useUserStore } from '@/stores/user';
import Button from '@/components/ui/button';
import SvgX from "@/components/icons/X";
import {API_URL} from "@/constants/env";
import SvgPencilIcon from "@/components/icons/PencilIcon";
import Input from "@/components/ui/input";
import InputLabel from "@/components/ui/input/label";
import {useStore} from "@/stores";
import FriendStatusAvatar from "@/components/friends/status-avatar";

export default function EditProfileScreen() {
  const { user, token } = useAuth();
  const { updateProfile, isUpdatingProfile } = useUserStore();
  const router = useRouter();

  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [alias, setAlias] = useState(user?.alias || '');

  const [hasImageChanged, setHasImageChanged] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [newImage, setNewImage] = useState<string | null>(null);
  const { setBackgroundColor } = useStore()

  useEffect(() => {
    setBackgroundColor(Colors.white)
  }, []);


  const handleSave = async () => {
    if (!token) {
      console.error('Token manquant');
      return;
    }

    try {
      const profileData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        alias: alias.trim(),
      };

      const success = await updateProfile(profileData, newImage, token);

      if (success) {
        router.back();
      } else {
        console.error('Échec de la mise à jour du profil');
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleClose = () => {
    router.back();
  };

  const handleEditPicture = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedImage = result.assets[0].uri;
      setNewImage(selectedImage);
      setHasImageChanged(true);
    }
  };

  const profilePictureUrl = `${API_URL}/api/user/picture/${user?.id}?bearer=${token}`;

  const hasChanges =
    firstName !== user?.firstName ||
    lastName !== user?.lastName ||
    alias !== user?.alias ||
    hasImageChanged;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Modifier mon profil</Text>
        <TouchableOpacity onPress={handleClose}>
          <SvgX />
        </TouchableOpacity>
      </View>

      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <FriendStatusAvatar
          image={newImage || (imageError || !user ? undefined : profilePictureUrl)}
          name={`${user?.firstName || ''} ${user?.lastName || ''}`}
          size={100}
          showStatus={false}
        />
        <TouchableOpacity style={styles.editIcon} onPress={handleEditPicture}>
          <SvgPencilIcon width={18} height={18} />
        </TouchableOpacity>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <View style={styles.field}>
          <InputLabel>Prénom</InputLabel>
          <Input value={firstName} onChangeText={setFirstName} placeholder="Prénom" />
        </View>

        <View style={styles.field}>
          <InputLabel>Nom</InputLabel>
          <Input value={lastName} onChangeText={setLastName} placeholder="Nom" />
        </View>

        <View style={styles.field}>
          <InputLabel>Pseudo</InputLabel>
          <Input value={alias} onChangeText={setAlias} placeholder="Pseudo" />
        </View>

        <View style={styles.buttonWrapper}>
          <Button
            onPress={handleSave}
            title='Sauvegarder'
            disabled={!hasChanges || isUpdatingProfile}
            width='fit'
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border
  },
  headerTitle: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  avatarContainer: {
    alignItems: 'center',
    margin: Spacing.xl,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: '35%',
    backgroundColor: Colors.white,
    borderRadius: Radius.full,
    borderWidth: 1,
    width: 37,
    height: 37,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  buttonWrapper: {
    marginTop: Spacing.xl,
    alignItems: 'center',
  },
  field: {
    gap: Spacing.sm,
  },
});
