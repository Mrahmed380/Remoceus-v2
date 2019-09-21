
module.exports = {
  name: "yeet",
  aliases: [],
  category: "Test",
  description: "Yeet the bois",
  usage: "",
  permissions: [],
  run: async (client, message, args) => {
    message.channel.send("YEEET")
      .then(m => m.delete(5000));
  }
}
