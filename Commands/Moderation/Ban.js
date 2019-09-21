
const { RichEmbed } = require("discord.js");

module.exports = {
  name: "ban",
  aliases: [],
  category: "Moderation",
  description: "Bans a user",
  usage: "<@user> <reason>",
  permissions: ["Ban Members"],
  run: async (client, message, args) => {
    if(message.deletable) message.delete();

    if(!args[0]){
      return message.channel.send("You need to mention another user").then(m => m.delete(5000));
    }

    let reason = args.slice(1).join(" ") || "No Reason Given";

    let toBan = message.mentions.members.first();

    if(!toBan){
      return message.channel.send("Could not find user").then(m => m.delete(5000));
    }

    if(!message.member.hasPermission("BAN_MEMBERS", false, true, true)){
      return client.errors.noPerms(message, "Ban Members");
    }

    if(!message.guild.me.hasPermission("BAN_MEMBERS", false, true, true)){
      return message.channel.send("Sorry, but I don't have permission to ban members").then(m => m.delete(5000));
    }

    if(toBan.id === message.author.id){
      return message.channle.send("You cannot ban yourself").then(m => m.delete(5000));
    }

    if(toBan.id === client.user.id){
      return message.channel.send("You cannot ban me");
    }

    if(!toKick.bannable){
      return message.channel.send("I cannot ban this member");
    }

    let banChannel = message.guild.channels.find(channel => channel.name === "logs") || message.channel;

    const banEmbed = new RichEmbed()
    .setTitle("Ban Embed")
    .setThumbnail(toBan.user.displayAvatarURL)
    .setColor(client.config.color)
    .addField("Banned User", `${toKick.user.tag} (${toKick.id})`)
    .addField("Banned By", `${message.author.tag} (${message.author.id})`);
    if(reason){
      kickEmbed.addField("Reason", reason);
    }

    toKick.ban(reason)
      .then(() =>{
        return banChannel.send(banEmbed)
      })
      .catch(err => console.log(err));
  }
}
