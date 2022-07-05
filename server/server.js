const { Server } = require('socket.io');
const PORT = process.env.PORT || 3000;
const Queue = require('../lib/queue.js');
const Log = require('../lib/logger.js');

const server = new Server(PORT);
const messageQueue = new Queue();
const caps = server.of('/caps');



caps.on('connection', socket => {
  console.log('Successfully connected to Caps Server!!' + socket.id);

  socket.on('JOIN', ({ queueId }) => {
    socket.join(queueId);
    socket.emit('JOIN', queueId);
  });

  socket.on('ORDER-RECEIVED', (payload) => {
    let currentQueue = messageQueue.read(payload.queueId);
    if (!currentQueue) {
      let queueKey = messageQueue.store(payload.queueId, new Queue());
      currentQueue = messageQueue.read(queueKey);
    }
    currentQueue.store(payload.messageId, payload);

    let log = new Log('ORDER-RECEIVED', payload);

    let message = currentQueue.remove(payload.messageId);
    console.log(log);
    caps.emit('ORDER-RECEIVED', message);
  });

  socket.on('PICKUP_REQUESTED', (payload) => {
    let currentQueue = messageQueue.read(payload.queueId);
    if (!currentQueue) {
      throw new Error('No messages in the Queue');
    }

    let log = new Log('SCHEDULED FOR PICKUP', payload);
    console.log(log);
    caps.emit('PICKUP_REQUESTED', payload);
  });

  socket.on('IN_TRANSIT', (payload) => {
    console.log(payload);
    let currentQueue = messageQueue.read(payload.queueId);
    if (!currentQueue) {
      throw new Error('No messages in the Queue');
    }
    let log = new Log('IN-TRANSIT', payload);
    console.log(log);
    caps.emit('IN_TRANSIT', payload);
  });
  
  socket.on('DELIVERED', (payload) => {
    let currentQueue = messageQueue.read(payload.queueId);
    if (!currentQueue) {
      throw new Error('No messages in the Queue');
    }
    let log = new Log('DELIVERED', payload);
    console.log(log);
    caps.emit('DELIVERY_CONFIRMED', payload);
  });
});
