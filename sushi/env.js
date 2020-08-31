if (!process.env.BEANSTALK)
  require('dotenv').config()
  
module.exports = {
  BEANSTALK: process.env.BEANSTALK,
  SUSHI_DISCORD_TOKEN: process.env.SUSHI_DISCORD_TOKEN,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_REGION: process.env.AWS_REGION,
  INFURA_PROJECT_ID: process.env.INFURA_PROJECT_ID
}