const rp = require("request-promise");
const sha = require("sha1");

var statusReport = require("./rssAmazonConfig.json");

var apiEndpoint = {
  url: "www.example.com",
  json: false
};

rp(apiEndpoint)
  .then(body => {
    if (body == sha(statusReport)) {
      //Everything Fine
    } else {
      // Oh BOY!
    }
  })
  .catch(err => {
    console.log(err);
    //EndPoint not live
  });
