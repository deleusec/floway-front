import { create } from 'zustand';

type Friend = {
  id: string;
  firstName: string;
  avatar: string;
  isRunning: boolean;
};

type FriendsState = {
  friends: Friend[];
};

export const useFriendsStore = create<FriendsState>(() => ({
  friends: [
    {
      id: '1',
      firstName: 'Léna',
      avatar: 'https://picsum.photos/seed/lena/200',
      isRunning: true,
    },
    {
      id: '2',
      firstName: 'Mathieu',
      avatar: 'https://picsum.photos/seed/mathieu/200',
      isRunning: false,
    },
    {
      id: '3',
      firstName: 'Zoé',
      avatar: 'https://picsum.photos/seed/zoe/200',
      isRunning: true,
    },
    {
      id: '4',
      firstName: 'Lucas',
      avatar: 'https://picsum.photos/seed/lucas/200',
      isRunning: false,
    },
    {
      id: '5',
      firstName: 'Emma',
      avatar: 'https://picsum.photos/seed/emma/200',
      isRunning: false,
    },
    {
      id: '6',
      firstName: 'Noah',
      avatar: 'https://picsum.photos/seed/noah/200',
      isRunning: false,
    },
    {
      id: '7',
      firstName: 'Chloé',
      avatar: 'https://picsum.photos/seed/chloe/200',
      isRunning: true,
    },
    {
      id: '8',
      firstName: 'Léo',
      avatar: 'https://picsum.photos/seed/leo/200',
      isRunning: false,
    },
  ],
}));
