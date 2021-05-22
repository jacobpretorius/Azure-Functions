const Axios = require('axios');
const SETTINGS = require('../settings.js');
const foodResponses = require('../responses.js');
const pubResponses = require('../pubResponses.js');

module.exports = async function (context, request) {
  let merchant = request.body.data.merchant.name;

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

  let messageToUser = `${request.body.data.merchant.emoji || '💸'} ${responseMessage}`;

  // All done, do the request
  Axios
    .get(
      'https://'
      + SETTINGS.JARVIS.URL
      +'/say/exact?key='
      + SETTINGS.JARVIS.KEY
      + '&pub='
      + isAPub
      + '&message='
      + encodeURI(messageToUser))
    .then(response => {
      context.done();
    })
    .catch(error => {
      context.done(error);
    });
};
