import { create } from 'zustand';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

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
  isPaused: boolean;
  startTime: number | null;
  locations: LocationPoint[];
  metrics: RunningMetrics;
  type: 'time' | 'distance' | 'free'; // Ajout du type 'free'
  objective: number;
  title: string;
}

interface SessionStore {
  session: RunningSession;
  userSessions: RunningSession[];
  isLoading: boolean;

  // Actions simples
  startSession: (type: 'time' | 'distance' | 'free', objective: number) => void;
  stopSession: () => void;
  pauseSession: () => void;
  resumeSession: () => void;
  updateMetrics: (metrics: RunningMetrics) => void;
  updateLocation: (location: LocationPoint) => void;
  saveSession: (authToken: string, userId: number) => Promise<void>;
  fetchUserSessions: (authToken: string, userId: number) => Promise<void>;
  updateSessionTitle: (newTitle: string, authToken: string) => Promise<void>;
  resetSession: () => void;
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
  isPaused: false,
  startTime: null,
  locations: [],
  metrics: initialMetrics,
  type: 'time',
  objective: 0,
  title: '',
};

export const useRunningSessionStore = create<SessionStore>((set, get) => ({
  session: initialSession,
  userSessions: [],
  isLoading: false,

  startSession: (type, objective) => {
    const date = new Date();
    const formattedDate = format(date, "dd/MM/yyyy 'à' HH:mm", { locale: fr });

    set(state => ({
      session: {
        ...state.session,
        isActive: true,
        isPaused: false,
        startTime: Date.now(),
        type,
        objective,
        locations: [],
        metrics: initialMetrics,
        title: `Session du ${formattedDate}`,
      },
    }));
  },

  stopSession: () => {
    set(state => ({
      session: {
        ...state.session,
        isActive: false,
        isPaused: false,
      },
    }));
  },

  pauseSession: () => {
    set(state => ({
      session: {
        ...state.session,
        isPaused: true,
      },
    }));
  },

  resumeSession: () => {
    set(state => ({
      session: {
        ...state.session,
        isPaused: false,
      },
    }));
  },

  updateMetrics: metrics => {
    set(state => ({
      session: {
        ...state.session,
        metrics,
      },
    }));
  },

  updateLocation: location => {
    set(state => ({
      session: {
        ...state.session,
        locations: [...state.session.locations, location],
      },
    }));
  },

  resetSession: () => {
    set({ session: initialSession });
  },

  saveSession: async (authToken: string, userId: number) => {
    const { session } = get();
    if (!session) {
      return;
    }

    // Pour les courses libres, on sauvegarde comme 'time' avec objectif 0
    const sessionTypeForAPI = session.type === 'free' ? 'time' : session.type;
    const objectiveForAPI = session.type === 'free' ? 0 : session.objective;

    const payload = {
      session_type: sessionTypeForAPI,
      user_id: userId,
      title: session.title,
      distance: session.metrics.distance,
      calories: session.metrics.calories,
      allure: session.metrics.pace,
      time: session.metrics.time,
      tps: session.locations,
      time_objective: sessionTypeForAPI === 'time' ? objectiveForAPI : 0,
      distance_objective: sessionTypeForAPI === 'distance' ? objectiveForAPI : 0,
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
}));
