import { initConfetti } from "./confetti.js";

const socket = io();
const playground = document.getElementById("playground");
const userCountElement = document.getElementById("user-count");
const otherHand = document.getElementById("other-hand");

let currentUserId;
let currentUserHandAppended = false;
let currentUserHand;

let count = 1;

socket.on("connect", () => {
	currentUserId = socket.id;
	console.log("connected", currentUserId);
	createHandElement(socket.id);
});

socket.on("user-connected", ({ id, userCount }) => {
	count = userCount;
	userCountElement.innerHTML = `online users: ${count}`;
});

function checkHandAppended() {
	if (currentUserHandAppended) {
		currentUserHand = document.getElementById(`user-${currentUserId}`);

		playground.addEventListener("mousemove", (e) => {
			e.preventDefault();
			let mouseX = e.clientX;
			let mouseY = e.clientY;

			let width = currentUserHand.offsetWidth;

			let currentUserHandLeft = mouseX - width / 2;
			let currentUserHandTop = mouseY - width / 2;

			currentUserHand.style.left = currentUserHandLeft + "px";
			currentUserHand.style.top = currentUserHandTop + "px";
		});
		clearInterval(checkHand); // Stop checking once the hand is appended
	}
}

function checkPlayerAdded() {
	if (count > 1) {
		otherHand.style.visibility = "collapse";
		clearInterval(checkPlayers);
	}
}
otherHand.addEventListener("click", (e) => {
	console.log("clicked");
	initConfetti();
});
const checkHand = setInterval(() => {
	checkHandAppended();
}, 100); // Check every 100ms

const checkPlayers = setInterval(() => {
	checkPlayerAdded();
}, 100);

function createHandElement(id) {
	const hand = document.createElement("div");
	hand.id = `user-${id}`;
	hand.classList.add("hand");
	hand.innerHTML = "👋";
	hand.style.backgroundColor = `#${Math.floor(
		Math.random() * 16777215
	).toString(16)}`;
	hand.style.position = "absolute";
	console.log("count", count);
	hand.style.zIndex = -count;
	playground.appendChild(hand);
	currentUserHandAppended = true;
}
