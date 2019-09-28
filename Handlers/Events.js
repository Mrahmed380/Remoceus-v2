
module.exports = (client) => {
  client.on("ready", () => {
    console.log(`${client.user.tag} is online`);

    client.user.setPresence({
      game: {
        name: "Silver Suffer",
        type: "Watching"
      },
      status: "online",
      afk: false
    });
  })

  client.on('message', async message => {
    if(message.channel.type === "dm") return;
    if(message.author.bot) return;


    let prefix = client.config.prefix;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    let command = client.commands.get(cmd.slice(prefix.length) || client.aliases.get(cmd.slice(prefix.length)));
    if(!command || !message.content.startsWith(prefix)){
      return;
    }
    try{
      if((command === "!politoed" && client.cooldown.has(message.author.id)) || !client.politoed){
        message.delete();
        message.channel.send("!politoed is on cooldown").then(m => m.delete(5000));
        return;
      }
      command.run(client, message, args);
      if(command === "!politoed"){
        addCooldown(message);
      }
    }catch(e){
      console.log(e);
    }
  })

  function addCooldown(message){
    client.cooldown.set(message.author.id, message.guild.id);
    setTimeout(function(){
      client.cooldown.delete(message.author.id);
      message.author.send("You can now use the !politoed command");
    }, 300000)
  }

  client.on("error", (err) => console.log(err));
  client.on("warn", (info) => console.warn(info));

  client.login(process.env.TOKEN);
}
