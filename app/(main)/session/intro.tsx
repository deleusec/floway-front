import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, FontSize, FontFamily, Spacing, Radius } from '@/constants/theme';
import Text from '@/components/ui/text';
import Button from '@/components/ui/button';
import SettingsSection from '@/components/ui/settings-section';

export default function SessionIntroScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text weight='bold' size='xxl' style={styles.title}>
        Prêt à courir ?
      </Text>
      <Text color='textSecondary' size='md' style={styles.subtitle}>
        Prépare tes réglages avant de lancer ta séance !
      </Text>
      <SettingsSection />
      <View style={styles.buttonsContainer}>
        <Button
          title='Commencer une nouvelle course'
          variant='primary'
          size='large'
          width='full'
          style={styles.button}
          onPress={() => router.push('/(main)/session/start')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    color: Colors.textPrimary,
  },
  subtitle: {
    textAlign: 'center',
    color: Colors.textSecondary,
    fontFamily: FontFamily.regular,
  },
  buttonsContainer: {
    marginTop: Spacing.xl,
  },
  button: {
    marginBottom: Spacing.md,
  },
});