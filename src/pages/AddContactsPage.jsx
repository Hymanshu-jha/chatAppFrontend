import React from 'react';
import './css/AddContactsPage.css';

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
    <div className="add-contacts-container">
      <div className="add-contacts-header">
        <h2>Add New Contacts</h2>
        <p>Search for users by their email address</p>
      </div>

      <div className="search-section">
        <div className="search-input-container">
          <input
            type="text"
            placeholder="Enter email address..."
            value={searchQuery}
            onChange={handleSearchInput}
            className="contact-search-input"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAddRooms(e);
              }
            }}
          />
          <div className="search-buttons">
            <button 
              className="search-btn"
              onClick={handleAddRooms}
              disabled={!searchQuery.trim()}
            >
              <svg className="search-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
              Search
            </button>
            {(searchQuery || foundUsers.length > 0) && (
              <button 
                className="clear-btn"
                onClick={clearSearch}
              >
                <svg className="clear-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="search-results-section">
        {foundUsers.length === 0 && searchQuery ? (
          <div className="no-results-state">
            <svg className="no-results-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <h3>No users found</h3>
            <p>Try searching with a different email address</p>
          </div>
        ) : foundUsers.length === 0 && !searchQuery ? (
          <div className="empty-search-state">
            <svg className="empty-search-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            <h3>Search for Contacts</h3>
            <p>Enter an email address to find and add new contacts</p>
          </div>
        ) : (
          <div className="contacts-results">
            <h3>Search Results ({foundUsers.length})</h3>
            <div className="contacts-list">
              {foundUsers.map((foundUser, index) => (
                <div key={index} className="contact-item">
                  <div className="contact-avatar">
                    {foundUser?.name?.charAt(0)?.toUpperCase() || foundUser?.emailid?.charAt(0)?.toUpperCase()}
                  </div>
                  <div className="contact-info">
                    <div className="contact-name">
                      {foundUser?.name || 'Unknown User'}
                    </div>
                    <div className="contact-email">
                      {foundUser?.emailid}
                    </div>
                  </div>
                  <button 
                    className="add-contact-btn"
                    onClick={(e) => handleAddSearchQuery(e, foundUser)}
                    title="Add Contact"
                  >
                    <svg className="add-icon" viewBox="0 0 24 24" fill="currentColor">
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

      <div className="contacts-tips">
        <h4>Tips for finding contacts:</h4>
        <ul>
          <li>Make sure to enter the complete email address</li>
          <li>Email search is case-sensitive</li>
          <li>Only registered users will appear in search results</li>
        </ul>
      </div>
    </div>
  );
};