const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const crypto = require("crypto");
const jwt = require('jsonwebtoken');
const cors = require('cors');
const http = require('http');
const multer = require('multer');
const path = require('path');
const Story = require('./model/story');

const app = express();
const port = 4000;
const socketPort = 6000;

app.use(cors());
app.use(cors({
    origin: '*', // Or specify the exact origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Connect to MongoDB
mongoose.connect('mongodb+srv://pradeepsnandayigol:fa6vQaNviXqqGyED@cluster123.lzz32fw.mongodb.net/real?retryWrites=true&w=majority&appName=Cluster123')
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.error('Error connecting to MongoDB:', error));

// Define the JWT secret key securely (consider using environment variables)
const JWT_SECRET_KEY = 'your-secure-jwt-secret-key';

// Import models
const User = require("./model/user");
const Message = require("./model/message");

// Register endpoint
app.post("/register", async (req, res) => {
    try {
        const { name, email, password, image } = req.body;
        const newUser = new User({ name, email, password, image });
        await newUser.save();
        res.status(200).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Error registering the user" });
    }
});

// Login endpoint
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(401).json({ message: 'Invalid email' });
        if (user.password !== password) return res.status(401).json({ message: 'Invalid password' });

        const token = jwt.sign({ userId: user._id }, JWT_SECRET_KEY);
        res.status(200).json({ token });
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ message: "Error logging in" });
    }
});

// Get users excluding the one with userId
app.get("/users/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const users = await User.find({ _id: { $ne: userId } });
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Error fetching users" });
    }
});

// Send request
app.post("/sendrequest", async (req, res) => {
    try {
        const { senderId, receiverId, message } = req.body;
        const receiver = await User.findById(receiverId);

        if (!receiver) return res.status(404).json({ message: "Receiver not found" });

        receiver.requests.push({ from: senderId, message });
        await receiver.save();
        res.status(200).json({ message: "Request sent successfully" });
    } catch (error) {
        console.error("Error sending request:", error);
        res.status(500).json({ message: "Error sending request" });
    }
});

// Get requests
app.get("/getrequests/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId).populate("requests.from", "name email image");

        if (user) {
            res.json(user.requests);
        } else {
            res.status(400).json({ message: "User not found" });
        }
    } catch (error) {
        console.error("Error fetching requests:", error);
        res.status(500).json({ message: "Error fetching requests" });
    }
});

// Accept request
app.post("/acceptrequest", async (req, res) => {
    try {
        const { userId, requestId } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

       const updateUser = await User.findByIdAndUpdate(
        userId, 
        {
            $pull: { requests: { from: requestId } },
            // $push: { friends: requestId },
        },
        {new: true},
    );
    if(!updateUser){
        return res.status(404).json({message:'Request not Found'});
    }

        const friendUser = await User.findByIdAndUpdate(requestId, {
            $push: { friends: userId }
        });

        if (!friendUser) return res.status(404).json({ message: "Friend not found" });

        res.status(200).json({ message: 'Request accepted successfully' });
    } catch (error) {
        console.error("Error accepting request:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Get user's friends
app.get('/user/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId).populate('friends', 'name email image');

        if (user) {
            res.json(user.friends);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Error fetching user" });
    }
});

// Setup HTTP server and Socket.IO
const server = http.createServer(app);
const io = require("socket.io")(server);

const userSocketMap = {};

io.on('connection', socket => {
    console.log("A user is connected", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId && userId !== "undefined") {
        userSocketMap[userId] = socket.id;
    }

    socket.on('disconnect', () => {
        console.log('User disconnected', socket.id);
        for (const [key, value] of Object.entries(userSocketMap)) {
            if (value === socket.id) {
                delete userSocketMap[key];
                break;
            }
        }
    });

    socket.on("sendMessage", ({ senderId, receiverId, message }) => {
        const receiverSocketId = userSocketMap[receiverId];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('receiverMessage', { senderId, message });
        }
    });
});

server.listen(socketPort, () => {
    console.log(`Socket.IO running on port ${socketPort}`);
});

// Send message and store in database
app.post("/sendMessage", async (req, res) => {
    try {
        const { senderId, receiverId, message } = req.body;
        const newMessage = new Message({ senderId, receiverId, message });

        await newMessage.save();

        const receiverSocketId = userSocketMap[receiverId];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Error sending message" });
    }
});

// Get messages
app.get("/messages", async (req, res) => {
    try {
        const { senderId, receiverId } = req.query;
        const messages = await Message.find({
            $or: [
                { senderId, receiverId },
                { senderId: receiverId, receiverId: senderId }
            ]
        }).populate('senderId', 'name');

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: "Error fetching messages" });
    }
});


app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});

