const express = require("express");
const { createServer } = require("node:http");
const { join } = require("node:path");
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);
const io = new Server(server);
const port = process.env.PORT || 3000;

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

	socket.on("high-five", () => {
		socket.broadcast.emit("high-five");
	});

	socket.on("disconnect", () => {
		userCount--;
		userList.splice(userList.indexOf(socket.id), 1);

		console.log("disconnected", socket.id);
		io.emit("user-disconnected", { id: socket.id, userCount });
	});
});

server.listen(port, () => {
	console.log(`server running at http://localhost:${port}/ 💕✨`);
});
