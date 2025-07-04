import { create } from 'zustand';
import * as Location from 'expo-location';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { calculateDistance, calculatePace } from '../utils/calculations';

interface LocationPoint {
  latitude: number;
  longitude: number;
  timestamp: number;
}

interface RunningMetrics {
  distance: number;
  pace: number;
  steps: number;
  calories: number;
  time: number;
}

interface RunningSession {
  id?: string;
  isActive: boolean;
  startTime: number | null;
  locations: LocationPoint[];
  metrics: RunningMetrics;
  type: 'time' | 'distance';
  objective: number;
  title: string;
  intervalId?: NodeJS.Timeout;
}

interface RunningSessionStore {
  session: RunningSession;
  userSessions: RunningSession[];
  isLoading: boolean;
  startSession: (type: 'time' | 'distance', objective: number) => Promise<void>;
  stopSession: () => void;
  pauseSession: () => void;
  resumeSession: () => void;
  updateLocation: (location: Location.LocationObject) => void;
  resetSession: () => void;
  saveSession: (authToken: string, userId: number) => Promise<void>;
  fetchUserSessions: (authToken: string, userId: number) => Promise<void>;
  updateSessionTitle: (newTitle: string, authToken: string) => Promise<void>;
  updateMetrics: () => void;
}

const initialMetrics: RunningMetrics = {
  distance: 0,
  pace: 0,
  steps: 0,
  calories: 0,
  time: 0,
};

const initialSession: RunningSession = {
  isActive: false,
  startTime: null,
  locations: [],
  metrics: initialMetrics,
  type: 'time',
  objective: 0,
  title: '',
};

export const useRunningSessionStore = create<RunningSessionStore>((set, get) => ({
  session: initialSession,
  userSessions: [],
  isLoading: false,

  startSession: async (type, objective) => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Permission to access location was denied');
    }

    const date = new Date();
    const formattedDate = format(date, "dd/MM/yyyy 'à' HH:mm", { locale: fr });

    set(state => ({
      session: {
        ...state.session,
        isActive: true,
        startTime: Date.now(),
        type,
        objective,
        locations: [],
        metrics: initialMetrics,
        title: `Session du ${formattedDate}`,
      },
    }));

    // Démarrer la mise à jour des métriques
    const intervalId = setInterval(() => {
      get().updateMetrics();
    }, 1000);

    set(state => ({
      session: {
        ...state.session,
        intervalId,
      },
    }));
  },

  stopSession: () => {
    const { session } = get();
    if (session.intervalId) {
      clearInterval(session.intervalId);
    }
    set(state => ({
      session: {
        ...state.session,
        isActive: false,
        intervalId: undefined,
      },
    }));
  },

  updateMetrics: () => {
    const { session } = get();
    if (!session.isActive || !session.startTime) return;

    const currentTime = Date.now() - session.startTime;
    const newMetrics = {
      ...session.metrics,
      time: currentTime,
      pace: calculatePace(session.metrics.distance, currentTime),
    };

    set(state => ({
      session: {
        ...state.session,
        metrics: newMetrics,
      },
    }));
  },

  updateLocation: location => {
    const { session } = get();
    if (!session.isActive) return;

    const newLocation: LocationPoint = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      timestamp: Date.now(),
    };

    // Calculer la distance depuis le dernier point
    let distanceIncrement = 0;
    if (session.locations.length > 0) {
      const lastLocation = session.locations[session.locations.length - 1];
      distanceIncrement = calculateDistance(
        lastLocation.latitude,
        lastLocation.longitude,
        newLocation.latitude,
        newLocation.longitude
      );
    }

    // Mettre à jour les métriques
    const newMetrics = {
      ...session.metrics,
      distance: session.metrics.distance + distanceIncrement,
      time: Date.now() - (session.startTime || Date.now()),
      pace: calculatePace(
        session.metrics.distance + distanceIncrement,
        Date.now() - (session.startTime || Date.now())
      ),
    };

    set(state => ({
      session: {
        ...state.session,
        locations: [...state.session.locations, newLocation],
        metrics: newMetrics,
      },
    }));

    // Log toutes les 10 positions pour éviter de surcharger la console
    if (session.locations.length % 10 === 0) {
      console.log('📍 Location update:', {
        totalDistance: newMetrics.distance,
        currentPace: newMetrics.pace,
        time: newMetrics.time,
      });
    }
  },

  resetSession: () => {
    set({ session: initialSession });
  },

  saveSession: async (authToken: string, userId: number) => {
    const { session } = get();
    if (!session) {
      return;
    }

    const payload = {
      session_type: session.type,
      user_id: userId,
      title: session.title,
      distance: session.metrics.distance,
      calories: session.metrics.calories,
      allure: session.metrics.pace,
      time: session.metrics.time,
      tps: session.locations,
      time_objective: session.type === 'time' ? session.objective : 0,
      distance_objective: session.type === 'distance' ? session.objective : 0,
      run_id: 1,
    };

    try {
      const response = await fetch('https://node.floway.edgar-lecomte.fr/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(`Failed to save session: ${responseData?.message || 'Unknown error'}`);
      }

      if (!responseData.data?.insertedId) {
        throw new Error('No session ID received from server');
      }

      set(state => ({
        session: {
          ...state.session,
          id: responseData.data.insertedId,
        },
      }));
    } catch (error) {
      throw error;
    }
  },

  fetchUserSessions: async (authToken: string, userId: number) => {
    set({ isLoading: true });
    try {
      const fromDate = format(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
      const toDate = format(new Date(), 'yyyy-MM-dd');

      const url = new URL(`https://node.floway.edgar-lecomte.fr/session/user/${userId}`);
      url.searchParams.append('from', fromDate);
      url.searchParams.append('to', toDate);

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch sessions');
      }

      const data = await response.json();
      set({ userSessions: data });
    } catch (error) {
      set({ userSessions: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  updateSessionTitle: async (newTitle: string, authToken: string) => {
    const { session } = get();
    if (!session?.id) {
      return;
    }

    try {
      const response = await fetch(`https://node.floway.edgar-lecomte.fr/session/${session.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ title: newTitle }),
      });

      if (!response.ok) {
        throw new Error('Failed to update session title');
      }

      set(state => ({
        session: {
          ...state.session,
          title: newTitle,
        },
      }));
    } catch (error) {
      throw error;
    }
  },

  pauseSession: () => {
    const { session } = get();
    if (session.intervalId) {
      clearInterval(session.intervalId);
    }
    set(state => ({
      session: {
        ...state.session,
        intervalId: undefined,
      },
    }));
  },

  resumeSession: () => {
    const { session } = get();
    if (!session.isActive || session.intervalId) return;

    // Redémarrer la mise à jour des métriques
    const intervalId = setInterval(() => {
      get().updateMetrics();
    }, 1000);

    set(state => ({
      session: {
        ...state.session,
        intervalId,
      },
    }));
  },
}));
