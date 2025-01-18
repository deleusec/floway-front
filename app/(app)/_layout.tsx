import { Redirect, Slot, Tabs } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';

import { useSession} from "@/context/ctx";
import AppMenu from '@/components/AppMenu';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { session, isLoading } = useSession();

  if (isLoading) {
      return <Text>Loading...</Text>;
  }

  if (!session) {
      return <Redirect href="/start" />;
  }

  return (
    <>
    <Slot />
    <AppMenu />
    </>
  );
}
