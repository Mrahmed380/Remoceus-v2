const Pokemon = require("../../Utils/Pokemon.js");
const { MessageEmbed, MessageCollector } = require("discord.js");
const movesPerPage = 5;

module.exports = {
  name: "learnset",
  aliases: [],
  category: "Pokemon",
  description: "Displays the learnset for a pokemon",
  usage: "<Pokemon Name>",
  permissions: [],
  run: async (client, message, args) => {
    if(message.deletable) message.delete();
    const learnsets = Pokemon.LearnSets;
    let pokemon = args.join(" ").replace(/[^a-z]/gi, "").toLowerCase();
    if(!pokemon) return message.channel.send("Could not find argument").then(m => m.delete({timeout: 5000}));
    let MoveSets = learnsets[pokemon].learnset;
    if(!MoveSets) return message.channel.send(`Could not find moveset for ${pokemon}`).then(m => m.delete({timeout: 5000}));
    let maxPages = Math.ceil(Object.keys(MoveSets).length/movesPerPage);
    let index = 0;
    message.channel.send(await getMoveSetEmbed(client, Pokemon.PokemonInfo[pokemon], MoveSets, index)).then(msg => {
      const filter = zeMessage => {
				return zeMessage.author.id === message.author.id;
			}

			const collector = new Discord.MessageCollector(message.channel, filter, {idle: 60000});

			collector.on('collect', async m => {
				let prefix = client.config.prefix;
				switch(m.content.toLowerCase()){
					case `${prefix}b`:{
						if(m.deletable) m.delete();
            index = (index-1) < 0? maxPages-1 :index-1;
            msg.edit(await getMoveSetEmbed(client, Pokemon.PokemonInfo[pokemon], MoveSets, index));
            break;
					}
					case `${prefix}n`:{
						if(m.deletable) m.delete();
            index = (index+1)%maxPages;
            msg.edit(await getMoveSetEmbed(client, Pokemon.PokemonInfo[pokemon], MoveSets, index));
            break;
					}
					case `${prefix}stop`:{
						if(m.deletable) m.delete();
						collector.emit('end');
            msg.delete().catch(err => {});
						break;
					}
				}
			})

      collector.on('end', collected => {})
    })
  }
}

async function getMoveSetEmbed(client, poke, learnset, index){
  let url = `https://www.serebii.net/pokemon/art/${getNum(poke.num)}${getforme(poke)}.png`;

  let maxPages = Math.ceil(Object.keys(learnset).length/movesPerPage);

  const embed = new MessageEmbed()
  .setTitle(poke.species)
  .setThumbnail(url)
  .setColor(Pokemon.TypeColors[poke.types[0]])
  .setFooter(`Page ${index+1} of ${maxPages}`);

  let moves = Object.keys(learnset);

  for(let i = index*movesPerPage; i<(index+1)*movesPerPage && i<moves.length; i++){
    let move = Pokemon.MoveInfo[moves[i]];
    embed.addField(`${move.name}`, `Type: ${move.type}\nPP: ${move.pp >= 5?`${move.pp} to ${move.pp+(move.pp/5)*3}`:move.pp}\n${move.basePower?`Power: ${move.basePower} `:''}${move.accuracy?`Accuracy: ${move.accuracy.toString() == "true"?'--':`${move.accuracy}%`}`:''}\nCategory: ${move.category}\n${move.zMovePower?`Z-Move Power: ${move.zMovePower}\n`:``}`)
  }

  return embed;
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
