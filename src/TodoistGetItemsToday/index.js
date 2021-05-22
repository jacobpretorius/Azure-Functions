const Axios = require('axios');
const Moment = require('moment');

// Remember to set Azure "Application settings" for:
// Todoist API key in 'TODOIST_API_TOKEN'
// or directly in the settings.js file (not recommended).
// See https://docs.microsoft.com/en-gb/azure/app-service/configure-common for more info
const SETTINGS = require('../settings.js');

module.exports = (context, request) => {
  const url = 'https://api.todoist.com/sync/v8/sync';

  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  // Get today formatted
  const today = Moment().format('YYYY-MM-DD');

  // Post to Todoist API
  Axios
    .post(
      url,
      `token=${SETTINGS.TODOIST.API_TOKEN}&sync_token=*&resource_types=%5B%22items%22%5D`,
      config
    )
    .then(response => {
      let itemsToday = response.data.items.filter(
        item => item.due != null && item.due.date.startsWith(today)
      );

      // All done, return
      context.res = {
        // status defaults to 200 */
        body: {
          ItemsToday: itemsToday != null ? itemsToday : null,
          Count: itemsToday != null ? itemsToday.length : 0,
        },
      };
      context.done();
    })
    .catch(error => {
      context.log.error(error);
      context.done();
    });
};
