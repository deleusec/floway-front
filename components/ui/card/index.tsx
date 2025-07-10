import React from 'react';
import { View, StyleSheet, ViewProps, ViewStyle } from 'react-native';
import { Colors, Radius } from '@/constants/theme';

type BorderRadiusSize = 'sm' | 'md' | 'lg';

interface CardProps extends ViewProps {
  radius?: BorderRadiusSize;
  style?: ViewStyle | ViewStyle[];
  children: React.ReactNode;
}

const radiusMap = {
  sm: Radius.sm, // 6px
  md: Radius.md, // 12px
  lg: Radius.lg, // 20px
};

const Card: React.FC<CardProps> = ({ radius = 'md', style, children, ...rest }) => {
  return (
    <View style={[styles.base, { borderRadius: radiusMap[radius] }, style]} {...rest}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    overflow: 'hidden',
  },
});

export default Card;
