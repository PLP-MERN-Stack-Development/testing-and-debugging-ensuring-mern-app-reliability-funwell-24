import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './App.css';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

function App() {
  const [socket, setSocket] = useState(null);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState('general');
  const [typingUsers, setTypingUsers] = useState([]);
  const [privateRecipient, setPrivateRecipient] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('user_authenticated', (data) => {
      setUser(data.user);
      setRooms(data.rooms);
      setUsers(data.users);
      setMessages(data.messages);
    });

    newSocket.on('receive_message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    newSocket.on('receive_private_message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    newSocket.on('user_typing', (data) => {
      if (data.isTyping) {
        setTypingUsers(prev => [...prev.filter(u => u !== data.username), data.username]);
      } else {
        setTypingUsers(prev => prev.filter(u => u !== data.username));
      }
    });

    newSocket.on('user_joined', (data) => {
      setMessages(prev => [...prev, {
        type: 'system',
        content: `${data.username} joined the chat`,
        timestamp: data.timestamp
      }]);
    });

    newSocket.on('user_left', (data) => {
      setMessages(prev => [...prev, {
        type: 'system',
        content: `${data.username} left the chat`,
        timestamp: data.timestamp
      }]);
    });

    newSocket.on('room_joined', (data) => {
      setCurrentRoom(data.room);
      setMessages(data.messages);
    });

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim() && socket) {
      socket.emit('user_join', { username: username.trim() });
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && socket && user) {
      if (isPrivate && privateRecipient) {
        socket.emit('send_private_message', {
          toUsername: privateRecipient,
          content: message.trim()
        });
      } else {
        socket.emit('send_message', { content: message.trim() });
      }
      setMessage('');
      socket.emit('typing_stop');
    }
  };

  const handleTyping = () => {
    if (socket) {
      if (message.trim()) {
        socket.emit('typing_start');
      } else {
        socket.emit('typing_stop');
      }
    }
  };

  const joinRoom = (roomName) => {
    if (socket) {
      socket.emit('join_room', roomName);
      setIsPrivate(false);
      setPrivateRecipient('');
    }
  };

  const startPrivateChat = (recipient) => {
    setIsPrivate(true);
    setPrivateRecipient(recipient);
    setMessages([]);
  };

  if (!user) {
    return (
      <div className="login-container">
        <div className="login-form">
          <h1>Chat Application</h1>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <button type="submit">Join Chat</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="sidebar">
        <div className="user-info">
          <h3>Welcome, {user.username}!</h3>
          <div className="status online">Online</div>
        </div>
        
        <div className="rooms-section">
          <h4>Rooms</h4>
          {rooms.map(room => (
            <div
              key={room}
              className={`room ${currentRoom === room ? 'active' : ''}`}
              onClick={() => joinRoom(room)}
            >
              # {room}
            </div>
          ))}
        </div>

        <div className="users-section">
          <h4>Online Users ({users.length})</h4>
          {users.map(u => (
            <div key={u.id} className="user-item">
              <span className="status-indicator"></span>
              <span 
                className={`username ${u.username === user.username ? 'current-user' : ''}`}
                onClick={() => u.username !== user.username && startPrivateChat(u.username)}
              >
                {u.username} {u.username === user.username && '(You)'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="chat-container">
        <div className="chat-header">
          <h2>
            {isPrivate ? (
              <>Private chat with <span className="private-recipient">{privateRecipient}</span></>
            ) : (
              <>#{currentRoom}</>
            )}
          </h2>
          {isPrivate && (
            <button 
              className="back-to-room"
              onClick={() => {
                setIsPrivate(false);
                setPrivateRecipient('');
                joinRoom(currentRoom);
              }}
            >
              Back to Room
            </button>
          )}
        </div>

        <div className="messages-container">
          {messages.map((msg, index) => (
            <div key={msg.id || index} className={`message ${msg.type === 'system' ? 'system-message' : ''}`}>
              {msg.type === 'system' ? (
                <div className="system-message">{msg.content}</div>
              ) : (
                <>
                  <div className="message-header">
                    <strong>{msg.username}</strong>
                    <span className="timestamp">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                    {msg.type === 'private' && (
                      <span className="private-badge">Private</span>
                    )}
                  </div>
                  <div className="message-content">{msg.content}</div>
                </>
              )}
            </div>
          ))}
          
          {typingUsers.length > 0 && (
            <div className="typing-indicator">
              {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <form className="message-form" onSubmit={sendMessage}>
          <input
            type="text"
            placeholder={isPrivate ? `Message ${privateRecipient}...` : `Message #${currentRoom}...`}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              handleTyping();
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                sendMessage(e);
              }
            }}
          />
          <button type="submit" disabled={!message.trim()}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;