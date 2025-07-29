import { useAuth } from '@/stores/auth';
import { Slot } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';
import { NotificationProvider } from '@/components/providers/NotificationProvider';

export default function RootLayout() {
  const { restoreSession } = useAuth();

  useEffect(() => {
    restoreSession();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <NotificationProvider>
        <Slot />
      </NotificationProvider>
    </View>
  );
}
