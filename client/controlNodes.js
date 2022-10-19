export function removeAllChildren(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

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
    otherHand.style.left = userHandLeft;
    otherHand.style.top = userHandTop;
  }
}
