import React, { createContext, useContext, useState, useCallback, useRef, useMemo } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import * as Location from 'expo-location';
import {
  SessionData,
  SessionType,
  SessionContextType,
  LocationData,
  Session,
  RunData,
} from '@/constants/SessionData';
import { useAuth } from '@/context/AuthContext';
import { formatDate, getLastWeekDate } from '@/utils/timeUtils';

// Context creation
const SessionContext = createContext<SessionContextType | undefined>(undefined);

// Provider Component
export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const locationSubscription = useRef<Location.LocationSubscription | null>(null);
  const [userSessions, setUserSessions] = useState<Session[]>([]);
  const { user, authToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const weeklyStats = useMemo(
    () => ({
      totalDistance: userSessions.reduce((sum, session) => sum + (session.distance || 0), 0),
      totalCalories: userSessions.reduce((sum, session) => sum + (session.calories || 0), 0),
      sessionCount: userSessions.length,
    }),
    [userSessions]
  );

  const fetchUserSessions = useCallback(async (userId: number, token: string) => {
    setIsLoading(true);
    try {
      const fromDate = formatDate(getLastWeekDate());
      const toDate = formatDate(new Date());

      const url = new URL(`https://node.floway.edgar-lecomte.fr/session/user/${userId}`);
      url.searchParams.append('from', fromDate);
      url.searchParams.append('to', toDate);

      const response = await fetch(url.toString(), {
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
    } finally {
      setIsLoading(false);
    }
  }, []);

  const initializeSession = useCallback((type: SessionType, objective?: number, run?: RunData) => {
    const date = new Date();
    const formattedDate = format(date, "dd/MM/yyyy 'à' HH:mm", { locale: fr });

    const newSession: SessionData = {
      type,
      id: '',
      title: `Session du ${formattedDate}`,
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
  }, []);

  const startSession = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Location permission denied');
      }

      setSessionData(prev => {
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
        updateLocation
      );
    } catch (error) {
      console.error('Error starting session:', error);
      throw error;
    }
  }, []);

  const stopLocationTracking = useCallback(() => {
    if (locationSubscription.current) {
      locationSubscription.current.remove();
    }
  }, []);

  const saveSession = useCallback(async () => {
    if (!sessionData || !user || !authToken) return;

    const payload = {
      session_type: sessionData.type,
      user_id: user.id,
      title: sessionData.title,
      distance: sessionData?.metrics?.distance || 0,
      calories: sessionData?.metrics?.calories || 0,
      allure: sessionData?.metrics?.pace || 0,
      time: sessionData?.time || 0,
      tps: [sessionData?.locations || { latitude: 0, longitude: 0, timestamp: 0 }],
      time_objective: sessionData?.time_objective || 0,
      distance_objective: sessionData?.distance_objective || 0,
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
      if (!response.ok) throw new Error(`Failed to save session: ${responseData?.message}`);

      setSessionData(prev => {
        if (!prev) return null;
        return {
          ...prev,
          id: responseData.data.insertedId,
        };
      });
    } catch (error) {
      console.error('Error details:', error);
      throw error;
    }
  }, [sessionData, user, authToken]);

  const updateSessionTitle = useCallback(
    async (newTitle: string) => {
      if (!sessionData?.id || !authToken) return;

      try {
        const response = await fetch(
          `https://node.floway.edgar-lecomte.fr/session/${sessionData.id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({ title: newTitle }),
          }
        );

        if (!response.ok) throw new Error('Failed to update session title');

        setSessionData(prev => {
          if (!prev) return null;
          return {
            ...prev,
            title: newTitle,
          };
        });
      } catch (error) {
        console.error('Error updating session title:', error);
        throw error;
      }
    },
    [sessionData?.id, authToken]
  );

  const updateLocation = useCallback((location: Location.LocationObject) => {
    setSessionData(prev => {
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
        saveSession,
        updateLocation,
        stopLocationTracking,
        clearSession,
        userSessions,
        fetchUserSessions,
        weeklyStats,
        updateSessionTitle,
        isLoading,
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
