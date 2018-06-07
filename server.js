// const ping = require("ping");
// const async = require("async");
// const fs = require("file-system");
// const sha = require("sha1");
// const Parser = require("rss-parser");
const express = require("express");
const app = express();
const sha = require("sha1");
// const pingHealth = require("./modules/ping_health.js");
// const rssAmazon = require("./modules/rss_amazon.js");

// var array = pingHealth();
// rssAmazon();
var statusReport = require("./rssAmazonConfig.json");

app.get("/check/hash", (req, res) => {
  res.send(sha(JSON.stringify(statusReport)), 200);
});
