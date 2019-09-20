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
