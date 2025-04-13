import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image, ScrollView, ActivityIndicator} from 'react-native';
import { Colors } from '@/constants/Colors';
import { PictureCard } from '@/components/cards/ThemedPictureCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import Logout from '@/assets/icons/logout.svg';
import {useSessionContext} from "@/context/SessionContext";
import { secondsToCompactReadableTime } from '@/utils/timeUtils';
import CustomModal from '@/components/modal/CustomModal';

export default function HomeScreen() {
  const { user, authToken } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { signOut } = useAuth();
  const { userSessions, fetchUserSessions, weeklyStats, isLoading } = useSessionContext();

  useEffect(() => {
    if (user?.id && authToken) {
      fetchUserSessions(user.id, authToken);
    }
  }, [user?.id, authToken]);

  const handleLogoutPress = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    signOut();
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        {/* Section utilisateur */}
        <View style={styles.userSection}>
          <View style={styles.userInfo}>
            <Image source={require('@/assets/images/start.jpg')} style={styles.userImage} />
            <View>
              <Text style={styles.userGreeting}>{`Bonjour ${user?.firstName || 'Coureur'}`}</Text>
              <Text style={styles.userReadyText}>Prêt à courir ?</Text>
            </View>
          </View>
          <View style={styles.settingsIcon}>
            <Logout width={24} height={24} onPress={handleLogoutPress} />
          </View>
        </View>

        {/* Section statistique */}
        <View style={styles.statsSection}>
          <Text style={styles.statsTitle}>Cette semaine...</Text>
          <View style={styles.statsRow}>
            <View style={styles.statBlock}>
              <Text style={styles.statLabel}>Tu as parcouru</Text>
              <Text style={styles.statValue}>
                {Number.isInteger(weeklyStats.totalDistance)
                  ? weeklyStats.totalDistance
                  : weeklyStats.totalDistance.toFixed(1)} km
              </Text>
            </View>
            <View style={styles.statBlock}>
              <Text style={styles.statLabel}>Tu as brûlé</Text>
              <Text style={styles.statValue}>{weeklyStats.totalCalories} kcal</Text>
            </View>
          </View>
          <View style={styles.statBlock}>
            <Text style={styles.statLabel}>Tu as démarré</Text>
            <Text style={styles.statValue}>
              {weeklyStats.sessionCount} {weeklyStats.sessionCount > 1 ? 'sessions' : 'session'}
            </Text>
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
              {isLoading ? (
                <View style={styles.placeholder}>
                  <ActivityIndicator size="large" color={Colors.light.white} />
                </View>
              ) : userSessions.length === 0 ? (
                <View style={styles.placeholder}>
                  <Text style={styles.placeholderText}>
                    Vous n'avez pas encore lancé une course.
                    Cliquez sur le bouton "play" pour lancer une course !
                  </Text>
                </View>
              ) : (
                userSessions.map((session) => (
                  <PictureCard
                    key={session._id}
                    title={session.title}
                    metrics={[
                      secondsToCompactReadableTime(session.time),
                      `${session.calories}kcal`,
                      `${session.allure}Km/h`,
                    ]}
                    image={require('@/assets/images/map_ex.png')}
                  />
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </View>
      <CustomModal
        visible={showLogoutModal}
        onClose={handleLogoutCancel}
        header={<Text style={styles.modalHeader}>Déconnexion</Text>}
        cancelButton={true}
        confirmButton={true}
        cancelAction={handleLogoutCancel}
        confirmAction={handleLogoutConfirm}>
        <Text style={styles.modalBody}>Êtes-vous sûr de vouloir vous déconnecter ?</Text>
      </CustomModal>
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
    borderRadius: 16,
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
  modalHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.white,
    textAlign: 'center',
  },
  modalBody: {
    fontSize: 14,
    color: Colors.light.white,
    textAlign: 'center',
  },
});
