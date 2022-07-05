'use strict';

const MessageClient = require('../lib/messageClient.js')
const chance = require('../lib/chance');
const axios = require('axios');

const messageQueue = new MessageClient('PokeCenter');

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


  const ulrinfo = `https://pokeapi.co/api/v2/pokemon/${randomPokemon}`

  let pokemonIfnoArr = [];

  let pokeInfo = await axios.get(ulrinfo);
  
  pokeInfo.data.abilities.forEach(element => {
    pokemonIfnoArr.push(element.ability.name);
  });
  
  function xp(){
    return Math.floor(Math.random()*500);
  }

  let experience = xp();

  let uppercasedPokemon = randomPokemon.charAt(0).toUpperCase() + randomPokemon.slice(1);

  let order = {
    payload: {
      // store: storeName,
      orderID: chance.guid(),
      customer: chance.name(),
      // address: chance.address(),
      pokemon: uppercasedPokemon,
      gainedXP: experience,
      moves:pokemonIfnoArr[1]
    }
  }

  messageQueue.publish('ORDER-RECEIVED', order);
  console.log('Customer order received with orderID ', order.payload.orderID);
}, 2000);


messageQueue.subscribe('ORDER-RECEIVED', (payload) => {
  messageQueue.publish('PICKUP-REQUESTED', payload);
  console.log(`${payload.payload.customer}, your pokemon ${payload.payload.pokemon} has been picked up from the PokeCenter. Your orderId is ${payload.payload.orderID}`)
});

messageQueue.subscribe('DELIVERY-CONFIRMED', (payload) => {
  console.log(`${payload.payload.customer} delivery with orderID:${payload.payload.orderID} confirmed. Thank you!`)
});