
module.exports = {
  name: "ping",
  aliases: [],
  category: "Test",
  description: "PONG",
  usage: "",
  permissions: "",
  run: async (client, message, args) => {
    message.channel.send("pong")
      .then(m => m.delete(5000));
  }
}
