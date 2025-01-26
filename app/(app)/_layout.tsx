import { Redirect, Slot } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';

import { useAuth } from '@/context/ctx';
import AppMenu from '@/components/AppMenu';

export default function TabLayout() {
  const { authToken, isLoading } = useAuth();

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!authToken) {
    return <Redirect href="/start" />;
  }

  return (
    <>
      <Slot />
      <AppMenu />
    </>
  );
}
