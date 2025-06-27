import { useSelector } from 'react-redux';
import { useState } from 'react';

export const MessageOpenBox = ({ messages, onDeleteMessage }) => {
  const { user } = useSelector((state) => state.auth);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const getName = (room) => {
    if (room?.isGroup) return room?.roomName;
    const [member1, member2] = room?.members;
    return user?.emailid === member1?.emailid ? member2.name : member1.name;
  };

  return (
    <div className="bg-gray-950 border border-gray-800 p-4 rounded-lg max-h-[600px] overflow-y-auto flex flex-col shadow-2xl">
      {messages?.length > 0 ? (
        <div className="flex flex-col space-y-3">
          {messages.map((msg, index) => {
            const isSent = msg?.sender?._id === user?._id;
            const alignment = isSent ? 'self-end' : 'self-start';
            const bubbleColor = isSent
              ? 'bg-gradient-to-br from-blue-600 to-orange-700 text-white shadow-lg'
              : 'bg-gradient-to-br from-gray-800 to-gray-900 text-gray-100 shadow-lg';
            const triangleStyles = isSent
              ? 'after:absolute after:top-full after:right-3 after:border-t-[8px] after:border-t-orange-700 after:border-x-[8px] after:border-x-transparent'
              : 'after:absolute after:bottom-full after:left-3 after:border-b-[8px] after:border-b-gray-800 after:border-x-[8px] after:border-x-transparent';

            return (
              <div
                key={msg._id || index}
                className={`relative max-w-[85%] px-4 py-3 rounded-2xl border ${
                  isSent 
                    ? 'border-orange-500/30 bg-gradient-to-br from-gray-600 to-gray-700' 
                    : 'border-gray-700/50 bg-gradient-to-br  from-blue-800 to-blue-900'
                } ${alignment} ${triangleStyles} backdrop-blur-sm`}
              >
                <div className="flex justify-between items-start gap-3">
                  <p className={`text-sm leading-relaxed ${
                    isSent ? 'text-white' : 'text-gray-100'
                  }`}>
                    {msg.message}
                  </p>

                  <div className="relative flex-shrink-0">
                    <button
                      onClick={() =>
                        setOpenDropdownId(openDropdownId === msg._id ? null : msg._id)
                      }
                      className={`text-lg px-2 py-1 rounded-full transition-all duration-200 ${
                        isSent 
                          ? 'text-orange-200 hover:bg-orange-800/50 hover:text-white' 
                          : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-200'
                      }`}
                    >
                      ⋮
                    </button>

                    {openDropdownId === msg._id && (
                      <div
                        className={`absolute ${
                          isSent ? 'right-0' : 'left-0'
                        } top-8 bg-gray-900 border border-gray-700 shadow-2xl rounded-lg text-sm z-50 w-max min-w-[170px] overflow-hidden backdrop-blur-sm`}
                      >
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            onDeleteMessage(msg._id, 'me');
                            setOpenDropdownId(null);
                          }}
                          className="block w-full px-4 py-3 text-left text-gray-200 hover:bg-orange-600/20 hover:text-orange-300 transition-all duration-200 border-b border-gray-800 last:border-b-0"
                        >
                          Delete for me
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            onDeleteMessage(msg._id, 'everyone');
                            setOpenDropdownId(null);
                          }}
                          className="block w-full px-4 py-3 text-left text-red-400 hover:bg-red-600/20 hover:text-red-300 transition-all duration-200"
                        >
                          Delete for everyone
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <p
                  className={`text-xs mt-2 ${
                    isSent ? 'text-orange-200/80' : 'text-gray-400'
                  }`}
                >
                  {new Date(msg?.createdAt || Date.now()).toLocaleTimeString()}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-600/20 to-orange-700/20 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <p className="text-orange-400 font-medium text-center">
            No messages to show
          </p>
          <p className="text-gray-500 text-sm text-center mt-1">
            Start a conversation to see messages here
          </p>
        </div>
      )}
    </div>
  );
};