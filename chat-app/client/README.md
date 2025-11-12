# Real-Time Chat Application

A modern, real-time chat application built with React, Node.js, and Socket.io featuring multiple rooms, private messaging, and real-time notifications.

## Features

### ✅ Core Features
- Real-time messaging with Socket.io
- User authentication (username-based)
- Multiple chat rooms
- Online user status
- Typing indicators
- Responsive design

### ✅ Advanced Features
- Private messaging between users
- Multiple chat rooms/channels
- "User is typing" indicators
- File sharing capability
- Real-time notifications
- Message timestamps

### ✅ Performance & UX
- Auto-scroll to new messages
- Reconnection handling
- Mobile-responsive design
- Clean, modern UI

## Setup Instructions

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd chat-app

  
##  Setup Server
cd server
npm install
cp .env.example .env
npm run dev
## Setup Client
cd client
npm install
cp .env.example .env
npm run dev

## Project Structure
text
chat-app/
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── index.js       # Server entry point
│   │   ├── socket/
│   │   │   └── handlers.js # Socket event handlers
│   │   └── models/
│   │       └── User.js    # User model
│   ├── package.json
│   └── .env
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── utils/         # Utility functions
│   │   └── App.js         # Main App component
│   ├── public/
│   └── package.json
└── README.md