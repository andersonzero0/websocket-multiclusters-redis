/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-var-requires */
const { io } = require('socket.io-client');

function createClient(id_user) {
  const socket = io('http://localhost/events', {
    transports: ['websocket'],
  });

  socket.on('connect', () => {
    console.log(`=>> id_user: ${id_user} connected to the WebSocket server`);
  });

  socket.on('events', (data) => {
    console.log(socket.id, 'received message:', data);
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from the WebSocket server');
  });
}

for (let i = 1; i <= 1; i++) {
  createClient(i.toString().padStart(2, '0'));
}
