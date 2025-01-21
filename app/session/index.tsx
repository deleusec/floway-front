import React from 'react';
import { SafeAreaView, View, StyleSheet, Text } from 'react-native';
import BackButton from '@/components/button/BackButton';
import ThemedButton from '@/components/button/ThemedButton';
import { CustomButton } from '@/components/button/ConfigButton';
import { Colors } from '@/constants/Colors';
import { Link } from 'expo-router';
import { router } from 'expo-router';

export default function SessionSelection() {
  const handleFreeSession = () => {
    console.log('Session libre');
  };

  const handleGoalSession = () => {
    router.push('/session/target');
  };

  const handleGuidedSession = () => {
    router.push('/session/guide');
    console.log('Session avec run guidée');
  };

  const handleStart = () => {
    router.push('/session/selectedFree');
    console.log('Commencer');
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
            state="selected"
            onPress={handleFreeSession}
            style={styles.sessionButton}
            icon={require('@/assets/images/home-active.png')}
          />

    
          <CustomButton
            text="Session avec objectif"
            state="default"
            onPress={handleGoalSession}
            style={styles.sessionButton}
            icon={require('@/assets/images/home-active.png')}
          />
    
        
        <CustomButton
          text="Session avec run guidée"
          state="default"
          onPress={handleGuidedSession}
          style={styles.sessionButton}
          icon={require('@/assets/images/home-active.png')}
        />
      </View>

      {/* Bouton Commencer */}
      <View style={styles.startButtonContainer}>
        <ThemedButton
          title="Commencer"
          buttonSize="large"
          buttonType="confirm"
          buttonState="default"
          onPress={handleStart}
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
