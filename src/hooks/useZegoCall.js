import { useEffect, useRef, useState } from 'react';
import { ZegoExpressEngine } from 'zego-express-engine-webrtc';

const appID = Number(import.meta.env.VITE_ZEGO_APP_ID);
const serverurl = import.meta.env.VITE_ZEGO_SERVER_URL;
const baseURL = import.meta.env.VITE_API_URL;

export const useZegoCall = ({ userID, userName, room }) => {
  const roomID = room?._id;

  const clientRef = useRef(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState([]);




  useEffect(() => {
    if (!roomID || !userID || !userName) {
      console.warn('Missing roomID, userID or userName');
      return;
    }

    const initZego = async () => {




      try {
        console.log('🔧 Initializing ZegoEngine...');
        const token = await fetchToken(roomID, userID);
        if (!token) throw new Error('Token fetch failed');
        console.log('✅ Token fetched:', token);

        if (!clientRef.current) {
          const zg = new ZegoExpressEngine(appID, serverurl);
          zg.setLogConfig({ logLevel: 'error', remoteLogging: false });
          clientRef.current = zg;
        }

        const zg = clientRef?.current;

        console.log('✅ ZegoExpressEngine instance created');
        console.log('Creating Zego with:', { appID, userID, userName, roomID });



// In the sample code, streams are published immediately after you successfully log in to a room. When implementing your service, you can choose to publish streams at any time when the room is connected status.

zg.loginRoom(roomID, token, { userID, userName: userID }, { userUpdate: true }).then(async result => {
     if (result == true) {
        console.log("login success")
        // Create a stream and start the preview.
           // After calling the `createZegoStream` method, you cannot perform subsequent operations until the ZEGOCLOUD server returns a streaming media object.
           const localStream = await zg.createZegoStream(
            {
               camera: {
    video: true,
    audio: true,
    facingMode: "user"   // <-- this fixes your problem!
  }
            }
           );

           setLocalStream(localStream);

           

           // Start to publish an audio and video stream to the ZEGOCLOUD audio and video cloud.
           let streamID = new Date().getTime().toString();
           zg.startPublishingStream(streamID, localStream)
     }
});


zg.on('roomStreamUpdate', async (roomID, updateType, streamList) => {
  if (updateType === 'ADD') {
    for (const stream of streamList) {
      console.log('Room', roomID, 'has a stream added:', stream.streamID);

      // skip own stream
      if (stream.streamID === localStream?.streamID) {
        continue;
      }

      const remoteStream = await zg.startPlayingStream(stream.streamID, {
        video: true,
        audio: true,
      });
setRemoteStream((prev) => {
  // check if this streamID already exists
  const exists = prev.some(s => s.streamID === stream.streamID);
  if (exists) return prev;

  return [
    ...prev,
    {
      streamID: stream.streamID,
      stream: remoteStream,
      userID: stream.user.userID,
    },
  ];
});

    }
  } else if (updateType === 'DELETE') {
    for (const stream of streamList) {
      console.log('Room', roomID, 'has a stream deleted:', stream.streamID);

      // remove from state
      setRemoteStream((prev) =>
        prev.filter((s) => s.streamID !== stream.streamID)
      );
    }
  }
});







      } catch (err) {
        console.error('❌ Failed to initialize Zego:', err);
      }
    };

    initZego();

    return () => {
      if (clientRef.current) {
        console.log('🧹 Cleaning up ZegoEngine');
        try {
          clientRef.current.destroyEngine();
        } catch (err) {
          console.error('Cleanup error:', err);
        }
        clientRef.current = null;
      }
    };
  }, [roomID, userID, userName]);

  return { localStream , remoteStream } ;
};




async function fetchToken(roomID, userID) {
  try {
    const res = await fetch(`${baseURL}/api/v1/zego/getZegoToken`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ roomID, userID })
    });

    if (!res.ok) throw new Error(`Failed to fetch token: ${res.status}`);
    const data = await res.json();
    return data?.token;
  } catch (err) {
    console.error('Token fetch error:', err);
    return null;
  }
}
