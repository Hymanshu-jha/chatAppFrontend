import React, { useState, useEffect, useRef } from 'react';
import { PhoneOff, Mic, MicOff, Video, VideoOff } from 'lucide-react';
import { useZegoCall } from '../hooks/useZegoCall.js';
import { useSelector } from 'react-redux';

export const VideoCallComponent = ({ room, onExitCall }) => {
  const { user } = useSelector((state) => state.auth);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isCallActive, setIsCallActive] = useState(true);

  const zegoService = useZegoCall({
    userID: user?.userId,
    userName: user.name,
    room,
  });

  console.log('zegoService', zegoService);
  console.log('remoteStream: ', zegoService?.remoteStream);

  useEffect(() => {
    const localStream = zegoService?.localStream?.zegoStream?.stream;
    const remoteStreams = zegoService?.remoteStream;

    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
      localVideoRef.current.play().catch((err) =>
        console.warn('Local autoplay failed:', err)
      );
    }

    if (remoteStreams && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStreams;
      remoteVideoRef.current.play().catch((err) =>
        console.warn('Remote autoplay failed:', err)
      );
    }
  }, [
    zegoService?.localStream?.zegoStream?.stream,
    zegoService?.remoteStream,
  ]);

  return (
    <div className="relative h-screen bg-gradient-to-br from-gray-900 to-black text-orange-100 overflow-hidden">
      {/* Debug Info */}
      <div className="absolute top-4 left-4 z-20 bg-black bg-opacity-50 p-2 rounded text-xs">
        <div>Local Stream: {zegoService?.localStream ? '✓' : '✗'}</div>
        <div>Remote Streams: {zegoService?.remoteStream?.length}</div>
        <div>User: {user.name}</div>
        <div>Room: {room?._id}</div>
      </div>

      {/* Video Grid - Mobile Responsive */}
      <div className="absolute inset-0 flex flex-col pb-24 p-4 overflow-auto">
        {/* Main video area */}
        <div className="flex-1 flex flex-col gap-4">
          
          {/* Remote Video(s) - Takes most space */}
          {zegoService?.remoteStream && (
            <div className="flex-1 min-h-0">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full bg-gray-800 rounded-xl shadow-lg object-cover border-2 border-orange-700"
              />
              <div className="absolute top-6 left-6 bg-black bg-opacity-50 px-2 py-1 rounded text-xs">
                Remote User
              </div>
            </div>
          )}

          {/* Multiple remote streams */}
          {zegoService?.remoteStream?.length > 0 && (
            <div className={`flex-1 grid gap-4 ${
              zegoService.remoteStream.length === 1 
                ? 'grid-cols-1' 
                : zegoService.remoteStream.length === 2 
                  ? 'grid-cols-1 sm:grid-cols-2' 
                  : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            }`}>
              {zegoService.remoteStream.map((streamObj) => (
                <div key={streamObj?.streamID} className="relative min-h-0">
                  <video
                    autoPlay
                    playsInline
                    ref={(el) => {
                      if (el && streamObj?.zegoStream) {
                        el.srcObject = streamObj.zegoStream;
                      }
                    }}
                    className="w-full h-full min-h-[200px] bg-gray-800 rounded-xl shadow-lg object-cover border-2 border-orange-700"
                  />
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-xs">
                    Remote User {streamObj?.streamID}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Placeholder when no remote streams */}
          {zegoService?.remoteStream?.length === 0 && !zegoService?.remoteStream && (
            <div className="flex-1 bg-gray-800 rounded-xl shadow-lg border-2 border-gray-600 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <Video className="w-12 h-12 mx-auto mb-2" />
                <p>Waiting for others to join...</p>
              </div>
            </div>
          )}
        </div>

        {/* Local Video - Picture in Picture style */}
        <div className="absolute top-4 right-4 w-32 h-24 sm:w-40 sm:h-30 lg:w-48 lg:h-36 z-10">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full bg-gray-800 rounded-lg shadow-lg object-cover border-2 border-orange-700"
          />
          <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 px-1 py-0.5 rounded text-xs">
            You
          </div>
          {!isCameraOn && (
            <div className="absolute inset-0 bg-gray-800 rounded-lg flex items-center justify-center">
              <VideoOff className="w-6 h-6 text-gray-400" />
            </div>
          )}
        </div>
      </div>

      {/* Bottom Control Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className="flex justify-center items-center p-4 sm:p-6 bg-black bg-opacity-60 backdrop-blur-sm border-t border-orange-800">
          <div className="flex space-x-4 sm:space-x-6">
            {/* Microphone Toggle */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-3 sm:p-4 rounded-full transition-all duration-200 ${
                isMuted
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-orange-600 hover:bg-orange-700 text-white'
              }`}
            >
              {isMuted ? (
                <MicOff className="w-5 h-5 sm:w-6 sm:h-6" />
              ) : (
                <Mic className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </button>

            {/* Camera Toggle */}
            <button
              onClick={() => setIsCameraOn(!isCameraOn)}
              className={`p-3 sm:p-4 rounded-full transition-all duration-200 ${
                !isCameraOn
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-orange-600 hover:bg-orange-700 text-white'
              }`}
            >
              {isCameraOn ? (
                <Video className="w-5 h-5 sm:w-6 sm:h-6" />
              ) : (
                <VideoOff className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </button>

            {/* End Call */}
            <button
              onClick={onExitCall}
              className="p-3 sm:p-4 bg-red-600 hover:bg-red-700 rounded-full transition-all duration-200 text-white"
            >
              <PhoneOff className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};