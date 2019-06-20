const AWS = require('aws-sdk')
const codePipeline = new AWS.CodePipeline()
const s3 = new AWS.S3()
const Discord = require('discord.js')
const AdmZip = require('adm-zip')

if (!process.env.PRODUCTION)
  require('dotenv').config()

const PATCH_NOTES_CHANNELS = [
  '469168969761161234',
  '456598885511593985'
]

const putJobSuccess = (job_id, context) => {
  codePipeline.putJobSuccessResult({ jobId: job_id }, err => {
    if (err)
      context.fail(err)
    else
      context.succeed()
  })
}

const putJobFailure = (job_id, context, message) => {
  const params = {
    jobId: job_id,
    failureDetails: {
      message: JSON.stringify(message),
      type: 'JobFailed',
      externalExecutionId: context.invokeid
    }
  }
  codePipeline.putJobFailureResult(params, _ => context.fail(message))
}

const broadcastPatchNotes = (code_s3_location, on_success, on_error) => {
  try {
    const { bucketName: code_bucket, objectKey: code_key } = code_s3_location
    const client = new Discord.Client()
    client.on('ready', async _ => {
      const { Body: zipped_code } = await s3.getObject({
          Bucket: code_bucket,
          Key: code_key
      }).promise()
      const source_code = new AdmZip(zipped_code),
            patch_notes = source_code.readAsText('patch_notes')
      if (patch_notes) {
        console.log(`Broadcasting to ${ PATCH_NOTES_CHANNELS.length } channels`)
        await Promise.all(PATCH_NOTES_CHANNELS.map(id => client.channels.get(id).send(patch_notes)))
      }
      else
        console.log('No patch notes found')
      on_success()
    })
    client.login(process.env.DISCORD_TOKEN)
  }
  catch(e) {
    on_error(e)
  }
}

exports.handler = async (event, context) => {
  const job_id = event['CodePipeline.job'].id
  broadcastPatchNotes(
    event['CodePipeline.job'].data.inputArtifacts[0].location.s3Location,
    _ => putJobSuccess(job_id, context),
    e => putJobFailure(job_id, context, e)
  )
  await new Promise(r => setTimeout(r, 20000))
}