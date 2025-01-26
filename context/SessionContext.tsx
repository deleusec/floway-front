import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import * as Location from 'expo-location';
import {
  SessionData,
  SessionType,
  SessionContextType,
  LocationData,
} from '@/constants/SessionData';

// Context creation
const SessionContext = createContext<SessionContextType | undefined>(undefined);

// Provider Component
export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const locationSubscription = useRef<Location.LocationSubscription | null>(null);

  const initializeSession = useCallback(
    (
      type: SessionType,
      objective?: { type: 'time' | 'distance'; value: number },
      runId?: number,
    ) => {
      const newSession: SessionData = {
        type,
        status: 'ready',
        currentMetrics: {
          time: {
            hours: '00',
            minutes: '00',
            seconds: '00',
            totalSeconds: 0,
          },
          distance: 0,
          pace: '0\'00"',
          calories: 0,
        },
        locations: [],
        objective,
        runId,
      };
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
      // Prepare data for backend
      const sessionPayload = {
        session_type: sessionData.type,
        user_id: 1, // Should come from auth context
        title: `Session ${new Date().toLocaleDateString()}`,
        distance: sessionData.currentMetrics.distance,
        calories: sessionData.currentMetrics.calories,
        allure: parseFloat(sessionData.currentMetrics.pace.replace("'", '.')),
        time: sessionData.currentMetrics.time.totalSeconds,
        tps: sessionData.locations.map((loc) => [loc.latitude, loc.longitude, loc.timestamp]),
        ...(sessionData.objective?.type === 'time' && {
          time_objective: sessionData.objective.value,
        }),
        ...(sessionData.objective?.type === 'distance' && {
          distance_objective: sessionData.objective.value,
        }),
        ...(sessionData.runId && { run_id: sessionData.runId }),
      };

      // Here you would typically send the data to your backend
      // await api.post('/sessions', sessionPayload);

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
