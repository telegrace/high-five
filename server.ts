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

type User = {
  userId: string;
  socketId: string;
};

let currentUsers = 0;
let currentSockets: Array<User | null> = [];

io.on("connection", (socket: Socket) => {
  currentUsers++;
  const socketId = socket.id;
  const generatedUserID = uuidv4();
  let newUser = { userId: generatedUserID, socketId };
  currentSockets.push(newUser);

  io.emit("current-users", { currentUsers, socketId });
  console.log("current-users", currentSockets);

  socket.on("disconnect", () => {
    console.log("disconnect ", newUser);

    currentUsers--;

    for (let i = 0; i < currentSockets.length; i++) {
      if (currentSockets[i]?.socketId === newUser.socketId) {
        currentSockets.splice(i, 1);
      }
    }

    console.log("current-users", currentSockets);

    io.emit("current-users", { currentUsers, socketId });
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
