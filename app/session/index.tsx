import React, { useState } from 'react';
import { SafeAreaView, View, StyleSheet, Text } from 'react-native';
import BackButton from '@/components/button/BackButton';
import ThemedButton from '@/components/button/ThemedButton';
import { CustomButton } from '@/components/button/ConfigButton';
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';
import ButterflyIcon from '@/components/icons/ButterflyIcon';
import TargetIcon from '@/components/icons/TargetIcon';
import HeadphoneIcon from '@/components/icons/HeadphoneIcon';

export default function SessionSelection() {

  const [selectedSession, setSelectedSession] = useState<'target' | 'guide' | 'free'>('free');

  const redirectTarget = () => {
    if(selectedSession === 'target') {
      router.push('/session/target');
    } else if (selectedSession === 'guide') {
      router.push('/session/guide');
    } else {
      router.push('/session/selectedFree');
    }
  }

  const handleGoalSession = () => {
    setSelectedSession('target');
  };

  const handleGuidedSession = () => {
    setSelectedSession('guide');
  };

  const handleFreeSession = () => {
    setSelectedSession('free');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Bouton retour */}
      <View style={styles.backButtonContainer}>
        <BackButton />
        {/* Titre */}
        <Text style={styles.title}>Choisis une session</Text>
      </View>

      {/* Boutons */}
      <View style={styles.buttonContainer}>

          <CustomButton
            text="Session libre"
            state={selectedSession === 'free' ? 'selected' : 'default'}
            onPress={handleFreeSession}
            style={styles.sessionButton}
            icon={
              <ButterflyIcon state={selectedSession === 'free' ? 'selected' : 'default'} width={24} height={24} />
            }
          />


          <CustomButton
            text="Session avec objectif"
            state={selectedSession === 'target' ? 'selected' : 'default'}
            onPress={handleGoalSession}
            style={styles.sessionButton}
            icon={
              <TargetIcon state={selectedSession === 'target' ? 'selected' : 'default'} width={24} height={24} />
            }
          />


        <CustomButton
          text="Session avec run guidée"
          state={selectedSession === 'guide' ? 'selected' : 'default'}
          onPress={handleGuidedSession}
          style={styles.sessionButton}
          icon={
            <HeadphoneIcon state={selectedSession === 'guide' ? 'selected' : 'default'} width={24} height={24} />
          }
        />
      </View>

      {/* Bouton Commencer */}
      <View style={styles.startButtonContainer}>
        <ThemedButton
          title="Commencer"
          buttonSize="large"
          buttonType="confirm"
          buttonState="default"
          onPress={redirectTarget}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    backgroundColor: Colors.dark.primaryDark,
  },
  backButtonContainer: {
    marginBottom: 16,
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.white,
    marginTop: 16,
    marginLeft: 8,
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'flex-end',
    padding: 24,
    gap: 16,
  },
  sessionButton: {
    width: '100%',
    alignSelf: 'center',
  },
  startButtonContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
  },
});
