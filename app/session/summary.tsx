import React, {useEffect, useState} from 'react';
import {SafeAreaView, View, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import { Colors } from '@/constants/Colors';
import { ThemedText } from '@/components/ThemedText';
import { ThemedButton } from '@/components/button/ThemedButton';
import { useRouter } from 'expo-router';
import { useSessionContext } from '@/context/SessionContext';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import TimeDisplay from '@/components/session/TimeDisplay';
import EditPencilIcon from '@/assets/icons/edit-pencil.svg';
import RouteMap from '@/components/map/map';


export default function SessionSummary() {
  const router = useRouter();
  const { sessionData, updateSessionTitle } = useSessionContext();
  const formattedDate = format(new Date(), "dd/MM/yyyy 'à' HH:mm", { locale: fr });
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(sessionData?.title || '');

  const handleTitleEdit = () => {
    setIsEditingTitle(true);
  };

  const handleFinish = async () => {
    if (isEditingTitle && newTitle.trim() !== '' && newTitle !== sessionData?.title) {
      try {
        await updateSessionTitle(newTitle.trim());
      } catch (error) {
        console.error('Failed to update title:', error);
      }
    }
    router.push('/');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          {isEditingTitle ? (
            <TextInput
              value={newTitle}
              onChangeText={setNewTitle}
              style={styles.titleInput}
              autoFocus
            />
          ) : (
            <>
              <ThemedText type="subtitle">{sessionData?.title}</ThemedText>
              <ThemedText type="default" style={styles.dateText}>
                {formattedDate}
              </ThemedText>
            </>
          )}
        </View>
        <TouchableOpacity onPress={handleTitleEdit}>
          <EditPencilIcon width={24} height={24} />
        </TouchableOpacity>
      </View>
      <View style={styles.mapContainerWrapper}>
        <View style={styles.mapContainer}>
          {sessionData?.locations && sessionData.locations.length > 0 && (
            <RouteMap locations={sessionData.locations} />
          )}
        </View>
      </View>
      <TimeDisplay time={sessionData?.time || 0} />
      <View style={styles.metricsContainer}>
        <View style={styles.metricItem}>
          <ThemedText type="default">Distance</ThemedText>
          <ThemedText type="subtitle">{sessionData?.metrics?.distance || 0.0}km</ThemedText>
        </View>
        <View style={styles.metricItem}>
          <ThemedText type="default">Allure</ThemedText>
          <ThemedText type="subtitle">{sessionData?.metrics?.pace || 0.0}</ThemedText>
        </View>
        <View style={styles.metricItem}>
          <ThemedText type="default">Calories</ThemedText>
          <ThemedText type="subtitle">{sessionData?.metrics?.calories || 0}kcal</ThemedText>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <ThemedButton
          title="Terminer"
          buttonSize="medium"
          buttonType="confirm"
          buttonState="default"
          onPress={handleFinish}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 24,
  },
  dateText: {
    opacity: 0.7,
    marginTop: 4,
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    padding: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapContainer: {
    height: 300,
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  mapContainerWrapper: {
    padding: 24,
    width: '100%',
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  metricItem: {
    alignItems: 'center',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 24,
  },
  titleContainer: {
    flex: 1,
    marginRight: 16,
  },
  titleInput: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.dark.white,
    padding: 0,
    margin: 0,
  },
});
