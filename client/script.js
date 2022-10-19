import { createHand, otherHand } from "./controlNodes.js";

const socket = io();
const playground = document.getElementById("playground");
const onlineUsersCount = document.querySelector(".online-users-count");

let globalUserSocketId;

socket.on("connect", () => {
  console.log("Here", socket.id);
  globalUserSocketId = socket.id;
  createHand(globalUserSocketId);
  socketListenerCurrentUsers();
});

let socketMap = new Map();

function socketListenerCurrentUsers() {
  socket.on("user-count", function ({ userCount }) {
    onlineUsersCount.innerHTML = `online: ${userCount}`;
  });
  socket.on("new-user", function ({ newUser }) {
    // removeAllChildren(playground);
    const { socketId, userId } = newUser;
    socketMap.set(socketId, userId);
    // console.log("count", userCount);
    createHand(socketId);
    // for (const key of socketMap.keys()) {
    //   createHand(key);
    // }
  });

  const userHand = document.getElementById(globalUserSocketId);
  playground.addEventListener("mousemove", function (event) {
    let x = event.clientX;
    let y = event.clientY;

    let width = userHand.offsetWidth;

    let userHandLeft = x - width / 2 + "px";
    let userHandTop = y - width / 2 + "px";

    userHand.style.left = userHandLeft;
    userHand.style.top = userHandTop;
    socket.emit("hand-move", { userHandLeft, userHandTop, globalUserSocketId });
  });
}

socket.on(
  "other-user-hand-move",
  function ({ userHandLeft, userHandTop, socketId }) {
    otherHand(userHandLeft, userHandTop, socketId);
  }
);

socket.on("user-disconnected", function ({ userCount, socketId }) {
  socketMap.delete(socketId);
  onlineUsersCount.innerHTML = `online: ${userCount}`;
});

socket.on("get-all-connections", function ({ socketMapObj }) {
  console.log(socketMapObj);
  const entries = Object.entries(socketMapObj);
  socketMap = new Map(entries);
  console.log("only the new connection should see this", socketMapObj);

  for (const key of socketMap.keys()) {
    createHand(key);
  }
});

document.addEventListener("click", function () {
  document.body.style.backgroundColor = "red";
  setTimeout(() => {
    document.body.style.backgroundColor = "white";
  }, 500);
});
