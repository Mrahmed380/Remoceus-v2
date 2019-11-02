const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");
const botconfig = require("./botconfig.json");
const errors = require("./Utils/Errors.js");
const { config } = require("dotenv");
const changeLogs = require("./Utils/ChangeLogs.js");

client.config = botconfig;
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.errors = errors;
client.changeLogs = changeLogs;


config({
  path: __dirname + "/.env"
})

let handlers = ["Commands.js", "Events.js"];
handlers.forEach(handler => {
    require(`./Handlers/${handler}`)(client);
});
