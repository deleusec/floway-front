import React from 'react';
import { Pressable, Image, StyleSheet, View } from 'react-native';
import { Colors, Radius } from '@/constants/theme';
import SvgRunningShoeIcon from '@/components/icons/RunningShoeIcon';

type Props = {
  image: string;
  isRunning?: boolean;
  onPress?: () => void;
  name?: string;
};

export default function FriendStatusAvatar({ image, isRunning = false, onPress }: Props) {
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
          <Image source={{ uri: image }} style={styles.avatar} />
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
