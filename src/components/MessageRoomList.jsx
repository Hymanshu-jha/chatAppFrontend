import React from 'react';
import { useSelector } from 'react-redux';
import Demo from './Demo';

export const MessageRoomList = ({ rooms, setRoomId, selectedRoomId }) => {
  const { user } = useSelector((state) => state.auth);

  const getName = (room) => {
      const members = room?.members;
    if (!members || members.length < 2) return 'Unknown Room';
    if (room?.isGroup) return room?.roomName;
    const [member1, member2] = room?.members;
    return user?.emailid === member1?.emailid ? member2?.name : member1?.name;
  };

  const getStatus = (room) => {
    if (room?.isGroup) return 'online';
    const [member1, member2] = room?.members;
    const other = user?.emailid === member1?.emailid ? member2 : member1;
    return other ? 'online' : 'offline';
  };

  if (!rooms || rooms.length === 0) {
    return (
      <div className="p-4 bg-gray-950 rounded-xl shadow-md max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-orange-500 mb-4 text-center">Your Chat Rooms</h2>
        <p className="text-orange-400 font-medium text-center mt-8">Your Room List is empty...</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-950 rounded-xl shadow-md max-h-[80vh] overflow-y-auto">
      <h2 className="text-xl font-bold text-orange-500 mb-4 text-center">Your Chat Rooms</h2>

      <div className="flex flex-col gap-4">
        {rooms.map((room) => {
          const isSelected = selectedRoomId === room._id;
          const status = getStatus(room);


          return (
            <div
              key={room._id}
              onClick={(e) => setRoomId(e, room)}
              className={`cursor-pointer px-4 py-3 rounded-lg transition-all duration-200 transform flex justify-between items-center 
                ${isSelected ? 'bg-black text-white font-bold text-2xl border-l-8 border-orange-600' : 'bg-gray-800 text-white text-xl border-l-8 border-orange-400 hover:bg-gray-700 hover:-translate-y-1 hover:shadow-lg'}`}
            >
              <div className="flex items-center gap-2">
                <Demo />
                <span className="truncate">{getName(room)}</span>
              </div>

              <span
                className={`inline-block w-2.5 h-2.5 rounded-full 
                  ${status === 'online' ? 'bg-orange-500' : 'bg-gray-400'}`}
              ></span>
            </div>
          );
        })}
      </div>
    </div>
  );
};