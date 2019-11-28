const TogglClient = require('toggl-api');

// SECRETS
const API_TOKEN = 'CHANGEME';
const PROJECT_ID = 'CHANGEME';

module.exports = (context, myTimer) => {
  const toggl = new TogglClient({apiToken: API_TOKEN});

  toggl.startTimeEntry({
    pid: PROJECT_ID
  },(err, timeEntry) => {
    if(err) {
      context.log('Something went wrong!', err); 
    } else {
      context.log('Timer started successfully.');   
    }

    context.done();
  });
};