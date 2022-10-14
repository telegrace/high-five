const Koa = require("koa");
const http = require("http");
import path from "path";
const serve = require("koa-static");
const { Server } = require("socket.io");
import { Socket } from "socket.io";
const PORT = process.env.PORT || 3000;
const app = new Koa();

const server = http.createServer(app.callback());
const io = new Server(server);

const staticDirPath = path.join(__dirname, "client");
app.use(serve(staticDirPath));

let currentUsers = 0;

io.on("connection", (socket: Socket) => {
  currentUsers++;
  let socketId = socket.id;
  io.emit("current-users", { currentUsers, socketId });
  socket.on("disconnect", () => {
    currentUsers--;
    io.emit("current-users", { currentUsers, socketId });
  });
});

server.listen(PORT);
