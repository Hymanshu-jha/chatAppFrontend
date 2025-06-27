import { useState, useRef } from 'react';

export const useChatState = () => {
  // Navigation state
  const [activeTab, setActiveTab] = useState('chats');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Message and room state
  const [toSendMessage, setToSendMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [foundUsers, setFoundUsers] = useState([]);
  
  // Connection state
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  
  // Refs
  const socketRef = useRef(null);
  const selectedRoomRef = useRef(null);
  const receiverRef = useRef(null);

  return {
    // Navigation
    activeTab,
    setActiveTab,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    
    // Messages & Rooms
    toSendMessage,
    setToSendMessage,
    messages,
    setMessages,
    rooms,
    setRooms,
    selectedRoomId,
    setSelectedRoomId,
    selectedRoom,
    setSelectedRoom,
    
    // Search
    searchQuery,
    setSearchQuery,
    foundUsers,
    setFoundUsers,
    
    // Connection
    socket,
    setSocket,
    isConnected,
    setIsConnected,
    
    // Refs
    socketRef,
    selectedRoomRef,
    receiverRef,
  };
};
