export function createHand(socketId) {
  let hand = document.createElement("div");
  hand.className = "hand";
  hand.id = socketId;
  hand.textContent = "✋";
  playground.appendChild(hand);
}

export function removeHand(socketId) {
  document.getElementById(socketId).remove();
}

export function otherHand(userHandLeft, userHandTop, socketId) {
  if (document.getElementById(socketId)) {
    let otherHand = document.getElementById(socketId);
    otherHand.style.left = userHandLeft + "px";
    otherHand.style.top = userHandTop + "px";
    otherHand.style.display = "unset";
  }
}

export function changeBackgroundColor(color) {
  document.body.style.backgroundColor = color;
}
