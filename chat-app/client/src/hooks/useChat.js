import { useState, useEffect, useCallback } from 'react';

export const useChat = (socket) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [error, setError] = useState(null);

  // Message handling
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (message) => {
      setMessages(prev => [...prev, message]);
    };

    const handleReceivePrivateMessage = (message) => {
      setMessages(prev => [...prev, message]);
    };

    const handleUserTyping = (data) => {
      setTypingUsers(prev => {
        if (data.isTyping) {
          return [...prev.filter(u => u !== data.username), data.username];
        } else {
          return prev.filter(u => u !== data.username);
        }
      });
    };

    const handleUsersUpdated = (usersList) => {
      setUsers(usersList);
    };

    const handleError = (errorData) => {
      setError(errorData.message);
      setTimeout(() => setError(null), 5000);
    };

    // Register event listeners
    socket.on('receive_message', handleReceiveMessage);
    socket.on('receive_private_message', handleReceivePrivateMessage);
    socket.on('user_typing', handleUserTyping);
    socket.on('users_updated', handleUsersUpdated);
    socket.on('error', handleError);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
      socket.off('receive_private_message', handleReceivePrivateMessage);
      socket.off('user_typing', handleUserTyping);
      socket.off('users_updated', handleUsersUpdated);
      socket.off('error', handleError);
    };
  }, [socket]);

  const sendMessage = useCallback((content) => {
    if (socket && content.trim()) {
      socket.emit('send_message', { content: content.trim() });
    }
  }, [socket]);

  const sendPrivateMessage = useCallback((toUsername, content) => {
    if (socket && content.trim()) {
      socket.emit('send_private_message', {
        toUsername,
        content: content.trim()
      });
    }
  }, [socket]);

  const startTyping = useCallback(() => {
    if (socket) {
      socket.emit('typing_start');
    }
  }, [socket]);

  const stopTyping = useCallback(() => {
    if (socket) {
      socket.emit('typing_stop');
    }
  }, [socket]);

  const joinRoom = useCallback((roomName) => {
    if (socket) {
      socket.emit('join_room', roomName);
      setMessages([]);
    }
  }, [socket]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    messages,
    users,
    typingUsers,
    error,
    sendMessage,
    sendPrivateMessage,
    startTyping,
    stopTyping,
    joinRoom,
    clearError,
    setMessages
  };
};