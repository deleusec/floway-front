import React, { useState } from 'react';
import { Pressable, Image, StyleSheet, View, Text } from 'react-native';
import { Colors, Radius, FontFamily } from '@/constants/theme';
import SvgRunningShoeIcon from '@/components/icons/RunningShoeIcon';

type AvatarSize = 46 | 56 | 74 | 100;

type Props = {
  image?: string; // URL vers l'image backend
  isRunning?: boolean;
  onPress?: () => void;
  name: string; // utilisé pour générer les initiales
  size?: AvatarSize; // taille de l'avatar en pixels
  showStatus?: boolean; // afficher ou non le status de course
};

export default function FriendStatusAvatar({ 
  image, 
  isRunning = false, 
  onPress, 
  name, 
  size = 46,
  showStatus = true 
}: Props) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(!!image);

  // Générer les initiales à partir du nom
  const getInitials = (fullName: string): string => {
    const names = fullName.trim().split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return names[0] ? names[0][0].toUpperCase() : '?';
  };

  // Calculer les styles dynamiques en fonction de la taille
  const avatarStyles = getAvatarStyles(size);
  
  // L'image s'affiche seulement si elle existe, n'est pas en erreur, et a fini de charger
  const showImage = image && !error && !loading;

  return (
    <Pressable onPress={onPress}>
      <View style={styles.wrapper}>
        <View
          style={[
            showStatus ? styles.border : null,
            showStatus ? avatarStyles.border : null,
            showStatus ? {
              borderColor: isRunning ? Colors.primary : Colors.borderHigh,
            } : null,
          ]}>
          <View style={[styles.avatarContainer, avatarStyles.avatar]}>
            {/* Placeholder avec initiales */}
            <View style={[styles.initialsContainer, avatarStyles.avatar]}>
              <Text style={[styles.initialsText, avatarStyles.text]}>
                {getInitials(name)}
              </Text>
            </View>
            
            {/* Image qui se superpose une fois chargée */}
            {image && (
              <Image
                source={{ uri: image }}
                style={[
                  styles.avatar, 
                  avatarStyles.avatar, 
                  { position: 'absolute', opacity: showImage ? 1 : 0 }
                ]}
                onLoad={() => setLoading(false)}
                onError={() => {
                  setError(true);
                  setLoading(false);
                }}
              />
            )}
          </View>
        </View>

        {showStatus && isRunning && (
          <View style={[styles.runningBadge, avatarStyles.badge]}>
            <SvgRunningShoeIcon color={Colors.white} size={avatarStyles.iconSize} />
          </View>
        )}
      </View>
    </Pressable>
  );
}

function getAvatarStyles(size: AvatarSize) {
  const borderPadding = size >= 74 ? 3 : 2;
  const badgeSize = size >= 74 ? { width: 32, height: 22 } : { width: 26, height: 18 };
  const iconSize = size >= 74 ? 14 : 12;
  const fontSize = size >= 74 ? 24 : size >= 56 ? 18 : 14;
  
  return {
    border: {
      padding: borderPadding,
    },
    avatar: {
      width: size,
      height: size,
    },
    badge: {
      ...badgeSize,
      bottom: size >= 74 ? -6 : -5,
    },
    iconSize,
    text: {
      fontSize,
    }
  };
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  border: {
    borderWidth: 2,
    borderRadius: Radius.full,
  },
  avatarContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    borderRadius: Radius.full,
  },
  initialsContainer: {
    backgroundColor: Colors.gray[400],
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialsText: {
    color: Colors.white,
    fontFamily: FontFamily.semiBold,
  },
  runningBadge: {
    position: 'absolute',
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.background
  },
});