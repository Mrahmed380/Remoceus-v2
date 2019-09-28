
module.exports = {
  name: "remoceus",
  aliases: [],
  category: "Owner",
  description: "Sends usage info for Remoceus",
  usage: "",
  permissions: [],
  run: async (client, message, args) => {
    if(message.deletable) message.delete();
    if(client.config.botowner === message.author.id || message.author.id === message.guild.ownerID){
      message.channel.send("__**Welcome to Remoceus**__\n\nI am a bot designed for The Silver League Networks Official Patreon Server.\nPlease use !help for a list of usable commands.");
    }
  }
}
