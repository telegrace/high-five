// remember to wrap in ()=>{}
const socket = io();

const movingDiv = document.getElementById("hand");

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
