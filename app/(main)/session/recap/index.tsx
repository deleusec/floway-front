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
  ActivityIndicator
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useRunningSessionStore } from '@/stores/session';
import { useAuth } from '@/stores/auth';
import {Colors, FontSize, Radius, Spacing} from '@/constants/theme';
import SvgEdit from '@/components/icons/Edit';
import SvgPlayIcon from '@/components/icons/PlayIcon';
import SvgUsersIcon from '@/components/icons/UsersIcon';
import SvgFlowayIcon from '@/components/icons/FlowayIcon';
import { paceToSpeed } from '@/utils/calculations';
import SessionMap from '@/components/ui/session-map';
import {useStore} from "@/stores";
import {Ionicons} from "@expo/vector-icons";
import Button from "@/components/ui/button";
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

const NODE_URL = 'https://node.floway.edgar-lecomte.fr';

// Types pour les événements
interface EventFriend {
  id: number;
  first_name: string;
  last_name: string;
}

interface IEvent {
  type: 'text' | 'audio' | 'internal';
  friend?: EventFriend;
  timestamp: number;
  text_content?: string;
  audio_name?: string;
}

const SessionSummaryScreen = () => {
  const router = useRouter();
  const { sessionData, sessionId } = useLocalSearchParams<{ sessionData?: string, sessionId?: string }>();
  const { user, token } = useAuth();
  const { setBackgroundColor } = useStore()

  const { session, updateSessionTitle, deleteSession, getUserSession, isLoading } =
    useRunningSessionStore();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [lastSession, setLastSession] = useState<any>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [loadingAudio, setLoadingAudio] = useState<string | null>(null);
  const [currentSound, setCurrentSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    setBackgroundColor(Colors.white)
    
    // Nettoyer l'audio quand on quitte la page
    return () => {
      if (currentSound) {
        currentSound.unloadAsync().catch(console.error);
      }
    };
  }, [currentSound]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoadingSession(true);
      
      try {
        if (sessionData) {
          // Mode historique : données passées en paramètre depuis la liste des sessions
          try {
            const parsedSessionData = JSON.parse(sessionData);
            // Récupérer les données fraîches depuis l'API si on a un ID
            if (parsedSessionData.id && user && token) {
              console.log('🔄 Récupération données fraîches pour session historique:', parsedSessionData.id);
              const data = await getUserSession(token, parsedSessionData.id);
              if (data) {
                setLastSession(data);
                setEditedTitle(data.title || parsedSessionData.title);
              } else {
                // Fallback sur les données passées en paramètre
                setLastSession(parsedSessionData);
                setEditedTitle(parsedSessionData.title || session.title);
              }
            } else {
              // Pas d'ID, utiliser les données passées en paramètre
              setLastSession(parsedSessionData);
              setEditedTitle(parsedSessionData.title || session.title);
            }
          } catch (error) {
            console.error('❌ Erreur parsing session data:', error);
            setEditedTitle(session.title);
          }
        } else if (sessionId && user && token) {
          // Mode fin de session : récupérer les données avec l'ID de session
          try {
            console.log('🔄 Récupération session avec ID:', sessionId);
            const data = await getUserSession(token, parseInt(sessionId));
            if (data) {
              setLastSession(data);
              setEditedTitle(data.title || session.title);
            } else {
              // Fallback sur les données de session locale
              setEditedTitle(session.title);
            }
          } catch (error) {
            console.error('❌ Erreur chargement session:', error);
            setEditedTitle(session.title);
          }
        } else if (user && token && session.id) {
          // Fallback : utiliser l'ID de session courante
          try {
            const data = await getUserSession(token, Number(session.id));
            if (data) {
              setLastSession(data);
              setEditedTitle(data.title || session.title);
            } else {
              setEditedTitle(session.title);
            }
          } catch (error) {
            console.error('❌ Erreur chargement session fallback:', error);
            setEditedTitle(session.title);
          }
        } else {
          // Pas de données à charger, utiliser les données locales
          setEditedTitle(session.title);
        }
      } finally {
        setIsLoadingSession(false);
      }
    };
    
    loadData();
  }, [user, token, sessionData, sessionId, session.id]);

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
    events: [], // Fallback pour les données locales
  };

  // Ajouter les événements depuis l'API si disponibles
  const sessionEvents = displayData.events || [];

  // Fonction pour lire un fichier audio
  const playAudio = async (audioName: string) => {
    try {
      console.log('🎵 Téléchargement de l\'audio:', audioName);
      
      if (!token) {
        console.error('❌ Token d\'authentification manquant pour l\'audio');
        return;
      }

      // Si un audio est déjà en cours, l'arrêter d'abord
      if (currentSound) {
        await stopAudio();
      }

      setLoadingAudio(audioName);

      const response = await fetch(`${NODE_URL}/auth/audio/${audioName}?authorization=${token}`, {
        method: 'GET',
      });

      if (!response.ok) {
        console.error('❌ Erreur lors du téléchargement de l\'audio:', response.status);
        setLoadingAudio(null);
        return;
      }

      // Télécharger l'audio
      const audioArrayBuffer = await response.arrayBuffer();
      
      // Créer un fichier temporaire
      const fileExtension = audioName.split('.').pop() || 'm4a';
      const tempFileName = `temp_audio_${Date.now()}.${fileExtension}`;
      const tempUri = `${FileSystem.documentDirectory}${tempFileName}`;
      
      console.log('🎵 Création fichier temporaire:', tempFileName);
      
      // Convertir ArrayBuffer en base64
      const binary = new Uint8Array(audioArrayBuffer);
      let base64String = '';
      for (let i = 0; i < binary.length; i++) {
        base64String += String.fromCharCode(binary[i]);
      }
      const base64Data = btoa(base64String);
      
      // Écrire le fichier temporaire
      await FileSystem.writeAsStringAsync(tempUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      console.log('🎵 Fichier audio temporaire créé:', tempUri);
      
      // Charger et jouer l'audio
      const { sound } = await Audio.Sound.createAsync(
        { uri: tempUri },
        { shouldPlay: true }
      );

      setCurrentSound(sound);
      setLoadingAudio(null);
      setPlayingAudio(audioName);
      console.log('🎵 Lecture de l\'audio en cours');

      // Nettoyer après la lecture
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          console.log('✅ Lecture audio terminée');
          setPlayingAudio(null);
          setCurrentSound(null);
          sound.unloadAsync();
          // Supprimer le fichier temporaire
          FileSystem.deleteAsync(tempUri).catch(console.error);
        }
      });
      
    } catch (error) {
      console.error('❌ Erreur lors de la lecture audio:', error);
      setLoadingAudio(null);
      setPlayingAudio(null);
      setCurrentSound(null);
    }
  };

  // Fonction pour arrêter l'audio
  const stopAudio = async () => {
    if (currentSound) {
      try {
        await currentSound.stopAsync();
        await currentSound.unloadAsync();
        setCurrentSound(null);
        setPlayingAudio(null);
        console.log('🛑 Audio arrêté');
      } catch (error) {
        console.error('❌ Erreur lors de l\'arrêt de l\'audio:', error);
      }
    }
  };

  // Fonction pour gérer le clic sur une card audio
  const handleAudioCardPress = async (audioName: string) => {
    if (playingAudio === audioName) {
      // Si cet audio est en cours de lecture, l'arrêter
      await stopAudio();
    } else {
      // Sinon, le lire
      await playAudio(audioName);
    }
  };

  // Fonction pour rendre un événement
  const renderEvent = (event: IEvent, index: number) => {
    const isAudioPlaying = event.type === 'audio' && event.audio_name && playingAudio === event.audio_name;
    const isAudioLoading = event.type === 'audio' && event.audio_name && loadingAudio === event.audio_name;
    
    const getEventIcon = () => {
      switch (event.type) {
        case 'audio':
          if (isAudioLoading) {
            return <ActivityIndicator size="small" color="#624AF6" />;
          }
          if (isAudioPlaying) {
            return <SvgPlayIcon color="#624AF6" size={20} />;
          }
          return <SvgPlayIcon color="#5E5E5E" size={20} />;
        case 'text':
          return <SvgUsersIcon color="#5E5E5E" size={20} />;
        case 'internal':
          return <SvgFlowayIcon color="#5E5E5E" size={20} />;
        default:
          return <SvgFlowayIcon color="#5E5E5E" size={20} />;
      }
    };

    const getEventText = () => {
      const friendName = event.friend ? `${event.friend.first_name} ${event.friend.last_name}` : '';
      
      switch (event.type) {
        case 'audio':
          return (
            <Text style={styles.eventText}>
              <Text style={styles.friendName}>{friendName}</Text> t'a envoyé un audio
            </Text>
          );
        case 'text':
          return (
            <Text style={styles.eventText}>
              <Text style={styles.friendName}>{friendName}</Text> t'a dit : {event.text_content}
            </Text>
          );
        case 'internal':
          return <Text style={styles.eventText}>{event.text_content}</Text>;
        default:
          return <Text style={styles.eventText}>{event.text_content}</Text>;
      }
    };

    const handlePress = () => {
      if (event.type === 'audio' && event.audio_name) {
        handleAudioCardPress(event.audio_name);
      }
    };

    const cardStyle = [
      styles.eventCard,
      (isAudioPlaying || isAudioLoading) && styles.eventCardPlaying,
      event.type === 'audio' && event.audio_name && styles.eventCardClickable,
    ];

    return (
      <TouchableOpacity 
        key={index} 
        style={cardStyle}
        onPress={handlePress}
        disabled={event.type !== 'audio' || !event.audio_name || !!isAudioLoading}
        activeOpacity={event.type === 'audio' && event.audio_name && !isAudioLoading ? 0.7 : 1}
      >
        <View style={styles.eventIcon}>
          {getEventIcon()}
        </View>
        <View style={styles.eventContent}>
          {getEventText()}
        </View>
      </TouchableOpacity>
    );
  };

  const coordinates = (displayData.tps || [])
    .filter((point: any) => Array.isArray(point) && point.length >= 2 && point[0] !== 0 && point[1] !== 0)
    .map((point: any) => ({
      latitude: point[0],
      longitude: point[1],
    }));

  let mapRegion = null;
  if (coordinates.length > 0) {
    const lats = coordinates.map((c: any) => c.latitude);
    const lngs = coordinates.map((c: any) => c.longitude);

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

  // Affichage du loading pendant le chargement des données
  if (isLoadingSession) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle='dark-content' backgroundColor='white' />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Chargement du récapitulatif...</Text>
        </View>
      </View>
    );
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

        {/* Section Événements */}
        <View style={styles.eventsSection}>
          <Text style={styles.eventsTitle}>Mes flows</Text>
          
          {sessionEvents && sessionEvents.length > 0 ? (
            <View style={styles.eventsList}>
              {sessionEvents.map((event: IEvent, index: number) => renderEvent(event, index))}
            </View>
          ) : (
            <View style={styles.eventsPlaceholder}>
              <Text style={styles.placeholderText}>Aucun flow pour cette session</Text>
            </View>
          )}
        </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  // Styles pour les événements
  eventsSection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  eventsTitle: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  eventsList: {
    gap: Spacing.sm,
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
  eventCardClickable: {
    // Style pour les cards audio cliquables
  },
  eventCardPlaying: {
    borderColor: '#624AF6', // Primary color
    borderWidth: 2,
  },
  eventIcon: {
    marginRight: Spacing.md,
  },
  eventContent: {
    flex: 1,
  },
  eventText: {
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  friendName: {
    fontWeight: '600',
    color: '#624AF6', // Primary color
  },
  eventsPlaceholder: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});

export default SessionSummaryScreen;
