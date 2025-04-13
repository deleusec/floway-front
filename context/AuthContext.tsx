import { useContext, createContext, type PropsWithChildren, useState, useEffect } from 'react';
import { useStorageState } from '@/hooks/useStorageState';

type UserInfo = {
  email: string;
  firstName: string;
  lastName: string;
  id: number;
  picturePath: string | null;
};

const AuthContext = createContext<{
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  authToken?: string | null;
  user: UserInfo | null;
  isLoading: boolean;
}>({
  signIn: async () => {},
  signOut: () => null,
  register: async () => {},
  authToken: null,
  user: null,
  isLoading: false,
});

export function useAuth() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useAuth must be wrapped in a <AuthProvider />');
    }
  }
  return value;
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [[isLoading, authToken], setAuthToken] = useStorageState('authToken');
  const [user, setUser] = useState<UserInfo | null>(null);

  const fetchUserInfo = async (token: string) => {
    try {
      const response = await fetch('https://api.floway.edgar-lecomte.fr/api/user/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user info');
      }

      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  useEffect(() => {
    if (authToken) {
      fetchUserInfo(authToken);
    } else {
      setUser(null);
    }
  }, [authToken]);

  return (
    <AuthContext.Provider
      value={{
        signIn: async (email, password) => {
          try {
            const response = await fetch('https://api.floway.edgar-lecomte.fr/api/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password }),
            });
            if (!response.ok) {
              throw new Error('Invalid credentials');
            }
            const { token } = await response.json();
            setAuthToken(token);
          } catch (error) {
            console.error('Login error:', error);
            throw error;
          }
        },
        signOut: () => {
          setAuthToken(null);
          setUser(null);
        },
        register: async (email, password, firstName, lastName) => {
          try {
            const response = await fetch('https://api.floway.edgar-lecomte.fr/api/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password, first_name: firstName, last_name: lastName }),
            });
            if (!response.ok) {
              throw new Error('Registration failed');
            }
          } catch (error) {
            console.error('Registration error:', error);
            throw error;
          }
        },
        authToken,
        user,
        isLoading,
      }}>
      {children}
    </AuthContext.Provider>
  );
}
