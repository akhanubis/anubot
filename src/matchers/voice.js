const ytdl = require('ytdl-core')
const { ASSETS_BUCKET_DOMAIN, ASSETS_BUCKET } = require('../env')
const { emoji, getAttachments } = require('../utils')

const
  REGEX = /^\!play(\s+([^\n]+))?$/i,
  NAME = 'Voice Test',
  ON_IDLE_TIMEOUT = 300000

exports.name = NAME

exports.regex = REGEX 

let leave_timeout

const get_cached_video = async youtube_id => {
  const result = await global.s3.listObjectsV2({
    Bucket: ASSETS_BUCKET,
    Prefix: `ytdl_cache/${ youtube_id }`,
  }).promise()
  if (result.Contents.length)
    return `${ ASSETS_BUCKET_DOMAIN }/${ result.Contents[0].Key }`
}

const save_to_cache = (youtube_id, media) => {
  const buffers = []
  media.on('data', chunk => buffers.push(chunk))
  media.on('end', _ => {
    global.s3.putObject({
      Bucket: ASSETS_BUCKET,
      Key: `ytdl_cache/${ youtube_id }`,
      ACL: 'public-read',
      Body: Buffer.concat(buffers)
    }).promise()
    .then(_ => {
      console.log('Video stored in cache')
      buffers = []
    })
  })
}

exports.process = async msg => {
  const voice_channel = msg.member.voice.channel,
        filename = (msg.content.match(REGEX)[2] || '').trim(),
        attachment = getAttachments(msg)[0]
  if (!voice_channel) {
    msg.channel.send(`You are not in a voice channel ${ emoji('pepothink') }`)
    return
  }
  if (!(attachment || filename)) {
    msg.channel.send(`Missing media ${ emoji('pepothink') }`)
    return
  }

  let media, media_name
  if (attachment)
    media = attachment.url
  else if (ytdl.validateURL(filename)) {
    const yt_id = ytdl.getVideoID(filename),
          cached_video = await get_cached_video(yt_id)
    media = cached_video || ytdl(filename, { quality: 'highestaudio' })
    if (!cached_video) {
      media_name = `YT ${ yt_id }`
      save_to_cache(yt_id, media)
    }
  }
  else
    media = `${ ASSETS_BUCKET_DOMAIN }/sounds/${ msg.channel.guild.id }/${ filename }.mp3`
  console.log('Playing', media_name || media)
  clearTimeout(leave_timeout)
  const connection = await voice_channel.join()
  connection.play(media)
  leave_timeout = setTimeout(_ => voice_channel.leave(), ON_IDLE_TIMEOUT)
}