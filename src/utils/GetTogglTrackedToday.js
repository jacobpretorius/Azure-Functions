const Axios = require('axios');
const Moment = require('moment');
const SETTINGS = require('../settings.js');

const getTogglTrackedToday = async function(projectId) {
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

module.exports = getTogglTrackedToday;