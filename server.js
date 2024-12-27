const express = require("express");
const { createServer } = require("node:http");
const { join } = require("node:path");
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static("client"));

const userList = [];
let userCount = 0;

app.get("/", (req, res) => {
	res.sendFile(join(__dirname, "./client/index.html"));
});

io.on("connection", (socket) => {
	userCount++;
	userList.push(socket.id);

	console.log("user-connected", socket.id);
	socket.on("get-user-list", () => {
		socket.emit("user-list", userList);
	});
	io.emit(`user-connected`, {
		id: socket.id,
		userCount,
		userList,
	});

	socket.on("hand-move", (data) => {
		socket.broadcast.emit(data.userId, data);
	});

	socket.on("disconnect", () => {
		userCount--;
		userList.splice(userList.indexOf(socket.id), 1);

		console.log("disconnected", socket.id);
		io.emit("user-disconnected", { id: socket.id, userCount, userList });
	});
});

server.listen(3000, () => {
	console.log("server running at http://localhost:3000 💕✨");
});
