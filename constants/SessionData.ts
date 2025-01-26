// constants/SessionData.ts
import type { LocationObject } from 'expo-location';

export interface LocationData {
  latitude: number;
  longitude: number;
  timestamp: number;
}

export type SessionType = 'free' | 'time' | 'distance' | 'run';

export interface SessionData {
  type: SessionType;
  time: number;
  metrics: {
    distance: number;
    pace: number;
    calories: number;
  };
  locations: LocationData[];
  time_objective?: number;
  distance_objective?: number;
  runId?: number;
}

export interface SessionContextType {
  sessionData: SessionData | null;
  setSessionData: (data: SessionData | null) => void;
  initializeSession: (
    type: SessionType,
    objective?: number,
    runId?: number,
  ) => void;
  startSession: () => Promise<void>;
  pauseSession: () => void;
  resumeSession: () => void;
  stopSession: () => Promise<void>;
  updateLocation: (location: LocationObject) => void;
  clearSession: () => void;
}

export interface SessionPayload {
  session_type: SessionType;
  user_id: number;
  title: string;
  distance: number;
  calories: number;
  allure: number;
  time: number;
  tps: [number, number, number][];
  time_objective?: number;
  distance_objective?: number;
  run_id?: number;
}
