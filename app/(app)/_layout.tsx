import { Redirect, Slot } from 'expo-router';
import React, { useEffect } from 'react';
import { PermissionsAndroid, Platform, Text } from 'react-native';

import { useAuth } from '@/context/AuthContext';
import AppMenu from '@/components/AppMenu';
import { Audio } from 'expo-av';

export default function TabLayout() {
  const { authToken, isLoading } = useAuth();
  useEffect(() => {
    const requestPermissions = async () => {
      if (Platform.OS === 'ios') {
        const { status: audioStatus } = await Audio.requestPermissionsAsync();

        if (audioStatus !== 'granted') {
          console.log('Permissions non accordées sur iOS');
        }
      } else if (Platform.OS === 'android') {
        const hasAudioPermission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        );
        let audioPermission;
        if (!hasAudioPermission) {
          audioPermission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            {
              title: 'Permission Microphone',
              message:
                "L'application a besoin d'accéder à votre micro pour enregistrer des audios.",
              buttonPositive: 'OK',
            },
          );
        }

        const storagePermission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Permission Accès aux fichiers',
            message:
              "L'application a besoin d'accéder à vos fichiers pour enregistrer et lire des audios.",
            buttonPositive: 'OK',
          },
        );

        if (audioPermission !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Permission micro refusée sur Android');
        }

        if (storagePermission !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Permission fichiers refusée sur Android');
        }
      }
    };

    requestPermissions();
  }, []);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!authToken) {
    return <Redirect href="/landing" />;
  }

  return (
    <>
      <Slot />
      <AppMenu />
    </>
  );
}
