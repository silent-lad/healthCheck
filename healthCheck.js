const rp = require("request-promise");
const sha = require("sha1");

var statusReport = require("./rssAmazonConfig.json");

var apiEndpoints = [
  {
    url: "www.example.com/check/hash",
    json: false
  },
  {
    url: "www.example1.com/check/hash",
    json: false
  }
];
apiEndpoints.forEach(endpoint => {
  rp(endpoint)
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
});
