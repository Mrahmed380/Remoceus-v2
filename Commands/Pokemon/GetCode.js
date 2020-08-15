
module.exports = {
  name: "code",
  aliases: ['c'],
  category: "Pokemon",
  description: "Generates a random 8-digit code for when you just can't be bothered to smash your keyboard.",
  usage: "",
  permissions: [],
  run: async (client, message, args) => {
    let code = '';
    for(let i = 1; i <= 8; i++){
      if(i == 4){
        code += ` `;
      }
      code += `${Math.floor(Math.random() * 10)}`;

      message.channel.send(`Your code is ${code}`);
    }
  }
}
