/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-var-requires */
const { io } = require('socket.io-client');

const socket = io('http://localhost:3000/events', {
  transports: ['websocket'],
});

socket.on('connect', () => {
  console.log(`connected to the WebSocket server`);
  socket.emit('message', 'Hello from the client!');
});

socket.on('disconnect', () => {
  console.log('Disconnected from the WebSocket server');
});
