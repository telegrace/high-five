import { createHand, removeAllChildren } from "./controlNodes.js";

// remember to wrap in ()=>{}
const socket = io();
const playground = document.getElementById("playground");

socketListenerCurrentUsers();

function socketListenerCurrentUsers() {
  socket.on("current-users", function ({ currentUsers, socketId }) {
    let onlineUsersCount = document.querySelector(".online-users-count");
    onlineUsersCount.innerHTML = `online: ${currentUsers}`;

    removeAllChildren(playground);

    for (let i = 0; i < currentUsers; i++) {
      createHand(socketId);
    }

    const userHand = document.getElementById(socketId);

    playground.addEventListener("mousemove", function (event) {
      let x = event.clientX;
      let y = event.clientY;

      let width = userHand.offsetWidth;
      let height = userHand.offsetHeight;

      userHand.style.left = x - width / 2 + "px";
      userHand.style.top = y - height / 2 + "px";
    });
  });
}

document.addEventListener("click", function () {
  document.body.style.backgroundColor = "red";
  setTimeout(() => {
    document.body.style.backgroundColor = "white";
  }, 500);
});
