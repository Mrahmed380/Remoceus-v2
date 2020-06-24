const { MessageEmbed, MessageCollector } = require("discord.js");

module.exports = {
  name: "changelogs",
  aliases: [],
  category: "General",
  description: "Displays Change Logs",
  usage: "",
  permissions: [],
  run: async (client, message, args) => {
    if(message.deletable) message.delete();
    let pages = Object.keys(client.changeLogs).reverse();
    let page = 0;
    message.channel.send(getChangeLogs(client, page))
    .then(msg => {
      //set filter to only let only set reactions and message author to respond
      const filter = zeMessage => {
        return zeMessage.author.id === message.author.id;
      }

      //create reactionCollector
      const collector = new MessageCollector(message.channel, filter, {idle: 60000})

      collector.on('collect', m => {
        let prefix = client.config.prefix;
        switch(m.content.toLowerCase()){
          case `${prefix}b`:{
            if(m.deletable) m.delete();
            page = page-1 < 0 ? pages.length-1: page-1;
            msg.edit(getChangeLogs(client, page));
            break;
          }
          case `${prefix}n`:{
            if(m.deletable) m.delete();
            page = (page+1)%pages.length;
            msg.edit(getChangeLogs(client, page));
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
    .catch(err => {
      console.log(err);
    })
  }
}

function getChangeLogs(client, page){
  let pages = Object.keys(client.changeLogs).reverse();
  let changes = client.changeLogs[pages[page]];
  let embed = new MessageEmbed()
  .setTitle(`Version ${pages[page]} Changes`)
  .setColor(client.config.color)
  .setThumbnail(client.user.displayAvatarURL())
  .addField("Changes", `-${changes.join(",\n-")}`)
  .setFooter(`Page ${page+1} of ${pages.length}`);
  return embed;
}
