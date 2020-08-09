const fetch = require('node-fetch');
const fs = require('fs');

function looseJsonParse(obj){
  return Function('"use strict"; return (' + obj + ')')();
}

fetch('http://play.pokemonshowdown.com/data/pokedex.js', {
  method: 'POST'
})
.then(async info => {
  let pokes = await info.text();
  pokes = pokes.split(/=/)[1];
  let Test = looseJsonParse(pokes.substring(0, pokes.length-1));
  fs.writeFile('./Utils/Pokemon/Pokemon Info.json', JSON.stringify(Test, null, '\t'), (err) =>{
    if(err) return console.log(err);
  })
})
.catch(console.error);

fetch('http://play.pokemonshowdown.com/data/moves.js', {
  method: 'POST'
})
.then(async info => {
  let moves = await info.text();
  moves = moves.split(/\s=\s/)[1];
  let Test = looseJsonParse(moves.substring(0, moves.length-1));
  fs.writeFile('./Utils/Pokemon/Move Info.json', JSON.stringify(Test, null, '\t'), (err) =>{
    if(err) return console.log(err);
  })
})
.catch(console.error);

fetch('http://play.pokemonshowdown.com/data/learnsets.js', {
    method: 'POST'
})
.then(async info => {
    let learnsets = await info.text();
    learnsets = learnsets.split(/=/)[1]
    let Test = looseJsonParse(learnsets.substring(0, learnsets.length-1));

    fs.writeFile('./Utils/Pokemon/Learn Sets.json', JSON.stringify(Test, null, '\t'), (err) => {
        if(err) return console.log(err);
    })
})
.catch(console.error);
