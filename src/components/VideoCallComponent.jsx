import React, { useState, useEffect, useRef } from 'react';
import { PhoneOff, Mic, MicOff, Video, VideoOff } from 'lucide-react';
import { useZegoCall } from '../hooks/useZegoCall.js';
import { useSelector } from 'react-redux';

export const VideoCallComponent = ({ room, onExitCall }) => {


  const { user } = useSelector((state) => state.auth);
  const localVideoRef = useRef(null);

  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isCallActive, setIsCallActive] = useState(true);



  const zegoService = useZegoCall({
          userID: user?.userId,
          userName: user.name,
          room
  });

  console.log('zegoService' , zegoService);


useEffect(() => {
  const mediaStream = zegoService?.localStream?.zegoStream?.stream;


  if (mediaStream instanceof MediaStream && localVideoRef.current) {
    localVideoRef.current.srcObject = mediaStream;
    console.log(`hellello: ${mediaStream}`);
    localVideoRef.current.play().catch((err) =>
      console.warn("Autoplay failed:", err)
    );
  }
}, [zegoService?.localStream]);






  return (
    <div className="relative h-screen bg-gradient-to-br from-gray-900 to-black text-orange-100 overflow-hidden">
      {/* Debug Info */}
      <div className="absolute top-4 left-4 z-20 bg-black bg-opacity-50 p-2 rounded text-xs">
        <div>Local Stream: {zegoService?.localStream ? '✓' : '✗'}</div>
        <div>Remote Streams: {zegoService?.remoteStreams?.length}</div>
        <div>User: {user.name}</div>
        <div>Room: {room?._id}</div>
      </div>

      {/* Video Grid */}
      <div className="absolute inset-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 overflow-auto">
        
        {/* Local Video */}
        <div className="relative">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-64 bg-gray-800 rounded-xl shadow-lg object-cover border-2 border-orange-700"
          />
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-xs">
            You ({user.name})
          </div>
          {!isCameraOn && (
            <div className="absolute inset-0 bg-gray-800 rounded-xl flex items-center justify-center">
              <VideoOff className="w-12 h-12 text-gray-400" />
            </div>
          )}
        </div>

        {/* Remote Videos */}
        {zegoService?.remoteStreams?.map((streamObj, index) => (
          <RemoteVideoComponent 
            key={streamObj?.streamID} 
            streamObj={streamObj} 
            index={index}
          />
        ))}

        {/* Placeholder for empty slots */}
        {zegoService?.remoteStreams?.length === 0 && (
          <div className="w-full h-64 bg-gray-800 rounded-xl shadow-lg border-2 border-gray-600 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <Video className="w-12 h-12 mx-auto mb-2" />
              <p>Waiting for others to join...</p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Control Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className="flex justify-center items-center p-6 bg-black bg-opacity-60 backdrop-blur-sm border-t border-orange-800">
          <div className="flex space-x-6">
            {/* Microphone Toggle */}
            <button
              className={`p-4 rounded-full transition-all duration-200 ${
                isMuted 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-orange-600 hover:bg-orange-700 text-white'
              }`}
            >
              {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </button>

            {/* Camera Toggle */}
            <button

              className={`p-4 rounded-full transition-all duration-200 ${
                !isCameraOn 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-orange-600 hover:bg-orange-700 text-white'
              }`}
            >
              {isCameraOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
            </button>

            {/* End Call */}
            <button

              className="p-4 bg-red-600 hover:bg-red-700 rounded-full transition-all duration-200 text-white"
            >
              <PhoneOff className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

