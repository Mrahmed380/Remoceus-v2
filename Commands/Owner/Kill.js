
module.exports = {
  name: "kill",
  aliases: [],
  category: "Owner",
  description: "Takes the bot offline (Bot owner only)",
  usage: "",
  permissions: "",
  run: async (client, message, args) => {
    if(message.deletable) message.delete();
    if(message.author.id !== client.config.botowner) return;
    message.channel.send("Signing Off")
    .then(m => {
      return client.destroy();
    })
    .catch(err => console.log(err));
  }
}
