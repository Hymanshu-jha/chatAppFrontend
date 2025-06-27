// Converted CreateGroupPage with Tailwind CSS
import React, { useEffect, useState } from 'react';
import { useSocket } from '../context/WebSocketContext';



const baseURL = import.meta.env.VITE_API_URL;

export const CreateGroupPage = () => {

  const { getGlobalSocketRef } = useSocket();

  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [name, setName] = useState('');
  const [availableContacts, setAvailableContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState('');

  const filteredContacts = availableContacts.filter(contact =>
    contact.name?.toLowerCase().includes(name.toLowerCase()) ||
    contact.emailid?.toLowerCase().includes(name.toLowerCase()) ||
    contact._id?.toLowerCase().includes(name.toLowerCase())
  );

  const handleContactSelect = (contact) => {
    const isSelected = selectedContacts.find(c => c._id === contact._id);
    if (!isSelected) {
      setSelectedContacts([...selectedContacts, contact]);
    }
  };

  useEffect(() => {
    const handleSearch = async () => {
      if (!name || name.trim().length < 2) {
        setSearchError('');
        return;
      }

      setIsLoading(true);
      setSearchError('');

      try {
        const res = await fetch(`${baseURL}/api/v1/user/getUserList/${encodeURIComponent(name.trim())}`, {
          credentials: 'include'
        });

        if (!res.ok) {
          if (res.status === 404) {
            setSearchError('No users found with this search term');
            return;
          }
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        const userList = data?.userList || data?.users || data || [];

        if (!Array.isArray(userList)) {
          setSearchError('Invalid response format');
          return;
        }

        if (userList.length === 0) {
          setSearchError('No users found');
        }

        setAvailableContacts(userList);

      } catch (error) {
        setSearchError('Failed to search users. Please try again.');
        setAvailableContacts([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(handleSearch, 300);
    return () => clearTimeout(timeoutId);
  }, [name]);

  const handleCreateGroup = (e) => {
    e.preventDefault();

    if (!groupName.trim()) return alert('Please enter a group name');
    if (selectedContacts.length === 0) return alert('Please select at least one contact');

    const socket = getGlobalSocketRef();

    if (!socket || socket.readyState !== WebSocket.OPEN) return alert('Connection error. Please try again.');

    socket.send(JSON.stringify({
      type: 'group_create',
      name: groupName,
      description: groupDescription,
      members: selectedContacts
    }));

    setGroupName('');
    setGroupDescription('');
    setSelectedContacts([]);
    setName('');
    setAvailableContacts([]);
    setSearchError('');
  };

  const removeSelectedContact = (contactId) => {
    setSelectedContacts(selectedContacts.filter(c => c._id !== contactId));
  };

  return (
    <div className="p-4 space-y-6 max-w-3xl mx-auto">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-semibold text-green-800">Create New Group</h2>
        <p className="text-sm text-green-600">Start a conversation with multiple people</p>
      </div>

      <form onSubmit={handleCreateGroup} className="space-y-6">
        <div className="bg-white shadow rounded-lg p-4 space-y-4 border-l-4 border-green-300">
          <h3 className="text-lg font-semibold text-green-800">Group Information</h3>

          <div>
            <label className="block text-sm font-medium text-green-800">Group Name *</label>
            <input type="text" className="mt-1 w-full border border-green-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-green-200" maxLength={50} value={groupName} onChange={(e) => setGroupName(e.target.value)} />
            <p className="text-xs text-right text-green-600">{groupName.length}/50</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-green-800">Description (Optional)</label>
            <textarea className="mt-1 w-full border border-green-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-green-200" rows={3} maxLength={200} value={groupDescription} onChange={(e) => setGroupDescription(e.target.value)} />
            <p className="text-xs text-right text-green-600">{groupDescription.length}/200</p>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-4 space-y-4 border-l-4 border-green-300">
          <h3 className="text-lg font-semibold text-green-800">Add Members ({selectedContacts.length})</h3>

          {selectedContacts.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-green-800 mb-2">Selected Members:</h4>
              <div className="flex flex-wrap gap-2">
                {selectedContacts.map(contact => (
                  <div key={contact._id} className="flex items-center bg-gradient-to-r from-green-700 to-green-300 text-white px-3 py-1 rounded-full text-sm">
                    <span className="mr-2 font-bold bg-white/20 px-2 py-1 rounded-full text-xs">{contact.name?.charAt(0).toUpperCase() || '?'}</span>
                    <span className="truncate max-w-[100px]">{contact.name}</span>
                    <button onClick={() => removeSelectedContact(contact._id)} className="ml-2 text-white hover:bg-white/20 rounded-full p-1">
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <input type="text" placeholder="Search contacts (min 2 characters)..." className="w-full border border-green-300 rounded-full px-4 py-2 focus:outline-none focus:ring focus:ring-green-200" value={name} onChange={(e) => setName(e.target.value)} />
            {isLoading && <div className="text-sm text-green-600 mt-2">Searching...</div>}
            {searchError && <div className="text-sm text-red-500 mt-2">{searchError}</div>}
          </div>

          <div className="max-h-64 overflow-y-auto">
            {name.trim().length < 2 ? (
              <p className="text-center text-green-600 opacity-70">Type at least 2 characters to search for contacts</p>
            ) : filteredContacts.length === 0 && !isLoading ? (
              <p className="text-center text-green-600 opacity-70">No contacts found</p>
            ) : (
              <div className="flex flex-col gap-2">
                {filteredContacts.map(contact => {
                  const isSelected = selectedContacts.find(c => c._id === contact._id);
                  return (
                    <div key={contact._id} onClick={() => handleContactSelect(contact)} className={`flex items-center p-3 rounded-md border cursor-pointer transition-all ${isSelected ? 'bg-green-100 border-green-400' : 'bg-white border-transparent hover:border-green-300 shadow-sm'}`}>
                      <div className="w-9 h-9 rounded-full bg-gradient-to-r from-green-700 to-green-300 text-white flex items-center justify-center mr-3 font-bold">
                        {contact.name?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-green-800">{contact.name || 'Unknown'}</p>
                        <p className="text-xs text-green-600">{contact.emailid || 'No email'}</p>
                      </div>
                      {isSelected && <div className="w-5 h-5 bg-green-700 text-white flex items-center justify-center rounded-full text-xs">✓</div>}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 border-t pt-4">
          <button type="button" onClick={() => {
            setGroupName('');
            setGroupDescription('');
            setSelectedContacts([]);
            setName('');
            setAvailableContacts([]);
            setSearchError('');
          }} className="px-4 py-2 border border-green-300 text-green-700 bg-white rounded-md hover:border-green-500">
            Clear All
          </button>

          <button type="submit" disabled={!groupName.trim() || selectedContacts.length === 0} className="px-4 py-2 bg-gradient-to-r from-green-700 to-green-400 text-white rounded-md font-semibold disabled:opacity-60 disabled:cursor-not-allowed">
            Create Group
          </button>
        </div>
      </form>
    </div>
  );
};