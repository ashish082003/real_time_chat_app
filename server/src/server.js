import path from "path";
import express from "express";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";

import connectToMongoDB from "./config/database.js";
import { environment } from "./config/environment.js";
import { app, server } from "./realtime/socket.js";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const clientDistPath = path.resolve(currentDirectory, "../../client/dist");

app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

app.get("/api/health", (_req, res) => {
	res.status(200).json({ status: "ok" });
});

app.use("/api", (_req, res) => {
	res.status(404).json({ error: "API route not found" });
});

app.use(express.static(clientDistPath));

app.get("*", (req, res) => {
	res.sendFile(path.join(clientDistPath, "index.html"));
});

const startServer = async () => {
	try {
		await connectToMongoDB();
		server.listen(environment.port, () => {
			console.log(`PulseChat server listening on port ${environment.port}`);
		});
	} catch (error) {
		console.error("PulseChat failed to start", error.message);
		process.exit(1);
	}
};

startServer();
