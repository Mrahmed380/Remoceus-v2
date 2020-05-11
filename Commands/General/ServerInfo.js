const { MessageEmbed } = require("discord.js");


module.exports = {
  name: "serverinfo",
  aliases: [],
  category: "General",
  description: "Displays information on the current server",
  usage: "",
  permissions: [],
  run: async (client, message, args) => {
    if(message.deletable) message.delete();

    let embed = new MessageEmbed()
    .setTitle(`${message.guild.name} Info`)
    .setThumbnail(message.guild.iconURL())
    .setColor(client.config.color)
    .addField("Server Owner", `${message.guild.owner.user.tag}`,true)
    .addField("Region", message.guild.region,true)
    .addField("Member Count", message.guild.members.cache.array().filter(member => !member.user.bot).length, true)
    .addField("Bot Count", message.guild.members.cache.array().filter(member => member.user.bot).length, true)
    .addField("Creation date", message.guild.createdAt);
    message.channel.send(embed);
  }
}
