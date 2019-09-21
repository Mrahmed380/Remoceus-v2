const info = require("../../League Files/Info.json");
const fs = require("fs");


module.exports = {
  name: "setfc",
  aliases: [],
  category: "Pokemon",
  description: "Sets your fc",
  usage: "<fc> (ex: !setfc 3883-7141-8049)",
  permissions: "",
  run: async (client, message, args) => {
    let fc = args.join(" ");
    if(!info[message.author.id]){
      info[message.author.id] = {
        fc: fc,
        ign: "Not set, use !setign <ign> to set your IGN"
      };
    }else{
      info[message.author.id].fc = fc;
    }
    fs.writeFile('./League Files/Info.json', JSON.stringify(info), (err) => {
      if(err) console.log(err);
    })
    message.channel.send(`Set ${message.author.username}'s fc to ${fc}`);
  }
}
