const info = require("../../League Files/Info.json");
const fs = require("fs");

module.exports = {
  name: "setign",
  aliases: [],
  category: "Pokemon",
  description: "Sets your ign",
  usage: "<ign> (ex: !setign Thot Slayer)",
  permissions: "",
  run: async (client, message, args) => {
    let ign = args.join(" ");
    if(!info[message.author.id]){
      info[message.author.id] = {
        fc: "Not set, use !setfc <fc> to set your FC",
        ign: ign
      };
    }else{
      info[message.author.id].ign = ign;
    }
    fs.writeFile('./League Files/Info.json', JSON.stringify(info), (err) => {
      if(err) console.log(err);
    })
    message.channel.send(`Set ${message.author.username}'s ign to ${ign}`);
  }
}
