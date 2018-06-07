const ping = require("ping");
const async = require("async");
const fs = require("file-system");
const sha = require("sha1");
const Parser = require("rss-parser");

const pingHealth = require("./modules/ping_health.js");
const rssAmazon = require("./modules/rss_amazon.js");

var array = pingHealth();
rssAmazon();
