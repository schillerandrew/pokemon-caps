'use strict';

const MessageClient = require('../lib/messageClient.js')
const chance = require('../lib/chance');
const axios = require('axios');

const messageQueue = new MessageClient('PokeFacts');

let storeName = chance.company();

// async function grabPokemon(){

//   return pokemonArray[random()];
// }

// let randomPokemon = grabPokemon();

setInterval(async () => {
  const url = 'https://pokeapi.co/api/v2/pokemon/?offset=150&limit=150'

  const pokemon = await axios.get(url)

  function random() {
    return Math.floor(Math.random() * 150);
  }

  let pokemonArray = [];
  pokemon.data.results.forEach(element => {
    pokemonArray.push(element.name);
  });

  let randomPokemon = pokemonArray[random()];

  let uppercasedPokemon = randomPokemon.charAt(0).toUpperCase() + randomPokemon.slice(1);

  let order = {
    payload: {
      // store: storeName,
      orderID: chance.guid(),
      customer: chance.name(),
      // address: chance.address(),
      pokemon: uppercasedPokemon
    }
  }

  messageQueue.publish('ORDER-RECEIVED', order);
  console.log('Customer order received with orderID ', order.payload.orderID);
}, 2000);


messageQueue.subscribe('ORDER-RECEIVED', (payload) => {
  messageQueue.publish('PICKUP-REQUESTED', payload);
  console.log(`${payload.payload.customer}, your pokemon ${payload.payload.pokemon} has been DELIVERED from the PokeCenter`)
});

messageQueue.subscribe('DELIVERY_CONFIRMED', (payload) => {
  console.log(`${payload.payload.customer} delivery with orderID:${payload.payload.orderID} confirmed. Thank you!`)
});