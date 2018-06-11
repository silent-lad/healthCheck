const fs = require("fs");
const async = require("async");

var config = require("./mappedConfig.json");

var status = {};

async.each(config, el => {
  el.forEach(element => {
    status[`${element}`] = true;
    console.log(element);
  });
});
var con = { status };

console.log(status);
fs.writeFile("./rssConfig.json", JSON.stringify(con));

var url = Object.keys(config);

var con2 = { list: [], maxFail: 5 };

url.forEach(address => {
  con2.list.push({ URL: `${address}`, failCount: 0 });
});

fs.writeFile("./pingConfig.json", JSON.stringify(con2));
