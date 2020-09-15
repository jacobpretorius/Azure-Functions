const axios = require("axios");
const Moment = require("moment");
const SETTINGS = require("../settings.js");

module.exports = (context, request) => {
  const url = "https://api.todoist.com/sync/v8/sync";

  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  // Get today formatted
  const today = Moment().format("YYYY-MM-DD");

  // Post to Todoist API
  axios
    .post(
      url,
      `token=${SETTINGS.TODOIST.API_TOKEN}&sync_token=*&resource_types=%5B%22items%22%5D`,
      config
    )
    .then(function (response) {
      let itemsToday = response.data.items.filter(item => 
        item.due != null && item.due.date.startsWith(today));

      // All done, return
      context.res = {
        // status defaults to 200 */
        body: {
          'ItemsToday': itemsToday != null ? itemsToday : null,
          'Count': itemsToday != null ? itemsToday.length : 0
        }
      };
      context.done();
    })
    .catch(function (error) {
      console.log(error);
      context.error(error);
      context.done();
    });
};
