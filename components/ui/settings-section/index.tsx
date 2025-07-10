import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Switch} from 'react-native';
import Text from '../text';
import { Colors, FontSize, FontFamily, Spacing } from '@/constants/theme';

const MAIN_OPTIONS = [
  {
    key: 'audio',
    title: 'Encouragements audio',
    subtitle: 'Reçois du support de tes amis pendant ta course',
  },
  {
    key: 'coach',
    title: 'Coach IA personnalisé',
    subtitle: 'Conseils adaptatifs basés sur tes performances',
  },
] as const;

type MainOptionKey = (typeof MAIN_OPTIONS)[number]['key'];
type MainValues = Record<MainOptionKey, boolean>;


export default function SettingsSection() {
  const [mainValues, setMainValues] = useState<MainValues>({
    audio: true,
    coach: true,
  });
  const [live, setLive] = useState(false);

  const handleMainToggle = (key: MainOptionKey, value: boolean) => {
    setMainValues(prev => ({ ...prev, [key]: value }));
  };

  return (
    <View style={styles.wrapper}>
      {MAIN_OPTIONS.map(opt => (
        <View key={opt.key} style={styles.card}>
          <View style={styles.cardTextBlock}>
            <Text weight='semiBold' size='md' style={styles.cardTitle}>
              {opt.title}
            </Text>
            <Text color='textSecondary' size='sm' style={styles.cardSubtitle}>
              {opt.subtitle}
            </Text>
          </View>
          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[styles.toggleBtn, mainValues[opt.key] && styles.toggleBtnActive]}
              onPress={() => handleMainToggle(opt.key, true)}
              activeOpacity={0.8}>
              <Text
                style={
                  [
                    styles.toggleBtnText,
                    mainValues[opt.key] ? styles.toggleBtnTextActive : undefined,
                  ] as any
                }>
                ✓ Activé
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleBtn,
                !mainValues[opt.key] && styles.toggleBtnInactive,
                !mainValues[opt.key] && styles.toggleBtnInactiveSelected,
              ]}
              onPress={() => handleMainToggle(opt.key, false)}
              activeOpacity={0.8}>
              <Text
                style={
                  [
                    styles.toggleBtnText,
                    !mainValues[opt.key]
                      ? styles.toggleBtnTextInactiveSelected
                      : styles.toggleBtnTextInactive,
                  ] as any
                }>
                Désactivé
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
      <View style={styles.quickSection}>
        <Text weight='semiBold' size='md' style={styles.quickTitle}>
          ⚡ Paramètres rapides
        </Text>
        <View style={styles.quickRow}>
          <Text size='md' style={styles.quickLabel}>
            Partage en temps réel
          </Text>
          <Switch
            value={live}
            onValueChange={setLive}
            trackColor={{ false: Colors.border, true: Colors.primary }}
            thumbColor={live ? Colors.primary : Colors.surface}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  cardTextBlock: {
    marginBottom: Spacing.md,
  },
  cardTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  cardSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 12,
  },
  toggleBtn: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  toggleBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  toggleBtnInactive: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
  },
  toggleBtnInactiveSelected: {
    backgroundColor: '#E0E0E0',
    borderColor: Colors.primary,
  },
  toggleBtnText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  toggleBtnTextActive: {
    color: Colors.white,
    fontWeight: 'bold',
  },
  toggleBtnTextInactive: {
    color: Colors.textSecondary,
  },
  toggleBtnTextInactiveSelected: {
    color: Colors.textPrimary,
    fontWeight: 'bold',
  },
  quickSection: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  quickTitle: {
    marginBottom: Spacing.md,
    color: Colors.textPrimary,
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
  },
  quickRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quickLabel: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
});
