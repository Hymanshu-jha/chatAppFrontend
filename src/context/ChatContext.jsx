// ChatContext.js
import { createContext, useContext } from 'react';
import { useChatState } from '../hooks/useChatState';

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const chatState = useChatState();
  return (
    <ChatContext.Provider value={chatState}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
