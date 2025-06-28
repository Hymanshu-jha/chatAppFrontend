import { useEffect, useRef, useState } from 'react';
import { ZegoExpressEngine } from 'zego-express-engine-webrtc';

const appID = Number(import.meta.env.VITE_ZEGO_APP_ID);
const serverurl = import.meta.env.VITE_ZEGO_SERVER_URL;
const baseURL = import.meta.env.VITE_API_URL;

export const useZegoCall = ({ userID, userName, room }) => {
  const roomID = room?._id;

  const clientRef = useRef(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);




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

        const zg = clientRef.current;

        console.log('✅ ZegoExpressEngine instance created');
        console.log('Creating Zego with:', { appID, userID, userName, roomID });



const { streamList } = await zg.loginRoom(roomID, token, { userID, userName });

// Play existing streams already in the room
for (const stream of streamList) {
  const remoteStream = await zg.startPlayingStream(stream.streamID);
  const remoteView = zg.createRemoteStreamView(remoteStream);
  remoteView.play("remote-video");
}







const stream = await zg.createZegoStream({
  camera: {
    video: {
      width: 1920,
      height: 1080,
      frameRate: 30
    },
    audio: true
  }
});


zg.on('roomUserUpdate', (roomID, updateType, userList) => {
    if (updateType == 'ADD') {
        for (var i = 0; i < userList.length; i++) {
            console.log(userList[i]['userID'], 'joins the room:', roomID)
        }
    } else if (updateType == 'DELETE') {
        for (var i = 0; i < userList.length; i++) {
            console.log(userList[i]['userID'], 'leaves the room:', roomID)
        }
    }
});

zg.on('playerStateUpdate', result => {
    // Stream playing status update callback
    var state = result['state']
    var streamID = result['streamID']
    var errorCode = result['errorCode']
    var extendedData = result['extendedData']
    if (state == 'PLAYING') {
        console.log('Successfully played an audio and video stream:', streamID);
    } else if (state == 'NO_PLAY') {
        console.log('No audio and video stream played');
    } else if (state == 'PLAY_REQUESTING') {
        console.log('Requesting to play an audio and video stream:', streamID);
    }
    console.log('Error code:', errorCode,' Extra info:', extendedData)
})


// Then listen for new streams
zg.on('roomStreamUpdate', async (roomID, updateType, streamList) => {
  if (updateType === 'ADD') {
    for (const stream of streamList) {
      const remoteStream = await zg.startPlayingStream(stream.streamID);
      const remoteView = zg.createRemoteStreamView(remoteStream);
      remoteView.play("remote-video");
    }
  } else if (updateType === 'DELETE') {
    // stop playing streams
  }
});




          console.log('🎥 Local stream created', stream);

          setLocalStream(stream); // ✅ This triggers a re-render in your component

          const streamID = new Date().getTime().toString();
          zg.startPublishingStream(streamID, stream);
        }
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
