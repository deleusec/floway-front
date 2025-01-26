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
  startTime?: number;
  status: 'ready' | 'running' | 'paused' | 'completed';
  currentMetrics: {
    time: {
      hours: string;
      minutes: string;
      seconds: string;
      totalSeconds: number;
    };
    distance: number;
    pace: string;
    calories: number;
  };
  locations: LocationData[];
  objective?: {
    type: 'time' | 'distance';
    value: number;
  };
  runId?: number;
}

export interface SessionContextType {
  sessionData: SessionData | null;
  setSessionData: (data: SessionData | null) => void;
  initializeSession: (
    type: SessionType,
    objective?: { type: 'time' | 'distance'; value: number },
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
