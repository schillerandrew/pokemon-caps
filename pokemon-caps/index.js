'use strict';

let api_Call = require('../randomPokemon');


let pokemonArray = async () =>{
  await api_Call();
} 


console.log(pokemonArray);