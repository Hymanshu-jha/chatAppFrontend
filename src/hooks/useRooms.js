import { useEffect } from 'react';

export const useRooms = (setRooms) => {
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const baseURL = import.meta.env.VITE_API_URL;
        const res = await fetch(`${baseURL}/api/v1/chat/rooms`, {
          credentials: 'include',
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.message || 'Failed to fetch rooms');
        }

        if (!data?.rooms || data.rooms.length === 0) {
          console.log('No rooms found for this user.');
          return;
        }

        setRooms(data.rooms);
      } catch (error) {
        console.error('Error fetching rooms:', error.message);
      }
    };

    fetchRooms();
  }, [setRooms]);
};