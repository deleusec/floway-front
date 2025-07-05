import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Link, usePathname } from 'expo-router';
import { Colors, FontFamily, FontSize, Spacing } from '@/constants/theme';

import SvgHomeIcon from '@/components/icons/HomeIcon';
import SvgPlayIcon from '@/components/icons/PlayIcon';
import SvgUsersIcon from '@/components/icons/UsersIcon';
import SvgUserIcon from "@/components/icons/UserIcon";

const TABS = [
  { label: 'Accueil', href: '/', icon: SvgHomeIcon },
  { label: 'Démarrer', href: '/session/start', icon: SvgPlayIcon },
  { label: 'Amis', href: '/friends', icon: SvgUsersIcon },
  { label: 'Profil', href: '/profile', icon: SvgUserIcon }
];

export default function BottomMenu() {
  const pathname = usePathname();

  return (
    <View style={styles.container}>
      {TABS.map(({ label, href, icon: Icon }) => {
        const isActive = pathname === href;
        const color = isActive ? Colors.textPrimary : Colors.gray[400];

        return (
          <Link href={href as any} asChild key={href}>
            <Pressable style={styles.tab}>
              <Icon size={22} color={color} />
              <Text style={[styles.label, { color }]}>{label}</Text>
            </Pressable>
          </Link>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  label: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
  },
});
