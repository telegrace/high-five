import { createHand, otherHand, removeAllChildren } from "./controlNodes.js";

const socket = io();
const playground = document.getElementById("playground");

let currentSockets = [];

socketListenerCurrentUsers();

function socketListenerCurrentUsers() {
  socket.on("current-users", function ({ currentUsers, socketId }) {
    currentSockets.push(socketId);
    console.log("current sockets ", currentSockets);
    let onlineUsersCount = document.querySelector(".online-users-count");
    onlineUsersCount.innerHTML = `online: ${currentUsers}`;

    removeAllChildren(playground);

    for (let i = 0; i < currentSockets.length; i++) {
      createHand(currentSockets[i]); //id is the same
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

document.addEventListener("click", function () {
  document.body.style.backgroundColor = "red";
  setTimeout(() => {
    document.body.style.backgroundColor = "white";
  }, 500);
});
