import BottomMenu from '@/components/layouts/menu';
import { useStore } from '@/stores';
import { useAuth } from '@/stores/auth';
import { Redirect, Slot, usePathname } from 'expo-router';
import {SafeAreaView, StyleSheet} from 'react-native';
import { View, ActivityIndicator } from 'react-native';
import { useEffect } from 'react';
import { Colors } from '@/constants/theme';

export default function MainLayout() {
  const store = useStore();
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    // Cacher le menu uniquement sur la page session
    store.setHideMenu(pathname === '/session' || pathname === '/cheer' || pathname === '/session/recap' || pathname === '/profile/edit');
  }, [pathname]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: store.backgroundColor }}>
        <ActivityIndicator size='large' />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href='/landing' />;
  }

  return (
    <View style={[styles.mainContainer, { backgroundColor: Colors.white }]}>
      <SafeAreaView style={[styles.container, { backgroundColor: store.backgroundColor }]}>
        <Slot />
      </SafeAreaView>
      {!store.hideMenu && <BottomMenu />}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
});
