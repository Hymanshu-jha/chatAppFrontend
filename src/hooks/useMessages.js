import { useEffect } from 'react';

export const useMessages = (selectedRoomRef, setMessages) => {
  useEffect(() => {
    if (!selectedRoomRef?.current?._id) {
      console.log('room id issue...');
      setMessages([]);
      return;
    }

    const controller = new AbortController();

    const fetchMessages = async () => {
      console.log('message fetching started...');
      try {
        const baseURL = import.meta.env.VITE_API_URL;
        const res = await fetch(`${baseURL}/api/v1/chat/messages/${selectedRoomRef?.current?._id}`, {
          credentials: 'include',
          signal: controller.signal,
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.message || 'Error while fetching messages');
        }

        console.log('message fetched...');
        setMessages(data?.messages || []);
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('Fetch aborted due to room change');
        } else {
          console.error('Error fetching messages:', error.message);
        }
      }
    };

    fetchMessages();

    return () => {
      controller.abort();
    };
  }, [selectedRoomRef.current, setMessages]);
};
