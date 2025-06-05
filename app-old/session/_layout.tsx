import { Redirect, Slot } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';
import { useAuth } from '@/context/AuthContext';

export default function SessionLayout() {
  const { authToken, isLoading } = useAuth();

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!authToken) {
    return <Redirect href='/landing' />;
  }

  return <Slot />;
}
