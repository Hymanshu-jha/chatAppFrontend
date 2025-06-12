import React, { useEffect, useState } from 'react';
import { getGlobalSocketRef } from './ChatPage';
import './css/CreateGroupPage.css';




export const CreateGroupPage = () => {
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [name, setName] = useState('');
  const [availableContacts, setAvailableContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState('');

  // Filter contacts based on search input
  const filteredContacts = availableContacts.filter(contact =>
    contact.name?.toLowerCase().includes(name.toLowerCase()) ||
    contact.emailid?.toLowerCase().includes(name.toLowerCase()) ||
    contact._id?.toLowerCase().includes(name.toLowerCase())
  );

  // Handle contact selection/deselection
  const handleContactSelect = (contact) => {
    const isSelected = selectedContacts.find(c => c._id === contact._id);
    
    if (isSelected) {
      //setSelectedContacts(selectedContacts.filter(c => c._id !== contact._id));
    } else {
      setSelectedContacts([...selectedContacts, contact]);
    }
  };

  // Search for users
  useEffect(() => {
    const handleSearch = async () => {
      // Don't search if name is empty or too short
      if (!name || name.trim().length < 2) {
        // setAvailableContacts([]);
        setSearchError('');
        return;
      }

      setIsLoading(true);
      setSearchError('');

      try {
        const res = await fetch(`http://localhost:8080/api/v1/user/getUserList/${encodeURIComponent(name.trim())}`, {
          credentials: 'include'
        });

        if (!res.ok) {
          if (res.status === 404) {
            setSearchError('No users found with this search term');
            // setAvailableContacts([]);
            return;
          }
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        if (!data) {
          console.log('Error while parsing the search query fetched result...');
          setSearchError('Failed to parse search results');
          // setAvailableContacts([]);
          return;
        }

        // Handle different possible response structures
        const userList = data?.userList || data?.users || data || [];

        if (!Array.isArray(userList)) {
          console.log('Invalid response format - userList is not an array');
          setSearchError('Invalid response format');
          // setAvailableContacts([]);
          return;
        }

        if (userList.length === 0) {
          console.log('No users found with this search term...');
          setSearchError('No users found');
        }

        setAvailableContacts(userList);

      } catch (error) {
        console.log('Error while fetching search query user on group page...', error.message);
        setSearchError('Failed to search users. Please try again.');
        setAvailableContacts([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce the search to avoid too many API calls
    const timeoutId = setTimeout(handleSearch, 300);
    return () => clearTimeout(timeoutId);
  }, [name]);

  

  const handleCreateGroup = (e) => {
    e.preventDefault();
    
    if (!groupName.trim()) {
      alert('Please enter a group name');
      return;
    }
    
    if (selectedContacts.length === 0) {
      alert('Please select at least one contact');
      return;
    }


    // Send group creation data via websocket
    const socket = getGlobalSocketRef();

    if (!socket) {
      console.log('socket is null in groupcreate page');
      alert('Connection error. Please try again.');
      return;
    }

    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: 'group_create', // Add message type for better handling
        name: groupName,
        description: groupDescription,
        members: selectedContacts
      }));
    } else {
      alert('Connection not ready. Please try again.');
      return;
    }

    console.log('group creation details sent successfully to backend server via websockets');
    
    // Reset form
    setGroupName('');
    setGroupDescription('');
    setSelectedContacts([]);
    setName('');
    setAvailableContacts([]);
    setSearchError('');
    
    console.log('Group created successfully!');
  };

  const removeSelectedContact = (contactId) => {
    setSelectedContacts(selectedContacts.filter(c => c._id !== contactId));
  };

  return (
    <div className="create-group-container">
      <div className="create-group-header">
        <h2>Create New Group</h2>
        <p>Start a conversation with multiple people</p>
      </div>

      <form onSubmit={handleCreateGroup} className="group-form">
        <div className="form-section">
          <h3>Group Information</h3>
          
          <div className="form-group">
            <label htmlFor="groupName">Group Name *</label>
            <input
              id="groupName"
              type="text"
              placeholder="Enter group name..."
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="form-input"
              maxLength={50}
            />
            <small className="char-count">{groupName.length}/50</small>
          </div>

          <div className="form-group">
            <label htmlFor="groupDescription">Description (Optional)</label>
            <textarea
              id="groupDescription"
              placeholder="What's the group about?"
              value={groupDescription}
              onChange={(e) => setGroupDescription(e.target.value)}
              className="form-textarea"
              rows={3}
              maxLength={200}
            />
            <small className="char-count">{groupDescription.length}/200</small>
          </div>
        </div>

        <div className="form-section">
          <h3>Add Members ({selectedContacts.length})</h3>
          
          {selectedContacts.length > 0 && (
            <div className="selected-contacts">
              <h4>Selected Members:</h4>
              <div className="selected-list">
                {selectedContacts.map(contact => (
                  <div key={contact._id} className="selected-contact">
                    <div className="selected-contact-avatar">
                      {contact.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <span className="selected-contact-name">{contact.name}</span>
                    <button
                      type="button"
                      className="remove-contact-btn"
                      onClick={() => removeSelectedContact(contact._id)}
                      title="Remove from group"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="contact-search">
            <input
              type="text"
              placeholder="Search contacts (min 2 characters)..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="contact-search-input"
            />
            {isLoading && <div className="search-loading">Searching...</div>}
            {searchError && <div className="search-error">{searchError}</div>}
          </div>

          <div className="available-contacts">
            {name.trim().length < 2 ? (
              <div className="no-contacts">
                <p>Type at least 2 characters to search for contacts</p>
              </div>
            ) : filteredContacts.length === 0 && !isLoading ? (
              <div className="no-contacts">
                <p>No contacts found</p>
              </div>
            ) : (
              <div className="contacts-grid">
                {filteredContacts.map(contact => (
                  <div
                    key={contact._id}
                    className={`contact-card ${selectedContacts.find(c => c._id === contact._id) ? 'selected' : ''}`}
                    onClick={() => handleContactSelect(contact)}
                  >
                    <div className="contact-card-avatar">
                      {contact.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div className="contact-card-info">
                      <div className="contact-card-name">{contact.name || 'Unknown'}</div>
                      <div className="contact-card-email">{contact.emailid || 'No email'}</div>
                    </div>
                    {selectedContacts.find(c => c._id === contact._id) && (
                      <div className="contact-selected-indicator">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => {
              setGroupName('');
              setGroupDescription('');
              setSelectedContacts([]);
              setName('');
              setAvailableContacts([]);
              setSearchError('');
            }}
          >
            Clear All
          </button>
          <button
            type="submit"
            className="create-btn"
            disabled={!groupName.trim() || selectedContacts.length === 0}
          >
            <svg className="create-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
            </svg>
            Create Group
          </button>
        </div>
      </form>
    </div>
  );
};