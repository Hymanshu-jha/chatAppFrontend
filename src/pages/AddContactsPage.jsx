import React from 'react';

export const AddContactsPage = ({ 
  searchQuery, 
  foundUsers, 
  handleSearchInput, 
  handleAddRooms, 
  handleAddSearchQuery,
  setSearchQuery,
  setFoundUsers 
}) => {

  const clearSearch = () => {
    setSearchQuery('');
    setFoundUsers([]);
  };

  return (
    <div className="h-full flex flex-col px-4 md:px-8 py-6 overflow-y-auto">
      <div className="pb-6 border-b-2 border-white/30 mb-5">
        <h2 className="text-2xl font-semibold text-green-900 mb-1">Add New Contacts</h2>
        <p className="text-green-700 text-sm">Search for users by their email address</p>
      </div>

      <div className="mb-6">
        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Enter email address..."
            value={searchQuery}
            onChange={handleSearchInput}
            onKeyDown={(e) => e.key === 'Enter' && handleAddRooms(e)}
            className="px-4 py-3 rounded-full border-2 border-green-300 text-sm focus:outline-none focus:border-green-700 focus:ring-2 focus:ring-green-200"
          />
          <div className="flex gap-3">
            <button
              onClick={handleAddRooms}
              disabled={!searchQuery.trim()}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white bg-gradient-to-r from-green-800 to-green-400 disabled:bg-gray-400 disabled:cursor-not-allowed hover:shadow-lg hover:-translate-y-[2px] transition"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zM9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
              Search
            </button>
            {(searchQuery || foundUsers.length > 0) && (
              <button
                onClick={clearSearch}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white bg-red-400 hover:bg-red-500 hover:shadow-lg hover:-translate-y-[2px] transition"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto mb-5">
        {foundUsers.length === 0 && searchQuery ? (
          <div className="flex flex-col items-center justify-center text-center py-12 text-green-700">
            <svg className="w-12 h-12 mb-4 opacity-60" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <h3 className="text-lg font-semibold text-green-900 mb-1">No users found</h3>
            <p className="text-sm opacity-80">Try searching with a different email address</p>
          </div>
        ) : foundUsers.length === 0 && !searchQuery ? (
          <div className="flex flex-col items-center justify-center text-center py-12 text-green-700">
            <svg className="w-12 h-12 mb-4 opacity-60" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zM9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            <h3 className="text-lg font-semibold text-green-900 mb-1">Search for Contacts</h3>
            <p className="text-sm opacity-80">Enter an email address to find and add new contacts</p>
          </div>
        ) : (
          <div>
            <h3 className="text-green-900 font-semibold text-lg mb-4">Search Results ({foundUsers.length})</h3>
            <div className="flex flex-col gap-4">
              {foundUsers.map((user, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-md border-l-4 border-green-300 hover:border-green-700 transition"
                >
                  <div className="w-10 h-10 flex items-center justify-center text-white bg-gradient-to-r from-green-800 to-green-400 rounded-full text-lg font-bold">
                    {user?.name?.charAt(0)?.toUpperCase() || user?.emailid?.charAt(0)?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-green-900 font-semibold text-sm truncate">{user?.name || 'Unknown User'}</div>
                    <div className="text-green-700 text-xs truncate opacity-80">{user?.emailid}</div>
                  </div>
                  <button
                    onClick={(e) => handleAddSearchQuery(e, user)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded-full shadow-md transition"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                    </svg>
                    Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-white/70 p-4 rounded-lg border-l-4 border-yellow-400 mt-auto">
        <h4 className="text-yellow-900 font-semibold text-sm mb-2">Tips for finding contacts:</h4>
        <ul className="list-disc list-inside text-yellow-800 text-sm space-y-1">
          <li>Make sure to enter the complete email address</li>
          <li>Email search is case-sensitive</li>
          <li>Only registered users will appear in search results</li>
        </ul>
      </div>
    </div>
  );
};
