const getTogglTrackedToday = require('../utils/GetTogglTrackedToday.js');
const getTodoistItemsToday = require('../utils/GetTodoistItemsToday.js');

// Remember to set Azure "Application settings" for:
// Todoist API key in 'TODOIST_API_TOKEN'
// Toggl API key in 'TOGGL_API_TOKEN
// or directly in the settings.js file (not recommended).
// See https://docs.microsoft.com/en-gb/azure/app-service/configure-common for more info

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
