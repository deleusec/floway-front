import { createContext, useContext, useState } from 'react';
import { SessionData } from '@/constants/SessionData';

interface SessionContextType {
  sessionData: SessionData | null;
  setSessionData: (data: SessionData | null) => void;
  updateSessionTarget: (target: SessionData['target']) => void;
  updateGuidedRun: (guidedRun: SessionData['guidedRun']) => void;
  startSession: () => void;
  pauseSession: () => void;
  resumeSession: () => void;
  stopSession: () => void;
  updateCurrentMetrics: (metrics: SessionData['currentMetrics']) => void;
  clearSession: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [sessionData, setSessionData] = useState<SessionData | null>(null);

  const updateSessionTarget = (target: SessionData['target']) => {
    setSessionData((prev) => (prev ? { ...prev, target } : { type: 'target', target }));
  };

  const updateGuidedRun = (guidedRun: SessionData['guidedRun']) => {
    setSessionData((prev) => (prev ? { ...prev, guidedRun } : { type: 'guided', guidedRun }));
  };

  const updateCurrentMetrics = (metrics: SessionData['currentMetrics']) => {
    setSessionData((prev) => (prev ? { ...prev, currentMetrics: metrics } : null));
  };

  const startSession = () => {
    setSessionData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        status: 'running',
        startTime: Date.now(),
        currentMetrics: {
          time: { hours: '00', minutes: '00', seconds: '00' },
          distance: '0,00',
          pace: '0\'00"',
          calories: '0',
        },
      };
    });
  };

  const pauseSession = () => {
    setSessionData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        status: 'paused',
        pauseTime: Date.now(),
      };
    });
  };

  const resumeSession = () => {
    setSessionData((prev) => {
      if (!prev) return null;
      const additionalPauseTime = prev.pauseTime ? Date.now() - prev.pauseTime : 0;
      return {
        ...prev,
        status: 'running',
        totalPauseTime: (prev.totalPauseTime || 0) + additionalPauseTime,
        pauseTime: undefined,
      };
    });
  };

  const stopSession = () => {
    setSessionData((prev) => (prev ? { ...prev, status: 'completed' } : null));
  };

  const clearSession = () => {
    setSessionData(null);
  };

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
      }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSessionContext = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSessionContext must be used within a SessionProvider');
  }
  return context;
};
