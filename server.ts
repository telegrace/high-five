import Koa, { Middleware } from "koa";
import Router from "koa-router";
import fs from "fs";
import http from "http";
import { Server } from "socket.io";

const PORT = process.env.PORT || 3000;
const app = new Koa();
const router = new Router();

const server = http.createServer(app.callback()); //?
const io = new Server(server);

// const hellowWorldlController: Middleware = async (ctx) => {
//   console.log("Received a request");
//   ctx.body = {
//     message: "Hellow world!",
//   };
// };

// router.get("/", hellowWorldlController);

router.get("/", (ctx, next) => {
  ctx.type = "html";
  ctx.body = fs.createReadStream("public/index.html");
});

io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });
});

app.use(router.routes()).use(router.allowedMethods());
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🥳`);
});
