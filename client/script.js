import {
  changeBackgroundColor,
  createHand,
  otherHand,
  removeHand,
} from './controlNodes.js';

const socket = io();
const playground = document.getElementById('playground');
const onlineUsersCount = document.querySelector('.online-users-count');
const instructions = document.querySelector('.instructions');

let globalUserSocketId;

socket.on('connect', () => {
  globalUserSocketId = socket.id;
  createHand(globalUserSocketId);
  socketListenerCurrentUsers();
});

let socketMap = new Map();
let elementMap = new Map();

function socketListenerCurrentUsers() {
  socket.on('user-count', function ({ userCount }) {
    onlineUsersCount.innerHTML = `online: ${userCount}`;
  });
  socket.on('new-user', function ({ newUser }) {
    const { socketId, userId } = newUser;
    socketMap.set(socketId, userId);
    createHand(socketId);
  });

  const userHand = document.getElementById(globalUserSocketId);

  playground.addEventListener('mousemove', function (event) {
    followMouse(userHand, event);
    userHand.style.display = 'unset';
  });
}

socket.on(
  'other-user-hand-move',
  function ({ userHandLeft, userHandTop, socketId }) {
    otherHand(userHandLeft, userHandTop, socketId);
    elementMap.set(socketId, { userHandLeft, userHandTop });
  }
);

socket.on('user-disconnected', function ({ userCount, socketId }) {
  socketMap.delete(socketId);
  removeHand(socketId);
  onlineUsersCount.innerHTML = `online: ${userCount}`;
});

socket.on('get-all-connections', function ({ socketMapObj }) {
  const entries = Object.entries(socketMapObj);
  socketMap = new Map(entries);
  // console.log('only the new connection should see this', socketMapObj);

  for (const key of socketMap.keys()) {
    createHand(key);
  }
});

socket.on('other-hand-in-range', function ({ socketId }) {
  if (globalUserSocketId !== socketId) {
    instructions.innerHTML = `click to high five!`;
    changeBackgroundColor('pink');
  }
});

socket.on('other-hand-out-of-range', function ({ socketId }) {
  if (globalUserSocketId !== socketId) {
    instructions.innerHTML = `move closer to a hand`;
    changeBackgroundColor('white');
    document.body.removeEventListener('click', confettiFunc);
  }
});

socket.on('smackee', function ({ socketId }) {
  if (globalUserSocketId !== socketId) {
    console.log('you got smacked');
  }
});

function followMouse(userHand, event) {
  event.preventDefault();
  let mouseX = event.clientX;
  let mouseY = event.clientY;

  let width = userHand.offsetWidth;

  let userHandLeft = mouseX - width / 2;
  let userHandTop = mouseY - width / 2;

  userHand.style.left = userHandLeft + 'px';
  userHand.style.top = userHandTop + 'px';
  socket.emit('hand-move', { userHandLeft, userHandTop, globalUserSocketId });

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
    socket.emit('hand-in-range', {
      globalUserSocketId,
    });
    instructions.innerHTML = `click to high five!`;
    changeBackgroundColor('pink');

    document.body.addEventListener('click', () => {
      socket.emit('smacker', {
        globalUserSocketId,
      });
      confettiFunc();
    });
  } else {
    socket.emit('hand-out-of-range', {
      globalUserSocketId,
    });
    instructions.innerHTML = `move closer to a hand`;
    changeBackgroundColor('white');
    document.body.removeEventListener('click', confettiFunc);
  }
}

function toDecimal(num) {
  let string = '0.' + num.toString();
  return parseFloat(string);
}

function confettiFunc() {
  confetti({
    angle: randomInRange(55, 125),
    spread: randomInRange(50, 70),
    particleCount: randomInRange(50, 100),
    origin: { x: 0.5, y: 0.5 },
  });
}

function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}
