// functions.js
import { setRoom } from '../redux/features/rooms/roomSlice';


export const createChatFunctions = ({
    user,
    dispatch,

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


}) => {


  const handleDeleteMessage = (msgId , deleteType) => {

    const payload = {
      messageId: msgId,
      deleteType,
      type: 'delete_message'
    }


    setMessages(messages.filter((message) => message._id !== msgId));

    socketRef.current.send(JSON.stringify(payload));
  }


  const getReceiver = (roomInfo) => {
    if (roomInfo.isGroup) {
      console.log(`it's a group message`);
      let members = roomInfo?.members.filter(
        (member) => member.emailid !== user?.emailid
      );
      return members.map((member) => ({
        emailid: member.emailid,
        name: member.name+"op",
      }));
    }

    if (!roomInfo?.members || roomInfo?.members?.length !== 2 || !user?.emailid) {
      return [{ emailid: 'unknown', name: 'Unknown User' }];
    }

    const [member1, member2] = roomInfo?.members;
    const otherMember = user?.emailid === member1?.emailid ? member2 : member1;
    console.log(`it's a direct message`);
    return [
      {
        emailid: otherMember?.emailid || 'unknown',
        name: `${otherMember?.name}` || 'Unknown User',
      },
    ];
  };

  const handleClick = (e, room) => {
    e.preventDefault();

    if (!room?._id) {
      console.error('Invalid room data');
      return;
    }

    console.log('Selecting room: ', room);
    setSelectedRoomId(room._id);
    setSelectedRoom(room);
    selectedRoomRef.current = room;
    receiverRef.current = getReceiver(room);
    dispatch(setRoom(room));
    setIsMobileMenuOpen(false);

    console.log('Room selected:', room);
    console.log('Receiver set to:', receiverRef?.current);
  };



  const handleSendButton = (e) => {
    e.preventDefault();

    if (!toSendMessage?.trim()) {
      console.warn('Cannot send: message is empty');
      return;
    }

    if (!socketRef.current || socketRef?.current?.readyState !== WebSocket.OPEN) {
      console.warn('Cannot send: WebSocket not connected');
      return;
    }

    const currentReceiver = receiverRef.current;
    const currentRoom = selectedRoom;

    if (!currentReceiver[0]?.emailid || currentReceiver[0]?.emailid === 'unknown') {
      console.warn('Cannot send: receiver not identified');
      return;
    }

    if (!currentRoom?._id) {
      console.warn('Cannot send: no room selected');
      return;
    }

    const messageType = currentRoom?.isGroup ? 'group_message' : 'direct_message';
    const to = currentRoom?.isGroup
      ? currentReceiver.map((r) => r.emailid)
      : [currentReceiver[0]?.emailid];

    const payload = {
      name: currentRoom?.roomName,
      roomId: currentRoom._id,
      message: toSendMessage,
      type: messageType,
      to,
      sender: user,
    };

    socketRef.current.send(JSON.stringify(payload));
    setToSendMessage('');
  };

  

  const handleAddRooms = async (e) => {
    e.preventDefault();

    const name = searchQuery.trim();
    if (!name) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/user/getUserList/${name}`, {
        credentials: 'include',
      });

      const data = await res.json();

      if (data?.userList?.length > 0) {
        setFoundUsers(data.userList);
      } else {
        setFoundUsers([]);
      }
    } catch (error) {
      console.error('Error fetching user list:', error);
      setFoundUsers([]);
    }
  };

  const handleSearchInput = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleTabChange = (tab) => {
    setIsMobileMenuOpen(false);
    if (tab) {
      setActiveTab(tab);
      setSelectedRoomId(null);
      setSelectedRoom(null);
      setMessages([]);
      selectedRoomRef.current = null;
      receiverRef.current = null;
    }
  };

  const getName = (room) => {
    if (room?.isGroup) return room?.roomName;
    const [m1, m2] = room?.members;
    return user?.emailid === m1?.emailid ? m2.name : m1.name;
  };

  const getCurrentReceiver = () => {
    return selectedRoom ? getReceiver(selectedRoom) : null;
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


  return {
    getReceiver,
    handleClick,
    handleSendButton,
    handleAddRooms,
    handleSearchInput,
    handleTabChange,
    getName,
    handleDeleteMessage,
    getCurrentReceiver,
    handleAddSearchQuery,
  };
};
