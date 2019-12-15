const Request = require('request');
const SETTINGS = require('../settings.js');
const foodResponses = require('../responses.js');
const pubResponses = require('../pubResponses.js');

module.exports = async function (context, req) {
  let merchant = req.body.data.merchant.name;

  // Make sure transaction is something merchant based
  if (!merchant || !merchant.length) {
    context.done();
    return;
  }

  let responseMessage = null;
  let isAPub = false;
  merchant = merchant.replace(/[^A-Za-z0-9]/g,"").toLowerCase();

  // Check if it's one we care about for food
  if ((merchant in foodResponses)) {
    responseMessage = foodResponses[merchant];
  }

  // Check if it's one we care about for booze
  if ((merchant in pubResponses)) {
    isAPub = true;
    responseMessage = pubResponses[merchant];
  }

  if (responseMessage === null) {
    context.done();
    return;
  }

  let messageToUser = `${req.body.data.merchant.emoji || '💸'} ${responseMessage}`;

  // All done, do the request
  Request(
    {
      url: 'https://'
        + SETTINGS.JARVIS.URL
        +'/say/exact?key='
        + SETTINGS.JARVIS.KEY
        + '&pub='
        + isAPub
        + '&message='
        + encodeURI(messageToUser),
      rejectUnauthorized: true
    }, (err, response) => {
      if (err) {
        context.done(err);
      }

      context.done();
    });
};