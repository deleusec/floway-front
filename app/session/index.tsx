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

  const redirectToSession = () => {
    const routes: { [key in 'target' | 'guide' | 'free']: '/session/selected-target' | '/session/selected-guided' | '/session/selected-free' } = {
      target: '/session/selected-target',
      guide: '/session/selected-guided',
      free: '/session/selected-free',
    };

    router.push(routes[selectedSession]);
  };

  const handleSessionSelect = (session: 'target' | 'guide' | 'free') => {
    setSelectedSession(session);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.headerContainer}>
          <BackButton />
          <Text style={styles.title}>Choisis une session</Text>
        </View>

        {/* Session Buttons */}
        <View style={styles.sessionButtonsContainer}>
          <CustomButton
            text="Session libre"
            state={selectedSession === 'free' ? 'selected' : 'default'}
            onPress={() => handleSessionSelect('free')}
            style={styles.sessionButton}
            icon={
              <ButterflyIcon
                state={selectedSession === 'free' ? 'selected' : 'default'}
                width={24}
                height={24}
              />
            }
          />
          <CustomButton
            text="Session avec objectif"
            state={selectedSession === 'target' ? 'selected' : 'default'}
            onPress={() => handleSessionSelect('target')}
            style={styles.sessionButton}
            icon={
              <TargetIcon
                state={selectedSession === 'target' ? 'selected' : 'default'}
                width={24}
                height={24}
              />
            }
          />
          <CustomButton
            text="Session avec run guidée"
            state={selectedSession === 'guide' ? 'selected' : 'default'}
            onPress={() => handleSessionSelect('guide')}
            style={styles.sessionButton}
            icon={
              <HeadphoneIcon
                state={selectedSession === 'guide' ? 'selected' : 'default'}
                width={24}
                height={24}
              />
            }
          />
        </View>

        {/* Start Button */}
        <View style={styles.startButtonContainer}>
          <ThemedButton
            title="Commencer"
            buttonSize="medium"
            buttonType="confirm"
            buttonState="default"
            onPress={redirectToSession}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.dark.primaryDark,
  },
  container: {
    flex: 1,
    padding: 24,
  },
  headerContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.white,
    marginTop: 16,
  },
  sessionButtonsContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 32,
    paddingBottom: 32,
  },
  sessionButton: {
    width: '100%',
    alignSelf: 'center',
  },
  startButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
