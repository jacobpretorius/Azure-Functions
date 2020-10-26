const axios = require('axios');

// Sign up to Ecologi if you havent already -> https://ecologi.com/jacob?r=5f06306809bb2c0017d8e912
// and then put your public username in SETTINGS.ECOLOGI.USER, or just replace it in 'url' below
const SETTINGS = require('../settings.js');

module.exports = (context, request) => {
  // Get Ecologi API
  const url = `https://api.ecologi.com/users/${SETTINGS.ECOLOGI.USER}/profile`;

  axios
    .get(url)
    .then((response) => {
      let carbonOffset = response.data.data.carbonOffsets.reduce(
        (a, b) => a + b.numberOfTonnes,
        0
      );

      let treesPlanted = response.data.data.trees.reduce((a, b) => a + b.value, 0);

      // All done, return
      context.res = {
        // status defaults to 200
        body: {
          CarbonOffset: carbonOffset.toFixed(2),
          TreesPlanted: treesPlanted,
        },
      };
      context.done();
    })
    .catch((error) => {
      context.log.error(error);
      context.res.statusCode = 500;
      context.res = {
        body: { error }
      };
      context.done();
    });
};
