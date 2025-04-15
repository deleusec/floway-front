import BottomMenu from "@/components/layouts/menu";
import { Colors } from "@/constants/theme";
import { useAuth } from "@/stores/auth";
import { Redirect, Slot } from "expo-router";
import { ScrollView, StyleSheet } from "react-native";
import { View, ActivityIndicator } from "react-native";

export default function MainLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/landing" />;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Slot />
      </ScrollView>
      <BottomMenu />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
});
