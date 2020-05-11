const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "getpermissions",
  aliases: [],
  category: "Owner",
  description: "Get permissions required for bot to function",
  usage: "",
  permissions: [],
  run: async (client, message, args) => {
    if(message.author.id !== client.config.botowner) return;
    permissions = ["Attach Files", "View Server Insights", "View Channels", "Send Messages", "Read Message History", "Add Reactions"];
    client.commands.forEach(command => {
      command.permissions.forEach(perm => {
        if(!permissions.includes(perm)){
          permissions.push(perm);
        }
      })
    })
    permissions.sort(function(a, b){
      return a.toUpperCase() > b.toUpperCase();
    })
    let embed = new MessageEmbed()
    .setColor(client.config.color)
    .setThumbnail(client.user.displayAvatarURL())
    .addField("Required Permissions", permissions);
    message.channel.send(embed);
  }
}
