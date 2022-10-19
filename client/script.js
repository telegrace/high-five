import { createHand, otherHand, removeAllChildren } from "./controlNodes.js";

const socket = io();
const playground = document.getElementById("playground");
const onlineUsersCount = document.querySelector(".online-users-count");
const currentUserId = document.querySelector(".current-user-id");

let socketMap = new Map();

socketListenerCurrentUsers();

function socketListenerCurrentUsers() {
  socket.on("new-user", function ({ userCount, newUser }) {
    removeAllChildren(playground);

    const { socketId, userId } = newUser;

    socketMap.set(socketId, userId);
    // console.log("count", userCount);
    console.log("mapcount", socketMap.size);

    onlineUsersCount.innerHTML = `online: ${userCount}`;
    currentUserId.innerHTML = `Current User ID: ${socketId}`;

    for (const key of socketMap.keys()) {
      createHand(key);
    }

    const userHand = document.getElementById(socketId);

    playground.addEventListener("mousemove", function (event) {
      let x = event.clientX;
      let y = event.clientY;

      let width = userHand.offsetWidth;

      let userHandLeft = x - width / 2 + "px";
      let userHandTop = y - width / 2 + "px";

      userHand.style.left = userHandLeft;
      userHand.style.top = userHandTop;
      socket.emit("hand-move", { userHandLeft, userHandTop, socketId });
    });
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
});

document.addEventListener("click", function () {
  document.body.style.backgroundColor = "red";
  setTimeout(() => {
    document.body.style.backgroundColor = "white";
  }, 500);
});
