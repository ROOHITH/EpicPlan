//server.js
const express = require("express");
const app = express();
const socketIO = require("socket.io");
const http = require("http");

const server = http.createServer(app);
const io = socketIO(server);

const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoute = require("./Routes/AuthRoute");
const db = require("./DbConn");
require("dotenv").config();
const PORT = process.env.PORT || 3000;

const isProduction = process.env.NODE_ENV === 'production';

// Enable CORS for all routes using the cors middleware
app.use(
  cors({
    origin: isProduction ? 'https://epicplan.onrender.com' : 'http://localhost:5173',
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Use the cookie parser middleware
app.use(cookieParser());
app.use(express.json());
 
// Define a route 
app.get("/", (req, res) => {
  res.send("Hello, Node.js!");
});

// Use the authRoute for your application
app.use("/", authRoute);

app.get("/user-profile", (req, res) => {
  // The user object is available in req.user due to the middleware
  res.json({ user: req.user });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Socket.IO
io.on('connection', (socket) => {
  console.log(`Socket ${socket.id} connected`);

  socket.on('sendMessage', (message) => {
    console.log('Received sendMessage event:', messageData);
    io.emit('message', message);
  }); 

  socket.on('disconnect', () => {
    console.log(`Socket ${socket.id} disconnected`);
  });
});