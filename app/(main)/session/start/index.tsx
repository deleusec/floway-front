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
import ClockIcon from '@/components/icons/ClockIcon';
import SvgX from '@/components/icons/X';
import Drawer from '@/components/ui/drawer';
import { ChallengeCardProps } from '@/components/ui/challenge-card';

type ChallengeType = 'free' | 'time' | 'distance';

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
    setChallengeType(type);
    if (type !== 'free') {
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

  const renderDrawerContent = () => {
    if (challengeType === 'time') {
      return (
        <View style={styles.drawerSheet}>
          <View style={styles.drawerHandle} />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 24,
              marginBottom: 8,
            }}>
            <Text style={styles.drawerTitle}>Mode minuterie</Text>
            <TouchableOpacity
              style={{ marginLeft: 'auto' }}
              onPress={() => setDrawerVisible(false)}>
              <SvgX width={24} height={24} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
          <View style={styles.drawerSeparator} />
          <View style={styles.drawerContent}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 16 }}>
              <ValueSelector label='heures' value={hours} onPress={() => openPicker('hours')} />
              <ValueSelector label='min' value={minutes} onPress={() => openPicker('minutes')} />
              <ValueSelector label='sec' value={seconds} onPress={() => openPicker('seconds')} />
            </View>
            <Button
              onPress={handleStartSession}
              title='Commencer'
              variant='primary'
              disabled={hours === 0 && minutes === 0 && seconds === 0}
            />
          </View>
        </View>
      );
    }

    if (challengeType === 'distance') {
      return (
        <View style={styles.drawerSheet}>
          <View style={styles.drawerHandle} />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 24,
              marginBottom: 8,
            }}>
            <Text style={styles.drawerTitle}>Mission kilomètres</Text>
            <TouchableOpacity
              style={{ marginLeft: 'auto' }}
              onPress={() => setDrawerVisible(false)}>
              <SvgX width={24} height={24} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
          <View style={styles.drawerSeparator} />
          <View style={styles.drawerContent}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 16 }}>
              <ValueSelector
                label='km'
                value={targetDistance}
                onPress={() => openPicker('distance')}
              />
            </View>
            <Button
              onPress={handleStartSession}
              title='Commencer'
              variant='primary'
              disabled={targetDistance <= 0}
            />
          </View>
        </View>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <View style={styles.header}>
          <Text style={styles.title}>Prêt à partir ?</Text>
          <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
            <SvgX width={24} height={24} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>Choisis ton défi du jour</Text>

        <View style={styles.challengeCards}>
          <ChallengeCard
            icon={
              <ClockIcon
                size={32}
                color={challengeType === 'free' ? Colors.primary : Colors.textSecondary}
              />
            }
            title='Course libre'
            description='Pas de pression, juste toi et la route. Profite de chaque foulée.'
            onPress={() => handleChallengeSelect('free')}
          />
          <ChallengeCard
            icon={
              <ClockIcon
                size={32}
                color={challengeType === 'time' ? Colors.primary : Colors.textSecondary}
              />
            }
            title='Mode minuterie'
            description="Lance un chrono et tiens le rythme jusqu'au bout."
            onPress={() => handleChallengeSelect('time')}
          />
          <ChallengeCard
            icon={
              <ClockIcon
                size={32}
                color={challengeType === 'distance' ? Colors.primary : Colors.textSecondary}
              />
            }
            title='Mission kilomètres'
            description='Fixe une distance, fonce, et ne lâche rien.'
            onPress={() => handleChallengeSelect('distance')}
          />
        </View>
      </ScrollView>

      <Drawer
        mode='fixed'
        height={400}
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}>
        {renderDrawerContent()}
      </Drawer>

      <Modal
        visible={pickerVisible}
        transparent
        animationType='slide'
        onRequestClose={() => setPickerVisible(false)}>
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.2)' }}>
          <View
            style={{
              backgroundColor: '#fff',
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              paddingBottom: 24,
              minHeight: 220,
            }}>
            {/* Barre de drag */}
            <View
              style={{
                alignSelf: 'center',
                width: 48,
                height: 5,
                borderRadius: 3,
                backgroundColor: '#EBEBEB',
                marginTop: 8,
                marginBottom: 16,
              }}
            />
            {/* Titre */}
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: '#000',
                textAlign: 'left',
                paddingHorizontal: 24,
                marginBottom: 8,
              }}>
              {pickerType === 'hours' || pickerType === 'minutes' || pickerType === 'seconds'
                ? 'Mode minuterie'
                : 'Mission kilomètres'}
            </Text>
            {/* Trait de séparation */}
            <View
              style={{
                height: 1,
                backgroundColor: '#EBEBEB',
                marginBottom: 16,
              }}
            />
            {/* Contenu dynamique */}
            <View style={{ alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>
              <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                <TouchableOpacity
                  onPress={() => setPickerValue(Math.max(0, pickerValue - 1))}
                  style={{ padding: 16 }}>
                  <Text style={{ fontSize: 24 }}>-</Text>
                </TouchableOpacity>
                <Text style={{ fontSize: 32, minWidth: 60, textAlign: 'center' }}>
                  {pickerValue}
                </Text>
                <TouchableOpacity
                  onPress={() => setPickerValue(pickerValue + 1)}
                  style={{ padding: 16 }}>
                  <Text style={{ fontSize: 24 }}>+</Text>
                </TouchableOpacity>
              </View>
              <Button title='Valider' onPress={() => handlePickerConfirm(pickerValue)} />
              <Button
                title='Annuler'
                variant='outline'
                onPress={() => setPickerVisible(false)}
                style={{ marginTop: 8 }}
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
    backgroundColor: '#F8F8F8',
  },
  headerWrapper: {
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: FontSize.xl,
    fontFamily: FontFamily.bold,
    color: Colors.textPrimary,
    textAlign: 'left',
  },
  closeButton: {
    padding: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.semiBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
    marginTop: Spacing.lg,
    textAlign: 'left',
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    backgroundColor: '#F8F8F8',
  },
  challengeCards: {
    marginBottom: Spacing.xl,
    gap: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
    borderWidth: 0,
  },
  cardTitle: {
    color: '#624AF6',
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    marginBottom: 2,
  },
  cardDescription: {
    color: '#000',
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    opacity: 0.7,
  },
  cardIcon: {
    marginRight: 16,
  },
  drawerContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  drawerTitle: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
    color: Colors.textPrimary,
  },
  configSection: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    justifyContent: 'center',
  },
  drawerFooter: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  drawerSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 24,
    minHeight: 220,
  },
  drawerHandle: {
    alignSelf: 'center',
    width: 48,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#EBEBEB',
    marginTop: 8,
    marginBottom: 16,
  },
  drawerSeparator: {
    height: 1,
    backgroundColor: '#EBEBEB',
    marginBottom: 16,
  },
  drawerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
});
