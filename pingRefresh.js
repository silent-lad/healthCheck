var fs = require("file-system");

var rssConfig = require("./pingConfig.json");

rssConfig.list.forEach(element => {
  element.failCount = 0;
});
console.log(rssConfig);

fs.writeFile("./pingConfig.json", JSON.stringify(rssConfig));
