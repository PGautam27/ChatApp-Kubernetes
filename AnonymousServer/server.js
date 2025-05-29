const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Set your frontend origin if deployed
  }
});

const userMap = new Map(); // socket.id -> username

io.on('connection', (socket) => {
  // Generate random username
  const randomName = uniqueNamesGenerator({
    dictionaries: [adjectives, animals],
    separator: ' ',
    style: 'lowerCase',
  });

  userMap.set(socket.id, randomName);

  socket.emit('welcome', `Welcome ${randomName}!`);
  console.log(`User connected: ${randomName}`);

  // Handle chat messages
  socket.on('message', (msg) => {
    const username = userMap.get(socket.id) || 'unknown';
    io.emit('message', { username, message: msg }); // broadcast message to all
  });

  // Handle typing indicator
  socket.on('typing', () => {
    const username = userMap.get(socket.id) || 'unknown';
    // Broadcast to everyone except the sender that this user is typing
    socket.broadcast.emit('typing', { username });
  });

  socket.on('stopTyping', () => {
    const username = userMap.get(socket.id) || 'unknown';
    // Broadcast to everyone except the sender that this user stopped typing
    socket.broadcast.emit('stopTyping', { username });
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${userMap.get(socket.id)}`);
    userMap.delete(socket.id);
  });
});

server.listen(7000, () => {
  console.log('Server running on http://localhost:7000');
});
