import Koa from "koa";
import path from "path";
import serve from "koa-static";

import http from "http";
import { Server } from "socket.io";

const PORT = process.env.PORT || 3000;
const app = new Koa();

const server = http.createServer(app.callback()); //?
const io = new Server(server);

const staticDirPath = path.join(__dirname, "client");

// fs stream would not include the style.css
app.use(serve(staticDirPath));

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🥳`);
});
