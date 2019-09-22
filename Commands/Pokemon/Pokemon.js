const { RichEmbed } = require("discord.js");
const { PokemonInfo, TypeColors } = require("../../Utils/Pokemon.js");

module.exports = {
  name: "pokemon",
  aliases: [],
  category: "Pokemon",
  description: "Gives stat infomation and more on a pokemon",
  usage: "<pokemon name>",
  permissions: [],
  run: async (client, message, args) => {
    if(message.deletable) message.delete();
    let pokemon = args.join("").split("-").join("").toLowerCase().trim();
    if(!pokemon) return message.channel.send("No name given").then(m => m.delete(5000));
    let PokeObject = PokemonInfo[pokemon];
    if(!PokeObject) return message.channel.send("Could not find pokemon").then(m => m.delete(5000));
    message.channel.send(await getPokeEmbed(PokeObject, client))
      .then(msg => {
        let reactions = [{emoji: "", page: "Stats"}]
      });
  }
}

async function getPokeEmbed(obj, client, page = "stats"){
  let url = `https://www.serebii.net/pokemon/art/${getNum(obj.num)}${getforme(obj)}.png`;
  let image = await client.errors.checkURL(url)
  .then(r => {
    return url;
  })
  .catch(err => {
    return 'https://www.serebii.net/pokearth/sprites/rb/000.png';
  })
  let numOfPokemon = getMaxDex();
  let embed = new RichEmbed()
  .setTitle(`${(obj.forme?`${obj.baseSpecies}-${obj.forme}`:obj.species)}`)
  .setThumbnail(image)
  .setColor(TypeColors[obj.types[0]])
  .setFooter(`Pokemon #${obj.num < 10?`00${obj.num}`: (obj.num < 100? `0${obj.num}`: obj.num)} of ${getMaxDex()}`)
  .addField("Typing", obj.types.join("/\n"), true)
  .addField("Height/ Weight", `Height: ${obj.heightm} m\nWeight: ${obj.weightkg} kg`, true)
  .addField("Base Stats",`HP: ${obj.baseStats.hp}\nAttack: ${obj.baseStats.atk}\nDefense: ${obj.baseStats.def}\nSp. Attack: ${obj.baseStats.spa}\nSp. Defense: ${obj.baseStats.spd}\nSpeed: ${obj.baseStats.spe}`, true)
  .addField("Abilities", getAbilities(obj.abilities), true)
  .addField("Egg Groups", obj.eggGroups, true)
  .addField("Color", obj.color, true)
  if(obj.prevo || obj.evos){
    embed.addField("Evolutions", `${obj.prevo? `Evolves from: ${PokemonInfo[obj.prevo].species} (${getEvoType(obj)})\n`: ``}${obj.evos?`Evolves into: ${getEvos(obj.evos).join(" or ")}`: ''}`);
  }
  return embed;
}

function getEvos(evos){
  for(let i = 0; i<evos.length; i++){
    let evo = evos[i];
    evos[i] = `${PokemonInfo[evo].species} (${getEvoType(PokemonInfo[evo])})`;
  }
  return evos;
}

function getEvoType(poke){
  if(poke.evoLevel){
    return `Level: ${poke.evoLevel}`;
  }
  if(poke.evoItem){
    return poke.evoItem;
  }
  return poke.evoType;
}

function getMaxDex(){
  var keys = Object.keys(PokemonInfo);
  var max = 0;
  keys.forEach(function(r, i){
    if(PokemonInfo[r].num > max){
      max = PokemonInfo[r].num;
    }
  })
  return max;
}

function getAbilities(abilities){
  let abilityArray = [];
  if(abilities[0]){
    abilityArray.push(`Ability 1: ${abilities[0]}`);
  }
  if(abilities[1]){
    abilityArray.push(`Ability 2: ${abilities[1]}`);
  }
  if(abilities.H){
    abilityArray.push(`Hidden Ability: ${abilities.H}`)
  }
  if(abilities.S){
    abilityArray.push(`Special Ability: ${abilities.S}`)
  }
  if(abilityArray.length > 0){
    return abilityArray;
  }else{
    return "No Special Abilities";
  }
}

function getforme(obj){
  if(obj.formeLetter){
    return `-${obj.formeLetter.toLowerCase()}`;
  }else{
    return '';
  }
}

function getNum(number){
  if(number < 10){
    return `00${number}`;
  }else if(number < 100){
    return `0${number}`;
  }else{
    return number;
  }
}
