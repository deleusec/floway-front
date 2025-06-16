import React from 'react';
import { View, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import Button from '@/components/ui/button';
import { Colors, Spacing } from '@/constants/theme';

export interface BackFooterAction {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost' | 'error';
  [key: string]: any;
}

interface BackFooterProps {
  actions?: BackFooterAction[];
  children?: React.ReactNode;
  style?: ViewStyle;
}

export default function BackFooter({ actions, children, style }: BackFooterProps) {
  return (
    <View style={[styles.container, style]}>
      {children}
      {actions && (
        <View style={styles.actionsRow}>
          {actions.map((action, idx) => (
            <Button
              title={action.label}
              key={action.label + idx}
              variant={action.variant as any}
              disabled={action.disabled}
              style={[styles.button, action.style]}
              {...action}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.md,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  button: {
    flex: 1,
    marginHorizontal: 0,
  },
});