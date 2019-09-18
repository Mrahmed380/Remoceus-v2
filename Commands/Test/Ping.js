

module.exports.run = async (client, message, args) => {
  message.channel.send("pong")
    .then(m => m.delete(5000));
}

module.exports.help = {
  name: "ping"
}
