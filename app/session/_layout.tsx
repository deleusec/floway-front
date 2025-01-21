import { Redirect, Slot, Tabs } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Stack } from 'expo-router';
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
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="target"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="guide"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="selectedFree"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="selectedTarget"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="selectedGuided"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </SessionProvider>
  );
}
