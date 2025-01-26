import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import * as Location from 'expo-location';
import {
  SessionData,
  SessionType,
  SessionContextType,
  LocationData,
  Session,
  RunData
} from '@/constants/SessionData';

// Context creation
const SessionContext = createContext<SessionContextType | undefined>(undefined);

// Provider Component
export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const locationSubscription = useRef<Location.LocationSubscription | null>(null);
  const [userSessions, setUserSessions] = useState<Session[]>([]);

  const fetchUserSessions = useCallback(async (userId: number, token: string) => {
    try {
      const response = await fetch(`https://node.floway.edgar-lecomte.fr/session/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch sessions');
      const data = await response.json();
      setUserSessions(data);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setUserSessions([]);
    }
  }, []);

  const initializeSession = useCallback(
    (
      type: SessionType,
      objective?: number,
      run?: RunData,
    ) => {
      const newSession: SessionData = {
        type,
        time: 0,
        metrics: {
          distance: 0.0,
          pace: 0.0,
          calories: 0,
        },
        locations: [],
        run: run || null,
      };

      if (type === 'time') {
        newSession.time_objective = objective;
      } else if (type === 'distance') {
        newSession.distance_objective = objective;
      }

      setSessionData(newSession);
    },
    [],
  );

  const startSession = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Location permission denied');
      }

      setSessionData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          status: 'running',
          startTime: Date.now(),
        };
      });

      // Start location tracking
      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 1000,
          distanceInterval: 5,
        },
        updateLocation,
      );
    } catch (error) {
      console.error('Error starting session:', error);
      throw error;
    }
  }, []);

  const pauseSession = useCallback(() => {
    setSessionData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        status: 'paused',
      };
    });

    if (locationSubscription.current) {
      locationSubscription.current.remove();
    }
  }, []);

  const resumeSession = useCallback(() => {
    setSessionData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        status: 'running',
      };
    });
  }, []);

  const stopSession = useCallback(async () => {
    if (!sessionData) return;

    try {
      // TODO: Save session data to API

      clearSession();
    } catch (error) {
      console.error('Failed to stop session:', error);
      throw error;
    }
  }, [sessionData]);

  const updateLocation = useCallback((location: Location.LocationObject) => {
    setSessionData((prev) => {
      if (!prev) return null;
      const newLocation: LocationData = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        timestamp: location.timestamp,
      };
      return {
        ...prev,
        locations: [...prev.locations, newLocation],
      };
    });
  }, []);

  const clearSession = useCallback(() => {
    if (locationSubscription.current) {
      locationSubscription.current.remove();
    }
    setSessionData(null);
  }, []);

  return (
    <SessionContext.Provider
      value={{
        sessionData,
        setSessionData,
        initializeSession,
        startSession,
        pauseSession,
        resumeSession,
        stopSession,
        updateLocation,
        clearSession,
        userSessions,
        fetchUserSessions,
      }}>
      {children}
    </SessionContext.Provider>
  );
};

// Hook for using the session context
export const useSessionContext = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSessionContext must be used within a SessionProvider');
  }
  return context;
};
