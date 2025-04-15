import { useAuth } from '@/stores/auth';
import { Slot } from 'expo-router';
import { useEffect } from 'react';
import { SafeAreaView } from 'react-native';

export default function RootLayout() {
  const { restoreSession } = useAuth();

  useEffect(() => {
    restoreSession();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Slot />
    </SafeAreaView>
  );
}
