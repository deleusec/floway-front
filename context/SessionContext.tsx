import { createContext, useContext, useState, useCallback } from 'react';
import { SessionData, Coordinates, SessionSummary } from '@/constants/SessionData';
import * as Location from 'expo-location';

interface SessionContextType {
  sessionData: SessionData | null;
  setSessionData: (data: SessionData | null) => void;
  updateSessionTarget: (target: SessionData['target']) => void;
  updateGuidedRun: (guidedRun: SessionData['guidedRun']) => void;
  startSession: () => Promise<void>;
  pauseSession: () => void;
  resumeSession: () => void;
  stopSession: () => Promise<void>;
  updateCurrentMetrics: (metrics: Partial<SessionData['currentMetrics']>) => void;
  clearSession: () => void;
  updateLocation: (location: Location.LocationObject) => void;
}

const getValidDate = (timestamp: number | undefined): string => {
  if (!timestamp) {
    return new Date().toISOString();
  }

  // Handle potential invalid timestamps
  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      return new Date().toISOString();
    }
    return date.toISOString();
  } catch {
    return new Date().toISOString();
  }
};


const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [locationSubscription, setLocationSubscription] =
    useState<Location.LocationSubscription | null>(null);

 const updateSessionTarget = useCallback((target: SessionData['target']) => {
   setSessionData((prev) => {
     if (!prev) {
       const newSession: SessionData = {
         id: generateSessionId(),
         type: 'target',
         target,
         status: 'ready',
         startTime: Date.now(),
         totalPauseTime: 0,
         locations: [],
         currentMetrics: {
           time: { hours: '00', minutes: '00', seconds: '00' },
           distance: '0,00',
           pace: '0\'00"',
           calories: '0',
         },
       };
       return newSession;
     }
     return { ...prev, target };
   });
 }, []);

 const updateGuidedRun = useCallback((guidedRun: SessionData['guidedRun']) => {
   setSessionData((prev) => {
     if (!prev) {
       const newSession: SessionData = {
         id: generateSessionId(),
         type: 'guided',
         guidedRun,
         status: 'ready',
         startTime: Date.now(),
         totalPauseTime: 0,
         locations: [],
         currentMetrics: {
           time: { hours: '00', minutes: '00', seconds: '00' },
           distance: '0,00',
           pace: '0\'00"',
           calories: '0',
         },
       };
       return newSession;
     }
     return { ...prev, guidedRun };
   });
 }, []);

 const updateCurrentMetrics = useCallback((metrics: Partial<SessionData['currentMetrics']>) => {
   setSessionData((prev) => {
     if (!prev) return null;
     return {
       ...prev,
       currentMetrics: {
         ...prev.currentMetrics,
         ...metrics,
       },
     };
   });
 }, []);
    
  const updateLocation = useCallback((location: Location.LocationObject) => {
    const newCoordinates: Coordinates = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      timestamp: location.timestamp,
      altitude: location.coords.altitude || undefined,
      accuracy: location.coords.accuracy || undefined,
      speed: location.coords.speed || undefined,
    };

    setSessionData((prev) => {
      if (!prev) return null;

      const locations = [...(prev.locations || []), newCoordinates];
      let bounds = prev.bounds;

      // Update bounds
      if (locations.length > 0) {
        const latitudes = locations.map((loc) => loc.latitude);
        const longitudes = locations.map((loc) => loc.longitude);

        bounds = {
          northEast: {
            latitude: Math.max(...latitudes),
            longitude: Math.max(...longitudes),
            timestamp: Date.now(),
          },
          southWest: {
            latitude: Math.min(...latitudes),
            longitude: Math.min(...longitudes),
            timestamp: Date.now(),
          },
        };
      }

      // Calculate real-time metrics
      const currentMetrics = calculateMetrics(prev.currentMetrics, newCoordinates, locations);

      return {
        ...prev,
        currentLocation: newCoordinates,
        locations,
        bounds,
        currentMetrics,
      };
    });
  }, []);

  const startSession = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Location permission not granted');
    }

    const locationSubscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 1000,
        distanceInterval: 5,
      },
      updateLocation,
    );

    setLocationSubscription(locationSubscription);

    setSessionData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        id: generateSessionId(),
        status: 'running',
        startTime: Date.now(),
        totalPauseTime: 0,
        locations: [],
        currentMetrics: {
          time: { hours: '00', minutes: '00', seconds: '00' },
          distance: '0,00',
          pace: '0\'00"',
          calories: '0',
          currentSpeed: 0,
          instantPace: '0\'00"',
        },
      };
    });
  };

  const pauseSession = useCallback(() => {
    if (locationSubscription) {
      locationSubscription.remove();
      setLocationSubscription(null);
    }

    setSessionData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        status: 'paused',
        pauseTime: Date.now(),
      };
    });
  }, [locationSubscription]);

  const resumeSession = async () => {
    await startSession();

    setSessionData((prev) => {
      if (!prev) return null;
      const additionalPauseTime = prev.pauseTime ? Date.now() - prev.pauseTime : 0;
      return {
        ...prev,
        status: 'running',
        totalPauseTime: prev.totalPauseTime + additionalPauseTime,
        pauseTime: undefined,
      };
    });
  };

  const stopSession = async () => {
    if (locationSubscription) {
      locationSubscription.remove();
      setLocationSubscription(null);
    }

    setSessionData((prev) => {
      if (!prev) return null;

      const summary: SessionSummary = {
        startDate: getValidDate(prev.startTime),
        endDate: new Date().toISOString(),
        totalDistance: parseFloat(prev.currentMetrics.distance),
        averagePace: prev.currentMetrics.pace,
        totalCalories: parseInt(prev.currentMetrics.calories),
        totalSteps: prev.currentMetrics.steps,
        averageHeartRate: prev.currentMetrics.heartRate,
      };

      return {
        ...prev,
        status: 'completed',
        endTime: Date.now(),
        summary,
      };
    });
  };

  const clearSession = useCallback(() => {
    if (locationSubscription) {
      locationSubscription.remove();
      setLocationSubscription(null);
    }
    setSessionData(null);
  }, [locationSubscription]);

  return (
    <SessionContext.Provider
      value={{
        sessionData,
        setSessionData,
        updateSessionTarget,
        updateGuidedRun,
        startSession,
        pauseSession,
        resumeSession,
        stopSession,
        updateCurrentMetrics,
        clearSession,
        updateLocation,
      }}>
      {children}
    </SessionContext.Provider>
  );
};

// Helper functions
const generateSessionId = () => {
  return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const calculateMetrics = (
  currentMetrics: SessionData['currentMetrics'],
  newLocation: Coordinates,
  locations: Coordinates[],
) => {
  // Implement metrics calculation logic here
  // This would include distance, pace, calories calculations
  return currentMetrics;
};

export const useSessionContext = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSessionContext must be used within a SessionProvider');
  }
  return context;
};
