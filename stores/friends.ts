import { create } from 'zustand';

type Friend = {
  id: string;
  firstName: string;
  avatar: string;
  isRunning: boolean;
};

type FriendRequest = {
  id: string;
  firstName: string;
  avatar: string;
};

type FriendsState = {
  friends: Friend[];
  requests: FriendRequest[];
  allUsers: FriendRequest[];
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
  requests: [
    {
      id: '101',
      firstName: 'Sarah',
      avatar: 'https://picsum.photos/seed/sarah/200',
    },
    {
      id: '102',
      firstName: 'Paul',
      avatar: 'https://picsum.photos/seed/paul/200',
    },
    {
      id: '103',
      firstName: 'Julie',
      avatar: 'https://picsum.photos/seed/julie/200',
    },
  ],
  allUsers: [
    {
      id: '1',
      firstName: 'Farah',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    },
    {
      id: '2',
      firstName: 'Farah',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    },
    {
      id: '3',
      firstName: 'Farah',
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    },
    {
      id: '4',
      firstName: 'Farah',
      avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
    },
    {
      id: '5',
      firstName: 'Farah',
      avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
    },
  ],
}));
