const { RichEmbed } = require("discord.js");
const ms = require("ms");
const pack = require("../../package.json");

module.exports = {
  name: "botinfo",
  aliases: [],
  category: "General",
  description: "Displays bot information",
  usage: "",
  permissions: "",
  run: async (client, message, args) => {
    if(message.deletable) message.delete();
    let embed = new RichEmbed()
    .setTitle(`${client.user.username}'s Info`)
    .setThumbnail(client.user.avatarURL)
    .setColor(client.config.color)
    .addField("Description", pack.description)
    .addField("Bot's Lord and Savior", pack.author)
    .addField("uptime", ms(client.uptime))
    .setFooter(`${client.user.username} Version: ${pack.version}`)
    message.channel.send(embed);
  }
}
