const { RichEmbed } = require("discord.js");

module.exports = {
  name: "mute",
  aliases: [],
  category: "Moderation",
  description: "Mutes a user",
  usage: "<@user>",
  permissions: ["Manage Roles"],
  run: async (client, message, args) => {
    if(message.deletable) message.delete();
    let tomute = message.guild.member(message.mentions.users.first());
    if(!tomute) return client.errors.noUser(message);
    if(!message.member.hasPermission("MANAGE_ROLES")) return client.errors.noPerms(message, "Manage Roles");
    if(message.member.highestRole.comparePositionTo(tomute.highestRole)<=0) return message.reply("Cannot mute member.").then(r => r.delete(5000));
    let muterole = message.guild.roles.find(role => role.name === client.config.muteRole);

    if(!muterole) return message.channel.send("No \"Muted\" role").then(m => m.delete(5000));

    let mutechannel = message.guild.channels.find(channel => channel.name === client.config.modChannel) || message.channel;
    if(!mutechannel) return message.channel.send("Couldn't find mute channel");

    tomute.addRole(muterole.id)
    .then(() => {
      message.channel.send(`${tomute.user.tag} has been muted`).then(m => m.delete(5000));

      let muteEmbed = new RichEmbed()
      .setDescription("Temp Mute")
      .setColor(client.config.color)
      .addField("Muted User", `${tomute} with ID: ${tomute.id}`)
      .addField("Muted By",`${message.author} with ID: ${message.author.id}`);

      mutechannel.send(muteEmbed);
    })
    .catch(err => message.channel.send("I'm sorry, but I was unable to mute this user.").then(m => m.delete(5000).catch(err => {})));
  }
}
