import { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { MessageOpenBox } from '../components/MessageOpenBox'
import { MessageRoomList } from '../components/MessageRoomList'
import { AddContactsPage } from './AddContactsPage'
import { CreateGroupPage } from './CreateGroupPage'
import './css/ChatPage.css'
import { setRoom } from '../redux/features/rooms/roomSlice';
import { socketConnect , addWebSocketListener , removeWebSocketListener } from '../Websocket/WebsocketSetup';
import { 
  WebSocketDirectMessageHandler,
  WebSocketCloseHandler,
  WebSocketErrorHandler,
 } from '../Websocket/WebSocketHandlers';


const baseURL = import.meta.env.VITE_API_URL;
 
let globalSocketRef = null;


export const getGlobalSocketRef = () => globalSocketRef? globalSocketRef : null;


export default function ChatPage() {
  const dispatch = useDispatch();
  
  // Navigation state
  const [activeTab, setActiveTab] = useState('chats');
  
  const [toSendMessage, setToSendMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null); // Add explicit selected room state
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [foundUsers, setFoundUsers] = useState([]);


  const [isKanban , setIsKanban] = useState(false);
  
  const socketRef = useRef(null);
  const selectedRoomRef = useRef(null);
  const receiverRef = useRef(null);

  const { user } = useSelector((state) => state.auth);

  // Helper function to get receiver info
  const getReceiver = (roomInfo) => {

    if(roomInfo.isGroup) {

      console.log(`it's a group message`);

      let members = roomInfo?.members.filter(
      (member) => member.emailid !== user?.emailid);

      return members.map(member => ({
       emailid: member.emailid,
       name: member.name
      }));
    }
      
    

    if (!roomInfo?.members || roomInfo?.members?.length !== 2 || !user?.emailid) {
      return [{ emailid: 'unknown', name: 'Unknown User' }];
    }

    const [member1, member2] = roomInfo?.members;
    const otherMember = (user?.emailid === member1?.emailid) ? member2 : member1;
    console.log(`it's a direct message`);
    return [{
      emailid: otherMember?.emailid || 'unknown',
      name: otherMember?.name || 'Unknown User'
    }];
  };

  // Get current receiver info (no useEffect needed - calculate on demand)
  const getCurrentReceiver = () => {
    console.log('current receiver--!!->: ', selectedRoom ? getReceiver(selectedRoom) : null)
    return selectedRoom ? getReceiver(selectedRoom) : null;
  };




  // Fetch all rooms
  useEffect(() => {
    const fetchRooms = async () => {
      try {
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
  }, []);




// Auth and connect WebSocket
useEffect(() => {

  let messageHandler;
  let closeHandler;
  let errorHandler;

  const fetchTokenAndConnect = async () => {
    try {
      const res = await fetch(`${baseURL}/api/v1/user/refresh`, {
        credentials: 'include',
      });

      const data = await res.json();

      if (data?.token) {
        const ws = socketConnect(data.token);

        socketRef.current = ws;
        globalSocketRef = socketRef.current;
        setSocket(ws);

        ws.onopen = () => {
          console.log('Connected to server');
          setIsConnected(true);
        };

        messageHandler = (event) => WebSocketDirectMessageHandler(event.data, selectedRoomRef, setRooms, setMessages);
        errorHandler = (event) => WebSocketErrorHandler(event);
        closeHandler = () => WebSocketCloseHandler(setIsConnected);


        // All event listeners should receive the event object:
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




  // Fetch messages for selected room
  useEffect(() => {
    if (!selectedRoomRef?.current?._id) {
      console.log('room id issue...', );
      setMessages([]);
      return;
    }

    const controller = new AbortController();

    const fetchMessages = async () => {
      console.log('message fetching started...');
      try {
        const res = await fetch(`${baseURL}/api/v1/chat/messages/${selectedRoomRef.current._id}`, {
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
  }, [selectedRoomRef.current]);



  const handleClick = (e, room) => {
    e.preventDefault();

  

    if(selectedRoomRef?.current?._id === room?._id) return;
    
    if (!room?._id) {
      console.error('Invalid room data');
      return;
    }

    console.log('Selecting room: ', room);
    
    // Clear messages first
    //setMessages([]);
    
    // Update all room-related state and refs immediately
    setSelectedRoomId(room._id);
    setSelectedRoom(room);
    selectedRoomRef.current = room;
    receiverRef.current = getReceiver(room);
    dispatch(setRoom(room));
    
    console.log('Room selected:', room);
    console.log('Receiver set to:', receiverRef?.current);
  };




  const handleSendButton = (e) => {
    e.preventDefault();

    // Validate message
    if (!toSendMessage?.trim()) {
      console.warn('Cannot send: message is empty');
      return;
    }

    // Validate WebSocket
    if (!socketRef.current || socketRef?.current?.readyState !== WebSocket.OPEN) {
      console.warn('Cannot send: WebSocket not connected');
      return;
    }

    // Get current receiver (calculate fresh to avoid stale refs)
    const currentReceiver = getCurrentReceiver();
    const currentRoom = selectedRoom;

    // Validate receiver
    if (!currentReceiver[0]?.emailid || currentReceiver[0]?.emailid === 'unknown') {
      console.warn('Cannot send: receiver not identified');
      console.warn('Selected room:', currentRoom);
      console.warn('Current receiver:', currentReceiver);
      console.warn('User email:', user?.emailid);
      return;
    }

    // Validate room
    if (!currentRoom?._id) {
      console.warn('Cannot send: no room selected');
      return;
    }

    let messageType;
    let to;

    if(currentRoom?.isGroup) {
      messageType = "group_message";
      to = currentReceiver?.map((rec) => {
        return rec?.emailid
      });
    } else if(!currentRoom?.isGroup) {
      messageType = "direct_message"
      to = [currentReceiver[0]?.emailid];
    }


    console.log("user.emialid:--------- ", user.emailid);

    const payload = {
      name: selectedRoomRef?.current?.roomName,
      roomId: currentRoom._id,
      message: toSendMessage,
      type: messageType,
      to,
      sender: user
    };

    console.log('Sending message:', payload);
    socketRef.current.send(JSON.stringify(payload));
    // setMessages([...messages , {
    //   roomName: name,
    //   room: currentRoom,
    //   message: toSendMessage,
    //   type: "direct_message",
    //   sender: user,
    //   receiver: receiverRef?.current
    // }]);
    setToSendMessage('');
  };




  const handleAddRooms = async (e) => {
    e.preventDefault();

    const name = searchQuery.trim();
    if (!name) return;

    try {
      const res = await fetch(`${baseURL}/v1/user/getUserList/${name}`, {
        credentials: 'include'
      });

      const fetchedUsersData = await res.json();

      if (fetchedUsersData?.userList?.length > 0) {
        setFoundUsers(fetchedUsersData?.userList);
      } else {
        setFoundUsers([]);
        console.log('No users found');
      }
    } catch (error) {
      console.error("Error fetching user list:", error);
      setFoundUsers([]);
    }
  };





  const handleSearchInput = (e) => {
    setSearchQuery(e.target.value);
  };




  const handleAddSearchQuery = (e, foundUser) => {
    e.preventDefault();

    if (!socketRef?.current || socketRef?.current?.readyState !== WebSocket?.OPEN) {
      console.log('WebSocket connection error');
      return;
    }

    if (!foundUser?.emailid) {
      console.log('Invalid user data');
      return;
    }

    const payload = {
      type: "direct_message",
      to: [foundUser?.emailid],
      message: `Hey ${foundUser?.name}, this is ${user?.name}`,
      purpose: "roomJoin"
    };

    console.log('Adding user to room:', payload);
    socketRef?.current?.send(JSON.stringify(payload));
  };



  // kanban click handle





  // Navigation handlers
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    
    // Reset chat-related states when switching away from chats
    if (tab !== 'chats') {
      setSelectedRoomId(null);
      setSelectedRoom(null);
      setMessages([]);
      selectedRoomRef.current = null;
      receiverRef.current = null;
    }
  };

  const renderLeftPanel = () => {
    switch (activeTab) {
      case 'contacts':
        return (
          <AddContactsPage 
            searchQuery={searchQuery}
            foundUsers={foundUsers}
            handleSearchInput={handleSearchInput}
            handleAddRooms={handleAddRooms}
            handleAddSearchQuery={handleAddSearchQuery}
            setSearchQuery={setSearchQuery}
            setFoundUsers={setFoundUsers}
          />
        );
      case 'groups':
        return <CreateGroupPage />;
      case 'chats':
      default:
        return (
          <div className="chat-room-content">
            <div className="chat-room-header">
              <button
                className={`tab-btn ${!showUserSearch ? 'active' : ''}`}
                onClick={() => setShowUserSearch(false)}
              >
                Rooms ({rooms.length})
              </button>
            </div>
            <MessageRoomList
              rooms={rooms}
              selectedRoomId={selectedRoomId}
              setRoomId={handleClick}
            />
          </div>
        );


    }
  };

  return (
    

<>
      <div className="chat-container">
      {/* Vertical Navigation Bar */}
      <div className="vertical-nav">
        <div className="nav-brand">
          <h3>Chat App</h3>
        </div>
        <div className="nav-items">
          <button 
            className={`nav-item ${activeTab === 'chats' ? 'active' : ''}`}
            onClick={() => handleTabChange('chats')}
          >
            <svg className="nav-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
            </svg>
            <span>Chats</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'contacts' ? 'active' : ''}`}
            onClick={() => handleTabChange('contacts')}
          >
            <svg className="nav-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A3.004 3.004 0 0 0 16.96 6c-.8 0-1.54.37-2.01.97L12 10.5 9.05 6.97A3.004 3.004 0 0 0 6.04 6c-1.18 0-2.25.66-2.81 1.72L1.5 16H4v6h2v-6h1.5l1.87-5.61L12 14l2.63-3.61L16.5 16H18v6h2z"/>
            </svg>
            <span>Add Contacts</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'groups' ? 'active' : ''}`}
            onClick={() => handleTabChange('groups')}
          >
            <svg className="nav-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
            </svg>
            <span>Create Group</span>
          </button>





        </div>
        
        <div className="nav-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="user-details">
              <span className="user-name">{user?.name || 'Unknown'}</span>
              <span className="user-status">{isConnected ? 'Online' : 'Offline'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Left Panel - Dynamic Content */}
      <div className="chat-room-list">
        {renderLeftPanel()}
      </div>

      {/* Right Panel - Messages */}
      <div className="chat-message-box">
        {!isConnected ? (
          <div className="loading-state">
            <h2>Connecting...</h2>
            <p>Establishing connection to chat server...</p>
          </div>
        ) : activeTab === 'chats' && selectedRoomId && selectedRoom ? (
          <>
            <div className="chat-messages-scroll">
              <h2 className="section-title">
                {selectedRoomRef?.current?.roomName || receiverRef?.current[0]?.name || 'Loading...'}
              </h2>
              <MessageOpenBox messages={messages} />
            </div>

            <form className="chat-input-bar" onSubmit={handleSendButton}>
              <input
                type="text"
                placeholder="Enter message here..."
                value={toSendMessage}
                onChange={(e) => setToSendMessage(e.target.value)}
              />
              <button type="submit" className="send-icon-btn" title="Send">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#007bff"
                  height="20"
                  width="20"
                  viewBox="0 0 24 24"
                >
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
                </svg>
              </button>
            </form>
          </>
        ) : (
          <div className="empty-chat-state">
            {activeTab === 'chats' ? (
              <div className="empty-message-content">
                <h3>Select a chat to start messaging</h3>
                <p>Choose from your existing conversations or start a new one</p>
              </div>
            ) : activeTab === 'contacts' ? (
              <div className="empty-message-content">
                <h3>Add New Contacts</h3>
                <p>Search and add new people to your contact list</p>
              </div>
            ) : (
              <div className="empty-message-content">
                <h3>Create New Group</h3>
                <p>Start a group conversation with multiple people</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
</>

    
    
  );
}


export const getWebSocket = () => {
  if(socketRef?.current)return socketRef?.current;
  return null;
};