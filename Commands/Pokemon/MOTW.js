const { MessageEmbed, MessageCollector } = require("discord.js");
const MOTW = require("../../Models/MOTW.js");
let index = 0;
const { PokemonInfo } = require("../../Utils/Pokemon.js");

module.exports = {
	name: "motw",
	aliases: [],
	category: "Pokemon",
	description: "Displays most recent MOTW moveset, or all movesets to a specific pokemon (Only has pokemon in motws after 2020)",
	usage: "<none or PokemonName>",
	permissions: [],
	run: async (client, message, args) => {
		if(message.deletable) message.delete();
		index = 0;
		let motws = args[0] ? await getMOTWWithSpecies(args[0]) : await getMOTW();
		if(motws && motws.length > 1){
			motws = motws.reverse();
		}
		let embed = createMOTWEmbed(client, message, motws);
		message.channel.send(embed).then(msg => {
			const filter = zeMessage => {
				return zeMessage.author.id === message.author.id;
			}

			const collector = new MessageCollector(message.channel, filter, {idle: 60000});

			collector.on('collect', m => {
				let prefix = client.config.prefix;
				switch(m.content.toLowerCase()){
					case `${prefix}b`:{
						if(m.deletable) m.delete();
						index = (index - 1) < 0 ? motws.length - 1 : index - 1;
						embed = createMOTWEmbed(client, message, motws);
						msg.edit(embed);
						break;
					}
					case `${prefix}n`:{
						if(m.deletable) m.delete();
						index = (index + 1) % motws.length;
						embed = createMOTWEmbed(client, message, motws);
						msg.edit(embed);
						break;
					}
					case `${prefix}stop`:{
						if(m.deletable) m.delete();
						collector.emit('end');
						break;
					}
				}
			})

			collector.on('end', collected => {
				msg.delete().catch(err => {});
			})
		})
	}
}

const createMOTWEmbed = (client, message, motws) => {
	let embed = new MessageEmbed()
	.setColor(client.config.color);
	if(!motws || motws.length === 0 || !motws[index]){
		embed.addField("No MOTWs", "Come back later!")
		.setThumbnail(message.guild.iconURL);
	}else{
		let currentSet = motws[index];
		embed.setTitle(currentSet.setName)
				 .setThumbnail(getThumbnail(message, currentSet.pokemon, currentSet.forme))
				 .addField("Pokemon", client.helpers.getTitleCase(currentSet.pokemon))
				 .addField("Ability(s)", currentSet.ability)
				 .addField("Item(s)", currentSet.item)
				 .addField("EVs", `${formatEVSpread(currentSet)}`)
				 .addField("Moveset", `${currentSet.move1}\n${currentSet.move2}\n${currentSet.move3}\n${currentSet.move4}`)
				 .setFooter(`Set #${index+1} of ${motws.length}.\nUse ${client.config.prefix}n to go to the next set, ${client.config.prefix}b to go back, and ${client.config.prefix}stop to close the motw.`);
         if(currentSet.ytLink){
           embed.setURL(currentSet.ytLink);
         }
	}
	return embed;
}

const formatEVSpread = ({evs}) => {
	let res = ``;
	let stat = ["HP", "Atk", "Def", "Sp Atk", "Sp Def", "Speed"];
	for(let i = 0; i < evs.length; i++){
		if(evs[i] != 0){
			res += `${evs[i]} ${stat[i]}, `;
		}
	}
	return res.substring(0, res.length - 2);
}

const getMOTW = async () => {
	let motws = await new Promise(function(resolve, reject) {
		MOTW.find().exec((err, res) => {
			if(err) console.log(err);
			if(!res) resolve([]);
			resolve(res);
		})
	});
	return motws;
}

const getMOTWWithSpecies = async (species) => {
	let motws = await new Promise(function(resolve, reject) {
    let pokemon = species.toLowerCase().trim();
		MOTW.find({
			pokemon: pokemon
		}).exec((err, res) => {
			if(err) console.log(err);
			if(!res) resolve([]);
			resolve(res);
		})
	});
	return motws;
}

const getThumbnail = (message, species, form) => {
	let poke = PokemonInfo[species.toLowerCase()];
	if(!species){
		return message.guild.iconURL;
	}
	if(!poke){
		return message.guild.iconURL;
	}
	let dexNum = `${poke.num}`;
	let formID = getFormLetter(species, form);
	switch(dexNum.length){
		case 1: {
			dexNum = `00${dexNum}`;
			break;
		}
		case 2: {
			dexNum = `0${dexNum}`;
			break;
		}
		default: break;
	}
	return `https://www.serebii.net/pokemon/art/${dexNum}${formID ? `-${formID}` : ''}.png`;
}

const getFormLetter = (species, form) => {
	if(!form) return '';
	form = form.toLowerCase().trim();
	let types = ['bug', 'dark', 'dragon', 'electric', 'fairy', 'fighting', 'fire', 'flying', 'ghost', 'grass', 'ground', 'ice', 'poison', 'psychic', 'rock', 'steel', 'water'];
	if((species == 'arceus' || species == 'silvally') && types.includes(form)){
		return form;
	}
	switch(form){
		case '10%': return '10';
		case 'attack': case 'autumn': case 'ash': return 'a';
		case 'blue-striped': case 'black': case 'blade': case 'busted': return 'b';
		case 'complete': case 'core': case 'crowned': return 'c';
		case 'defense': case 'dusk': return 'd';
		case 'dawn wings': return 'dw';
		case 'dusk mane': return 'dm';
		case 'east': case 'electric': case 'eternal': case 'eternamax': return 'e';
		case 'frost': case 'fire': return 'f';
		case 'galar': return 'g';
		case 'galar-zen': return 'gz';
		case 'gmax': case 'gigantimax': return 'gi';
		case 'heat': case 'super': case 'hangry': return 'h';
		case 'snowy': case 'ice': return 'i';
		case 'large': case 'low key': return 'l';
		case 'primal': case 'mega': case 'mow': case 'midnight': case 'ultra': return 'm';
		case 'average': case 'noice': return 'n';
		case 'origin': case 'original': return 'o';
		case 'plant': case 'pom-pom': return 'p';
		case 'pa\'u': return 'pau';
		case 'rainy': case 'resolute': return 'r';
		case 'sunny': case 'speed': case 'sunshine': case 'fan': case 'sky': case 'summer': case 'therian': case 'pirouette': case 'small': case 'sensu': case 'school': return 's';
		case 'trash': return 't';
		case 'unbound': return 'u';
		case 'wash': case 'winter': case 'white': case 'water': return 'w';
		case 'zen': return 'z';
		default: return '';
	}
	return '';
}
