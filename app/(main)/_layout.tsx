import BottomMenu from '@/components/layouts/menu';
import { useStore } from '@/stores';
import { useAuth } from '@/stores/auth';
import { Redirect, Slot, usePathname } from 'expo-router';
import {SafeAreaView, StyleSheet} from 'react-native';
import { View, ActivityIndicator } from 'react-native';
import { useEffect } from 'react';

export default function MainLayout() {
  const store = useStore();
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    // Cacher le menu uniquement sur la page session
    store.setHideMenu(pathname === '/session' || pathname === '/cheer' || pathname === '/session/recap');
  }, [pathname]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size='large' />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href='/landing' />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: store.backgroundColor }]}>
      <Slot />
      {!store.hideMenu && <BottomMenu />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
});
