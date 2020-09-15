const TogglClient = require('toggl-api');
const Moment = require('moment');
const Request = require('request');
const SETTINGS = require('../settings.js');

module.exports = (context, request) => {
  const toggl = new TogglClient({ apiToken: SETTINGS.TOGGL.API_TOKEN });

  // Get yesterdays date
  const date = Moment(Moment().add(-1,'days').format('LL')).toISOString();

  // Get all time entries for yesterday  
  toggl.getTimeEntries(date, null, (togglErr, timeEntries) => {
    if (togglErr) {
      context.error(togglErr);
      context.done();
    } else {
      let durationMs = 0;
      let goalAchieved = false;
      let activeDay = Moment().add(-1,'days').format('DD');

      // Check that we have timers
      if (timeEntries !== null && timeEntries.length > 0) {
        // Loop em
        timeEntries.forEach(function(TimedActivity) { 
          // Check if it is a reading timer
          if (TimedActivity.pid == SETTINGS.STARTPAGE.GOAL_PROJECT_ID && Moment(TimedActivity.stop).format('DD') === activeDay) {
            // Got one
            durationMs = durationMs + TimedActivity.duration;
          }
        });   
      }

      // Check if we have more than (goal) mins
      if ((durationMs / 60) >= SETTINGS.STARTPAGE.GOAL_MINUTES) {
        goalAchieved = true;
      }

      // All done, do the request
      Request(
      {
        url: 'https://'
          + SETTINGS.STARTPAGE.URL
          + '/api/SetDay?key='
          + SETTINGS.STARTPAGE.KEY
          + '&day='
          + Moment().add(-1,'days').format('dddd') + '&goal='
          + goalAchieved
          + '&time='
          + Math.floor(durationMs / 60),
        rejectUnauthorized: false
      }, (err, response) => {
        if (err) {
          context.error(togglErr);
          context.done();
        }

        context.done();
      });
    }});
};