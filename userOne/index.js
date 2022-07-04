'use strict';

const  { io }  = require('socket.io-client');

const socket = io('http://localhost:3002/pokemon-caps');

socket.on('POKEMON', (payload) => {
  setTimeout( () => {
    console.log(payload);
    socket.emit('LOGOFF', payload);
  })
}, 1000);

socket.on('LOGOFF', (payload) => {
  console.log(`Thanks for the Pokemon info. I'm logging off -- see ya later!`);
})