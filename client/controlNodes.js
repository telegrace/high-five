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
