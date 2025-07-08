import FriendsStatusList from '@/components/friends/status-list';
import CardMap from '@/components/ui/map';
import Title from '@/components/ui/title';
import { Spacing } from '@/constants/theme';
import { useAuth } from '@/stores/auth';
import { useUserStore } from '@/stores/user';
import { getSessionAchievements, getSessionAchievement } from '@/utils/achievements';
import { ScrollView, StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import { useEffect, useMemo } from 'react';

export default function MainScreen() {
  const { user, token } = useAuth();
  const { sessions, isLoadingSessions, error, fetchUserSessions } = useUserStore();

  useEffect(() => {
    if (user?.id && token) {
      fetchUserSessions(user.id, token);
    }
  }, [user?.id, token, fetchUserSessions]);

  const sessionAchievements = useMemo(() => {
    return getSessionAchievements(sessions);
  }, [sessions]);

  const formatTime = (timeInSeconds: number) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h${minutes.toString().padStart(2, '0')}`;
    }
    return `${minutes}min`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDistance = (distance: number) => {
    return `${distance.toFixed(1)} km`;
  };

  const formatSpeed = (allure: number) => {
    return `${allure.toFixed(1)} km/h`;
  };

  return (
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <Title>Bonjour {user?.firstName} 👋</Title>
      </View>

      {/* Friends Status Section */}
      <View style={styles.friendsSection}>
        <FriendsStatusList />
      </View>

      {/* Content Section */}
      <View style={styles.contentSection}>
        <Title style={styles.runsTitle} level={2}>Mes courses</Title>

        {/* Loading State */}
        {isLoadingSessions && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" />
            <Text style={styles.loadingText}>Chargement de vos sessions...</Text>
          </View>
        )}

        {/* Error State */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Erreur: {error}</Text>
          </View>
        )}

        {/* Empty State */}
        {!isLoadingSessions && !error && sessions.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucune session trouvée</Text>
          </View>
        )}

        {/* Sessions List */}
        <View style={styles.sessionsList}>
          {!isLoadingSessions && !error && sessions.length > 0 && (
            <>
              {sessions.map((session, index) => {
                const achievement = getSessionAchievement(session, sessionAchievements) || undefined;

                return (
                  <CardMap
                    key={session._id}
                    image={require('@/assets/images/map.png')}
                    runData={{
                      title: session.title,
                      date: formatDate(session.reference_day),
                      duration: formatTime(session.time),
                      distance: formatDistance(session.distance),
                      speed: formatSpeed(session.allure),
                    }}
                    participants={[]}
                    achievement={achievement}
                  />
                );
              })}
            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: 100,
  },
  headerSection: {
    paddingTop: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  friendsSection: {
    paddingVertical: Spacing.md,
  },
  contentSection: {
    paddingHorizontal: Spacing.lg,
  },
  runsTitle: {
    marginBottom: Spacing.md
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  loadingText: {
    marginTop: Spacing.sm,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    backgroundColor: '#ffebee',
    borderRadius: 8,
    marginBottom: Spacing.md,
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
    textAlign: 'center',
  },
  emptyContainer: {
    paddingVertical: Spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  sessionsList: {
    gap: Spacing.md,
  },
});
