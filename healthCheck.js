const rp = require("request-promise");
const sha = require("sha1");

const email = require("./mail.js");
let me = "www.healthcheck.com";

var statusReport = require("./rssConfig.json");

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

var errCount = 1;
var reported = false;

apiEndpoints.forEach(endpoint => {
  rp(endpoint.url)
    .then(body => {
      if (body == sha(statusReport)) {
        console.log("Everything Fine");
        reported = false;
      } else {
        if (!reported) {
          email("HEALTHCHEACK", endpoint.url, me, "");
          reported = true;
        }
      }
    })
    .catch(err => {
      if (errCount % 5 == 0) {
        email("HEALTHCHECKDOWN", endpoint.url, " not responding to get request", `${me}`)
      }
    });
});
