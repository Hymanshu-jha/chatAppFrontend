import { useEffect, useRef } from 'react';
import { socketConnect, addWebSocketListener, removeWebSocketListener } from '../Websocket/WebsocketSetup';
import { 
  WebSocketDirectMessageHandler,
  WebSocketCloseHandler,
  WebSocketErrorHandler,
} from '../Websocket/WebSocketHandlers';

export const useWebSocket = (chatState) => {
  const {
    setSocket,
    setIsConnected,
    setRooms,
    setMessages,
    selectedRoomRef,
    socketRef
  } = chatState;

  let globalSocketRef = useRef(null);

  const getGlobalSocketRef = () => globalSocketRef.current;

  useEffect(() => {
    let messageHandler;
    let closeHandler;
    let errorHandler;

    const fetchTokenAndConnect = async () => {
      try {
        const baseURL = import.meta.env.VITE_API_URL;
        const res = await fetch(`${baseURL}/api/v1/user/refresh`, {
          credentials: 'include',
        });

        const data = await res.json();

        if (data?.token) {
          const ws = socketConnect(data.token);

          socketRef.current = ws;
          globalSocketRef.current = ws;
          setSocket(ws);

          ws.onopen = () => {
            console.log('Connected to server');
            setIsConnected(true);
          };

          messageHandler = (event) => WebSocketDirectMessageHandler(
            event.data, 
            selectedRoomRef, 
            setRooms, 
            setMessages
          );
          errorHandler = (event) => WebSocketErrorHandler(event);
          closeHandler = () => WebSocketCloseHandler(setIsConnected);

          addWebSocketListener('message', messageHandler);
          addWebSocketListener('close', closeHandler); 
          addWebSocketListener('error', errorHandler);

        } else {
          console.error('Token not received');
        }
      } catch (error) {
        console.error('Error getting WebSocket token:', error);
      }
    };

    fetchTokenAndConnect();

    return () => {
      if (socketRef.current) {
        removeWebSocketListener('message', messageHandler);
        removeWebSocketListener('close', closeHandler);
        removeWebSocketListener('error', errorHandler);
        socketRef.current.close();
      }
    };
  }, []);

  return { getGlobalSocketRef };
};