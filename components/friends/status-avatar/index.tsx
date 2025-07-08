import React, { useState } from 'react';
import { Pressable, Image, StyleSheet, View } from 'react-native';
import { Colors, Radius } from '@/constants/theme';
import SvgRunningShoeIcon from '@/components/icons/RunningShoeIcon';

type Props = {
  image: string; // URL vers l’image backend
  isRunning?: boolean;
  onPress?: () => void;
  name?: string; // utilisé pour générer le fallback
};

export default function FriendStatusAvatar({ image, isRunning = false, onPress, name }: Props) {
  const [error, setError] = useState(false);

  const fallbackImage = name
    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`
    : undefined;

  return (
    <Pressable onPress={onPress}>
      <View style={styles.wrapper}>
        <View
          style={[
            styles.border,
            {
              borderColor: isRunning ? Colors.primary : Colors.borderHigh,
            },
          ]}>
          <Image
            source={{ uri: error && fallbackImage ? fallbackImage : image }}
            style={styles.avatar}
            onError={() => setError(true)}
          />
        </View>

        {isRunning && (
          <View style={styles.runningBadge}>
            <SvgRunningShoeIcon color={Colors.white} size={12} />
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  border: {
    padding: 2,
    borderWidth: 2,
    borderRadius: Radius.full,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: Radius.full,
  },
  runningBadge: {
    position: 'absolute',
    bottom: -5,
    width: 26,
    height: 18,
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.background
  },
});
