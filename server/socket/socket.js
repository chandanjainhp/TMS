import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: [process.env.FRONTEND_URL || "http://localhost:5173"],
        methods: ["GET", "POST"],
        credentials: true
    },
});

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};

const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
    // console.log("a user connected", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId && userId !== "undefined") {
        userSocketMap[userId] = socket.id;
    }

    // io.emit() is used to send events to all the connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // Listen for typing events
    socket.on("typing", ({ recipientId }) => {
        const socketId = getReceiverSocketId(recipientId);
        if (socketId) {
            io.to(socketId).emit("typing", { senderId: userId });
        }
    });

    socket.on("stopTyping", ({ recipientId }) => {
        const socketId = getReceiverSocketId(recipientId);
        if (socketId) {
            io.to(socketId).emit("stopTyping", { senderId: userId });
        }
    });

    socket.on("disconnect", () => {
        // console.log("user disconnected", socket.id);
        if (userId) {
            delete userSocketMap[userId];
        }
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { app, io, server };
