import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useRunningSessionStore } from '@/stores/session';
import Button from '@/components/ui/button';
import ChallengeCard from '@/components/ui/challenge-card';
import ValueSelector from '@/components/ui/value-selector';
import BottomSheet from '@/components/ui/bottom-sheet';
import { Colors, FontSize, Radius, Spacing } from '@/theme';
import {useStore} from "@/stores";

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
  const { setBackgroundColor } = useStore()

  // Plus besoin des animations personnalisées avec BottomSheet

  // États pour la minuterie
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  // État pour la distance
  const [targetDistance, setTargetDistance] = useState(0);

  // État temporaire pour le picker
  const [tempValue, setTempValue] = useState(0);

  const { startSession } = useRunningSessionStore();

  useEffect(() => {
    setBackgroundColor(Colors.white)
  }, []);

  const handleChallengeSelect = (type: ChallengeType) => {
    setChallengeType(type);
    if (type !== 'free') {
      setDrawerState('selection');
      openDrawer();
    }
  };

  const openDrawer = () => {
    setDrawerVisible(true);
  };

  const handleStartSession = async () => {
    try {
      let objectiveValue;
      let sessionType: 'time' | 'distance' | 'free' = 'time';

      if (challengeType === 'time') {
        objectiveValue = hours * 3600 + minutes * 60 + seconds;
        if (objectiveValue <= 0) {
          alert('Veuillez configurer votre temps dans Mode minuterie');
          return;
        }
        sessionType = 'time';
      } else if (challengeType === 'distance') {
        objectiveValue = targetDistance;
        if (objectiveValue <= 0) {
          alert('Veuillez configurer votre distance dans Mission kilomètres');
          return;
        }
        sessionType = 'distance';
      } else {
        sessionType = 'free';
        objectiveValue = 0;
      }

      await startSession(sessionType, objectiveValue);
      setDrawerVisible(false);
      router.push('/(main)/session' as any);
    } catch (error: any) {
      alert('Erreur lors du démarrage de la session: ' + error.message);
    }
  };

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

  // Vérifier si on peut démarrer la session
  const canStartSession = () => {
    if (challengeType === 'free') return true;
    if (challengeType === 'time') {
      return hours > 0 || minutes > 0 || seconds > 0;
    }
    if (challengeType === 'distance') {
      return targetDistance > 0;
    }
    return false;
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
              onPress={closeDrawer}
              title='Valider'
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

      {/* Bouton Commencer en bas de page */}
      <View style={styles.bottomButtonContainer}>
        <Button
          onPress={handleStartSession}
          title='Commencer'
          variant='primary'
          disabled={!canStartSession()}
          style={styles.startButton}
        />
      </View>

      {/* Bottom Sheet pour la configuration */}
      <BottomSheet
        visible={drawerVisible}
        onClose={closeDrawer}
        height={400}
        enableDrag={true}
        enableBackdropDismiss={true}
      >
        {renderDrawerContent()}
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  headerWrapper: {
    backgroundColor: Colors.white,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
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
  // Styles pour le contenu du BottomSheet
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
    gap: 5,
  },
  pickerLabel: {
    fontSize: FontSize.md,
    color: Colors.gray[400],
    fontStyle: 'italic',
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
  bottomButtonContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  startButton: {
    width: '100%',
  },
});
