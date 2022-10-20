import {
  changeBackgroundColor,
  createHand,
  otherHand,
  removeHand,
} from "./controlNodes.js";

const socket = io();
const playground = document.getElementById("playground");
const onlineUsersCount = document.querySelector(".online-users-count");
const instructions = document.querySelector(".instructions");

let globalUserSocketId;

socket.on("connect", () => {
  globalUserSocketId = socket.id;
  createHand(globalUserSocketId);
  socketListenerCurrentUsers();
});

let socketMap = new Map();
let elementMap = new Map();

function socketListenerCurrentUsers() {
  socket.on("user-count", function ({ userCount }) {
    onlineUsersCount.innerHTML = `online: ${userCount}`;
  });
  socket.on("new-user", function ({ newUser }) {
    const { socketId, userId } = newUser;
    socketMap.set(socketId, userId);
    createHand(socketId);
  });

  const userHand = document.getElementById(globalUserSocketId);

  playground.addEventListener("mousemove", function (event) {
    followMouse(userHand, event);
    userHand.style.display = "unset";
  });

  // closeProximity(globalUserSocketId);
}

socket.on(
  "other-user-hand-move",
  function ({ userHandLeft, userHandTop, socketId }) {
    otherHand(userHandLeft, userHandTop, socketId);
    elementMap.set(socketId, { userHandLeft, userHandTop });
  }
);

socket.on("user-disconnected", function ({ userCount, socketId }) {
  socketMap.delete(socketId);
  removeHand(socketId);
  onlineUsersCount.innerHTML = `online: ${userCount}`;
});

socket.on("get-all-connections", function ({ socketMapObj }) {
  const entries = Object.entries(socketMapObj);
  socketMap = new Map(entries);
  console.log("only the new connection should see this", socketMapObj);

  for (const key of socketMap.keys()) {
    createHand(key);
  }
});

function followMouse(userHand, event) {
  event.preventDefault();
  let mouseX = event.clientX;
  let mouseY = event.clientY;

  let width = userHand.offsetWidth;

  let userHandLeft = mouseX - width / 2;
  let userHandTop = mouseY - width / 2;

  userHand.style.left = userHandLeft + "px";
  userHand.style.top = userHandTop + "px";
  socket.emit("hand-move", { userHandLeft, userHandTop, globalUserSocketId });

  for (const key of elementMap.keys()) {
    closeProximity(key, userHandLeft, userHandTop);
  }
}

function closeProximity(key, userHandLeft, userHandTop) {
  let maxOtherHandLeft = elementMap.get(key).userHandLeft + 20;
  let minOtherHandLeft = elementMap.get(key).userHandLeft - 20;
  let maxOtherHandTop = elementMap.get(key).userHandTop + 20;
  let minOtherHandTop = elementMap.get(key).userHandTop - 20;

  if (
    minOtherHandLeft < userHandLeft &&
    userHandLeft < maxOtherHandLeft &&
    minOtherHandTop < userHandTop &&
    userHandTop < maxOtherHandTop
  ) {
    instructions.innerHTML = `click to high five!`;
    changeBackgroundColor("pink");
    let confetti = new Confetti(key);
    confetti.setCount(75);
    confetti.setSize(1);
    confetti.setPower(25);
    confetti.setFade(false);
    confetti.destroyTarget(false);
  } else {
    instructions.innerHTML = `move closer to a hand`;
    changeBackgroundColor("white");
  }
}
