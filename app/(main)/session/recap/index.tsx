import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useRunningSessionStore } from '@/stores/session';
import { useAuth } from '@/stores/auth';
import MapView, { Polyline, Marker } from 'react-native-maps';
import { FontSize } from '@/constants/theme';
import SvgEdit from '@/components/icons/Edit';
import { paceToSpeed } from '@/utils/calculations';
import SvgClockIcon from '@/components/icons/ClockIcon';
import SvgPinIcon from '@/components/icons/PinIcon';
import SvgSpeedIcon from '@/components/icons/SpeedIcon';

const SessionSummaryScreen = () => {
  const router = useRouter();
  const { sessionData } = useLocalSearchParams<{ sessionData?: string }>();
  const { user, token } = useAuth();
  const {
    session,
    updateSessionTitle,
    deleteSession,
    fetchLastUserSession,
    isLoading,
  } = useRunningSessionStore();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [lastSession, setLastSession] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      if (sessionData) {
        try {
          const parsedSessionData = JSON.parse(sessionData);
          console.log('✅ [SessionSummary] Session depuis paramètres:', parsedSessionData);
          setLastSession(parsedSessionData);
          setEditedTitle(parsedSessionData.title || session.title);
        } catch (error) {
          console.error('❌ Erreur parsing session data:', error);
          setEditedTitle(session.title);
        }
      } else if (user && token) {
        try {
          const data = await fetchLastUserSession(token, user.id);
          console.log('✅ [SessionSummary] Dernière session:', data);
          setLastSession(data);
          setEditedTitle(data?.title || session.title);
        } catch (error) {
          console.error('❌ Erreur chargement session:', error);
          setEditedTitle(session.title);
        }
      }
    };
    loadData();
  }, [user, token, sessionData]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}h${minutes.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDistance = (kilometers: number) => {
    if (kilometers >= 1) {
      return `${kilometers.toFixed(1)} km`;
    }
    return `${(kilometers * 1000).toFixed(0)} m`;
  };

  const formatSpeed = (kmh: number) => {
    return `${kmh.toFixed(1)} km/h`;
  };

  const formatDate = (title: string) => {
    if (title && title.includes('Session du')) {
      const parts = title.split(' ');
      if (parts.length >= 5) {
        return `${parts[2]} ${parts[4]}`;
      }
    }
    return title || '';
  };

  const handleSaveTitle = async () => {
    if (!token || !editedTitle || editedTitle === (lastSession?.title || session.title)) {
      setIsEditingTitle(false);
      return;
    }
    try {
      await updateSessionTitle(editedTitle, token);
      setIsEditingTitle(false);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de modifier le titre');
    }
  };

  const handleSaveSession = async () => {
    try {
      router.replace('/');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de sauvegarder');
    }
  };

  const handleDeleteSession = () => {
    Alert.alert('Supprimer', 'Supprimer cette session ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          try {
            if (token && lastSession) {
              const sessionIdToDelete = lastSession.id;
              if (sessionIdToDelete) {
                await deleteSession(token, sessionIdToDelete);
                router.replace('/');
              }
            }
          } catch (error) {
            Alert.alert('Erreur', 'Impossible de supprimer');
          }
        },
      },
    ]);
  };

  const displayData = lastSession || {
    title: session.title,
    distance: session.metrics.distance / 1000,
    time: session.metrics.time / 1000,
    allure: session.metrics.pace ? paceToSpeed(session.metrics.pace) : 0,
    tps: session.locations.map(loc => [loc.latitude, loc.longitude, loc.timestamp]),
  };

  const coordinates = (displayData.tps || [])
    .filter(point => Array.isArray(point) && point.length >= 2 && point[0] !== 0 && point[1] !== 0)
    .map(point => ({
      latitude: point[0],
      longitude: point[1],
    }));

  let mapRegion = null;
  if (coordinates.length > 0) {
    const lats = coordinates.map(c => c.latitude);
    const lngs = coordinates.map(c => c.longitude);

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    mapRegion = {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: Math.max(maxLat - minLat, 0.01) * 1.5,
      longitudeDelta: Math.max(maxLng - minLng, 0.01) * 1.5,
    };
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle='dark-content' backgroundColor='white' />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          {isEditingTitle ? (
            <TextInput
              style={styles.titleInput}
              value={editedTitle}
              onChangeText={setEditedTitle}
              onBlur={handleSaveTitle}
              onSubmitEditing={handleSaveTitle}
              autoFocus
            />
          ) : (
            <View style={styles.titleSection}>
              <Text style={styles.title}>{displayData.title}</Text>
              <Text style={styles.subtitle}>{formatDate(displayData.title)}</Text>
            </View>
          )}
          <TouchableOpacity onPress={() => setIsEditingTitle(true)} style={styles.editButton}>
            <SvgEdit />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Carte */}
        <View style={styles.mapCard}>
          <View style={styles.mapContainer}>
            {mapRegion && coordinates.length > 0 ? (
              <MapView
                style={styles.map}
                region={mapRegion}
                scrollEnabled={false}
                zoomEnabled={false}
                rotateEnabled={false}
                pitchEnabled={false}
                showsUserLocation={false}
                showsMyLocationButton={false}
                showsCompass={false}
                showsScale={false}
                showsPointsOfInterest={false}
                showsBuildings={false}
                showsTraffic={false}
                showsIndoors={false}
                toolbarEnabled={false}
                moveOnMarkerPress={false}
                liteMode={true}
                mapType='standard'>
                {/* Tracé principal */}
                <Polyline
                  coordinates={coordinates}
                  strokeColor='#FF4757'
                  strokeWidth={4}
                  lineJoin='round'
                  lineCap='round'
                />
                {/* Start marker */}
                {coordinates.length > 0 && (
                  <Marker coordinate={coordinates[0]} anchor={{ x: 0.5, y: 0.5 }}>
                    <View style={styles.startMarker}>
                      <Text style={styles.startMarkerText}>🏁</Text>
                    </View>
                  </Marker>
                )}
                {/* End marker */}
                {coordinates.length > 1 && (
                  <Marker
                    coordinate={coordinates[coordinates.length - 1]}
                    anchor={{ x: 0.5, y: 0.5 }}>
                    <View style={styles.endMarker}>
                      <Text style={styles.endMarkerText}>🏃‍♂️</Text>
                    </View>
                  </Marker>
                )}
              </MapView>
            ) : (
              <View style={styles.mapPlaceholder}>
                <View style={styles.fakeMap}>
                  <Text style={styles.mapTitle}>🗺️ Paris</Text>
                  <View style={styles.fakeRoute} />
                  <View style={styles.fakeRoute2} />
                  <View style={styles.fakeLoop} />
                </View>
              </View>
            )}
          </View>

          {/* Info section */}
          <View style={styles.mapInfo}>
            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <SvgClockIcon width={12} height={12} />
                <Text style={styles.statText}>{formatTime(displayData.time)}</Text>
              </View>
              <View style={styles.stat}>
                <SvgPinIcon width={12} height={12} />
                <Text style={styles.statText}>{formatDistance(displayData.distance)}</Text>
              </View>
              <View style={styles.stat}>
                <SvgSpeedIcon width={12} height={12} />
                <Text style={styles.statText}>{formatSpeed(displayData.allure)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Achievement */}
        {displayData.distance > 0 && (
          <View style={styles.achievement}>
            <View style={styles.achievementCard}>
              <Text style={styles.trophy}>🏆</Text>
              <View style={styles.achievementText}>
                <Text style={styles.achievementTitle}>Objectif atteint !</Text>
                <Text style={styles.achievementDesc}>
                  Tu as réussi à courir {formatDistance(displayData.distance)}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Boutons */}
        <View style={styles.buttons}>
          {sessionData ? (
            // Mode historique : seulement le bouton supprimer
            <TouchableOpacity style={[styles.deleteBtn, styles.fullWidthBtn]} onPress={handleDeleteSession}>
              <Text style={styles.deleteBtnText}>Supprimer cette session</Text>
            </TouchableOpacity>
          ) : (
            // Mode fin de session : supprimer et enregistrer
            <>
              <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteSession}>
                <Text style={styles.deleteBtnText}>Supprimer</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveBtn, isLoading && styles.saveBtnDisabled]}
                onPress={handleSaveSession}
                disabled={isLoading}>
                <Text style={styles.saveBtnText}>
                  {isLoading ? 'Enregistrement...' : 'Enregistrer'}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  titleSection: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  titleInput: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    flex: 1,
    borderBottomWidth: 2,
    borderBottomColor: '#6366F1',
    paddingBottom: 5,
  },
  editButton: {
    padding: 8,
    marginLeft: 16,
  },
  content: {
    flex: 1,
  },
  mapCard: {
    margin: 20,
    marginBottom: 24,
    borderRadius: 16,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    alignItems: 'center', // centre la bulle sous la carte
  },
  mapContainer: {
    position: 'relative',
    height: 200,
    width: '100%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  map: {
    flex: 1,
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#E8F1F0',
  },
  fakeMap: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#E8F4F8',
  },
  mapTitle: {
    position: 'absolute',
    top: 16,
    left: 16,
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  fakeRoute: {
    position: 'absolute',
    top: 50,
    left: 30,
    width: 80,
    height: 3,
    backgroundColor: '#FF4757',
    borderRadius: 2,
    transform: [{ rotate: '25deg' }],
  },
  fakeRoute2: {
    position: 'absolute',
    top: 90,
    left: 60,
    width: 60,
    height: 3,
    backgroundColor: '#FF4757',
    borderRadius: 2,
    transform: [{ rotate: '-15deg' }],
  },
  fakeLoop: {
    position: 'absolute',
    top: 70,
    right: 50,
    width: 30,
    height: 30,
    borderWidth: 3,
    borderColor: '#FF4757',
    borderRadius: 15,
  },
  mapInfo: {
    position: 'absolute',
    left: '60%',
    transform: [{ translateX: -150 }],
    bottom: -20,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    paddingVertical: 8,
    paddingHorizontal: 12,
    minWidth: 220,
    maxWidth: 320,
  },
  achievement: {
    paddingHorizontal: 20,
    marginBottom: 32,
    marginTop: 32,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F0C814',
  },
  trophy: {
    fontSize: 32,
    marginRight: 16,
  },
  achievementText: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 2,
  },
  achievementDesc: {
    fontSize: 14,
    color: '#666',
  },
  buttons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    marginTop: 32,
    gap: 12,
  },
  deleteBtn: {
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  deleteBtnText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  saveBtn: {
    flex: 1,
    backgroundColor: '#6366F1',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  statText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  // Ajout styles markers
  startMarker: {
    backgroundColor: 'white',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  startMarkerText: {
    fontSize: 12,
  },
  endMarker: {
    backgroundColor: 'white',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  endMarkerText: {
    fontSize: 12,
  },
  fullWidthBtn: {
    flex: 1,
    marginLeft: 0,
  },
});

export default SessionSummaryScreen;
