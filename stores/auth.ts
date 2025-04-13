import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useStorageState } from '@/hooks/useStorageState';

type UserInfo = {
  email: string;
  firstName: string;
  lastName: string;
  id: number;
  picturePath: string | null;
};

type AuthStore = {
    authToken: string | null;
    user: UserInfo | null;
    isLoading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => void;
    register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
    fetchUserInfo: () => Promise<void>;
};

export const useAuthStore = create<AuthStore>()(
    persist(
      (set, get) => ({
        authToken: null,
        user: null,
        isLoading: false,

        signIn: async (email, password) => {
          try {
            set({ isLoading: true });
            const res = await fetch('https://api.floway.edgar-lecomte.fr/api/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password }),
            });

            if (!res.ok) throw new Error('Invalid credentials');
            const { token } = await res.json();
            set({ authToken: token });

            await get().fetchUserInfo();
          } catch (err) {
            console.error('Login error:', err);
            throw err;
          } finally {
            set({ isLoading: false });
          }
        },

        signOut: () => {
          set({ authToken: null, user: null });
        },

        register: async (email, password, firstName, lastName) => {
          try {
            const res = await fetch('https://api.floway.edgar-lecomte.fr/api/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email,
                password,
                first_name: firstName,
                last_name: lastName,
              }),
            });

            if (!res.ok) throw new Error('Registration failed');
          } catch (err) {
            console.error('Registration error:', err);
            throw err;
          }
        },

        fetchUserInfo: async () => {
          const token = get().authToken;
          if (!token) return;

          try {
            const res = await fetch('https://api.floway.edgar-lecomte.fr/api/user/me', {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });

            if (!res.ok) throw new Error('Failed to fetch user info');
            const data = await res.json();
            set({ user: data });
          } catch (err) {
            console.error('Error fetching user info:', err);
            set({ user: null });
          }
        },
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          authToken: state.authToken,
          user: state.user,
        }),
      },
    ),
  );
