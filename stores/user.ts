import { create } from 'zustand';
import { API_URL, NODE_URL } from '@/constants/env';
import { useAuth } from "@/stores/auth";

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
  last_tps_unix: number;
}

interface UpdateProfileData {
  firstName: string;
  lastName: string;
  alias: string;
}

interface UserStore {
  sessions: Session[];
  isLoadingSessions: boolean;
  isUpdatingProfile: boolean;
  error: string | null;
  fetchUserSessions: (userId: number, token: string) => Promise<void>;
  updateProfile: (profileData: UpdateProfileData, imageUri: string | null, token: string) => Promise<boolean>;
  addSession: (session: Session) => void;
  clearSessions: () => void;
}

export const useUserStore = create<UserStore>((set, get) => ({
  sessions: [],
  isLoadingSessions: false,
  isUpdatingProfile: false,
  error: null,

  fetchUserSessions: async (userId: number, token: string) => {
    set({ isLoadingSessions: true, error: null });

    try {
      const response = await fetch(`${NODE_URL}/auth/session/user/${userId}`, {
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

  updateProfile: async (profileData: UpdateProfileData, imageUri: string | null, token: string) => {
    set({ isUpdatingProfile: true, error: null });

    try {
      const formData = new FormData();

      formData.append('payload', JSON.stringify(profileData));

      if (imageUri) {
        const imageExtension = imageUri.split('.').pop()?.toLowerCase() || 'jpg';
        const mimeType = `image/${imageExtension === 'jpg' ? 'jpeg' : imageExtension}`;

        formData.append('picture', {
          uri: imageUri,
          type: mimeType,
          name: `profile_picture.${imageExtension}`,
        } as any);
      }

      const response = await fetch(`${API_URL}/api/user`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.log('❌ Update profile failed, error text:', errorText);
        throw new Error(`Failed to update profile: ${response.status} - ${errorText}`);
      }

      const updatedUser = await response.json();

      const setAuthUser = useAuth.getState().setUser;
      setAuthUser(updatedUser);

      set({ isUpdatingProfile: false });
      return true;

    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update profile',
        isUpdatingProfile: false
      });
      return false;
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
