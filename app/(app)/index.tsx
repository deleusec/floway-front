import React, {useEffect} from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { Colors } from '@/constants/Colors';
import { PictureCard } from '@/components/ThemedPictureCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/ctx';
import { Link } from 'expo-router';
import SettingsIcon from '@/assets/icons/settings.svg';
import {useSessionContext} from "@/context/SessionContext";

export default function HomeScreen() {
  const { user, authToken } = useAuth();
  const { userSessions, fetchUserSessions } = useSessionContext();

  useEffect(() => {
    if (user?.id && authToken) {
      fetchUserSessions(user.id, authToken);
    }
  }, [user?.id, authToken]);

  const formatTime = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hrs > 0 ? `${hrs}h${mins}min` : `${mins}min`;
  };

  const formatPace = (pace: number) => {
    const minutes = Math.floor(pace);
    const seconds = Math.round((pace - minutes) * 60);
    return `${minutes}'${seconds.toString().padStart(2, '0')}"`;
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        {/* Section utilisateur */}
        <View style={styles.userSection}>
          <View style={styles.userInfo}>
            <Link href="/start" style={styles.userImage}>
              <Image source={require('@/assets/images/start.jpg')} style={styles.userImage} />
            </Link>
            <View>
              <Text style={styles.userGreeting}>{`Bonjour ${user?.firstName || 'Coureur'}`}</Text>
              <Text style={styles.userReadyText}>Prêt à courir ?</Text>
            </View>
          </View>
          <View style={styles.settingsIcon}>
            <Link href="/explore">
              <SettingsIcon width={24} height={24} fill={Colors.light.primary} />
            </Link>
          </View>
        </View>

        {/* Section statistique */}
        <View style={styles.statsSection}>
          <Text style={styles.statsTitle}>Cette semaine...</Text>
          <View style={styles.statsRow}>
            <View style={styles.statBlock}>
              <Text style={styles.statLabel}>Tu as parcouru</Text>
              <Text style={styles.statValue}>18 km</Text>
            </View>
            <View style={styles.statBlock}>
              <Text style={styles.statLabel}>Tu as brûlé</Text>
              <Text style={styles.statValue}>2478 kcal</Text>
            </View>
          </View>
          <View style={styles.statBlock}>
            <Text style={styles.statLabel}>Tu as démarré</Text>
            <Text style={styles.statValue}>8 sessions</Text>
          </View>
        </View>

        {/* Section courses récentes */}
        <View style={styles.coursesContainer}>
          <Text style={styles.coursesTitle}>Courses récentes</Text>
          <View style={styles.coursesScrollWrapper}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
              style={styles.scrollView}>
              {userSessions.length === 0 ? (
                <View style={styles.placeholder}>
                  <Text style={styles.placeholderText}>
                    Aucune course enregistrée. Commencez votre première course !
                  </Text>
                </View>
              ) : (
                userSessions.map((session) => (
                  <PictureCard
                    key={session._id}
                    title={session.title || `Course du ${new Date(session.reference_day).toLocaleDateString()}`}
                    metrics={[
                      formatTime(session.time),
                      `${session.calories}kcal`,
                      formatPace(session.allure),
                    ]}
                    image={require('@/assets/images/start.jpg')}
                  />
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Layout styles
  safeArea: {
    flex: 1,
    backgroundColor: Colors.dark.primaryDark,
  },
  container: {
    flexGrow: 1,
    paddingTop: 24,
    paddingHorizontal: 24,
  },

  // User section styles
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userGreeting: {
    fontSize: 16,
    fontFamily: 'Poppins-Light',
    color: Colors.light.mediumGrey,
  },
  userReadyText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.light.white,
  },
  settingsIcon: {
    padding: 8,
  },
  settingsIconImage: {
    width: 24,
    height: 24,
    tintColor: Colors.light.white,
  },

  // Stats section styles
  statsSection: {
    backgroundColor: Colors.dark.secondaryDark,
    borderRadius: 12,
    padding: 14,
    marginBottom: 24,
  },
  statsTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.light.white,
    marginBottom: 14,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 24,
  },
  statBlock: {},
  statValue: {
    fontSize: 26,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.light.primary,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: Colors.light.lightGrey,
  },

  // Courses section styles
  coursesContainer: {
    flex: 1,
    marginBottom: -16,
  },
  coursesScrollWrapper: {
    flex: 1,
  },
  coursesTitle: {
    fontSize: 20,
    color: Colors.light.white,
    fontFamily: 'Poppins-SemiBold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 70,
    paddingTop: 10,
  },
  topGradient: {
    position: 'absolute',
    pointerEvents: 'none',
    top: 0,
    left: 0,
    right: 0,
    height: 20,
    zIndex: 10,
  },
  placeholder: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: Colors.light.mediumGrey,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
});
