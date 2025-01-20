import React, { useState } from 'react';
import { SafeAreaView, View, StyleSheet, Text } from 'react-native';
import BackButton from '@/components/button/BackButton';
import ThemedButton from '@/components/button/ThemedButton';
import TimeInputField from '@/components/input/TimeInput';
import SelectInput from '@/components/input/SelectInput';
import { Colors } from '@/constants/Colors';
import { Router } from 'expo-router';
export default function GoalDefinition() {
  const [hours, setHours] = useState('00');
  const [minutes, setMinutes] = useState('00');
  const [seconds, setSeconds] = useState('00');
    const [goalType, setGoalType] = useState<string>('Temps');

  const handleStart = () => {
    
    console.log('Commencer avec:', `${hours}:${minutes}:${seconds}`);
  };

  const isValidTime = hours !== '00' || minutes !== '00' || seconds !== '00';

  return (
    <SafeAreaView style={styles.container}>
      {/* Header avec bouton retour */}
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.title}>Définis ton objectif</Text>
      </View>

      {/* Section temps */}
      <View style={styles.content}>
        <SelectInput options={['Temps', 'Distance']} onValueChange={setGoalType} value={goalType} />
        <View style={styles.timeInputContainer}>
          <TimeInputField placeholder="00" unit="heures" value={hours} onChange={setHours} />
          <TimeInputField placeholder="00" unit="min" value={minutes} onChange={setMinutes} />
          <TimeInputField placeholder="00" unit="sec" value={seconds} onChange={setSeconds} />
        </View>
      </View>

      {/* Bouton Commencer */}
      <View style={styles.buttonContainer}>
        <ThemedButton
          title="Commencer"
          buttonSize="large"
          buttonType="confirm"
          buttonState={isValidTime ? 'default' : 'disabled'}
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
  label: {
    fontSize: 16,
    color: Colors.light.white,
    marginBottom: 16,
  },
  timeInputContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 24,
  },
  startButton: {
    width: '100%',
  },
});
