const Axios = require('axios');
const Moment = require('moment');
const SETTINGS = require('../settings.js');

const getTodoistItemsToday = async function() {
  const todoistApiUrl = 'https://api.todoist.com/sync/v8/sync';
  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  const todoistResponse = await Axios.post(
    todoistApiUrl,
    `token=${SETTINGS.TODOIST.API_TOKEN}&sync_token=*&resource_types=%5B%22items%22%5D`,
    config
  );

  // Get Todoist items for today
  const today = Moment().format('YYYY-MM-DD');
  const itemsToday = todoistResponse.data.items.filter(
    item => item.due != null && item.due.date.startsWith(today)
  );
  return itemsToday;
}

module.exports = getTodoistItemsToday;