import { Redirect, Slot } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';
import { useSession } from '@/context/ctx';
import { SessionProvider } from '@/context/SessionContext';

export default function SessionLayout() {
  const { session, isLoading } = useSession();

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!session) {
    return <Redirect href="/start" />;
  }

  return (
    <SessionProvider>
      <Slot />
    </SessionProvider>
  );
}
