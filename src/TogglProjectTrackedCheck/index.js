const getTogglTrackedToday = require('../utils/GetTogglTrackedToday.js');

// Remember to set Azure "Application settings" for:
// Toggl API key in 'TOGGL_API_TOKEN
// or directly in the settings.js file (not recommended).
// See https://docs.microsoft.com/en-gb/azure/app-service/configure-common for more info

// Expects projectId as a request param
module.exports = async (context, request) => {
  if (request.query.projectId.length <= 5) {
    context.log.error('No projectId query given');
    context.done();
  }

  // Load tracked entries from Toggl
  const togglResponse = await getTogglTrackedToday(request.query.projectId);

  // All done, return
  context.res = {
    // status defaults to 200 */
    body: {
      trackedDurationInSeconds: togglResponse,
    },
  };
  context.done();
};
