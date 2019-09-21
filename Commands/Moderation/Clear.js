
module.exports = {
  name: "clear",
  aliases: [],
  category: "Moderation",
  description: "Clears up to 100 messages at a time",
  usage: "",
  run: async (client, message, args) => {
    if(message.deletable) message.delete();
    if(!message.member.hasPermission("MANAGE_MESSAGES")) return client.errors.noPerms(message,"Manage Messages");
    if(!args[0] || isNaN(args[0])) return message.channel.send("You need to enter a number").then(m => m.delete(5000).catch(err => {}));
    if(args[0]>100) return message.channel.send("Cannot delete more than 100 messages at a time").then(msg => msg.delete(5000).catch(err => {}));
    message.channel.bulkDelete(args[0], true).then(messages => {
      return message.channel.send(`Cleared ${messages.size} messages`);
    })
    .then(msg => msg.delete(5000).catch(err => {}));
  }
}
