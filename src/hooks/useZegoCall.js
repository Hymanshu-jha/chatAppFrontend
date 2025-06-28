import { useEffect, useRef, useState } from 'react';
import { ZegoExpressEngine } from 'zego-express-engine-webrtc';

const appID = Number(import.meta.env.VITE_ZEGO_APP_ID);
const serverurl = import.meta.env.VITE_ZEGO_SERVER_URL;
const baseURL = import.meta.env.VITE_API_URL;

export const useZegoCall = ({ userID, userName, room }) => {
  const roomID = room?._id;

  const clientRef = useRef(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState([]);

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

        // Login to the room
        const loginResult = await zg.loginRoom(
          roomID,
          token,
          {
            userID,
            userName
          }
        );

        if (loginResult !== true) {
          console.error('❌ Login failed:', loginResult);
          return;
        }

        console.log('✅ Login success');

        // Generate a single streamID to use for publishing
        const streamID = `${userID}-${Date.now()}`;

        // 1. Create local stream
        const stream = await zg.createZegoStream({
          camera: {
            video: {
              width: 1280,
              height: 720,
              frameRate: 30
            },
            audio: true
          }
        });

        console.log('🎥 Local stream created', stream);

        setLocalStream({
          zegoStream: stream,
          streamID
        });

        // Publish local stream
        zg.startPublishingStream(streamID, stream);

        // 2. Fetch existing remote streams for late joiners
        const existingStreams = await zg.getRoomStreamList(roomID);

        console.log('💻 Existing streams in room:', existingStreams);

        for (const streamInfo of existingStreams) {
          if (streamInfo.user.userID !== userID) {
            console.log('Playing existing remote stream:', streamInfo.streamID);
            const remoteStream = await zg.startPlayingStream(streamInfo.streamID);

            setRemoteStreams((prev) => [
              ...prev,
              {
                streamID: streamInfo.streamID,
                zegoStream: remoteStream,
                user: streamInfo.user
              }
            ]);
          }
        }

        // Listen for future stream changes
        zg.on('roomStreamUpdate', async (roomID, updateType, streamList) => {
          console.log('🚀 roomStreamUpdate', updateType, streamList);

          if (updateType === 'ADD') {
            for (const streamInfo of streamList) {
              if (streamInfo.user.userID !== userID) {
                const remoteStream = await zg.startPlayingStream(streamInfo.streamID);
                console.log('✅ New remote stream:', streamInfo.streamID);

                setRemoteStreams((prev) => [
                  ...prev,
                  {
                    streamID: streamInfo.streamID,
                    zegoStream: remoteStream,
                    user: streamInfo.user
                  }
                ]);
              }
            }
          } else if (updateType === 'DELETE') {
            for (const streamInfo of streamList) {
              zg.stopPlayingStream(streamInfo.streamID);

              setRemoteStreams((prev) =>
                prev.filter((s) => s.streamID !== streamInfo.streamID)
              );
            }
          }
        });

        zg.on('playerStateUpdate', (result) => {
          console.log(
            '🎮 Player state update:',
            result.state,
            result.streamID,
            result.errorCode,
            result.extendedData
          );
        });

        zg.on('roomUserUpdate', (roomID, updateType, userList) => {
          console.log(`👥 Users ${updateType}:`, userList);
        });

      } catch (err) {
        console.error('❌ Failed to initialize Zego:', err);
      }
    };

    initZego();

    return () => {
      if (clientRef.current) {
        const zg = clientRef.current;

        try {
          if (localStream?.zegoStream) {
            zg.stopPublishingStream(localStream.streamID);
            if (zg.destroyStream) {
              zg.destroyStream(localStream.zegoStream);
            }
          }
        } catch (e) {
          console.error('Error cleaning up local stream:', e);
        }

        // Stop playing remote streams
        if (remoteStreams.length > 0) {
          for (const remote of remoteStreams) {
            try {
              zg.stopPlayingStream(remote.streamID);
              if (zg.destroyStream) {
                zg.destroyStream(remote.zegoStream);
              }
            } catch (e) {
              console.error('Error cleaning up remote stream:', e);
            }
          }
        }

        try {
          zg.logoutRoom(roomID);
        } catch (e) {
          console.error('Error logging out of room:', e);
        }

        zg.destroyEngine();
        clientRef.current = null;
      }
    };
  }, [roomID, userID, userName]);

  return {
    localStream,
    remoteStreams
  };
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
