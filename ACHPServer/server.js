const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Server } = require('socket.io');
const http = require('http');

const server = express();
// Middleware
server.use(bodyParser.json());
server.use(cors());

const app = http.createServer(server);
const io = new Server(app, {
  cors: {
    origin: "*",  // Allow requests from your frontend
    methods: ["GET", "POST"],
  }
});

const PORT = process.env.PORT || 7000;

io.on('connection', (socket) => {
  console.log('a user connected');

  // Emit event to client
  socket.emit('welcome', 'Hello, you are connected!');

  // Receive a message from client
  socket.on('message', (msg) => {
    io.emit('message', msg);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// Start the server
// Bind to all interfaces
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on 0.0.0.0:${PORT}`);
});


