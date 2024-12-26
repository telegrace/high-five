import { initConfetti } from "./confetti.js";

const socket = io();
const playground = document.getElementById("playground");
const otherHand = document.getElementById("other-hand");

let currentUserId;
let currentUserHandAppended = false;
let currentUserHand;

let userCount = 1;

socket.on("connect", () => {
	currentUserId = socket.id;
	console.log("connected", currentUserId);
	createHandElement(socket.id);
});

function checkHandAppended() {
	if (currentUserHandAppended) {
		currentUserHand = document.getElementById(`user-${currentUserId}`);

		playground.addEventListener("mousemove", (e) => {
			console.log("move");
			e.preventDefault();
			let mouseX = e.clientX;
			let mouseY = e.clientY;

			let width = currentUserHand.offsetWidth;

			let currentUserHandLeft = mouseX - width / 2;
			let currentUserHandTop = mouseY - width / 2;

			currentUserHand.style.left = currentUserHandLeft + "px";
			currentUserHand.style.top = currentUserHandTop + "px";
		});
		clearInterval(intervalId); // Stop checking once the hand is appended
	}
}

const intervalId = setInterval(checkHandAppended, 100); // Check every 100ms

otherHand.addEventListener("click", (e) => {
	console.log("click");
	initConfetti();
});

function createHandElement(id) {
	const hand = document.createElement("div");
	hand.id = `user-${id}`;
	hand.classList.add("hand");
	hand.innerHTML = "👋";
	hand.style.backgroundColor = `#${Math.floor(
		Math.random() * 16777215
	).toString(16)}`;
	hand.style.position = "absolute";
	hand.style.zIndex = -userCount;
	playground.appendChild(hand);
	currentUserHandAppended = true;
}
