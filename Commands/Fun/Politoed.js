
module.exports = {
  name: "politoed",
  aliases: ["rant"],
  category: "Fun",
  description: "Sends the infamous politoed rant",
  usage: "",
  permissions: [],
  run: async (client, message, args) => {
    if(message.deletable) message.delete();
    client.politoed = false;
    const script = [
      {
        person: "Silver August",
        line: "Politoed..."
      },
      {
        person: "Silver August",
        line: "Fucking..."
      },
      {
        person: "Silver August",
        line: "Politoed..."
      },
      {
        person: "Politoed",
        line: "Oh come on man, what'd I ever do."
      },
      {
        person: "Silver August",
        line: "Don't act dumb you piece of trash."
      },
      {
        person: "Silver August",
        line: "You're the one who started weather wars!"
      },
      {
        person: "Politoed",
        line: "Oh come on man. Ninetales helped out too."
      },
      {
        person: "Silver August",
        line: "Hey."
      },
      {
        person: "Silver August",
        line: "Don't drag Ninetales into this."
      },
      {
        person: "Silver August",
        line: "It's bad enough that Ninetales got usurped by Charizard in the next generation AFTER its ability got nerfed."
      },
      {
        person: "Silver August",
        line: "Where's your superior replacement?!"
      },
      {
        person: "Politoed",
        line: "Oh come on man, it wasn't that bad."
      },
      {
        person: "Silver August",
        line: "Wasn't that bad?"
      },
      {
        person: "Silver August",
        line: "WASN'T THAT BAD?!"
      },
    ];

    let jem = await message.channel.fetchWebhooks()
      .then(webhooks => {
        let hook = webhooks.find(wb => wb.name === "Silver August");
        if(!hook){
          hook = message.channel.createWebhook("Silver August", "https://i.imgur.com/CSbyH2e.png").then(wb => {
            return wb;
          });
        }
        return hook;
      })
      .catch(err => console.log(err));
    let politoed = await message.channel.fetchWebhooks()
      .then(webhooks => {
        let hook = webhooks.find(wb => wb.name === "Politoed");
        if(!hook){
          hook = message.channel.createWebhook("Politoed", "https://i.imgur.com/YmvjXJb.png").then(wb => {
            return wb;
          });
        }
        return hook;
      })
      .catch(err => console.log(err));

    script.forEach(function(r, i){
      setTimeout(function(){
        if(r.person === "Silver August"){
          jem.send(r.line);
        }else if(r.person === "Politoed"){
          politoed.send(r.line);
        }
        if(i === script.length-1){
          jem.delete();
          politoed.delete();
          client.politoed = true;
        }
      }, i*1500)
    })
  }
}
