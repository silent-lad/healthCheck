const ping = require("ping");
const async = require("async");
const fs = require("file-system");

const email = require("./mail.js");

var asyncPing = () => {
  let { map } = require("./mappedConfig.json");
  let rssConfig = require("./rssConfig.json");
  let pingConfig = require("./pingConfig.json");
  async.each(
    pingConfig.list,
    (key, callback) => {
      ping.sys.probe(key.URL, function (isAlive) {
        if (!isAlive) {
          if (++key.failCount > pingConfig.maxFail) {
            key.failCount = 0;
            fs.writeFile("pingConfig.json", JSON.stringify(pingConfig));
            // DEAD ULTIMATE
            var url = key.URL;
            var doubtedServices = map[`${url}`];
            doubtedServices.forEach(element => {
              if (rssConfig.status[`${element}`]) {
                email("PINGERR", key, "not replying to ping requests", "Internal App error")
              } else {
                email("PINGSERVERR", key, "not replying to ping requests", element)
              }
            });
            callback();
          } else {
            fs.writeFile("./pingConfig.json", JSON.stringify(pingConfig));
            callback();
          }
        } else {
          console.log("alive", key.URL);
          callback();
        }
      });
    },
    function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("DONE");
      }
    }
  );
};

asyncPing();

module.exports = asyncPing;
