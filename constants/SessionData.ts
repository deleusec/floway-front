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
  run?: RunData | null;
}

interface Run {
  id: number;
  title: string;
  time_objective: number;
  distance_objective: number;
  price: number;
  is_buyable: boolean;
  description: string;
}

interface ActivationParam {
  run_id: number;
  audio_id: number;
  audioFile?: File;
  time: number;
  distance: number;
}

interface User {
  first_name: string;
  last_name: string;
  picture_path: string;
}

export interface RunData {
  run: Run;
  activation_param: ActivationParam[];
  user: User;
}


export interface SessionContextType {
  sessionData: SessionData | null;
  userSessions: Session[];
  setSessionData: (data: SessionData | null) => void;
  initializeSession: (
    type: SessionType,
    objective?: number,
    run?: RunData,
  ) => void;
  startSession: () => Promise<void>;
  pauseSession: () => void;
  resumeSession: () => void;
  saveSession: () => Promise<void>;
  updateLocation: (location: LocationObject) => void;
  clearSession: () => void;
  fetchUserSessions: (userId: number, token: string) => Promise<void>;
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

export interface Session {
  _id: string;
  id: string;
  reference_day: string;
  session_type: SessionType;
  user_id: number;
  title: string;
  distance: number;
  calories: number;
  allure: number;
  time: number;
  tps: [number, number, number][];
  time_objective: number | null;
  distance_objective: number | null;
  run_id: number | null;
}
