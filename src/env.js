if (!process.env.BEANSTALK)
  require('dotenv').config()
  
module.exports = {
  BEANSTALK: process.env.BEANSTALK,
  DISCORD_TOKEN: process.env.DISCORD_TOKEN,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_REGION: process.env.AWS_REGION,
  MATCHES_TABLE: process.env.MATCHES_TABLE,
  GITHUB_REPOSITORY: process.env.GITHUB_REPOSITORY,
  ACTIVITY_REFRESH_INTERVAL_IN_S: process.env.ACTIVITY_REFRESH_INTERVAL_IN_S || 600
}