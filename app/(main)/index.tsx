import FriendsStatusList from "@/components/friends/status-list";
import Card from "@/components/ui/card";
import Title from "@/components/ui/title";
import { Spacing } from "@/constants/theme";
import { useAuth } from "@/stores/auth";
import { ScrollView, StyleSheet, View } from "react-native";

export default function MainScreen() {
    const { user } = useAuth();

    return (
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Header Section */}
          <View style={styles.headerSection}>
            <Title>Bonjour {user?.firstName}</Title>
          </View>

          {/* Friends Status Section */}
          <View style={styles.friendsSection}>
            <FriendsStatusList />
          </View>

          {/* Content Section */}
          <View style={styles.contentSection}>
            <Title level={2}>Mes courses</Title>

          </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scroll: {
      paddingBottom: 100,
    },
    headerSection: {
      paddingTop: Spacing.lg,
      paddingHorizontal: Spacing.lg,
    },
    friendsSection: {
      paddingVertical: Spacing.md,
    },
    contentSection: {
      paddingHorizontal: Spacing.lg,
    },
});
