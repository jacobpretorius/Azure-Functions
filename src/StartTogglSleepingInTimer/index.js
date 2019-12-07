const TogglClient = require('toggl-api');
const SETTINGS = require('../settings.js');

module.exports = (context, myTimer) => {
  const toggl = new TogglClient({ apiToken: SETTINGS.TOGGL.API_TOKEN });

  toggl.startTimeEntry({
    pid: SETTINGS.TOGGL.SLEEPING_IN_PROJECT_ID
  }, (err, timeEntry) => {
    if(err) {
      context.log('Something went wrong!', err); 
    } else {
      context.log('Timer started successfully.');   
    }

    context.done();
  });
};