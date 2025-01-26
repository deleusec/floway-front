import React, { useState } from 'react';
import { SafeAreaView, View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import BackButton from '@/components/button/BackButton';
import ThemedButton from '@/components/button/ThemedButton';
import TimeInputs from '@/components/input/TimeInputs';
import SelectInput from '@/components/input/SelectInput';
import DistanceInput from '@/components/input/DistanceInput';
import { Colors } from '@/constants/Colors';
import { useSessionContext } from '@/context/SessionContext';
import { ThemedText } from '@/components/text/ThemedText';

export default function GoalDefinition() {
  const router = useRouter();
  const { updateSessionTarget } = useSessionContext();

  const [goalType, setGoalType] = useState<'Temps' | 'Distance'>('Temps');
  const [timeValues, setTimeValues] = useState<number>(0);
  const [goalDistance, setGoalDistance] = useState<number>(0);

  const handleStart = () => {
    if (goalType === 'Temps') {
      // Convert total seconds to hours, minutes, seconds
      const hours = Math.floor(timeValues / 3600)
        .toString()
        .padStart(2, '0');
      const minutes = Math.floor((timeValues % 3600) / 60)
        .toString()
        .padStart(2, '0');
      const seconds = (timeValues % 60).toString().padStart(2, '0');

      updateSessionTarget({
        type: 'time',
        time: { hours, minutes, seconds },
      });
    } else {
      updateSessionTarget({
        type: 'distance',
        distance: goalDistance,
      });
    }

    router.push('/session/selected-target');
  };

  const isValidGoal = goalType === 'Temps' ? timeValues > 0 : goalDistance > 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton />
        <ThemedText type="title" style={styles.title}>
          Définis ton objectif
        </ThemedText>
      </View>

      <View style={styles.content}>
        <View style={styles.inputGroup}>
          <ThemedText type="default">Type de l'objectif</ThemedText>
          <View style={styles.selectContainer}>
            <SelectInput
              options={['Temps', 'Distance']}
              onValueChange={(value) => setGoalType(value as 'Temps' | 'Distance')}
              value={goalType}
              hidePlaceholder
            />
            {goalType === 'Temps' ? (
              <TimeInputs totalSeconds={timeValues} onChange={setTimeValues} status="active" />
            ) : (
              <DistanceInput
                value={goalDistance}
                onChange={setGoalDistance}
                unit="km"
                status="default"
              />
            )}
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <ThemedButton
          title="Commencer"
          buttonSize="large"
          buttonType="confirm"
          buttonState={isValidGoal ? 'default' : 'disabled'}
          onPress={handleStart}
          style={styles.startButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.primaryDark,
  },
  header: {
    padding: 24,
  },
  title: {
    marginTop: 16,
    marginLeft: 8,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  inputGroup: {
    gap: 6,
    marginBottom: 20,
  },
  selectContainer: {
    gap: 20,
  },
  buttonContainer: {
    padding: 24,
  },
  startButton: {
    width: '100%',
  },
});
