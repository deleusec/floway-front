import FriendsStatusList from '@/components/friends/status-list';
import CardMap from '@/components/ui/map';
import Title from '@/components/ui/title';
import { Spacing } from '@/constants/theme';
import { useAuth } from '@/stores/auth';
import { useLiveFriends } from '@/hooks/useLiveFriends';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function MainScreen() {
  const { user } = useAuth();

  // Utiliser le hook pour le polling des amis en direct
  useLiveFriends();

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
        <CardMap
          image={require('@/assets/images/map.png')}
          runData={{
            title: 'Course du midi',
            date: '13/04/2024',
            duration: '1h29',
            distance: '10.1 km',
            speed: '6.7 km/h',
          }}
          participants={[
            {
              id: '1',
              avatar: 'https://i.pravatar.cc/150?img=1',
              firstName: 'Jean',
            },
            {
              id: '2',
              avatar: 'https://i.pravatar.cc/150?img=2',
              firstName: 'Marie',
            },
          ]}
        />
      </View>
      <View style={{ padding: Spacing.lg }}></View>
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
