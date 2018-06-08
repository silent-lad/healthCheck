const fs = require("file-system");
const sha = require("sha1");
const Parser = require("rss-parser");
const async = require("async");

let rssPoll = () => {
  const rssConfig = require("../rssAmazonConfig.json");
  const URLs = Object.keys(rssConfig.status);
  async.each(URLs, (key, processedURL) => {
    let parser = new Parser();
    let currURL;
    key.startsWith("https")
      ? (currURL = key)
      : (currURL = "https://status.cloud.google.com/incidents.json");
    (async () => {
      let parsedFeed = await parser.parseURL(currURL);
      if (currURL == key) {
        //AMAZON LOOP
        if (parsedFeed.items[0]) {
          if (parsedFeed.items[0].title.startsWith("S")) {
            if (rss.status[key]) {
              console.log("Everything Fine");
              processedURL();
            } else {
              console.log("Error resolved");
              rss.status[key] = true;
              fs.writeFile("./rssAmazonConfig.json", JSON.stringify(rssConfig));
              processedURL();
            }
          } else {
            if (rss.status[key]) {
              console.log("New Error");
              rss.status[key] = false;
              fs.writeFile("./rssAmazonConfig.json", JSON.stringify(rssConfig));
              processedURL();
            } else {
              console.log("old error Persists");
              processedURL();
            }
          }
        }
      } else {
        //Google LOOP
        if (processedURL.items[0].link.indexOf(key) != -1) {
          if (parsedFeed.items[0].title.startsWith("RESOLVED")) {
            if (rss.status[key] == false) {
              console.log("error resolved");
              rss.status[key] = true;
              fs.writeFile("./rssAmazonConfig.json", JSON.stringify(rssConfig));
              processedURL();
            } else {
              console.log("Everything alright");
              processedURL();
            }
          } else {
            if (!rss.status[key]) {
              console.log("Old error persists");
              processedURL();
            } else {
              console.log("New error");
              rss.status[key] = false;
              fs.writeFile("./rssAmazonConfig.json", JSON.stringify(rssConfig));
              processedURL();
            }
          }
        } else {
          console.log("Everything fine");
        }
      }
    })();
  });
};
rssPoll();
