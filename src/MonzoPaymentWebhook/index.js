const Request = require('request');
const SETTINGS = require('../settings.js');
const responses = require('../responses.js');

module.exports = async function (context, req) {
  let merchant = req.body.data.merchant.name;

  // Make sure transaction is something merchant based
  if (!merchant || !merchant.length) {
    context.done();
    return;
  }

  merchant = merchant.replace(/[^A-Za-z0-9]/g,"").toLowerCase();

  // Check if it's one we care about
  if (!(merchant in responses)) {
    context.done();
    return;
  }

  let messageToUser = `${req.body.data.merchant.emoji || '💸'} ${responses[merchant]}`;

  // All done, do the request
  Request(
    {
      url: 'https://'
        + SETTINGS.JARVIS.URL
        +'/say/exact?key='
        + SETTINGS.JARVIS.KEY
        + '&message='
        + encodeURI(messageToUser),
      rejectUnauthorized: true
    }, (err, response) => {
      if (err) {
        context.error(err);
      }

      context.done();
    });
};