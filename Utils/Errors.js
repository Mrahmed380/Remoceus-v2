
module.exports = {
  noUser: (message) => {
    message.channel.send("No user found")
      .then(m => m.delete({timeout: 5000}));
  },
  noPerms: (message, perm) => {
    message.channel.send(`Missing Permission: ${perm}`)
      .then(m => m.delete({timeout: 5000}));
  }
}
