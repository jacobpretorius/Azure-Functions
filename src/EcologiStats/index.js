const Axios = require('axios');

// Sign up to Ecologi if you havent already -> https://ecologi.com/jacob?r=5f06306809bb2c0017d8e912
// and then put your public username in SETTINGS.ECOLOGI.USER, or just replace it in 'url' below
const SETTINGS = require('../settings.js');

module.exports = (context, request) => {
  // Get Ecologi API
  const url = `https://api.ecologi.com/users/${SETTINGS.ECOLOGI.USER}/profile`;

  Axios.get(url)
    .then(response => {
      // All done, return
      context.res = {
        // status defaults to 200
        body: {
          CarbonOffset: response.data.data.totalCarbonTonnes,
          TreesPlanted: response.data.data.totalTrees,
        },
      };
      context.done();
    })
    .catch(error => {
      context.log.error(error);
      context.res.statusCode = 500;
      context.res = {
        body: { error },
      };
      context.done();
    });
};
