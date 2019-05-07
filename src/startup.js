const AWS = require('aws-sdk')
const { BEANSTALK, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION } = require('./env')

exports.initAWS = _ => {
  if (!BEANSTALK) {
    AWS.config.update({
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
      region: AWS_REGION,
      endpoint: `https://dynamodb.${ AWS_REGION }.amazonaws.com`
    })
  }
  global.db = new AWS.DynamoDB.DocumentClient()
}