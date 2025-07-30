import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useRunningSessionStore } from '@/stores/session';
import { useAuth } from '@/stores/auth';
import {Colors, FontSize, Radius, Spacing} from '@/constants/theme';
import SvgEdit from '@/components/icons/Edit';
import { paceToSpeed } from '@/utils/calculations';
import SessionMap from '@/components/ui/session-map';
import {useStore} from "@/stores";
import {Ionicons} from "@expo/vector-icons";
import Button from "@/components/ui/button";

const SessionSummaryScreen = () => {
  const router = useRouter();
  const { sessionData } = useLocalSearchParams<{ sessionData?: string }>();
  const { user, token } = useAuth();
  const { setBackgroundColor } = useStore()

  const { session, updateSessionTitle, deleteSession, fetchLastUserSession, isLoading } =
    useRunningSessionStore();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [lastSession, setLastSession] = useState<any>(null);

  useEffect(() => {
    setBackgroundColor(Colors.white)
  }, []);

  useEffect(() => {
    const loadData = async () => {
      if (sessionData) {
        try {
          const parsedSessionData = JSON.parse(sessionData);
          setLastSession(parsedSessionData);
          setEditedTitle(parsedSessionData.title || session.title);
        } catch (error) {
          console.error('❌ Erreur parsing session data:', error);
          setEditedTitle(session.title);
        }
      } else if (user && token) {
        try {
          const data = await fetchLastUserSession(token, user.id);
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
          <TouchableOpacity onPress={() => setIsEditingTitle(true)}>
            <SvgEdit />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Carte */}
        <View style={styles.mapContainer}>
          <View style={styles.mapCard}>
            <SessionMap
              coordinates={displayData.tps || []}
              height={140}
              style={styles.mapStyle}
            />
          </View>

          <View style={styles.statsBox}>
            <View style={styles.statItem}>
              <Ionicons name='time' size={12} color={Colors.textPrimary} />
              <Text style={styles.statText}>{formatTime(displayData.time)}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name='location' size={12} color={Colors.textPrimary} />
              <Text style={styles.statText}>{formatDistance(displayData.distance)}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name='speedometer' size={12} color={Colors.textPrimary} />
              <Text style={styles.statText}>{formatSpeed(displayData.allure)}</Text>
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
      </ScrollView>

      {/* Boutons */}
      <View style={styles.buttons}>
        {sessionData ? (
          <>
            {/* Mode historique : seulement le bouton supprimer */}
            <Button
              onPress={() => router.push('/(main)')}
              title='Retour'
              variant='outline'
              style={{ flex: 1 }}
            />
            <Button
              onPress={handleDeleteSession}
              title='Supprimer'
              variant='error'
              style={{ flex: 1 }}
            />
          </>
        ) : (
          // Mode fin de session : supprimer et enregistrer
          <>
            <Button
              onPress={handleDeleteSession}
              title='Supprimer'
              variant='error'
              style={{ flex: 1 }}
            />
            <Button
              onPress={handleSaveSession}
              title={isLoading ? 'Enregistrement...' : 'Enregistrer'}
              disabled={isLoading}
              style={{ flex: 1 }}
            />
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border
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
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 18,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
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
  content: {
    flex: 1,
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
  mapContainer: {
    alignItems: 'center',
    paddingTop: Spacing.lg,
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  mapCard: {
    width: '100%',
    borderRadius: Radius.md,
    backgroundColor: Colors.white,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  mapStyle: {
    borderTopLeftRadius: Radius.md,
    borderTopRightRadius: Radius.md,
  },
  statsBox: {
    flexDirection: 'row',
    gap: Spacing.md,
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.sm,
    position: 'absolute',
    bottom: -20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    marginLeft: Spacing.xs,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
  },
  fakeRoute: {
    position: 'absolute',
    top: 50,
    left: 30,
    width: 80,
    height: 3,
    backgroundColor: Colors.primary,
    borderRadius: 2,
    transform: [{ rotate: '25deg' }],
  },
  fakeRoute2: {
    position: 'absolute',
    top: 90,
    left: 60,
    width: 60,
    height: 3,
    backgroundColor: Colors.primary,
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
    backgroundColor: Colors.primary,
    borderRadius: 15,
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
    justifyContent: 'space-between',
    gap: 16,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.white,
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
