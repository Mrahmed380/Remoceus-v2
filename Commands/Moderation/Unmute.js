
module.exports = {
  name: "unmute",
  aliases: [],
  category: "Moderation",
  description: "Unmutes an already muted user",
  usage: "<@user>",
  permissions: ["Manage Roles"],
  run: async (client, message, args) => {
    if(message.deletable) message.delete();
    let tomute = message.guild.member(message.mentions.users.first());
    if(!tomute) return client.errors.noUser(message);
    if(!message.member.hasPermission("MANAGE_ROLES")) return client.errors.noPerms(message, "Manage Roles");
    if(message.member.highestRole.comparePositionTo(tomute.highestRole)<=0 && message.author.id !== message.guild.ownerID) return message.reply("Cannot unmute member.").then(r => r.delete(5000));

    let muterole = message.guild.roles.find(role => role.name === client.config.muteRole);
    if(!muterole){
      return message.channel.send("No \"Muted\" role")
            .then(m => {
              return m.delete(5000);
            })
            .catch(err => {});
    }

    tomute.removeRole(muterole.id)
    .then(() => {
      return message.channel.send(`${tomute.user.tag} has been unmuted`)
    })
    .then(m => {
      return m.delete(5000);
    })
    .catch(err => message.channel.send("Could not remove role.").then(m => m.delete(5000).catch(err => {})))
  }
}
