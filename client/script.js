import { initConfetti } from "./confetti.js";

const socket = io();
const playground = document.getElementById("playground");
const userCountElement = document.getElementById("user-count");
const otherHand = document.getElementById("other-hand");

let currentUserId;

let count = 1;

const userMap = new Map();

socket.on("connect", () => {
	socket.emit("get-user-list");
	currentUserId = socket.id;
	createHandElement(currentUserId);

	socket.on("user-list", (userList) => {
		userList.forEach((user) => {
			if (user !== currentUserId) {
				userMap.set(user, { x: 0, y: 0, appended: false });
				createHandElement(user);
			}
		});
	});
});

socket.on("user-connected", ({ id, userCount, userList }) => {
	count = userCount;
	userCountElement.innerHTML = `online users: ${count}`;
	if (currentUserId !== id) {
		userMap.set(id, { x: 0, y: 0, appended: false });
		createHandElement(id);
	}
});

socket.on("high-five", () => {
	initConfetti();
});

socket.on("user-disconnected", ({ id, userCount }) => {
	count = userCount;
	userCountElement.innerHTML = `online users: ${count}`;
	document.getElementById(`user-${id}`).remove();
	userMap.delete(id);
	otherHand.style.visibility = "visible";
});

function checkHandAppended() {
	if (userMap.get(currentUserId).appended) {
		const currentUserHand = document.getElementById(`user-${currentUserId}`);

		playground.addEventListener("mousemove", (e) => {
			e.preventDefault();
			let mouseX = e.clientX;
			let mouseY = e.clientY;

			let width = currentUserHand.offsetWidth;

			let currentUserHandLeft = mouseX - width / 2;
			let currentUserHandTop = mouseY - width / 2;

			currentUserHand.style.left = currentUserHandLeft + "px";
			currentUserHand.style.top = currentUserHandTop + "px";

			emitHandMove(currentUserId, currentUserHandLeft, currentUserHandTop);
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
	initConfetti();
});

const checkHand = setInterval(() => {
	checkHandAppended();
}, 100); // Check every 100ms

const checkPlayers = setInterval(() => {
	checkPlayerAdded();
}, 100);

const checkHands = setInterval(() => {
	userMap.forEach((value, key) => {
		if (value.appended) {
			socket.on(key, (data) => {
				const hand = document.getElementById(`user-${key}`);
				hand.style.left = data.x + "px";
				hand.style.top = data.y + "px";
			});
		}
	});
}, 300);

function createHandElement(id) {
	const hand = document.createElement("div");
	hand.id = `user-${id}`;
	hand.classList.add("hand");
	hand.innerHTML = "👋";

	hand.style.position = "absolute";
	playground.appendChild(hand);
	hand.style.zIndex = -count;

	if (id !== currentUserId) {
		hand.addEventListener("click", (e) => {
			socket.emit("high-five");
			initConfetti();
		});
		hand.style.zIndex = count;
	}

	const user = userMap.get(id);
	userMap.set(id, { ...user, appended: true });
}

function emitHandMove(userId, x, y) {
	socket.emit("hand-move", { userId, x, y });
}
