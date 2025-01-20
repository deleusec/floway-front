import { createContext, useContext, useState } from 'react';
import { SessionData } from '@/constants/SessionData';

interface SessionContextType {
  sessionData: SessionData | null;
  setSessionData: (data: SessionData | null) => void;
  updateSessionTarget: (target: SessionData['target']) => void;
  updateGuidedRun: (guidedRun: SessionData['guidedRun']) => void;
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
