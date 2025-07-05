import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { useRunningSessionStore } from '@/stores/session';
import { Colors, FontSize, FontFamily, Radius, Spacing } from '@/constants/theme';
import Button from '@/components/ui/button';
import ChallengeCard from '@/components/ui/challenge-card';
import ValueSelector from '@/components/ui/value-selector';
//import ClockIcon from '@/components/icons/ClockIcon';
import SvgX from '@/components/icons/X';

type ChallengeType = 'free' | 'time' | 'distance';

// Icônes pour les défis
const RunnerIcon = ({ size = 32, color }: { size?: number; color: string }) => (
  <Text style={{ fontSize: size, color }}>🏃‍♂️</Text>
);
const ClockIcon = ({ size = 32, color }: { size?: number; color: string }) => (
  <Text style={{ fontSize: size, color }}>⏱️</Text>
);

const CheckeredFlagIcon = ({ size = 32, color }: { size?: number; color: string }) => (
  <Text style={{ fontSize: size, color }}>🏁</Text>
);

export default function StartScreen() {
  const router = useRouter();
  const [challengeType, setChallengeType] = useState<ChallengeType>('free');
  const [drawerVisible, setDrawerVisible] = useState(false);

  // États pour la minuterie
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(30);
  const [seconds, setSeconds] = useState(0);

  // État pour la distance
  const [targetDistance, setTargetDistance] = useState(13);

  const { session, startSession, updateLocation } = useRunningSessionStore();

  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerType, setPickerType] = useState<'hours' | 'minutes' | 'seconds' | 'distance' | null>(
    null
  );
  const [pickerValue, setPickerValue] = useState(0);

  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null;

    if (session.isActive) {
      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        location => {
          updateLocation(location);
        }
      ).then(subscription => {
        locationSubscription = subscription;
      });
    }

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [session.isActive]);

  const handleChallengeSelect = (type: ChallengeType) => {
    console.log('Challenge selected:', type); // Debug
    setChallengeType(type);
    if (type !== 'free') {
      console.log('Opening drawer for:', type); // Debug
      setDrawerVisible(true);
    } else {
      // Course libre : lancer directement
      handleStartSession();
    }
  };

  const handleStartSession = async () => {
    try {
      let objectiveValue = 0;
      let sessionType: 'time' | 'distance' = 'time';

      if (challengeType === 'time') {
        objectiveValue = hours * 3600 + minutes * 60 + seconds;
        if (objectiveValue <= 0) {
          alert('Veuillez définir un temps valide');
          return;
        }
        sessionType = 'time';
      } else if (challengeType === 'distance') {
        objectiveValue = targetDistance;
        if (objectiveValue <= 0) {
          alert('Veuillez définir une distance valide');
          return;
        }
        sessionType = 'distance';
      } else {
        // Course libre : on utilise un temps très long par défaut
        sessionType = 'time';
        objectiveValue = 24 * 3600; // 24 heures
      }

      await startSession(sessionType, objectiveValue);
      setDrawerVisible(false);
      router.push('/(main)/session' as any);
    } catch (error: any) {
      alert('Erreur lors du démarrage de la session: ' + error.message);
    }
  };

  // Ouvre le picker pour le type donné
  const openPicker = (type: 'hours' | 'minutes' | 'seconds' | 'distance') => {
    setPickerType(type);
    if (type === 'hours') setPickerValue(hours);
    else if (type === 'minutes') setPickerValue(minutes);
    else if (type === 'seconds') setPickerValue(seconds);
    else setPickerValue(targetDistance);
    setPickerVisible(true);
  };

  // Applique la valeur choisie
  const handlePickerConfirm = (val: number) => {
    if (pickerType === 'hours') setHours(val);
    else if (pickerType === 'minutes') setMinutes(val);
    else if (pickerType === 'seconds') setSeconds(val);
    else if (pickerType === 'distance') setTargetDistance(val);
    setPickerVisible(false);
  };

  const closeDrawer = () => {
    console.log('Closing drawer'); // Debug
    setDrawerVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <View style={styles.header}>
          <Text style={styles.title}>Prêt à partir ?</Text>
          <TouchableOpacity style={styles.headerCloseButton} onPress={() => router.back()}>
            <SvgX width={24} height={24} color='#000' />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>Choisis ton défi du jour</Text>

        <View style={styles.challengeCards}>
          <ChallengeCard
            icon={<RunnerIcon size={40} color={challengeType === 'free' ? '#6366F1' : '#9CA3AF'} />}
            title='Course libre'
            description='Pas de pression, juste toi et la route. Profite de chaque foulée.'
            isSelected={challengeType === 'free'}
            onPress={() => handleChallengeSelect('free')}
          />
          <ChallengeCard
            icon={<ClockIcon size={38} color={challengeType === 'time' ? '#6366F1' : '#9CA3AF'} />}
            title='Mode minuterie'
            description="Lance un chrono et tiens le rythme jusqu'au bout."
            isSelected={challengeType === 'time'}
            onPress={() => handleChallengeSelect('time')}
          />
          <ChallengeCard
            icon={
              <CheckeredFlagIcon
                size={40}
                color={challengeType === 'distance' ? '#6366F1' : '#9CA3AF'}
              />
            }
            title='Mission kilomètres'
            description='Fixe une distance, fonce, et ne lâche rien.'
            isSelected={challengeType === 'distance'}
            onPress={() => handleChallengeSelect('distance')}
          />
        </View>
      </ScrollView>

      {/* Drawer avec Modal pour garantir l'affichage */}
      <Modal visible={drawerVisible} transparent animationType='slide' onRequestClose={closeDrawer}>
        <View style={styles.drawerBackdrop}>
          <TouchableOpacity
            style={styles.backdropTouchable}
            activeOpacity={1}
            onPress={closeDrawer}
          />
          <View style={styles.drawerContainer}>
            <View style={styles.drawerHandle} />

            <View style={styles.drawerHeader}>
              <Text style={styles.drawerTitle}>
                {challengeType === 'time' ? 'Mode minuterie' : 'Mission kilomètres'}
              </Text>
              <TouchableOpacity style={styles.closeButton} onPress={closeDrawer}>
                <SvgX width={24} height={24} color='#6B7280' />
              </TouchableOpacity>
            </View>

            <View style={styles.drawerSeparator} />

            <View style={styles.drawerContent}>
              {challengeType === 'time' ? (
                <View style={styles.valueSelectorContainer}>
                  <ValueSelector label='heures' value={hours} onPress={() => openPicker('hours')} />
                  <ValueSelector
                    label='min'
                    value={minutes}
                    onPress={() => openPicker('minutes')}
                  />
                  <ValueSelector
                    label='sec'
                    value={seconds}
                    onPress={() => openPicker('seconds')}
                  />
                </View>
              ) : (
                <View style={styles.valueSelectorContainer}>
                  <ValueSelector
                    label='km'
                    value={targetDistance}
                    onPress={() => openPicker('distance')}
                  />
                </View>
              )}

              <Button
                onPress={handleStartSession}
                title='Commencer'
                variant='primary'
                disabled={
                  challengeType === 'time'
                    ? hours === 0 && minutes === 0 && seconds === 0
                    : targetDistance <= 0
                }
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Picker Modal */}
      <Modal
        visible={pickerVisible}
        transparent
        animationType='slide'
        onRequestClose={() => setPickerVisible(false)}>
        <View style={styles.pickerBackdrop}>
          <View style={styles.pickerContainer}>
            <View style={styles.pickerHandle} />
            <Text style={styles.pickerTitle}>
              {pickerType === 'hours' || pickerType === 'minutes' || pickerType === 'seconds'
                ? 'Mode minuterie'
                : 'Mission kilomètres'}
            </Text>
            <View style={styles.pickerSeparator} />
            <View style={styles.pickerContent}>
              <View style={styles.pickerValueContainer}>
                <TouchableOpacity
                  onPress={() => setPickerValue(Math.max(0, pickerValue - 1))}
                  style={styles.pickerButton}>
                  <Text style={styles.pickerButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.pickerValue}>{pickerValue}</Text>
                <TouchableOpacity
                  onPress={() => setPickerValue(pickerValue + 1)}
                  style={styles.pickerButton}>
                  <Text style={styles.pickerButtonText}>+</Text>
                </TouchableOpacity>
              </View>
              <Button title='Valider' onPress={() => handlePickerConfirm(pickerValue)} />
              <Button
                title='Annuler'
                variant='outline'
                onPress={() => setPickerVisible(false)}
                style={styles.cancelButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  headerWrapper: {
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
  },
  headerCloseButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginTop: 32,
    marginBottom: 24,
  },
  challengeCards: {
    gap: 16,
    paddingBottom: 32,
  },
  // Drawer avec Modal
  drawerBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  backdropTouchable: {
    flex: 1,
  },
  drawerContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    maxHeight: '80%',
    minHeight: 350,
  },
  drawerHandle: {
    alignSelf: 'center',
    width: 36,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#D1D5DB',
    marginTop: 12,
    marginBottom: 20,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  closeButton: {
    padding: 8,
  },
  drawerSeparator: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginBottom: 32,
  },
  drawerContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 32,
    justifyContent: 'space-between',
  },
  valueSelectorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 40,
  },
  // Picker styles
  pickerBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 32,
    minHeight: 280,
  },
  pickerHandle: {
    alignSelf: 'center',
    width: 36,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#D1D5DB',
    marginTop: 12,
    marginBottom: 20,
  },
  pickerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  pickerSeparator: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginBottom: 32,
  },
  pickerContent: {
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  pickerValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    marginBottom: 32,
  },
  pickerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerButtonText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#374151',
  },
  pickerValue: {
    fontSize: 36,
    fontWeight: '700',
    color: '#000',
    minWidth: 80,
    textAlign: 'center',
  },
  cancelButton: {
    marginTop: 12,
  },
});
