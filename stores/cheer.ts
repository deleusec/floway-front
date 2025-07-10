import { create } from 'zustand';
import flowsData from '@/assets/flows-messages.json';

interface CheerStats {
  time: number;
  distance: number;
  speed: number;
  mapImageUrl?: string;
}

interface CheerStore {
  friendName: string;
  stats: CheerStats | null;
  flows: { id: string; text: string }[];
  selectedFlowId: string | null;
  audioUri: string | null;
  setFriend: (name: string, stats: CheerStats) => void;
  pickRandomFlows: () => void;
  selectFlow: (id: string) => void;
  setAudioUri: (uri: string | null) => void;
  reset: () => void;
}

function getRandomFlows() {
  const all = flowsData.messages.filter(f => f.text && f.text.length > 0);
  const shuffled = all.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3);
}

export const useCheerStore = create<CheerStore>((set) => ({
  friendName: '',
  stats: null,
  flows: getRandomFlows(),
  selectedFlowId: null,
  audioUri: null,
  setFriend: (name, stats) => set({ friendName: name, stats }),
  pickRandomFlows: () => set({ flows: getRandomFlows(), selectedFlowId: null }),
  selectFlow: (id) => set({ selectedFlowId: id }),
  setAudioUri: (uri) => set({ audioUri: uri }),
  reset: () => set({ friendName: '', stats: null, flows: getRandomFlows(), selectedFlowId: null, audioUri: null }),
}));
