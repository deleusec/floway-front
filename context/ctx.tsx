import { useContext, createContext, type PropsWithChildren } from 'react';
import { useStorageState } from "@/hooks/useStorageState";

const AuthContext = createContext<{
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  session?: string | null;
  isLoading: boolean;
}>({
  signIn: async () => {},
  signOut: () => null,
  register: async () => {},
  session: null,
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
        isLoading,
      }}>
      {children}
    </AuthContext.Provider>
  );
}
