
const Discord = require("discord.js");

module.exports = {
  name: "help",
  aliases: [],
  category: "General",
  description: "Displays help menu",
  usage: "!help",
  run: async (client, message, args) => {
    //let categories = new Discord.Collection();
    let categoryNames = [];
    let index = 0;
    client.commands.forEach(function(object, key, map){
      if(!categoryNames.includes(object.category)){
        //categories.set(object.category, [object]);
        categoryNames.push(object.category);
      }else{
        //categories.get(object.category).push(object);
      }
    })
    //console.log(categories);
    //console.log(categoryNames);
    message.channel.send(getCategoryEmbed(client, categoryNames[index])).then(msg => {

      //Add Reactions to msg
      let reactions = ["⬅", "➡", "⏹"];
      reactions.forEach(function(r, i){
        setTimeout(function(){
          msg.react(r);
        }, i*800)
      })

      const filter = (reaction, user) => {
        return reactions.includes(reaction.emoji.name) && user.id === message.author.id;
      }

      const collector = msg.createReactionCollector(filter, {});

      collector.on('collect', (reaction) => {
        setTimeout(function(){
          reaction.remove(message.author.id).catch(err => {});
        }, 500)
        switch(reaction.emoji.name){
          case '⬅':{
            index = (index-1) < 0? categoryNames.length-1 :index-1;
            msg.edit(getCategoryEmbed(client, categoryNames[index]));
            break;
          }
          case '➡':{
            index = (index+1)%categoryNames.length;
            msg.edit(getCategoryEmbed(client, categoryNames[index]));
            break;
          }
          case '⏹':{
            collector.emit('end');
            break;
          }
        }
      })

      collector.on('end', collected => {
        msg.delete();
      })
    })
  }
}

function getCategoryEmbed(client, category){
  let commands = [];
  client.commands.filter(r => r.category === category).forEach(function(object, key, map){
    let obj = {
      name: object.name,
      description: object.description,
      usage: object.usage
    }
    commands.push(obj);
  })
  let embed = new Discord.RichEmbed()
  .setTitle(`${category} Commands`)
  .setColor(client.config.color)
  .setThumbnail(client.user.displayAvatarURL);
  if(commands.length == 0){
    embed.addField("No Commands", "No Commands Listed");
  }else{
    for(let i = 0; i<commands.length; i++){
      let temp = commands[i];
      embed.addField(temp.name, `Description: ${temp.description}\nUsage: ${temp.usage}`)
    }
  }
  return embed;
}
