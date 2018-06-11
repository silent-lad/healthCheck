var nodemailer = require("nodemailer");
var hbs = require('nodemailer-express-handlebars');

var mailCredentials = require("./mailCredentials.json");
var { mailingList } = require("./mappedConfig.json");

var email = (type, defectedService, error, cause) => {
  var defaultLayout;
  switch (type) {
    case "PINGERR":
      defaultLayout = 'pingError';
      break;
    case "SERVERR":
      defaultLayout = 'serviceError';
      break;
    case "PINGSERVERR":
      defaultLayout = 'pingServiceError';
      break;
    case "SERVERRRES":
      defaultLayout = 'serviceErrorRes';
      break;
    case "HEALTHCHECK":
      defaultLayout = 'healthCheck';
      break;
    case "HEALTHCHECKDOWN":
      defaultLayout = 'healthCheckDown';
      break;
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
  mailer.sendMail({
    from: `${mailCredentials.user}`,
    to: mailingList,
    subject: 'ALERT',
    template: `${defaultLayout}`,
    context: {
      defectedService: `${defectedService}`,
      error: `${error}`,
      cause: `${cause}`
    }
  }, function (error, response) {
    if (error) {
      console.log(error);
    } else {
      // console.log('mail sent to ' + eAdress);
      console.log(response);
    }
  });
};
// sendMail("Hi", "Hello");
// sendMail("");

email("SERVERRRES", "bleh", "blah", "blu");

module.exports = email;
