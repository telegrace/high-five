import { initConfetti } from "./confetti.js";

const socket = io();
const playground = document.getElementById("playground");

console.log("get the box to follow the mouse");

const currentUserHand = document.getElementById("current-user-hand");
const otherHand = document.getElementById("other-hand");

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

otherHand.addEventListener("click", (e) => {
	console.log("click");
	initConfetti();
});

// function followMouse()
