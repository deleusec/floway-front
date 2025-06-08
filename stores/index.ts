import { create } from 'zustand';

interface Store {
    hideMenu: boolean;
    setHideMenu: (hideMenu: boolean) => void;
}

export const useStore = create<Store>((set) => ({
    hideMenu: false,
    setHideMenu: (hideMenu: boolean) => set({ hideMenu }),
}));
