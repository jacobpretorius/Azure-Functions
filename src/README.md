# Jacob's Azure Functions

## Functions
**Start Toggl sleeping In timer**
The Azure re-implementation of [toggl-sleeping-in](https://github.com/jacobpretorius/toggl-sleeping-in) which used to run on the ex-wonderful webtask.io.

**Toggl Startpage Sync**
The sync job that checks Toggl for daily read goal and updates my Startpage API.

# Installation
Update your keys in `src/settings.js` for local debugging or add to Azure ENV variables for hosted running.

Configure run times in `src/job/function.json` using the `"schedule": "* * * * * *"` cron setting.
