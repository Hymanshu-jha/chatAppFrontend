let socket = null;

// Fix: Return the socket instance
export const socketConnect = (token) => {
  if(!socket || socket?.readyState === WebSocket?.CLOSED) {
    socket = new WebSocket(`ws://localhost:8080`);
  }
  return socket; // Add this return statement
};

export const getWebSocket = () => socket;

// addEventListener
export const addWebSocketListener = (event, handler) => {
  if(socket) socket.addEventListener(event, handler);
}

// removeEventListener
export const removeWebSocketListener = (event, handler) => {
  if(socket) socket.removeEventListener(event, handler);
}