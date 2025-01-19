import { Redirect, Slot } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';

import { useSession } from '@/context/ctx';
import { StudioProvider } from '@/context/StudioContext';

export default function TabLayout() {
  const { session, isLoading } = useSession();

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!session) {
    return <Redirect href="/start" />;
  }

  return (
    <StudioProvider>
      <Slot />
    </StudioProvider>
  );
}
