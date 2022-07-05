'use strict';

const MessageClient = require('../lib/messageClient.js')
const chance = require('../lib/chance');

const messageQueue = new MessageClient('PokeFacts')

let storeName = chance.company();


setInterval(async () => {
 let order = {
  payload: {
    store: storeName,
    orderID: chance.guid(),
    customer: chance.name(),
    address: chance.address()
  }
}

  messageQueue.publish('SUBSCRIPTION-RECEIVED', order);
  console.log('Customer order received with orderID ',order.payload.orderID);
}, 20000);


messageQueue.subscribe('SUBSCRIPTION_RECEIVED', (payload) => {
  messageQueue.publish('POKE-FACTS', payload);
  console.log(`${payload.payload.store}: Order with ${payload.payload.orderID} has been PICKED UP`)
});

messageQueue.subscribe('DELIVERY_CONFIRMED', (payload) => {
  console.log(`${payload.payload.store} delivery with orderID:${payload.payload.orderID} confirmed. Thank you!`)
})