import React, { useState, useRef, useEffect } from 'react';
import './ChatRoom.css';

const ChatRoom = ({ 
  messages, 
  users, 
  typingUsers, 
  currentRoom, 
  onSendMessage, 
  onStartTyping, 
  onStopTyping,
  onJoinRoom,
  onStartPrivateChat 
}) => {
  const [message, setMessage] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [privateRecipient, setPrivateRecipient] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
      onStopTyping();
    }
  };

  const handleTyping = () => {
    if (message.trim()) {
      onStartTyping();
    } else {
      onStopTyping();
    }
  };

  const handleStartPrivateChat = (username) => {
    setIsPrivate(true);
    setPrivateRecipient(username);
    onStartPrivateChat(username);
  };

  const handleBackToRoom = () => {
    setIsPrivate(false);
    setPrivateRecipient('');
    onJoinRoom(currentRoom);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="chat-room">
      <div className="chat-header">
        <div className="room-info">
          <h2>
            {isPrivate ? (
              <>
                <span className="private-icon">🔒</span>
                Private chat with <span className="recipient-name">{privateRecipient}</span>
              </>
            ) : (
              <>
                <span className="room-icon">#</span>
                {currentRoom}
              </>
            )}
          </h2>
          <span className="online-count">{users.length} users online</span>
        </div>
        
        {isPrivate && (
          <button className="back-button" onClick={handleBackToRoom}>
            ← Back to Room
          </button>
        )}
      </div>

      <div className="chat-main">
        <div className="sidebar">
          <div className="online-users">
            <h3>Online Users ({users.length})</h3>
            <div className="users-list">
              {users.map(user => (
                <div key={user.id} className="user-item">
                  <span className="status-dot"></span>
                  <span 
                    className={`username ${user.isTyping ? 'typing' : ''}`}
                    onClick={() => handleStartPrivateChat(user.username)}
                  >
                    {user.username}
                  </span>
                  {user.isTyping && <span className="typing-indicator-small">...</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="chat-area">
          <div className="messages-container">
            {messages.map((msg, index) => (
              <div key={msg.id || index} className={`message ${msg.type === 'system' ? 'system' : ''}`}>
                {msg.type === 'system' ? (
                  <div className="system-message">
                    {msg.content}
                    <span className="message-time">
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                ) : (
                  <div className="message-bubble">
                    <div className="message-header">
                      <span className="message-sender">{msg.username}</span>
                      <span className="message-time">
                        {formatTime(msg.timestamp)}
                      </span>
                      {msg.type === 'private' && (
                        <span className="private-badge">Private</span>
                      )}
                    </div>
                    <div className="message-content">{msg.content}</div>
                  </div>
                )}
              </div>
            ))}
            
            {typingUsers.length > 0 && (
              <div className="typing-indicator">
                <div className="typing-dots">
                  {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing
                  <span className="dot">.</span>
                  <span className="dot">.</span>
                  <span className="dot">.</span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="message-input-form">
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
                  handleSubmit(e);
                }
              }}
            />
            <button type="submit" disabled={!message.trim()}>
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;