# Start Toggl Sleeping In Timer

The Azure re-implementation of [toggl-sleeping-in](https://github.com/jacobpretorius/toggl-sleeping-in) which used to run on the ex-wonderful webtask.io.

# Installation
Update your `API_TOKEN` and `PROJECT_ID` keys in `StartTogglSleepingInTimer/index.js`.

By default it runs every day at 6:30am (server time), you can change this in `StartTogglSleepingInTimer/function.json` using the `"schedule": "0 30 6 * * *"` cron setting.

## Wishlist
* Implement [key vault](https://daniel-krzyczkowski.github.io/Integrate-Key-Vault-Secrets-With-Azure-Functions/) I guess.