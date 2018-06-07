const fs = require("file-system");
const sha = require("sha1");
const Parser = require("rss-parser");
const async = require("async");
const request = require("request");
const rp = require("request-promise");

// const rssAmazonConfig = require("../rssAmazonConfig.json");

let rssAmazonPoll = () => {
  const rssAmazonConfig = require("../rssAmazonConfig.json");
  async.each(
    rssAmazonConfig.list,
    (key, proccesedURl) => {
      let parser = new Parser();
      (async () => {
        let parsedFeed = await parser.parseURL(key.URL);
        if (parsedFeed.items[0]) {
          if (parsedFeed.items[0].title.startsWith("S")) {
            console.log("No error");
            var url = key.URL;
            rssAmazonConfig.status[`${url}`] = true;
            console.log(key.prev_hash);
            fs.writeFile(
              "./rssAmazonConfig.json",
              JSON.stringify(rssAmazonConfig)
            );
            proccesedURl();
          } else {
            if (sha(parsedFeed.items[0].pubDate) == key.prev_hash) {
              console.log("No New error");
              proccesedURl();
            } else {
              console.log("New Error");
              key.prev_hash = sha(parsedFeed.items[0].pubDate);
              var url = key.URL;
              rssAmazonConfig.status[`${url}`] = false;
              fs.writeFile(
                "./rssAmazonConfig.json",
                JSON.stringify(rssAmazonConfig)
              );
              proccesedURl();
            }
          }
        } else {
          proccesedURl();
        }
      })();
    },
    function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Done1");
      }
    }
  );
};

let rssGooglePoll = () => {
  var rssConfig = require("../rssAmazonConfig.json");
  var concernedServices = ["cloud-networking"];
  var googleDashUrl = {
    url: "https://status.cloud.google.com/incidents.json",
    json: true
  };
  rp(googleDashUrl).then(body => {
    if (body[0].end) {
      //Check if previous issue is solved
      if (rssConfig.status[`${body[0].service_key}`] == false) {
        rssConfig.status[`${body[0].service_key}`] == false;
        //Change Json FS
        //Done
      } else {
        //Nothing that concerns us
      }
    } else {
      if (concernedServices.indexOf(`${body[0].service_key}`) != -1) {
        //New Issue
        if (rssConfig.status[`${body[0].service_key}`] == true) {
          rssConfig.status[`${body[0].service_key}`] == false;
          //change Json FS
          //ALERT SYSTEM
        } else {
          //False Alert
        }
      }
    }
  });
};

rssGooglePoll();
// rssAmazonPoll();

// module.exports = rssPoll;
