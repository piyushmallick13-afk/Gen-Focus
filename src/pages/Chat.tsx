import React, { useState, useEffect, useRef } from 'react';
import { initAuth, googleSignIn, getAccessToken, logout } from '../lib/auth';
import { User } from 'firebase/auth';
import { MessageSquare, Send, LogOut } from 'lucide-react';

interface Space {
  name: string;
  displayName: string;
  type: string;
  spaceType: string;
}

interface Message {
  name: string;
  text: string;
  createTime: string;
  sender: {
    displayName: string;
  };
}

export default function Chat() {
  const [needsAuth, setNeedsAuth] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [activeSpace, setActiveSpace] = useState<Space | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setUser(user);
        setNeedsAuth(false);
        fetchSpaces(token);
      },
      () => {
        setNeedsAuth(true);
        setUser(null);
      }
    );
    return () => unsubscribe();
  }, []);

  const fetchSpaces = async (token?: string) => {
    setLoading(true);
    try {
      const accessToken = token || await getAccessToken();
      const res = await fetch('https://chat.googleapis.com/v1/spaces', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      if (data.spaces) {
        setSpaces(data.spaces);
      }
    } catch (err) {
      console.error('Error fetching spaces:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (spaceName: string) => {
    setLoading(true);
    try {
      const accessToken = await getAccessToken();
      const res = await fetch(`https://chat.googleapis.com/v1/${spaceName}/messages`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      if (data.messages) {
        setMessages(data.messages.reverse()); // Chat API returns oldest first usually, but we'll sort or just use as is
      } else {
        setMessages([]);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSpaceSelect = (space: Space) => {
    setActiveSpace(space);
    fetchMessages(space.name);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeSpace) return;

    try {
      const accessToken = await getAccessToken();
      const res = await fetch(`https://chat.googleapis.com/v1/${activeSpace.name}/messages`, {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: newMessage })
      });
      if (res.ok) {
        setNewMessage('');
        fetchMessages(activeSpace.name); // Refresh messages
      }
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setNeedsAuth(false);
        fetchSpaces(result.accessToken);
      }
    } catch (err) {
      console.error('Login failed:', err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (needsAuth) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-8">
        <MessageSquare className="w-16 h-16 text-stone-500 mb-6" />
        <h2 className="text-2xl font-semibold mb-2">Team Chat</h2>
        <p className="text-gray-600 mb-8 text-center max-w-md">
          Sign in with Google to access your team spaces and communicate directly from the dashboard.
        </p>
        <button 
          onClick={handleLogin}
          disabled={isLoggingIn}
          className="gsi-material-button bg-white border border-gray-300 rounded shadow-sm flex items-center px-4 py-2 hover:bg-gray-50 transition-colors"
        >
          <div className="gsi-material-button-icon mr-3">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
              <path fill="none" d="M0 0h48v48H0z"></path>
            </svg>
          </div>
          <span className="text-sm font-medium text-gray-700">{isLoggingIn ? 'Signing in...' : 'Sign in with Google'}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-80px)] bg-white border rounded-lg shadow-sm overflow-hidden m-4 max-w-6xl mx-auto">
      {/* Sidebar - Spaces List */}
      <div className="w-1/3 border-r bg-gray-50 flex flex-col">
        <div className="p-4 border-b bg-white flex justify-between items-center">
          <h3 className="font-semibold text-gray-800 flex items-center">
            <MessageSquare className="w-4 h-4 mr-2" /> Spaces
          </h3>
          <button onClick={logout} className="text-gray-500 hover:text-red-500 transition-colors" title="Sign Out">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading && !spaces.length ? (
            <div className="p-4 text-center text-sm text-gray-500">Loading spaces...</div>
          ) : spaces.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500">No spaces found.</div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {spaces.map(space => (
                <li key={space.name}>
                  <button 
                    onClick={() => handleSpaceSelect(space)}
                    className={`w-full text-left p-4 hover:bg-stone-50 transition-colors flex items-center ${activeSpace?.name === space.name ? 'bg-stone-50 border-l-4 border-stone-500' : 'border-l-4 border-transparent'}`}
                  >
                    <div className="w-8 h-8 rounded bg-stone-100 flex items-center justify-center text-stone-700 font-bold mr-3 flex-shrink-0">
                      {(space.displayName || 'S').charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-medium text-gray-900 truncate">{space.displayName || 'Unnamed Space'}</p>
                      <p className="text-xs text-gray-500">{space.spaceType}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {activeSpace ? (
          <>
            <div className="p-4 border-b shadow-sm z-10 flex items-center bg-white">
              <h2 className="font-semibold text-lg">{activeSpace.displayName || 'Unnamed Space'}</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 flex flex-col-reverse">
              {loading && !messages.length ? (
                <div className="text-center text-sm text-gray-500 p-4">Loading messages...</div>
              ) : messages.length === 0 ? (
                <div className="text-center text-sm text-gray-500 p-4">No messages yet. Say hello!</div>
              ) : (
                messages.map((msg, i) => {
                  const isMe = msg.sender.displayName === user?.displayName;
                  return (
                    <div key={msg.name || i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] rounded-lg px-4 py-2 ${isMe ? 'bg-stone-600 text-white rounded-br-none' : 'bg-white border text-gray-800 rounded-bl-none shadow-sm'}`}>
                        {!isMe && <p className="text-xs font-semibold text-gray-500 mb-1">{msg.sender.displayName}</p>}
                        <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="p-4 border-t bg-white">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-stone-500 text-sm"
                />
                <button 
                  type="submit" 
                  disabled={!newMessage.trim() || loading}
                  className="bg-stone-600 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-stone-700 disabled:opacity-50 transition-colors"
                >
                  <Send className="w-4 h-4 ml-1" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50">
            <MessageSquare className="w-12 h-12 mb-4 text-gray-300" />
            <p>Select a space to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}
