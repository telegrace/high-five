import { createHand, removeAllChildren } from "./controlNodes.js";

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

    for (let i = 0; i < currentUsers; i++) {
      createHand(socketId); //id is the same
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

      // socket.emit("hand-move", { userHandLeft, userHandTop, socketId });
    });
  });
}

socket.on("hand-move", function ({ userHandLeft, userHandTop, socketId }) {
  // const otherHand = document.getElementById(socketId);
  console.log("socketId ", socketId);
  // otherHand.style.left = userHandLeft;
  // otherHand.style.top = userHandTop;
});

document.addEventListener("click", function () {
  document.body.style.backgroundColor = "red";
  setTimeout(() => {
    document.body.style.backgroundColor = "white";
  }, 500);
});
