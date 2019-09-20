const Discord = require("discord.js");
const info = require("../../League Files/Info.json");

module.exports = {
  name: "fc",
  aliases: [],
  category: "Pokemon",
  description: "Retrieves friend code info for a user",
  usage: "!fc or !fc <@user>",
  run: async (client, message, args) => {
    let fcUser = message.mentions.members.first() || message.guild.members.get(message.author.id);
    let embed = new Discord.RichEmbed()
    .setColor(client.config.color)
    .setTitle(`${fcUser.displayName}'s FC and IGN`)
    .setThumbnail(fcUser.user.displayAvatarURL)
    .addField("FC", info[fcUser.id] && info[fcUser.id].fc?info[fcUser.id].fc: "Not set, use !setfc <fc> to set your FC")
    .addField("IGN", info[fcUser.id] && info[fcUser.id].ign?info[fcUser.id].ign: "Not set, use !setign <ign> to set your IGN");
    message.channel.send(embed)
      .catch(err => console.log(err));
  }
}
