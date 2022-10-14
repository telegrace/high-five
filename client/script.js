// remember to wrap in ()=>{}
const socket = io();
const playground = document.getElementById("playground");

socket.on("current-users", function (currentUsers) {
  let onlineUsersCount = document.querySelector(".online-users-count");
  onlineUsersCount.innerHTML = `online: ${currentUsers}`;
  removeAllChildren(playground);
  for (let i = 0; i < currentUsers; i++) {
    createHand();
  }
});

function removeAllChildren(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function createHand() {
  let item = document.createElement("p");
  item.textContent = "✋";
  // item.style.left = Math.random() * 100 + "%";
  playground.appendChild(item);
}
// const movingDiv = document.getElementById("hand");

const mousemoveHandler = function (event) {
  let x = event.clientX;
  let y = event.clientY;

  let width = movingDiv.offsetWidth;
  let height = movingDiv.offsetHeight;

  movingDiv.style.left = x - width / 2 + "px";
  movingDiv.style.top = y - height / 2 + "px";
};

document.addEventListener("mousemove", mousemoveHandler);
document.addEventListener("click", function () {
  document.body.style.backgroundColor = "red";
  setTimeout(() => {
    document.body.style.backgroundColor = "white";
  }, 500);
});
