import React from 'react';
import { SafeAreaView, View, StyleSheet, Dimensions } from 'react-native';
import { Colors } from '@/constants/Colors';
import { ThemedText } from '@/components/ThemedText';
import { ThemedButton } from '@/components/button/ThemedButton';
import MapView, { Polyline } from 'react-native-maps';
import { useRouter } from 'expo-router';
import { useSessionContext } from '@/context/SessionContext';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import TimeDisplay from '@/components/session/TimeDisplay';
import EditPencilIcon from '@/assets/icons/edit-pencil.svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function SessionSummary() {
  const router = useRouter();
  const { sessionData } = useSessionContext();
  const formattedDate = format(new Date(), "dd/MM/yyyy 'à' HH:mm", { locale: fr });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <ThemedText type="subtitle">Session du samedi soir</ThemedText>
          <ThemedText type="default" style={styles.dateText}>
            {formattedDate}
          </ThemedText>
        </View>
        <EditPencilIcon width={24} height={24} />
      </View>

      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          customMapStyle={darkMapStyle}
          showsUserLocation={false}
          showsCompass={false}
          initialRegion={{
            latitude: 48.8566,
            longitude: 2.3522,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}>
          {sessionData?.locations && (
            <Polyline
              coordinates={sessionData.locations}
              strokeColor={Colors.light.primary}
              strokeWidth={3}
            />
          )}
        </MapView>
      </View>

      <TimeDisplay time={sessionData?.time || 0}/>

      <View style={styles.metricsContainer}>
        <View style={styles.metricItem}>
          <ThemedText type="default">Distance</ThemedText>
          <ThemedText type="subtitle">
            {sessionData?.metrics?.distance || 0.0}km
          </ThemedText>
        </View>
        <View style={styles.metricItem}>
          <ThemedText type="default">Allure</ThemedText>
          <ThemedText type="subtitle">{sessionData?.metrics?.pace || 0.0}</ThemedText>
        </View>
        <View style={styles.metricItem}>
          <ThemedText type="default">Calories</ThemedText>
          <ThemedText type="subtitle">
            {sessionData?.metrics?.calories || 0}kcal
          </ThemedText>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <ThemedButton
          title="Terminer"
          buttonSize="large"
          buttonType="confirm"
          buttonState="default"
          onPress={() => router.push('/')}
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
    height: SCREEN_WIDTH * 0.6,
  },
  map: {
    flex: 1,
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
    padding: 24,
  },
});

const darkMapStyle = [
  {
    elementType: 'geometry',
    stylers: [{ color: '#242f3e' }],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [{ color: '#746855' }],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#242f3e' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#38414e' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#212a37' }],
  },
];
