
const Discord = require("discord.js");

module.exports = {
  name: "help",
  aliases: [],
  category: "General",
  description: "Displays help menu",
  usage: "",
  permissions: [],
  run: async (client, message, args) => {
    if(message.deletable) message.delete();
    let categoryNames = [];
    let index = 0;
    client.commands.forEach(function(object, key, map){
      if(!categoryNames.includes(object.category)){
        categoryNames.push(object.category);
      }
    })
    message.channel.send(getCategoryEmbed(client, categoryNames, index)).then(msg => {
      //set filter to only let only set reactions and message author to respond
      const filter = (zeMessage) => {
        return zeMessage.author.id === message.author.id;
      }

      // Create Message Collector
      const collector = new Discord.MessageCollector(message.channel, filter, {idle: 60000});

      collector.on('collect', (m) => {
        let prefix = client.config.prefix;
        switch(m.content.toLowerCase()){
          case `${prefix}n`: {
            if(m.deletable) m.delete();
            index = (index+1)%categoryNames.length;
            msg.edit(getCategoryEmbed(client, categoryNames, index));
            break;
          }
          case `${prefix}b`: {
            if(m.deletable) m.delete();
            index = (index-1) < 0? categoryNames.length-1 :index-1;
            msg.edit(getCategoryEmbed(client, categoryNames, index));
            break;
          }
          case `${prefix}stop`: {
            if(m.deletable) m.delete();
            collector.emit('end');
            msg.delete().catch(err => {});
            break;
          }
        }
      })

      collector.on('end', collected => {});
    })
  }
}

function getCategoryEmbed(client, categoryNames, index){
  let commands = [];
  client.commands.filter(r => r.category === categoryNames[index]).forEach(function(object, key, map){
    let obj = {
      name: object.name,
      description: object.description,
      usage: object.usage,
      permissions: object.permissions.join(", ")
    }
    commands.push(obj);
  })
  let embed = new Discord.MessageEmbed()
  .setTitle(`${categoryNames[index]} Commands`)
  .setColor(client.config.color)
  .setThumbnail(client.user.displayAvatarURL())
  .setFooter(`Page ${index+1} of ${categoryNames.length}, use ${client.config.prefix}n to go to the next page and ${client.config.prefix}b to go to the last page and ${client.config.prefix}stop to close the page.`);
  if(commands.length == 0){
    embed.addField("No Commands", "No Commands Listed");
  }else{
    let commandList = [];
    for(let i = 0; i<commands.length; i++){
      let temp = commands[i];
      commandList.push(`**${client.config.prefix}${temp.name} ${temp.usage}** | Description: ${temp.description}${temp.permissions? `\nPermissions: ${temp.permissions}`: ``}`)
      //embed.addField(`**${client.config.prefix}${temp.name} ${temp.usage}**`, `Description: ${temp.description}\n${temp.permissions? `Permissions: ${temp.permissions}`: ``}`)
    }
    embed.setDescription(commandList.join('\n'));
  }
  return embed;
}
