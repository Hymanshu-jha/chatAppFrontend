import React, { useState, useEffect, useRef } from 'react';
import {
  PhoneOff,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { useZegoCall } from '../hooks/useZegoCall.js';
import { useSelector } from 'react-redux';

export const VideoCallComponent = ({ room, onExitCall }) => {
  const { user } = useSelector((state) => state.auth);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isRemoteExpanded, setIsRemoteExpanded] = useState(false);

  const zegoService = useZegoCall({
    userID: user?.userId,
    userName: user.name,
    room,
  });

  console.log('zegoService', zegoService);
  console.log('remoteStream: ', zegoService?.remoteStream);

  useEffect(() => {
    const localStream = zegoService?.localStream?.zegoStream?.stream;
    const remoteStream = zegoService?.remoteStream;

    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
      localVideoRef.current.play().catch((err) =>
        console.warn('Local autoplay failed:', err)
      );
    }

    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
      remoteVideoRef.current.play().catch((err) =>
        console.warn('Remote autoplay failed:', err)
      );
    }
  }, [
    zegoService?.localStream?.zegoStream?.stream,
    zegoService?.remoteStream,
  ]);

  return (
    <div className="w-full h-screen flex flex-col bg-gradient-to-br from-gray-900 to-black text-orange-100 overflow-hidden">
      {/* Debug Info */}
      <div className="absolute top-2 left-2 z-50 bg-black bg-opacity-70 p-2 rounded text-xs max-w-xs">
        <div>Local Stream: {zegoService?.localStream ? '✓' : '✗'}</div>
        <div>Remote Streams: {zegoService?.remoteStream?.length || 0}</div>
        <div>User: {user?.name}</div>
        <div>Room: {room?._id}</div>
      </div>

      {/* Video Container */}
      <div className="flex-1 relative p-2 pb-24 w-full overflow-hidden">
        {/* Single Remote Video */}
        {zegoService?.remoteStream && !Array.isArray(zegoService.remoteStream) && (
          <div
            className={`w-full h-full flex items-center justify-center transition-all duration-300`}
            onClick={() => setIsRemoteExpanded(!isRemoteExpanded)}
          >
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              muted={false}
              className={`w-full h-full object-cover border border-orange-700 ${
                isRemoteExpanded
                  ? 'rounded-none'
                  : 'rounded-lg max-h-[60vh] sm:max-h-[70vh]'
              }`}
            />
            <div className="absolute top-2 left-2 bg-black bg-opacity-70 px-2 py-1 rounded text-xs">
              Remote User
            </div>
            <div className="absolute top-2 right-2 bg-black bg-opacity-70 p-1 rounded">
              {isRemoteExpanded ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </div>
          </div>
        )}

        {/* Multiple Remote Streams */}
        {Array.isArray(zegoService?.remoteStream) &&
          zegoService.remoteStream.length > 0 && (
            <div
              className={`grid gap-2 p-2 w-full h-full ${
                isRemoteExpanded
                  ? 'grid-cols-1'
                  : zegoService.remoteStream.length === 1
                  ? 'grid-cols-1 sm:grid-cols-1'
                  : zegoService.remoteStream.length === 2
                  ? 'grid-cols-1 sm:grid-cols-2'
                  : 'grid-cols-2 sm:grid-cols-3'
              }`}
            >
              {zegoService.remoteStream.map((streamObj, index) => (
                <div
                  key={streamObj?.streamID || index}
                  className="relative w-full h-full cursor-pointer rounded-lg overflow-hidden border border-orange-700"
                  onClick={() => setIsRemoteExpanded(!isRemoteExpanded)}
                >
                  <video
                    autoPlay
                    playsInline
                    muted={false}
                    ref={(el) => {
                      if (el && streamObj?.zegoStream) {
                        el.srcObject = streamObj.zegoStream;
                        el.play().catch((err) =>
                          console.warn('Remote autoplay failed:', err)
                        );
                      }
                    }}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-1 left-1 bg-black bg-opacity-70 px-1 py-0.5 rounded text-xs">
                    User {index + 1}
                  </div>
                  <div className="absolute top-1 right-1 bg-black bg-opacity-70 p-1 rounded">
                    {isRemoteExpanded ? (
                      <Minimize2 className="w-3 h-3" />
                    ) : (
                      <Maximize2 className="w-3 h-3" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

        {/* Placeholder when no remote */}
        {(!zegoService?.remoteStream ||
          (Array.isArray(zegoService?.remoteStream) &&
            zegoService.remoteStream.length === 0)) && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <Video className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2" />
              <p className="text-sm sm:text-base">
                Waiting for others to join...
              </p>
            </div>
          </div>
        )}

        {/* Local Video - floating picture-in-picture */}
<div
  className={`absolute z-50 ${
    isRemoteExpanded
      ? 'bottom-2 right-2 w-40 h-40 sm:w-32 sm:h-24'
      : 'bottom-4 right-4 w-36 h-24 sm:w-40 sm:h-28'
  }`}
>
  <video
    ref={localVideoRef}
    autoPlay
    muted
    playsInline
    className="w-full h-full rounded-lg object-cover border border-orange-700 shadow-lg bg-gray-800"
  />
  <div className="absolute bottom-0 left-0 bg-black bg-opacity-70 px-1 py-0.5 rounded-tr text-xs">
    You
  </div>
  {!isCameraOn && (
    <div className="absolute inset-0 bg-gray-800 rounded-lg flex items-center justify-center">
      <VideoOff className="w-4 h-4 sm:w-6 sm:h-6 text-gray-400" />
    </div>
  )}
</div>

      </div>

      {/* Bottom Control Bar (now in normal flow) */}
      <div className="w-full bg-black bg-opacity-80 backdrop-blur-sm border-t border-orange-800">
        <div className="flex justify-center items-center py-3 px-4">
          <div className="flex space-x-3 sm:space-x-4">
            {/* Microphone Toggle */}
            <button
              onClick={() => {
                setIsMuted(!isMuted);
                // TODO: integrate with Zego SDK
              }}
              className={`p-2 sm:p-3 rounded-full transition-all duration-200 ${
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
              onClick={() => {
                setIsCameraOn(!isCameraOn);
                // TODO: integrate with Zego SDK
              }}
              className={`p-2 sm:p-3 rounded-full transition-all duration-200 ${
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
              className="p-2 sm:p-3 bg-red-600 hover:bg-red-700 rounded-full transition-all duration-200 text-white"
            >
              <PhoneOff className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
