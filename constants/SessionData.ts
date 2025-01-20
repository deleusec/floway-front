export interface SessionData {
  type: 'free' | 'target' | 'guided';
  target?: {
    type: 'time' | 'distance';
    time?: {
      hours: string;
      minutes: string;
      seconds: string;
    };
    distance?: number;
  };
  guidedRun?: {
    id: string;
    title: string;
    description: string;
    duration: string;
    distance?: string;
  };
}
