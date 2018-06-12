const fs = require("fs");
const async = require("async");

const { map } = require("./mappedConfig.json");

var status = {};

async.each(map, el => {
  el.forEach(element => {
    status[`${element}`] = true;
    console.log(element);
  });
});
var config = { status };

console.log(status);
fs.writeFile("./rssConfig.json", JSON.stringify(config));

var url = Object.keys(map);

var config2 = { list: [], maxFail: 5 };

url.forEach(address => {
  config2.list.push({ URL: `${address}`, failCount: 0 });
});

fs.writeFile("./pingConfig.json", JSON.stringify(config2));
