module.exports = {
  name: "flip",
  aliases: [],
  category: "Fun",
  description: "Flips a coin",
  usage: "",
  permissions: [],
  run: async (client, message, args) => {
    let flip = Math.round(Math.random()) == 0 ? "Heads" : "Tails";

    message.channel.send(`The coin landed on ${flip.toLowerCase()}.`, {
      files: [{
        attachment: `./Images/${flip}.png`,
        name: `${flip}.png`
      }]
    })
  }
}
