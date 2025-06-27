// Fix: Correct parameter order and add missing setMessages parameter
export const WebSocketDirectMessageHandler = (data, selectedRoomRef, setRooms, setMessages) => {
  try {
    const parsedData = JSON.parse(data);
    console.log('started at least:', parsedData);
    
    // Handle direct messages
    if (parsedData.type === "direct_message" && parsedData?.room && selectedRoomRef?.current) {
      // Fix: Compare room IDs instead of object references
      if ((parsedData?.room?._id || parsedData?.roomId) === selectedRoomRef?.current?._id) {
        const newMessage = {
          ...parsedData.message,
          sender: parsedData?.sender
        };
        setMessages((prev) => [...prev, newMessage]);
        console.log('Received message...1b:', parsedData);
      }
      console.log('Received message...1a:', parsedData);
    } 
    // Handle room join
    else if (parsedData.type === "group_ create" && parsedData.room) {
      const newRoom = {
        ...parsedData.room,
        roomName: parsedData.roomName || 'New Room'
      };
      setRooms(prevRooms => [...prevRooms, newRoom]);
      console.log('Received message...2:', parsedData);
    } 
    else if (parsedData?.type === 'group_create') {
      console.log('group_create...handler..');
    } else if (parsedData?.type === "group_message") {
      console.log('parsedData is...', parsedData);
      const newMessage = {
        message: parsedData?.message,
        sender: parsedData?.sender
      };   
      setMessages((prev) => [...prev, newMessage]);
    } else if (parsedData?.type === 'notification') {
      console.log('notification...handler..frontend initiated...');
    } else if (parsedData?.type === 'delete_message') {
      console.log('delete_message handler invoked');
      const messageId = parsedData?.messageId;
      setMessages((prev) => prev.filter((message) => message._id !== messageId));
    } else {
      console.log('Message not handled:', parsedData);
    }
  } catch (err) {
    console.error("Invalid JSON received:", data, err);
  }
}

export const WebSocketCloseHandler = (setIsConnected) => {
  try {
    setIsConnected(false);
    console.log('connection closed...!!!');
  } catch (error) {
    console.log('error while calling websocketclosehandler: ', error.message);
  }
}

export const WebSocketErrorHandler = (event) => {
  console.log('error while calling websocketerrorhandler: ', event.error.message);
}

// group message handler

export const WebSocketGroupMessageHandler = () => {
  try {
    
  } catch (error) {
    console.log('error while calling websocketgroupMessagehandler: ', error.message);
  }
}