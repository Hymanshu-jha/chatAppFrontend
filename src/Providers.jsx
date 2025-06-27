// Providers.jsx
import React from 'react';
import { ChatProvider } from './context/ChatContext';
import { WebSocketProvider } from './context/WebSocketContext';
// import { ZegoProvider } from './context/ZegoProvider';
 // optional

const Providers = ({ children }) => {
  return (

    <ChatProvider>               
      <WebSocketProvider> 

        {children }

      </WebSocketProvider>
    </ChatProvider>


  );
};

export default Providers;
