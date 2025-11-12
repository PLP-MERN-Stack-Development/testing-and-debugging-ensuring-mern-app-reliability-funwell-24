import { v4 as uuidv4 } from 'uuid';

// In-memory storage
const users = new Map();
const rooms = new Set(['general', 'random', 'tech', 'help']);
const messages = {
  general: [],
  random: [],
  tech: [],
  help: []
};

const privateMessages = new Map();

export const handleConnection = (socket, io) => {
  console.log('User connected:', socket.id);

  // User authentication handler
  const handleUserJoin = (userData) => {
    if (!userData.username || userData.username.trim() === '') {
      socket.emit('error', { message: 'Username is required' });
      return;
    }

    const username = userData.username.trim();
    
    // Check if username is already taken
    const existingUser = Array.from(users.values()).find(
      user => user.username.toLowerCase() === username.toLowerCase()
    );
    
    if (existingUser && existingUser.isOnline) {
      socket.emit('error', { message: 'Username is already taken' });
      return;
    }

    const user = {
      id: socket.id,
      username,
      room: 'general',
      isOnline: true,
      lastSeen: new Date(),
      typing: false
    };
    
    users.set(socket.id, user);
    socket.join('general');
    
    // Notify others about new user
    socket.broadcast.to('general').emit('user_joined', {
      username: user.username,
      timestamp: new Date(),
      usersCount: users.size
    });
    
    // Send welcome message to the new user
    const welcomeMessage = {
      id: uuidv4(),
      username: 'System',
      content: `Welcome to the chat, ${user.username}!`,
      room: 'general',
      timestamp: new Date(),
      type: 'system'
    };
    
    messages.general.push(welcomeMessage);
    
    // Send current users and room messages to the new user
    socket.emit('user_authenticated', {
      user,
      rooms: Array.from(rooms),
      users: Array.from(users.values()),
      messages: messages.general.slice(-100)
    });

    // Update all users list
    io.emit('users_updated', Array.from(users.values()));
  };

  // Message handler
  const handleSendMessage = (data) => {
    const user = users.get(socket.id);
    if (!user) {
      socket.emit('error', { message: 'User not authenticated' });
      return;
    }

    if (!data.content || data.content.trim() === '') {
      socket.emit('error', { message: 'Message content is required' });
      return;
    }

    const message = {
      id: uuidv4(),
      username: user.username,
      content: data.content.trim(),
      room: user.room,
      timestamp: new Date(),
      type: 'text',
      userId: user.id
    };

    // Store message
    messages[user.room].push(message);
    
    // Send to room
    io.to(user.room).emit('receive_message', message);
    
    // Send delivery receipt
    socket.emit('message_delivered', { id: message.id });
  };

  // Private message handler
  const handlePrivateMessage = (data) => {
    const fromUser = users.get(socket.id);
    if (!fromUser) return;

    const toUser = Array.from(users.values()).find(
      u => u.username === data.toUsername && u.id !== socket.id
    );
    
    if (!toUser) {
      socket.emit('error', { message: 'User not found or offline' });
      return;
    }

    const privateMessage = {
      id: uuidv4(),
      from: fromUser.username,
      to: data.toUsername,
      content: data.content,
      timestamp: new Date(),
      type: 'private'
    };

    // Store private message
    const conversationKey = [fromUser.username, toUser.username].sort().join('-');
    if (!privateMessages.has(conversationKey)) {
      privateMessages.set(conversationKey, []);
    }
    privateMessages.get(conversationKey).push(privateMessage);

    // Send to both users
    socket.emit('receive_private_message', privateMessage);
    socket.to(toUser.id).emit('receive_private_message', privateMessage);
    
    // Send notification to recipient
    socket.to(toUser.id).emit('new_private_message', {
      from: fromUser.username,
      message: data.content.substring(0, 50) + (data.content.length > 50 ? '...' : '')
    });
  };

  // Typing indicators handler
  const handleTypingStart = () => {
    const user = users.get(socket.id);
    if (user) {
      user.typing = true;
      socket.broadcast.to(user.room).emit('user_typing', {
        username: user.username,
        isTyping: true
      });
    }
  };

  const handleTypingStop = () => {
    const user = users.get(socket.id);
    if (user) {
      user.typing = false;
      socket.broadcast.to(user.room).emit('user_typing', {
        username: user.username,
        isTyping: false
      });
    }
  };

  // Room management handler
  const handleJoinRoom = (roomName) => {
    const user = users.get(socket.id);
    if (!user || !rooms.has(roomName)) {
      socket.emit('error', { message: 'Invalid room' });
      return;
    }

    // Leave current room
    socket.leave(user.room);
    
    // Notify room about user leaving
    socket.broadcast.to(user.room).emit('user_left_room', {
      username: user.username,
      room: user.room
    });

    // Join new room
    socket.join(roomName);
    user.room = roomName;
    users.set(socket.id, user);

    // Send room messages to user
    socket.emit('room_joined', {
      room: roomName,
      messages: messages[roomName].slice(-100)
    });

    // Notify new room
    socket.broadcast.to(roomName).emit('user_joined_room', {
      username: user.username,
      room: roomName
    });

    // Update users list for all clients
    io.emit('users_updated', Array.from(users.values()));
  };

  // File sharing handler (simplified - in production, use file storage)
  const handleFileShare = (data) => {
    const user = users.get(socket.id);
    if (!user) return;

    const fileMessage = {
      id: uuidv4(),
      username: user.username,
      fileName: data.fileName,
      fileType: data.fileType,
      fileSize: data.fileSize,
      fileUrl: data.fileUrl,
      room: user.room,
      timestamp: new Date(),
      type: 'file'
    };

    messages[user.room].push(fileMessage);
    io.to(user.room).emit('receive_message', fileMessage);
  };

  // Get user list handler
  const handleGetUsers = () => {
    socket.emit('users_list', Array.from(users.values()));
  };

  // Get room list handler
  const handleGetRooms = () => {
    socket.emit('rooms_list', Array.from(rooms));
  };

  // Disconnection handler
  const handleDisconnect = () => {
    const user = users.get(socket.id);
    if (user) {
      user.isOnline = false;
      user.lastSeen = new Date();
      
      // Notify users in the same room
      socket.broadcast.to(user.room).emit('user_left', {
        username: user.username,
        timestamp: new Date(),
        usersCount: users.size - 1
      });
      
      // Remove user after a delay (for reconnection)
      setTimeout(() => {
        if (users.get(socket.id) && !users.get(socket.id).isOnline) {
          users.delete(socket.id);
          io.emit('users_updated', Array.from(users.values()));
        }
      }, 30000);
    }
    console.log('User disconnected:', socket.id);
  };

  // Register event handlers
  socket.on('user_join', handleUserJoin);
  socket.on('send_message', handleSendMessage);
  socket.on('send_private_message', handlePrivateMessage);
  socket.on('typing_start', handleTypingStart);
  socket.on('typing_stop', handleTypingStop);
  socket.on('join_room', handleJoinRoom);
  socket.on('send_file', handleFileShare);
  socket.on('get_users', handleGetUsers);
  socket.on('get_rooms', handleGetRooms);
  socket.on('disconnect', handleDisconnect);

  // Error handler
  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
};