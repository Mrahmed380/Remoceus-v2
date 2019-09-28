const ms = require("ms");
const { RichEmbed } = require("discord.js");

module.exports = {
  name: "tempmute",
  aliases: [],
  category: "Moderation",
  description: "Temporarily mutes a user for a set amount of time",
  usage: "<@user> <mute time>",
  permissions: ["Manage Roles"],
  run: async (client, message, args) => {
    if(message.deletable) message.delete();

    let tomute = message.guild.member(message.mentions.users.first());
    if(!tomute) return client.errors.noUser(message);
    if(!message.member.hasPermission("MANAGE_ROLES")) return client.errors.noPerms(message, "Manage Roles");
    if(message.member.highestRole.comparePositionTo(tomute.highestRole)<=0) return message.reply("Cannot mute member.").then(r => r.delete(5000));
    let muterole = message.guild.roles.find(role => role.name === client.config.muteRole);
    if(!muterole) return message.channel.send("No \"Muted\" role").then(m => m.delete(5000));

    let mutetime = args[1];
    if(!mutetime) return message.reply("You didn't specify a time!").then(r => r.delete(5000));

    tomute.addRole(muterole.id)
    .then(() => {
      message.channel.send(`${tomute.user.tag} has been muted for ${ms(ms(mutetime))}`).then(m => m.delete(5000));

      let muteEmbed = new RichEmbed()
      .setDescription("Temp Mute")
      .setColor(client.config.color)
      .addField("Muted User", `${tomute.user.tag} with ID: ${tomute.id}`)
      .addField("Muted By",`${message.author.tag} with ID: ${message.author.id}`)
      .addField("Muted for", mutetime);

      let mutechannel = message.guild.channels.find(channel => channel.name === client.config.modChannel) || message.channel;
      if(!mutechannel) return message.channel.send("Couldn't find mute channel");

      mutechannel.send(muteEmbed).then(m => {
        setTimeout(function(){
          tomute.removeRole(muterole.id)
          .then(() => {
            message.channel.send(`${tomute.user.tag} has been unmuted!`).then(m => m.delete(5000).catch(err => {}));
          })
          .catch(err => message.channel.send("I couldn't unmute them").then(m => m.delete(5000).catch(err => {})))
        }, ms(mutetime));
      })
      .catch(err => {});
    })
  }
}
