import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '@/constants/env';

type User = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  alias: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: {
    email: string;
    password: string;
    username: string;
    first_name: string;
    last_name: string;
  }) => Promise<boolean>;
  logout: () => void;
  restoreSession: () => Promise<void>;
  getUserAndTokenFromStorage: () => Promise<{ user: User | null; token: string | null }>;
  setUser: (user: User) => void;
};

export const useAuth = create<AuthState>(set => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,

  getUserAndTokenFromStorage: async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      const userStr = await SecureStore.getItemAsync('user');
      const user = userStr ? JSON.parse(userStr) : null;
      return { user, token };
    } catch (error) {
      console.error('Error getting user and token from storage:', error);
      return { user: null, token: null };
    }
  },

  login: async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) return false;

      console.log('response', response);
      const { token } = await response.json();

      await SecureStore.setItemAsync('token', token);

      const userResponse = await fetch(`${API_URL}/api/user/me`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!userResponse.ok) return false;

      const user = await userResponse.json();
      await SecureStore.setItemAsync('user', JSON.stringify(user));

      set({ token, user, isAuthenticated: true });
      return true;
    } catch (err) {
      console.error('Login error:', err);
      return false;
    }
  },

  register: async ({ email, password, username, first_name, last_name }) => {
    try {
      const response = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, username, first_name, last_name }),
      });

      return response.status === 201;
    } catch (err) {
      console.error('Register error:', err);
      return false;
    }
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('user');
    set({ user: null, token: null, isAuthenticated: false });
  },

  restoreSession: async () => {
    set({ isLoading: true });

    const token = await SecureStore.getItemAsync('token');

    if (!token) {
      set({ isLoading: false, isAuthenticated: false });
      return;
    }

    try {
      const userResponse = await fetch(`${API_URL}/api/user/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!userResponse.ok) throw new Error('Unauthorized');

      const user = await userResponse.json();
      await SecureStore.setItemAsync('user', JSON.stringify(user));

      set({ token, user, isAuthenticated: true });
    } catch (err) {
      console.error('Session restore failed:', err);
      await SecureStore.deleteItemAsync('token');
      await SecureStore.deleteItemAsync('user');
      set({ token: null, user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },

  setUser: (user) => {
    set({ user });
    SecureStore.setItemAsync('user', JSON.stringify(user));
  },
}));
