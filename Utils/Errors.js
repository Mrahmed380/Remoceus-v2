const { Image } = require("canvas");

module.exports = {
  noUser: (message) => {
    message.channel.send("No user found")
      .then(m => m.delete(5000));
  },
  noPerms: (message, perm) => {
    message.channel.send(`Missing Permission: ${perm}`)
      .then(m => m.delete(5000));
  },
  checkURL: (url, timeoutT) => {
      return new Promise(function (resolve, reject) {
          var timeout = timeoutT || 5000;
          var timer, img = new Image();
          img.onerror = img.onabort = function () {
              clearTimeout(timer);
              reject("error");
          };
          img.onload = function () {
              clearTimeout(timer);
              resolve("success");
          };
          timer = setTimeout(function(){
              // reset .src to invalid URL so it stops previous
              // loading, but doesn't trigger new load
              img.src = "//!!!!/test.jpg";
              reject("timeout");
          }, timeout);
          img.src = url;
      });
  }
}
