import { Redirect, Slot } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';

import { useSession } from '@/context/ctx';

export default function TabLayout() {
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
    </>
  );
}
