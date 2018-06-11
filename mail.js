var nodemailer = require("nodemailer");
var async = require("async");
var hbs = require('nodemailer-express-handlebars');

var mailingList = require("./mailingList.json");
var mailCredentials = require("./mailCredentials.json");

var email = (type, defectedService, error, cause) => {
  var defaultLayout;
  if (type == "PINGERR") {
    defaultLayout = 'pingError';
  } else if (type == "SERVERR") {
    defaultLayout = 'serviceError';
  } else if (type == "PINGSERVERR") {
    defaultLayout = 'pingServiceError';
  } else if (type == "SERVERRRES") {
    defaultLayout = 'serviceErrorRes';
  } else if (type == "HEALTHCHECK") {
    defaultLayout = 'healthCheck'
  } else if (type == "HEALTHCHECKDOWN") {
    defaultLayout = 'healthCheckDown';
  }
  var options = {
    viewEngine: {
      extname: '.hbs',
      layoutsDir: 'views/email/',
      defaultLayout: `${defaultLayout}`
    },
    viewPath: 'views/email/',
    extName: '.hbs'
  };
  var mailer = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: `${mailCredentials.user}`,
      pass: `${mailCredentials.password}`
    }
  });
  console.log(defaultLayout);


  mailer.use('compile', hbs(options));
  async.each(mailingList.list, eAdress => {
    mailer.sendMail({
      from: `${mailCredentials.user}`,
      to: `${eAdress}`,
      subject: 'ALERT',
      template: `${defaultLayout}`,
      context: {
        defectedService: `${defectedService}`,
        error: `${error}`,
        cause: `${cause}`
      }
    }, function (error, response) {
      console.log('mail sent to ' + eAdress);
      console.log(error);

      // mailer.close();
    });
  });
};
// sendMail("Hi", "Hello");
// sendMail("");



module.exports = email;
