'use strict';
const axios = require("axios");

async function grabPokemon(){
  const url = 'https://pokeapi.co/api/v2/pokemon/'
  
  const pokemon = await axios.get(url)
  
  function random(){
    return Math.floor(Math.random()*20);
  }
  let pokemonArray = [];


  pokemon.data.results.forEach(element => {
    pokemonArray.push(element.name);
  });
  
  // pokemon.data.map((e)=>{
  //   pokemonArray.push(e.name);
  // });
  // make sure that when you are using this function you have it return the item instead of console.log
  // console.log(pokemonArray[random()]);


  // random pokemon return 
  return pokemonArray[random()];
}


module.exports = grabPokemon;
