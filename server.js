const express = require("express");
const { createServer } = require("node:http");
const { join } = require("node:path");
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static("client"));

app.get("/", (req, res) => {
	res.sendFile(join(__dirname, "./client/index.html"));
});

let userCount = 0;

io.on("connection", (socket) => {
	userCount++;

	console.log("user-connected", socket.id);

	io.emit(`user-connected`, {
		id: socket.id,
		userCount,
	});

	//listen to hand-move
	socket.on("hand-move", (data) => {
		socket.broadcast.emit(data.userId, data);
	});

	socket.on("disconnect", () => {
		userCount--;

		console.log("disconnected", socket.id);
		io.emit("user-disconnected", { id: socket.id });
	});
});

server.listen(3000, () => {
	console.log("server running at http://localhost:3000 💕✨");
});
