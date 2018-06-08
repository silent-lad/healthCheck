const express = require("express");
const app = express();
const sha = require("sha1");

var statusReport = require("./rssAmazonConfig.json");

app.get("/check/hash", (req, res) => {
  res.send(sha(JSON.stringify(statusReport)), 200);
});
