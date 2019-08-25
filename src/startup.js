const AWS = require('aws-sdk')
const { TranslationServiceClient } = require('@google-cloud/translate').v3beta1
const { BEANSTALK, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_PROJECT_ID } = require('./env')

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
}