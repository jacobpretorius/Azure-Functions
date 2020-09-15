# Jacob's Azure Functions

A collection of Azure functions in use by my personal cloud of *stuff*.

## Notes

In VS code make sure to have the Azure Functions extension installed, VS will prompt you to install it. When you start debugging it will also prompt to install `azure-functions-core-tools` locally to enable the virtual Azure environment.

### Functions

**Toggl project tracked check**
Checks a given project in Toggl to see how much time has been logged to it for the current day.

**Toggl start sleeping In timer**
The Azure re-implementation of [toggl-sleeping-in](https://github.com/jacobpretorius/toggl-sleeping-in) which used to run on the ex-wonderful webtask.io. Currently disabled in the function.json file.

**Toggl => Startpage Sync**
The sync job that checks Toggl for daily read goal and updates my personal Startpage API.

**Monzo payment webhook**
Called by Monzo every time I do transaction, which then triggers my Telegram bot to give me lip on my bad spending choices.

**Todoist get items today**
Get the due tasks for the current day.

### Installation

You need Azurite for storage emulation, the plugin will auto install so you can use it to start the "Azurite blob service" in the VS toolbar.

Update your keys in `src/settings.js` for local debugging or add to Azure ENV variables for hosted running.

Configure run times in `src/job/function.json` using the `"schedule": "* * * * * *"` cron setting.

### Todo

- Remove Request usage & replace with Axios.
