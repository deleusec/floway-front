import { useContext, createContext, type PropsWithChildren, useState, useEffect } from 'react';
import { useStorageState } from "@/hooks/useStorageState";

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
  session?: string | null;
  user: UserInfo | null;
  isLoading: boolean;
}>({
  signIn: async () => {},
  signOut: () => null,
  register: async () => {},
  session: null,
  user: null,
  isLoading: false,
});

export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />');
    }
  }
  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState('session');
  const [user, setUser] = useState<UserInfo | null>(null);

  const fetchUserInfo = async (token: string) => {
    try {
      const response = await fetch('https://api.floway.edgar-lecomte.fr/api/user/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
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
    if (session) {
      fetchUserInfo(session);
    } else {
      setUser(null);
    }
  }, [session]);

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
            setSession(token);
          } catch (error) {
            console.error('Login error:', error);
            throw error;
          }
        },
        signOut: () => {
          setSession(null);
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
        session,
        user,
        isLoading,
      }}>
      {children}
    </AuthContext.Provider>
  );
}