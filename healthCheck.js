const rp = require("request-promise");
const sha = require("sha1");

const email = require("./mail.js");
let me = "www.healthcheck.com";

var statusReport = require("./rssConfig.json");
var { checkers } = require("./mappedConfig.json");

var errCount = 1;
var reported = false;

checkers.forEach(endpoint => {
  if (endpoint != me) {
    rp(endpoint)
      .then(body => {
        if (body == sha(statusReport)) {
          console.log("Everything Fine");
          reported = false;
        } else {
          if (!reported) {
            email("HEALTHCHECK", endpoint, me, "");
            reported = true;
          }
        }
      })
      .catch(err => {
        if (errCount % 5 == 0) {
          email("HEALTHCHECKDOWN", endpoint, " not responding to get request", `${me}`)
        }
      });
  }

});
