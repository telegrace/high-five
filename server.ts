const Koa = require("koa");
const http = require("http");
import path from "path";
const serve = require("koa-static");
const { Server } = require("socket.io");
import { Socket } from "socket.io";
const PORT = process.env.PORT || 3000;
const app = new Koa();
import { v4 as uuidv4 } from "uuid";

const server = http.createServer(app.callback());
const io = new Server(server);

const staticDirPath = path.join(__dirname, "client");
app.use(serve(staticDirPath));

let userCount = 0;
let socketMap = new Map();

io.on("connection", (socket: Socket) => {
  userCount++;
  console.log("connect");
  const socketId = socket.id;
  const generatedUserID = uuidv4();
  let newUser = { socketId, userId: generatedUserID };

  socketMap.set(newUser.socketId, newUser.userId);

  io.emit("new-user", { userCount, newUser });

  const socketMapObj = Object.fromEntries(socketMap);
  // io.to(socketId).emit("get-all-connections", { socketMapObj });
  socket.emit("get-all-connections", { socketMapObj });

  socket.on("disconnect", () => {
    userCount--;
    console.log("disconnect");
    socketMap.delete(socketId);
    io.emit("user-disconnected", { userCount, socketId });
  });

  socket.on("hand-move", function ({ userHandLeft, userHandTop, socketId }) {
    // console.log("socketId ", userHandLeft, userHandTop, socketId);
    socket.broadcast.emit("other-user-hand-move", {
      userHandLeft,
      userHandTop,
      socketId,
    });
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}/ 🥳`);
});
