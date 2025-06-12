const wsURL = import.meta.env.VITE_WS_API_URL;


let socket = null;



// Fix: Return the socket instance
export const socketConnect = (token) => {
  if(!socket || socket?.readyState === WebSocket?.CLOSED) {
    socket = new WebSocket(`${wsURL}`);
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