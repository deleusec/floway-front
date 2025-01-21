// screens/session/GoalDefinition.tsx
import React, { useState } from 'react';
import { SafeAreaView, View, StyleSheet, Text, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import BackButton from '@/components/button/BackButton';
import ThemedButton from '@/components/button/ThemedButton';
import TimeInputField from '@/components/input/TimeInput';
import SelectInput from '@/components/input/SelectInput';
import { Colors } from '@/constants/Colors';
import { useSessionContext } from '@/context/SessionContext';

export default function GoalDefinition() {
  const router = useRouter();
  const { updateSessionTarget } = useSessionContext();
  
  const [hours, setHours] = useState('00');
  const [minutes, setMinutes] = useState('00');
  const [seconds, setSeconds] = useState('00');
  const [goalType, setGoalType] = useState<'Temps' | 'Distance'>('Temps');
  const [distance, setDistance] = useState<string>('5.0');

  const handleStart = () => {
    // Mettre à jour le contexte selon le type d'objectif
    if (goalType === 'Temps') {
      updateSessionTarget({
        type: 'time',
        time: {
          hours,
          minutes,
          seconds
        }
      });
    } else {
      updateSessionTarget({
        type: 'distance',
        distance: parseFloat(distance)
      });
    }

    // Naviguer vers la page de session
    router.push('/session/selectedTarget');
  };

  const isValidGoal = goalType === 'Temps' 
    ? (hours !== '00' || minutes !== '00' || seconds !== '00')
    : (parseFloat(distance) > 0);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header avec bouton retour */}
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.title}>Définis ton objectif</Text>
      </View>

      {/* Section objectif */}
      <View style={styles.content}>
        <SelectInput 
          options={['Temps', 'Distance']} 
          onValueChange={(value) => setGoalType(value as 'Temps' | 'Distance')} 
          value={goalType} 
          label="Type d'objectif"
        />

        {goalType === 'Temps' ? (
          <View style={styles.timeInputContainer}>
            <TimeInputField 
              placeholder="00" 
              unit="heures" 
              value={hours} 
              onChange={setHours} 
            />
            <TimeInputField 
              placeholder="00" 
              unit="min" 
              value={minutes} 
              onChange={setMinutes} 
            />
            <TimeInputField 
              placeholder="00" 
              unit="sec" 
              value={seconds} 
              onChange={setSeconds} 
            />
          </View>
        ) : (
          <View style={styles.distanceInputContainer}>
            <TextInput
              style={styles.distanceInput}
              value={distance}
              onChangeText={setDistance}
              keyboardType="decimal-pad"
              placeholder="5.0"
              placeholderTextColor={Colors.light.mediumGrey}
            />
            <Text style={styles.distanceUnit}>km</Text>
          </View>
        )}
      </View>

      {/* Bouton Commencer */}
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
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.white,
    marginTop: 16,
    marginLeft: 8,
  },
  content: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    gap: 20,
  },
  timeInputContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  distanceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.secondaryDark,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  distanceInput: {
    flex: 1,
    color: Colors.light.white,
    fontSize: 16,
    padding: 0,
  },
  distanceUnit: {
    color: Colors.light.white,
    fontSize: 16,
    marginLeft: 8,
    opacity: 0.7,
  },
  buttonContainer: {
    padding: 24,
  },
  startButton: {
    width: '100%',
  },
});