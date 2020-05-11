const { MessageEmbed } = require("discord.js");

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
      //Add Reactions to msg
      let reactions = ["⬅", "➡", "⏹"];
      reactions.forEach(function(r, i){
        setTimeout(function(){
          msg.react(r);
        }, i*800)
      })

      //set filter to only let only set reactions and message author to respond
      const filter = (reaction, user) => {
        return reactions.includes(reaction.emoji.name) && user.id === message.author.id;
      }

      //create reactionCollector
      const collector = msg.createReactionCollector(filter, {});

      collector.on('collect', (reaction) => {
        /*setTimeout(function(){
          reaction.remove(message.author.id).catch(err => {});
        }, 250)*/
        switch(reaction.emoji.name){
          case '⬅':{
            page = page-1 < 0 ? pages.length-1: page-1;
            msg.edit(getChangeLogs(client, page));
            break;
          }
          case '➡':{
            page = (page+1)%pages.length;
            msg.edit(getChangeLogs(client, page));
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
