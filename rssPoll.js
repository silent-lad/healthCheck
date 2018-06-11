const fs = require("file-system");
const Parser = require("rss-parser");
const async = require("async");

const email = require("./mail.js");


let rssPoll = () => {
  const rssConfig = require("./rssConfig.json");
  const URLs = Object.keys(rssConfig.status);
  let alerts = [];
  async.each(URLs, (key, processedURL) => {
    let parser = new Parser();
    let currURL;
    key.startsWith("https")
      ? (currURL = key)
      : (currURL = "https://status.cloud.google.com/feed.atom");
    console.log(currURL);

    (async () => {
      try {
        let parsedFeed = await parser.parseURL(currURL);
        if (currURL == key) {
          //AMAZON LOOP
          if (parsedFeed.items[1]) {
            if (parsedFeed.items[1].title.startsWith("S")) {
              if (rssConfig.status[key]) {
                console.log("Everything Fine");
                // console.log(parsedFeed.items[1].content);
                processedURL();
              } else {
                console.log("Error Resolved");
                var alert = new Object();
                alert.title = "Error Resolved";
                alert.description = `The error in service ${key} is now resolved.`;
                alert.error = `Error RESOLVED:- ${parsedFeed.items[1].description}`
                rssConfig.status[key] = true;
                fs.writeFile("./rssConfig.json", JSON.stringify(rssConfig));
                // console.log(parsedFeed.items[1].content);

                email("SERVERRRES", key, parsedFeed.items[1].title, parsedFeed.items[1].content)
                processedURL();
              }
            } else {
              if (rssConfig.status[key]) {
                console.log("New Error");
                rssConfig.status[key] = false;
                fs.writeFile("./rssConfig.json", JSON.stringify(rssConfig));
                var alert = new Object();
                alert.title = "New Error";
                alert.description = `New error in service ${key}.`;
                alert.error = `Error:- ${parsedFeed.items[1].content}`
                email("SERVERR", key, parsedFeed.items[1].title, parsedFeed.items[1].content);
                processedURL();
              } else {
                console.log("old error Persists");
                processedURL();
              }
            }
          } else {
            rssConfig.status[key] = true;
            fs.writeFile("./rssConfig.json", JSON.stringify(rssConfig));
            processedURL();
          }
        } else {
          //Google LOOP
          // console.log( parsedFeed);

          if (parsedFeed.items[1].link.indexOf(key) != -1) {
            if (parsedFeed.items[1].title.startsWith("RESOLVED")) {
              if (rssConfig.status[key] == false) {
                console.log("error resolved");
                var alert = new Object();
                alert.title = "Error Resolved";
                alert.description = `The error in service ${key} is now resolved.`;
                alert.error = `Error RESOLVED :- ${parsedFeed.items[1].content}`;
                rssConfig.status[key] = true;
                fs.writeFile("./rssConfig.json", JSON.stringify(rssConfig));
                email("SERVERRRES", key, parsedFeed.items[1].title, parsedFeed.items[1].content);
                processedURL();
              } else {
                console.log("Everything alright");
                processedURL();
              }
            } else {
              if (!rssConfig.status[key]) {
                console.log("Old error persists");
                processedURL();
              } else {
                console.log("New error");
                var alert = new Object();
                alert.title = "New Error";
                alert.description = `New error in service ${key} .`;
                alert.error = `Error:- ${parsedFeed.items[1].content}`
                rssConfig.status[key] = false;
                fs.writeFile("./rssConfig.json", JSON.stringify(rssConfig));
                email("SERVERR", key, parsedFeed.items[1].title, parsedFeed.items[1].content)
                processedURL();
              }
            }
          } else {
            console.log("Everything fine");
          }
        }
      } catch (e) {
        console.log(e.code);
      }
    })();
  });
};
rssPoll();


