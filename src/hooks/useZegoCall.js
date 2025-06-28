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

        const zg = clientRef?.current;

        console.log('✅ ZegoExpressEngine instance created');
        console.log('Creating Zego with:', { appID, userID, userName, roomID });



// In the sample code, streams are published immediately after you successfully log in to a room. When implementing your service, you can choose to publish streams at any time when the room is connected status.

const loginInfo = await zg.loginRoom(roomID, token, { userID, userName: userID }, { userUpdate: true }).then(async result => {
     if (result == true) {
        console.log("login success")
        // Create a stream and start the preview.
           // After calling the `createZegoStream` method, you cannot perform subsequent operations until the ZEGOCLOUD server returns a streaming media object.
           const localStream = await zg.createZegoStream();

           // Preview the stream and mount the playback component to the page. "local-video" is the id of the <div> element that serves as the component container.
           

           // Start to publish an audio and video stream to the ZEGOCLOUD audio and video cloud.
           let streamID = new Date().getTime().toString();
           zg.startPublishingStream(streamID, localStream)
     }
});

if(loginInfo) {
  console.log(`loginInfo: ${loginInfo}`);
} else {
  console.log(`couldn't login`);
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


if(stream) {
  setLocalStream(stream);
  console.log(`localStream: ${stream}`);
} else {
  console.log('error while collecting localStream');
}



// Stream status update callback
zg.on('roomStreamUpdate', async (roomID, updateType, streamList, extendedData) => {
    // When `updateType` is set to `ADD`, an audio and video stream is added, and you can call the `startPlayingStream` method to play the stream.
    if (updateType == 'ADD') {
        // When streams are added, play them.
        // For the conciseness of the sample code, only the first stream in the list of newly added audio and video streams is played here. In a real service, it is recommended that you traverse the stream list to play each stream. 
        const streamID = streamList[0].streamID;
        // The stream list specified by `streamList` contains the ID of the corresponding stream.
        const remoteStream = await zg.startPlayingStream(streamID);

        setRemoteStream(remoteStream);

    } else if (updateType == 'DELETE') {
        // When streams are deleted, stop playing them.
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
