import { create } from 'zustand';
import { API_URL, NODE_URL } from '@/constants/env';

interface Session {
  _id: string;
  id: string;
  reference_day: string;
  session_type: string;
  user_id: number;
  title: string;
  distance: number;
  calories: number;
  allure: number;
  time: number;
  tps: [number, number, number][];
  time_objective: number | null;
  distance_objective: number | null;
  run_id: number;
}

interface UserStore {
  sessions: Session[];
  isLoadingSessions: boolean;
  error: string | null;
  fetchUserSessions: (userId: number, token: string) => Promise<void>;
  addSession: (session: Session) => void;
  clearSessions: () => void;
}

export const useUserStore = create<UserStore>((set, get) => ({
  sessions: [],
  isLoadingSessions: false,
  error: null,

  fetchUserSessions: async (userId: number, token: string) => {
    set({ isLoadingSessions: true, error: null });

    try {
      const response = await fetch(`${NODE_URL}/session/user/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.log('❌ Response not OK, error text:', errorText);
        throw new Error(`Failed to fetch sessions: ${response.status} - ${errorText}`);
      }

      const sessions: Session[] = await response.json();

      const sortedSessions = sessions.sort((a, b) =>
        new Date(b.reference_day).getTime() - new Date(a.reference_day).getTime()
      );

      set({ sessions: sortedSessions, isLoadingSessions: false });

    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch sessions',
        isLoadingSessions: false
      });
    }
  },

  addSession: (session: Session) => {
    const { sessions } = get();
    const updatedSessions = [session, ...sessions].sort((a, b) =>
      new Date(b.reference_day).getTime() - new Date(a.reference_day).getTime()
    );
    set({ sessions: updatedSessions });
  },

  clearSessions: () => {
    set({ sessions: [], error: null });
  },
}));

