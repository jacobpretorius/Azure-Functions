const TogglClient = require('toggl-api');
const Moment = require('moment');
const SETTINGS = require('../settings.js');

module.exports = (context, request) => {
  const toggl = new TogglClient({ apiToken: SETTINGS.TOGGL.API_TOKEN });
  
  if (request.query.projectId.length <= 5){
    context.error('No projectId query given');
    context.done();
  }

  // Get date
  const date = Moment(Moment().format('LL')).toISOString();

  // Get all time entries for yesterday  
  toggl.getTimeEntries(date, null, (togglErr, timeEntries) => {
    if (togglErr) {
      context.error(togglErr);
      context.done();
    } else {
      let durationMs = 0;
      let activeDay = Moment().format('DD');

      // Check that we have timers
      if (timeEntries !== null && timeEntries.length > 0) {
        // Loop em
        timeEntries.forEach(function(TimedActivity) { 
          // Check if it is a reading timer
          if (TimedActivity.pid == request.query.projectId && Moment(TimedActivity.stop).format('DD') === activeDay) {
            // Got one
            durationMs = durationMs + TimedActivity.duration;
          }
        });   
      }

      // All done, return
      context.res = {
        // status defaults to 200 */
        body: { "trackedDurationInMs": durationMs }
      };
      context.done();
    }});
};