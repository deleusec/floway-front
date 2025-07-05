import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { useRunningSessionStore } from '@/stores/session';
import Button from '@/components/ui/button';
import ChallengeCard from '@/components/ui/challenge-card';
import ValueSelector from '@/components/ui/value-selector';
import SvgX from '@/components/icons/X';
import {Colors, FontSize, Radius, Spacing} from "@/theme";

type ChallengeType = 'free' | 'time' | 'distance';
type PickerState = 'selection' | 'hours' | 'minutes' | 'seconds' | 'distance';

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
  const [drawerState, setDrawerState] = useState<PickerState>('selection');

  // États pour la minuterie
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(30);
  const [seconds, setSeconds] = useState(0);

  // État pour la distance
  const [targetDistance, setTargetDistance] = useState(13);

  // État temporaire pour le picker
  const [tempValue, setTempValue] = useState(0);

  const { session, startSession, updateLocation } = useRunningSessionStore();

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
    setChallengeType(type);
    if (type !== 'free') {
      setDrawerState('selection');
      setDrawerVisible(true);
    } else {
      handleStartSession();
    }
  };

  // Dans votre StartScreen, modifiez la fonction handleStartSession :

  const handleStartSession = async () => {
    try {
      let objectiveValue = 0;
      let sessionType: 'time' | 'distance' | 'free' = 'time';

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
        // Course libre
        sessionType = 'free';
        objectiveValue = 0; // Pas d'objectif pour une course libre
      }

      await startSession(sessionType, objectiveValue);
      setDrawerVisible(false);
      router.push('/(main)/session' as any);
    } catch (error: any) {
      alert('Erreur lors du démarrage de la session: ' + error.message);
    }
  };

  // Ouvre le picker dans le drawer
  const openInlinePicker = (type: PickerState) => {
    if (type === 'hours') setTempValue(hours);
    else if (type === 'minutes') setTempValue(minutes);
    else if (type === 'seconds') setTempValue(seconds);
    else if (type === 'distance') setTempValue(targetDistance);
    setDrawerState(type);
  };

  // Confirme la valeur et retourne à la sélection
  const confirmValue = () => {
    if (drawerState === 'hours') setHours(tempValue);
    else if (drawerState === 'minutes') setMinutes(tempValue);
    else if (drawerState === 'seconds') setSeconds(tempValue);
    else if (drawerState === 'distance') setTargetDistance(tempValue);
    setDrawerState('selection');
  };

  // Retourne à la sélection sans sauvegarder
  const cancelPicker = () => {
    setDrawerState('selection');
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    setDrawerState('selection');
  };

  // Fonction pour obtenir le label du picker
  const getPickerLabel = () => {
    switch (drawerState) {
      case 'hours':
        return 'heures';
      case 'minutes':
        return 'minutes';
      case 'seconds':
        return 'secondes';
      case 'distance':
        return 'kilomètres';
      default:
        return '';
    }
  };

  // Rendu du contenu du drawer selon l'état
  const renderDrawerContent = () => {
    if (drawerState === 'selection') {
      // Vue de sélection normale
      return (
        <>
          <View style={styles.drawerHeader}>
            <Text style={styles.drawerTitle}>
              {challengeType === 'time' ? 'Mode minuterie' : 'Mission kilomètres'}
            </Text>
          </View>

          <View style={styles.drawerSeparator} />

          <View style={styles.drawerContent}>
            {challengeType === 'time' ? (
              <View style={styles.valueSelectorContainer}>
                <ValueSelector
                  label='heures'
                  value={hours}
                  onPress={() => openInlinePicker('hours')}
                />
                <ValueSelector
                  label='min'
                  value={minutes}
                  onPress={() => openInlinePicker('minutes')}
                />
                <ValueSelector
                  label='sec'
                  value={seconds}
                  onPress={() => openInlinePicker('seconds')}
                />
              </View>
            ) : (
              <View style={styles.valueSelectorContainer}>
                <ValueSelector
                  label='km'
                  value={targetDistance}
                  onPress={() => openInlinePicker('distance')}
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
        </>
      );
    } else {
      // Vue picker intégrée
      return (
        <>
          <View style={styles.drawerHeader}>
            <Text style={styles.drawerTitle}>
              {challengeType === 'time' ? 'Mode minuterie' : 'Mission kilomètres'}
              {challengeType === 'time' && !!getPickerLabel() && (
                <Text style={styles.pickerLabel}> ({getPickerLabel()})</Text>
              )}
            </Text>
          </View>

          <View style={styles.drawerSeparator} />

          <View style={styles.drawerContent}>

            <View style={styles.inlinePickerContainer}>
              <TouchableOpacity
                onPress={() => setTempValue(Math.max(0, tempValue - 1))}
                style={styles.pickerButton}>
                <Text style={styles.pickerButtonText}>-</Text>
              </TouchableOpacity>

              <Text style={styles.pickerValue}>{tempValue}</Text>

              <TouchableOpacity
                onPress={() => setTempValue(tempValue + 1)}
                style={styles.pickerButton}>
                <Text style={styles.pickerButtonText}>+</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.pickerActions}>
              <Button
                title='Annuler'
                variant='outline'
                onPress={cancelPicker}
                style={styles.pickerActionButton}
              />
              <Button
                title='Valider'
                variant='primary'
                onPress={confirmValue}
                style={styles.pickerActionButton}
              />
            </View>
          </View>
        </>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerWrapper}>
        <View style={styles.header}>
          <Text style={styles.title}>Prêt à partir ?</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <SvgX width={24} height={24} color='#444444' />
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

      {/* Drawer unifié avec picker intégré */}
      <Modal visible={drawerVisible} transparent animationType='slide' onRequestClose={closeDrawer}>
        <View style={styles.drawerBackdrop}>
          <TouchableOpacity
            style={styles.backdropTouchable}
            activeOpacity={1}
            onPress={closeDrawer}
          />
          <View style={styles.drawerContainer}>
            <View style={styles.drawerHandle} />
            {renderDrawerContent()}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerWrapper: {
    backgroundColor: Colors.white,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: '600',
    color: Colors.black,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  subtitle: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.black,
    marginTop: 40,
    marginBottom: Spacing.xl,
  },
  challengeCards: {
    gap: 16,
    paddingBottom: 32,
  },
  // Drawer unifié
  drawerBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  backdropTouchable: {
    flex: 1,
  },
  drawerContainer: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Spacing.lg,
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
    paddingHorizontal: Spacing.lg,
    marginBottom: 21,
  },
  drawerTitle: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.black,
    flex: 1,
  },
  closeButton: {
    padding: 8,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#6366F1',
    fontWeight: '600',
  },
  drawerSeparator: {
    height: 1,
    backgroundColor: Colors.border,
    marginBottom: 37,
  },
  drawerContent: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingBottom: 32,
    justifyContent: 'space-between',
  },
  valueSelectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    gap: 5
  },
  // Picker intégré
  pickerLabel: {
    fontSize: FontSize.md,
    color: Colors.gray[400],
    fontStyle: 'italic'
  },
  inlinePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 40,
  },
  pickerButton: {
    width: 50,
    height: 50,
    borderRadius: Radius.full,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerButtonText: {
    fontSize: FontSize.xxl,
    fontWeight: '600',
    color: Colors.black,
  },
  pickerValue: {
    fontSize: 42,
    fontWeight: '700',
    color: '#000',
    minWidth: 100,
    textAlign: 'center',
  },
  pickerActions: {
    flexDirection: 'row',
    gap: 16,
  },
  pickerActionButton: {
    flex: 1,
  },
});
