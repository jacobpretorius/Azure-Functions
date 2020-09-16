const Axios = require('axios');
const Moment = require('moment');

// Remember to set your Todoist API key in a 'TODOIST_API_TOKEN' Azure function secret, or directly in the settings.js file (not recommended).
const SETTINGS = require('../settings.js');

// Interacts with Todoist
async function getTodoistItemsToday() {
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

// Interacts with Toggl
async function getTogglTrackedToday(projectId) {
  const today = Moment(Moment().format('LL')).toISOString();
  const togglApiUrl = `https://api.track.toggl.com/api/v8/time_entries?start_date=${today}`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
    auth: {
      username: SETTINGS.TOGGL.API_TOKEN,
      password: 'api_token',
    },
  };

  const timeEntries = await Axios.get(togglApiUrl, config);

  let durationInSeconds = 0;
  let activeDay = Moment().format('DD');

  // Check that we have timers
  if (timeEntries.data !== null && timeEntries.data.length > 0) {
    // Loop em
    timeEntries.data.forEach(function (TimedActivity) {
      // Check if it is a reading timer
      if (
        TimedActivity.pid == projectId &&
        Moment(TimedActivity.stop).format('DD') === activeDay
      ) {
        // Got one, make sure it's not an active timer
        if (TimedActivity.duration > 0) {
          durationInSeconds += TimedActivity.duration;
        }
      }
    });
  }

  return durationInSeconds < 0 ? 0 : durationInSeconds;
}

// Expects the Toggl projectId as a parameter
module.exports = async (context, request) => {
  if (
    typeof request.query.projectId == 'undefined' ||
    request.query.projectId.length <= 5
  ) {
    context.log.error('No projectId query given');
    return {
      Status:
        'Error, you need to send a Toggl Project ID in a projectId parameter with the request.',
    };
  }

  // Call Todoist API
  const todoistResponse = await getTodoistItemsToday();

  // Call Toggl API
  const togglResponse = await getTogglTrackedToday(request.query.projectId);

  // All done, return
  return {
    body: {
      Todoist: {
        ItemsToday: todoistResponse != null ? todoistResponse : null,
        Count: todoistResponse != null ? todoistResponse.length : 0,
      },
      Toggl: {
        TimeTrackedInSeconds: togglResponse,
        MinutesTracked: Math.round(togglResponse / 60),
      },
    },
  };
};
