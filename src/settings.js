module.exports = {
  TOGGL : {
    'API_TOKEN' : process.env.TOGGL_API_TOKEN || '',
    'SLEEPING_IN_PROJECT_ID' : process.env.TOGGL_SLEEPING_IN_PROJECT_ID || ''
  },

  TODOIST : {
    'API_TOKEN' : process.env.TODOIST_API_TOKEN || ''
  },

  STARTPAGE : {
    'URL' : process.env.STARTPAGE_URL || '',
    'KEY' : process.env.STARTPAGE_KEY || '',
    'GOAL_PROJECT_ID' : process.env.STARTPAGE_GOAL_PROJECT_ID || '',
    'GOAL_MINUTES' : process.env.STARTPAGE_GOAL_MINUTES || 0
  },

  JARVIS : {
    'URL' : process.env.JARVIS_URL || '',
    'KEY' : process.env.JARVIS_KEY || ''
  },

  ECOLOGI : {
    'USER' : process.env.ECOLOGI_USER || ''
  }
}
