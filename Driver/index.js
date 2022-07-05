'use strict';

const MessageClient = require('../lib/messageClient');

const messageQueue = new MessageClient('driver');

messageQueue.subscribe('PICKUP_REQUESTED', (payload) => {
  setTimeout(() => {
    messageQueue.publish('IN_TRANSIT', payload);
    console.log(`ORDER STATUS: Order for ${payload.payload.orderID} is currently IN TRANSIT.`);
  }, 2000);
});
messageQueue.subscribe('IN_TRANSIT', (payload) => {
  setTimeout(() => {
    messageQueue.publish('DELIVERED', payload);
    console.log(`ORDER STATUS: Order for ${payload.payload.orderID} has been DELIVERED.`);
  }, 2000);
});

// messageQueue.subscribe('POKE-FACTS', (payload) => {
//   setTimeout(() => {
//     messageQueue.publish('IN_TRANSIT', payload);
//     let random = Math.floor(Math.random()*5)
//     if(random === 0){
//       console.log('Woah That\'s amazing I never knew pokemons were so cool')
//     } else if(random === 1){
//       console.log('This is the bees knees I can\'t believe I just now subscribed to this.')
//     }else if(random === 2){
//       console.log('You guys have outdone yourselves. Amazing fact')
//     }else if(random === 3){
//       console.log('Actually I don\'t know if that is accurate')
//     }else if(random === 4){
//       console.log('Can you send me some facts about charizard')
//     }else if(random === 5){
//       console.log('WOOOW! I didn\'t know that!!!!')
//     }
//   }, 2000);
// });
// messageQueue.subscribe('IN_TRANSIT', (payload) => {
//   setTimeout(() => {
//     messageQueue.publish('DELIVERED', payload);
//     console.log(`ORDER STATUS: Order for ${payload.payload.orderID} has been DELIVERED.`);
//   }, 2000);
// });