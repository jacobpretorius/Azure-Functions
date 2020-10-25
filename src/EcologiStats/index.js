const axios = require('axios');

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
        // status defaults to 200 */
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
