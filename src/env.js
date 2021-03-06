if (!process.env.BEANSTALK)
  require('dotenv').config()
  
module.exports = {
  BEANSTALK: process.env.BEANSTALK,
  DISCORD_TOKEN: process.env.DISCORD_TOKEN,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_REGION: process.env.AWS_REGION,
  MATCHES_TABLE: process.env.MATCHES_TABLE,
  TAGS_TABLE: process.env.TAGS_TABLE,
  GITHUB_REPOSITORY: process.env.GITHUB_REPOSITORY,
  ACTIVITY_REFRESH_INTERVAL_IN_S: process.env.ACTIVITY_REFRESH_INTERVAL_IN_S || 600,
  ALLOWED_SERVERS: process.env.ALLOWED_SERVERS.split('__NEW_LINE__'),
  ALLOWED_DM_USERS: process.env.ALLOWED_DM_USERS.split('__NEW_LINE__'),
  ADMIN_USER: process.env.ADMIN_USER,
  MATCHES_TABLE_MATCH_ID_INDEX: process.env.MATCHES_TABLE_MATCH_ID_INDEX,
  TAGS_TABLE_GUILD_TAG_ID_INDEX: process.env.TAGS_TABLE_GUILD_TAG_ID_INDEX,
  TAGS_TABLE_SCANNABLE_INDEX: process.env.TAGS_TABLE_SCANNABLE_INDEX,
  TODOS_TABLE: process.env.TODOS_TABLE,
  TODOS_TABLE_USER_ID_INDEX: process.env.TODOS_TABLE_USER_ID_INDEX,
  GOOGLE_CLIENT_EMAIL: process.env.GOOGLE_CLIENT_EMAIL,
  GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY.replace(/__NEW_LINE__/g, "\n"),
  GOOGLE_PROJECT_ID: process.env.GOOGLE_PROJECT_ID,
  ASSETS_BUCKET: process.env.S3_BUCKET,
  ASSETS_BUCKET_DOMAIN: `https://${ process.env.S3_BUCKET }.s3.amazonaws.com`,
  BOT_ID: `${ process.env.BOT_ID }`,
  ON_VOICE_IDLE_TIMEOUT_IN_S: process.env.ON_VOICE_IDLE_TIMEOUT_IN_S || 300,
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
  SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
  YOUTUBE_REGION_CODE: process.env.YOUTUBE_REGION_CODE
}