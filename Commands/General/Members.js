const { MessageEmbed, MessageCollector } = require("discord.js");
const membersPerPage = 10;
let page = 1;

module.exports = {
  name: "members",
  aliases: [],
  category: "General",
  description: "Displays all non bot members in the current server",
  usage: "",
  permissions: [],
  run: async (client, message, args) => {
    if(message.deletable) message.delete();
    let guildMembers = message.guild.members.cache.array().filter(member => !member.user.bot);
    let maxPages = Math.ceil(guildMembers.length/membersPerPage);
    message.channel.send(getMemberPage(client, message.guild))
    .then(msg => {
      const filter = (zeMessage) => {
        return zeMessage.author.id === message.author.id;
      }

      const collector = new MessageCollector(message.channel, filter, {idle: 60000});
      collector.on('collect', m => {
        let prefix = client.config.prefix;
        switch(m.content.toLowerCase()){
          case `${prefix}n`:{
            if(m.deletable) m.delete();
            page = ((page%maxPages)+1);
            msg.edit(getMemberPage(client, message.guild));
            break;
          }
          case `${prefix}b`:{
            if(m.deletable) m.delete();
            page = page - 1 <= 0 ? maxPages : (page-1);
            msg.edit(getMemberPage(client, message.guild));
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
      collector.on('end', collected => {});
    })
    .catch(err => {});
  }
}


function getMemberPage(client, guild){
  let guildMembers = guild.members.cache.array().filter(member => !member.user.bot);
  let maxPages = Math.ceil(guildMembers.length/membersPerPage);
  let guildEmbed = new MessageEmbed()
  .setTitle(`${guild.name}'s Members`)
  .setThumbnail(guild.iconURL())
  .setColor(client.config.color)
  .setFooter(`Page ${page} out of ${maxPages}`);
  let memberList = [];
  for(let i = (page-1)*membersPerPage; i<page*membersPerPage && i<guildMembers.length; i++){
    let leMember = guildMembers[i];
    memberList.push(`#${i+1}: ${leMember.user.tag}`);
    //guildEmbed.addField(`#${i+1}: ${leMember.user.username}`, leMember.user.tag);
  }
  guildEmbed.setDescription(memberList.join('\n'));
  return guildEmbed;
}
