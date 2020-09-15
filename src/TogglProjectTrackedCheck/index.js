const TogglClient = require('toggl-api');
const Moment = require('moment');
const SETTINGS = require('../settings.js');
// Remember to set your Toggl API key in a 'TOGGL_API_TOKEN' Azure function secret, or directly in the settings.js file (not recommended).

// Expects projectId as a param 
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
            if (TimedActivity.duration > 0) {
              durationMs += TimedActivity.duration;
            }
          }
        });   
      }

      if (durationMs < 0) {
        durationMs = 0;
      }

      // All done, return
      context.res = {
        // status defaults to 200 */
        body: { "trackedDurationInMs": durationMs }
      };
      context.done();
    }});
};
