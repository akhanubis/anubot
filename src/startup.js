const AWS = require('aws-sdk')
const { TranslationServiceClient } = require('@google-cloud/translate').v3beta1
const { google } = require('googleapis')
const SpotifyWebApi = require('spotify-web-api-node')
const { BEANSTALK, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_PROJECT_ID, GOOGLE_API_KEY, SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = require('./env')

const renew_spotify_token = _ => global.spotify.clientCredentialsGrant().then(data =>global.spotify.setAccessToken(data.body['access_token']))

exports.initAWS = _ => {
  if (!BEANSTALK) {
    AWS.config.update({
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
      region: AWS_REGION
    })
  }
  global.db = new AWS.DynamoDB.DocumentClient()
  global.s3 = new AWS.S3()
}

exports.initGoogle = _ => {
  global.translation = new TranslationServiceClient({
    credentials: {
      client_email: GOOGLE_CLIENT_EMAIL,
      private_key: GOOGLE_PRIVATE_KEY,
      projectId: GOOGLE_PROJECT_ID
    }
  })

  global.youtube = google.youtube({
    version: 'v3',
    auth: GOOGLE_API_KEY
  })
}

exports.initSpotify = _ => {
  global.spotify = new SpotifyWebApi({
    clientId: SPOTIFY_CLIENT_ID,
    clientSecret: SPOTIFY_CLIENT_SECRET
  })
  renew_spotify_token()
  setInterval(renew_spotify_token, 3000000)
}