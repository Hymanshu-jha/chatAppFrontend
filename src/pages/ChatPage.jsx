const baseURL = import.meta.env.VITE_API_URL; 
// ChatPage.jsx (Refactored)
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useRooms } from '../hooks/useRooms';
import { useMessages } from '../hooks/useMessages';
import { useChatActions } from '../hooks/useChatActions';
import { MessageOpenBox } from '../components/MessageOpenBox';
import { MessageRoomList } from '../components/MessageRoomList';
import { AddContactsPage } from './AddContactsPage';
import { CreateGroupPage } from './CreateGroupPage';
import { VideoCallComponent } from '../components/VideoCallComponent';


import { useChat } from '../context/ChatContext';

export default function ChatPage() {
  const { user } = useSelector((state) => state.auth);

  
  
  
  const chatContext = useChat();

  // Video call state
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [videoCallRoom, setVideoCallRoom] = useState(null);
  const [isTextChatActive, setIsTextChatActive] = useState(true);

  // Data fetching hooks
  useRooms(chatContext.setRooms);
  useMessages(chatContext.selectedRoomRef, chatContext.setMessages);
  
  // Action handlers
  const actions = useChatActions(chatContext, user);

  // Video call handler
  const handleVideoCall = async () => {
    setIsVideoCallActive(true);
    setIsTextChatActive(false);
    setVideoCallRoom(chatContext.selectedRoom);
  };

  // Exit video call handler
  const handleExitVideoCall = () => {
    setIsVideoCallActive(false);
    setIsTextChatActive(true);
    setVideoCallRoom(null);
  };

  // If video call is active, render only the VideoCallComponent
  if (isVideoCallActive) {
    return (
      <VideoCallComponent 
        room={chatContext?.selectedRoomRef?.current}
        onExitCall={handleExitVideoCall}
      />
    );
  }

  const renderLeftPanel = () => {
    switch (chatContext.activeTab) {
      case 'contacts':
        return (
          <AddContactsPage 
            searchQuery={chatContext.searchQuery}
            foundUsers={chatContext.foundUsers}
            handleSearchInput={actions.handleSearchInput}
            handleAddRooms={actions.handleAddRooms}
            handleAddSearchQuery={actions.handleAddSearchQuery}
            setSearchQuery={chatContext.setSearchQuery}
            setFoundUsers={chatContext.setFoundUsers}
          />
        );
      case 'groups':
        return <CreateGroupPage />;
      case 'chats':
      default:
        return (
          <div className="h-full flex flex-col">
            <div className="mb-4">
              <button className="px-4 py-2 text-sm font-bold rounded-full bg-blue-500 text-white">
                Rooms ({chatContext.rooms.length})
              </button>
            </div>
            <MessageRoomList
              rooms={chatContext.rooms}
              selectedRoomId={chatContext.selectedRoomId}
              setRoomId={actions.handleClick}
            />
          </div>
        );
    }
  };

return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 to-black font-sans">
      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-orange-600 text-white rounded-lg shadow-lg"
        onClick={() => chatContext.setIsMobileMenuOpen(!chatContext.isMobileMenuOpen)}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {chatContext.isMobileMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Overlay */}
      {chatContext.isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-70 z-30"
          onClick={() => chatContext.setIsMobileMenuOpen(false)}
        />
      )}

      {/* Vertical Navigation Bar */}
      <div className={`
        ${chatContext.isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 fixed md:relative z-40 
        w-16 md:w-16 lg:w-16 xl:hover:w-48 
        bg-gradient-to-b from-gray-900 to-black 
        flex flex-col items-center py-4 md:py-5 border-r-2 border-orange-800 
        transition-all duration-300 ease-in-out h-full group
      `}>
        <div className="mb-6 md:mb-8 text-center">
          <h3 className="text-orange-200 text-sm md:text-base m-0 opacity-0 xl:group-hover:opacity-100 transition-opacity duration-300">
            Chat App
          </h3>
        </div>

        <div className="flex-1 flex flex-col gap-3 md:gap-4 w-full">
          <button 
            className={`flex items-center justify-start px-3 md:px-5 py-2 md:py-3 mx-1 md:mx-2 rounded-lg transition-all duration-300 relative overflow-hidden group/item ${
              chatContext.activeTab === 'chats' 
                ? 'bg-orange-600 text-white' 
                : 'text-orange-300 hover:bg-orange-600/20 hover:text-orange-200'
            }`}
            onClick={() => actions.handleTabChange('chats')}
          >
            <svg className="w-4 h-4 md:w-5 md:h-5 min-w-[16px] md:min-w-[20px] transition-transform duration-300" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
            </svg>
            <span className="ml-3 md:ml-4 text-xs md:text-sm font-medium opacity-0 xl:group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              Chats
            </span>
          </button>
          
          <button 
            className={`flex items-center justify-start px-3 md:px-5 py-2 md:py-3 mx-1 md:mx-2 rounded-lg transition-all duration-300 relative overflow-hidden group/item ${
              chatContext.activeTab === 'contacts' 
                ? 'bg-orange-600 text-white' 
                : 'text-orange-300 hover:bg-orange-600/20 hover:text-orange-200'
            }`}
            onClick={() => actions.handleTabChange('contacts')}
          >
            <svg className="w-4 h-4 md:w-5 md:h-5 min-w-[16px] md:min-w-[20px] transition-transform duration-300" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 4c0-1.11.89-2 2-2s2 .89 2-2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A3.004 3.004 0 0 0 16.96 6c-.8 0-1.54.37-2.01.97L12 10.5 9.05 6.97A3.004 3.004 0 0 0 6.04 6c-1.18 0-2.25.66-2.81 1.72L1.5 16H4v6h2v-6h1.5l1.87-5.61L12 14l2.63-3.61L16.5 16H18v6h2z"/>
            </svg>
            <span className="ml-3 md:ml-4 text-xs md:text-sm font-medium opacity-0 xl:group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              Add Contacts
            </span>
          </button>
          
          <button 
            className={`flex items-center justify-start px-3 md:px-5 py-2 md:py-3 mx-1 md:mx-2 rounded-lg transition-all duration-300 relative overflow-hidden group/item ${
              chatContext.activeTab === 'groups' 
                ? 'bg-orange-600 text-white' 
                : 'text-orange-300 hover:bg-orange-600/20 hover:text-orange-200'
            }`}
            onClick={() => actions.handleTabChange('groups')}
          >
            <svg className="w-4 h-4 md:w-5 md:h-5 min-w-[16px] md:min-w-[20px] transition-transform duration-300" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
            </svg>
            <span className="ml-3 md:ml-4 text-xs md:text-sm font-medium opacity-0 xl:group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              Create Group
            </span>
          </button>

         


        </div>
        
        <div className="mt-auto w-full px-1 md:px-2">
          <div className="flex items-center p-1 md:p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-300 cursor-pointer">
            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-r from-orange-500 to-orange-700 flex items-center justify-center text-white font-bold text-xs">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="ml-2 flex flex-col opacity-0 xl:group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-orange-200 text-xs font-medium truncate max-w-20 md:max-w-24">
                {user?.name || 'Unknown'}
              </span>
              <span className={`text-xs ${chatContext.isConnected ? 'text-green-400' : 'text-red-400'}`}>
                {chatContext.isConnected ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Left Panel - Dynamic Content */}
      <div className={`
        ${chatContext.isMobileMenuOpen || chatContext.selectedRoomId ? 'hidden' : 'block'}
        ${chatContext.selectedRoomId ? 'md:block' : 'block'}
        w-full md:w-72 lg:w-80 xl:w-96 bg-gradient-to-b from-gray-800 to-gray-900 
        flex flex-col overflow-hidden border-r-2 border-orange-800
        ${chatContext.selectedRoomId ? 'md:hidden lg:flex' : 'md:flex'}
      `}>
        <div className="p-4 md:p-5 h-full overflow-y-auto">
          <div className="pt-12 md:pt-0">
            {renderLeftPanel()}
          </div>
        </div>
      </div>

      {/* Right Panel - Messages */}
      <div className={`
        flex-1 bg-gradient-to-b from-gray-700 to-gray-800 flex-col overflow-hidden
        ${chatContext.isMobileMenuOpen ? 'hidden' : 'flex'}
        ${!chatContext.selectedRoomId ? 'hidden md:flex lg:flex' : 'flex'}
      `}>
        {!chatContext.isConnected ? (
          <div className="flex-1 flex items-center justify-center text-center p-4 md:p-5">
            <div>
              <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <h2 className="text-lg md:text-xl font-semibold text-orange-200 mb-2">Connecting...</h2>
              <p className="text-sm md:text-base text-orange-300">Establishing connection to chat server...</p>
            </div>
          </div>
        ) : chatContext.activeTab === 'chats' && chatContext.selectedRoomId && chatContext.selectedRoom ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 md:p-5 pb-2 md:pb-3 border-b border-orange-700/50">
              <div className="flex items-center min-w-0 flex-1">
                <button
                  className="md:hidden mr-3 p-1 rounded-lg hover:bg-orange-600/20"
                  onClick={() => chatContext.setSelectedRoomId(null)}
                >
                  <svg className="w-5 h-5 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                {/* Chat/Group Name - Always visible */}
                <h2 className="text-lg md:text-xl font-semibold text-orange-100 truncate">
                  {actions.getName(chatContext.selectedRoomRef.current)}
                </h2>
              </div>

              <div className="flex items-center space-x-2 ml-3">
                <button
                  title="Audio Call"
                  className="p-2 rounded-full hover:bg-orange-600/20 transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-7 h-7 text-orange-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </button>

                <button
                  title="Video Call"
                  className="p-2 rounded-full hover:bg-orange-600/20 transition"
                  onClick={handleVideoCall}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-7 h-7 text-orange-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M4 6h8a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z" />
                  </svg>
                </button>
              </div>
            </div> 

            {/* Messages Area */}
            <div className="flex-1 flex flex-col overflow-hidden p-4 md:p-5 pt-2 md:pt-3 pb-0">
              <div className="flex-1 overflow-hidden">
                <MessageOpenBox
                  messages={chatContext.messages}
                  onDeleteMessage={actions.handleDeleteMessage}
                />
              </div>
            </div>

            {/* Message Input */}
            <div className="p-4 md:p-5 pt-2 md:pt-3">
              <div className="flex items-center relative">
                <input
                  type="text"
                  placeholder="Enter message here..."
                  value={chatContext.toSendMessage}
                  onChange={(e) => chatContext.setToSendMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && actions.handleSendButton(e)}
                  className="flex-1 py-2 md:py-3 px-3 md:px-4 pr-10 md:pr-12 text-sm md:text-base border border-orange-600 rounded-full outline-none shadow-sm bg-gray-800 text-orange-100 placeholder-orange-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <button 
                  onClick={actions.handleSendButton}
                  className="absolute right-1 md:right-2 p-1.5 md:p-2 rounded-full hover:bg-orange-600/20 transition-colors duration-200"
                  title="Send"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#f97316"
                    height="16"
                    width="16"
                    viewBox="0 0 24 24"
                    className="md:w-5 md:h-5 hover:scale-110 transition-transform duration-200"
                  >
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center p-4 md:p-5">
            {chatContext.activeTab === 'chats' ? (
              <div>
                <div className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-4 md:mb-6 bg-orange-600/20 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 md:w-12 md:h-12 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                  </svg>
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-orange-200 mb-2 md:mb-3">Select a chat to start messaging</h3>
                <p className="text-orange-300 text-base md:text-lg">Choose from your existing conversations or start a new one</p>
              </div>
            ) : chatContext.activeTab === 'contacts' ? (
              <div>
                <div className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-4 md:mb-6 bg-orange-600/20 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 md:w-12 md:h-12 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A3.004 3.004 0 0 0 16.96 6c-.8 0-1.54.37-2.01.97L12 10.5 9.05 6.97A3.004 3.004 0 0 0 6.04 6c-1.18 0-2.25.66-2.81 1.72L1.5 16H4v6h2v-6h1.5l1.87-5.61L12 14l2.63-3.61L16.5 16H18v6h2z"/>
                  </svg>
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-orange-200 mb-2 md:mb-3">Add New Contacts</h3>
                <p className="text-orange-300 text-base md:text-lg">Search and add new people to your contact list</p>
              </div>
            ) : (
              <div>
                <div className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-4 md:mb-6 bg-orange-600/20 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 md:w-12 md:h-12 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
                  </svg>
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-orange-200 mb-2 md:mb-3">Create New Group</h3>
                <p className="text-orange-300 text-base md:text-lg">Start a group conversation with multiple people</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export const getGlobalSocketRef = () => {
  return ( socketContext || null );
};