const express = require('express');
const mongoose = require('mongoose');
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

const PORT = process.env.PORT || 4000;

// MongoDB connection
mongoose.connect('mongodb+srv://gautam:appu@cluster0.dbs5z.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Chat Schema
const chatSchema = new mongoose.Schema({
  chat: String,
});

const Chats = mongoose.model('Chat', chatSchema);

// CRUD routes

// Create a chat
server.post('/chat', async (req, res) => {
  const { chat } = req.body;
  console.log("This is the chat => ", chat);
  const newChat = new Chats({ chat });
  await newChat.save();
  res.status(201).send(newChat);
});

// Get all chats
server.get('/chat', async (req, res) => {
  const chats = await Chats.find();
  res.send(chats);
});

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
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
