const Axios = require('axios');
const Moment = require('moment');
const SETTINGS = require('../settings.js');

module.exports = async function (context, request) {
  // Get yesterdays date
  const yesterday = Moment(Moment().add(-1, 'days').format('LL')).toISOString();

  const togglApiUrl = `https://api.track.toggl.com/api/v8/time_entries?start_date=${yesterday}`;

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

  let durationMs = 0;
  let goalAchieved = false;
  let activeDay = Moment().add(-1, 'days').format('DD');

  // Check that we have timers
  if (timeEntries?.data !== null && timeEntries.data.length > 0) {
    // Loop em
    timeEntries.data.forEach(function (TimedActivity) {
      // Check if it is a reading timer
      if (
        TimedActivity.pid == SETTINGS.STARTPAGE.GOAL_PROJECT_ID &&
        Moment(TimedActivity.stop).format('DD') === activeDay
      ) {
        // Got one
        durationMs = durationMs + TimedActivity.duration;
      }
    });
  }

  // Check if we have more than (goal) mins
  if (durationMs / 60 >= SETTINGS.STARTPAGE.GOAL_MINUTES) {
    goalAchieved = true;
  }

  // All done, do the request
  Axios
    .get(
      'https://' +
      SETTINGS.STARTPAGE.URL +
      '/api/SetDay?key=' +
      SETTINGS.STARTPAGE.KEY +
      '&day=' +
      Moment().add(-1, 'days').format('dddd') +
      '&goal=' +
      goalAchieved +
      '&time=' +
      Math.floor(durationMs / 60))
    .then(response => {
      context.done();
    })
    .catch(error => {
      context.done(error);
    });
};
