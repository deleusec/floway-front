import FriendsStatusList from '@/components/friends/status-list';
import CardMap from '@/components/ui/map';
import Card from '@/components/ui/card';
import Title from '@/components/ui/title';
import { Spacing, Colors, FontFamily, FontSize, Radius } from '@/constants/theme';
import { useAuth } from '@/stores/auth';
import { useUserStore } from '@/stores/user';
import { getSessionAchievements, getSessionAchievement } from '@/utils/achievements';
import { ScrollView, StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import { useEffect, useMemo } from 'react';
import { formatSpeed } from '@/utils/sessionUtils';

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

  // Calculate weekly statistics
  const weeklyStats = useMemo(() => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Start of current week (Sunday)
    startOfWeek.setHours(0, 0, 0, 0);

    const weekSessions = sessions.filter(session => {
      const sessionDate = new Date(session.reference_day);
      return sessionDate >= startOfWeek;
    });

    const totalDistance = weekSessions.reduce((sum, session) => sum + session.distance, 0);
    const totalTime = weekSessions.reduce((sum, session) => sum + session.time, 0);
    const totalCalories = weekSessions.reduce((sum, session) => sum + session.calories, 0);
    const sessionCount = weekSessions.length;
    const avgSpeed = sessionCount > 0 ? weekSessions.reduce((sum, session) => sum + session.allure, 0) / sessionCount : 0;

    return {
      totalDistance,
      totalTime,
      totalCalories,
      sessionCount,
      avgSpeed
    };
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

  // formatSpeed maintenant importé de utils/sessionUtils

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
        {/* Weekly Summary Section */}
        {!isLoadingSessions && sessions.length > 0 && (
          <View style={styles.weeklySummarySection}>
            <Card style={styles.weeklyCard}>
              <View style={styles.weeklyContent}>
                <View style={styles.statsGrid}>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{weeklyStats.sessionCount}</Text>
                    <Text style={styles.statLabel}>Sessions</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{formatDistance(weeklyStats.totalDistance)}</Text>
                    <Text style={styles.statLabel}>Distance</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{formatTime(weeklyStats.totalTime)}</Text>
                    <Text style={styles.statLabel}>Temps</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{weeklyStats.totalCalories}</Text>
                    <Text style={styles.statLabel}>Calories</Text>
                  </View>
                </View>
                {weeklyStats.sessionCount > 0 && (
                  <View style={styles.avgSpeedContainer}>
                    <Text style={styles.avgSpeedLabel}>Vitesse moyenne</Text>
                    <Text style={styles.avgSpeedValue}>{formatSpeed(weeklyStats.avgSpeed)} km/h</Text>
                  </View>
                )}
              </View>
            </Card>
          </View>
        )}

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
                    sessionTps={session.tps}
                    runData={{
                      title: session.title,
                      date: formatDate(session.reference_day),
                      duration: formatTime(session.time),
                      distance: formatDistance(session.distance),
                      speed: `${formatSpeed(session.allure)} km/h`,
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
  weeklySummarySection: {
    paddingBottom: Spacing.md,
  },
  weeklyTitle: {
    marginBottom: Spacing.md,
  },
  weeklyCard: {
    padding: Spacing.lg,
  },
  weeklyContent: {
    gap: Spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  statItem: {
    alignItems: 'center',
    minWidth: '22%',
  },
  statValue: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  avgSpeedContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  avgSpeedLabel: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.medium,
    color: Colors.textSecondary,
  },
  avgSpeedValue: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
    color: Colors.primary,
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
