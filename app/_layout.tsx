import { useAuth } from '@/stores/auth';
import { Slot } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';

export default function RootLayout() {
  const { restoreSession } = useAuth();

  useEffect(() => {
    restoreSession();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Slot />
    </View>
  );
}
