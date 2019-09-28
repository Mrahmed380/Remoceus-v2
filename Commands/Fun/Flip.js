const { Attachment } = require("discord.js");

module.exports = {
  name: "flip",
  aliases: [],
  category: "Fun",
  description: "Flips a coin",
  usage: "",
  permissions: [],
  run: async (client, message, args) => {
    var promise = new Promise(function(resolve, reject) {
      let flip = Math.round(Math.random());
      if(flip === 0){
        resolve(new Attachment('./Images/Heads.png'));
      }else{
        reject(new Attachment('./Images/Tails.png'));
      }
    });
    promise.then((attachment) => {
      message.channel.send("The coin landed on heads!", attachment);
    }).catch((attachment) => {
      message.channel.send("The coin landed on tails!", attachment);
    })
  }
}
