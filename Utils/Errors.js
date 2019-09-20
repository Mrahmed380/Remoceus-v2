
module.exports = {
  noUser: (message) => {
    message.channel.send("No user found")
      .then(m => m.delete(5000));
  }
}
