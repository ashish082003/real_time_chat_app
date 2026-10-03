import { Server } from "socket.io";
import http from "http";
import express from "express";
import { environment } from "../config/environment.js";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: environment.clientOrigin,
		methods: ["GET", "POST"],
	},
});

export const getReceiverSocketId = (receiverId) => {
	return userSocketMap[receiverId];
};

const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
	const userId = socket.handshake.query.userId;
	if (userId && userId !== "undefined") userSocketMap[userId] = socket.id;

	// io.emit() is used to send events to all the connected clients
	io.emit("getOnlineUsers", Object.keys(userSocketMap));

	socket.on("disconnect", () => {
		if (userSocketMap[userId] === socket.id) delete userSocketMap[userId];
		io.emit("getOnlineUsers", Object.keys(userSocketMap));
	});
});

export { app, io, server };
