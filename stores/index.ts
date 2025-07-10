import { Colors } from '@/constants/theme';
import { create } from 'zustand';

interface Store {
    hideMenu: boolean;
    setHideMenu: (hideMenu: boolean) => void;
    backgroundColor: string;
    setBackgroundColor: (backgroundColor: string) => void;
}

export const useStore = create<Store>((set) => ({
    hideMenu: false,
    setHideMenu: (hideMenu: boolean) => set({ hideMenu }),
    backgroundColor: Colors.background,
    setBackgroundColor: (backgroundColor: string) => set({ backgroundColor }),
}));
