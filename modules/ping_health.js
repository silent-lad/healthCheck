const ping = require("ping");
const async = require("async");
const fs = require("file-system");

// let pingConfig = require("../pingConfig.json");

// var sitesDown = ["www.google.com"];

var asyncPing = () => {
  let map = require("../mappedConfig.json");
  let rssConfig = require("../rssAmazonConfig.json");
  let pingConfig = require("../pingConfig.json");
  async.each(
    pingConfig.list,
    (key, callback) => {
      ping.sys.probe(key.URL, function(isAlive) {
        if (!isAlive) {
          // console.log("DEAD");
          // console.log(key.URL);

          if (++key.failCount > pingConfig.maxFail) {
            key.failCount = 0;
            fs.writeFile("pingConfig.json", JSON.stringify(pingConfig));
            // console.log("DEAD ULTIMATE", key.URL);
            var url = key.URL;
            var doubtedServices = map[`${url}`];
            console.log(doubtedServices.length);

            // console.log(rssConfig.status[`${doubtedServices[0]}`]);
            for (var i = 0; i < doubtedServices.length; i++) {
              console.log(rssConfig.status[`${doubtedServices[i]}`]);
            }
            doubtedServices.forEach(element => {
              if (rssConfig.status[`${element}`]) {
                console.log("Internal app error");
              } else {
                console.log(`Error due to ${url} error`);
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
    function(err) {
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
