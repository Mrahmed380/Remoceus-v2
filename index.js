const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");
const botconfig = require("./botconfig.json");
const { config } = require("dotenv");
client.config = botconfig;


client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

config({
  path: __dirname + "/.env"
})

let handlers = ["Commands.js"];
handlers.forEach(handler => {
    require(`./Utils/${handler}`)(client);
});

/*fs.readdir("./Commands/", (err, files) => {
  if(err) console.log(err);

  if(files.length <= 0){
    console.log("Couldn't find commands.");
    return;
  }

  let folders = files.filter(f => f.split(".")[1] !== "js");
  let js = files.filter(f => f.split(".")[1] === "js");

  folders.forEach((r, i) => {
    fs.readdir(`./Commands/${r}`, (err, files) => {
      const jsFiles = files.filter(f => f.split(".")[1] === "js");
      jsFiles.forEach((f, i) => {
        let prop = require(`./Commands/${r}/${f}`);
        if(!prop) return;
        client.commands.set(prop.help.name, prop);
        js = js.filter(q => q !== f);
        console.log(`Loaded: ${f}`);
      })
    })
  })

  js.forEach((r, i) => {
    let prop = require(`./Commands/${r}`);
    if(!prop) return;
    client.commands.set(prop.help.name, prop);
    console.log(`Loaded: ${r}`);
  })
})*/

client.on("ready", () => {
  console.log(`${client.user.tag} is online`);
})

client.on("error", (err) => console.log(err));
client.on("warn", (info) => console.warn(info));

client.on("message", (message) => {
  if(message.channel.type === "dm") return;
  if(message.author.bot) return;


  let prefix = botconfig.prefix;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);

  let command = client.commands.get(cmd.slice(prefix.length) || client.aliases.get(cmd.slice(prefix.length)));
  if(!command || !message.content.startsWith(prefix)){
    return;
  }
  try{
    command.run(client, message, args);
  }catch(e){
    console.log(e);
  }
})

client.login(process.env.TOKEN);
