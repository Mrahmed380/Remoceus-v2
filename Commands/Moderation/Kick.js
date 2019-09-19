
module.exports = {
  name: "kick",
  aliases: [],
  category: "Moderation",
  description: "Kicks a user",
  usage: "",
  run: async (client, message, args) => {
    if(message.deletable) message.delete();
    if(message.member.hasPermission("KICK_MEMBERS", false, true, true))
  }
}
