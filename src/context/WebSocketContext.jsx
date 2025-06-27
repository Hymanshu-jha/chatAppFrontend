// ChatContext.js
import { createContext, useContext } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import { useChat } from './ChatContext';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const chatState = useChat();
  const WebSocketState = useWebSocket(chatState);
  return (
    <WebSocketContext.Provider value={WebSocketState}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};
