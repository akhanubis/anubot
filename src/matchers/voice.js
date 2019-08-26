const ytdl = require('ytdl-core')
const { ASSETS_BUCKET_DOMAIN, ASSETS_BUCKET, BOT_ID } = require('../env')
const { emoji, getAttachments, latestMessages } = require('../utils')

const
  REGEX = /^\!play(\s+([^\n]+))?$/i,
  NAME = 'Voice Test',
  ON_IDLE_TIMEOUT = 300000,
  NOW_PLAYING = {},
  QUEUE = {},
  LAST_TEXT_CHANNEL = {},
  LAST_VOICE_CHANNEL = {},
  LEAVE_TIMEOUT = {}

exports.name = NAME

exports.regex = REGEX 

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
      buffers.splice(0, buffers.length)
    })
  })
  return media
}

const queue_left_text = guild_id => `${ QUEUE[guild_id].length } song${ QUEUE[guild_id].length === 1 ? '' : 's' } left in queue`

const play_next = async guild_id => {
  const next_song = QUEUE[guild_id].shift()
  if (!next_song) {
    NOW_PLAYING[guild_id] = null
    const current_voice_channel = (global.client.voice.connections[guild_id] || {}).channel
    if (current_voice_channel)
      LEAVE_TIMEOUT[guild_id] = setTimeout(_ => current_voice_channel.leave(), ON_IDLE_TIMEOUT)
    return
  }
  const { attachment, filename, media_name } = next_song
  let media
  if (attachment)
    media = attachment.url
  else if (ytdl.validateURL(filename)) {
    const yt_id = ytdl.getVideoID(filename),
          cached_video = await get_cached_video(yt_id)
    media = cached_video || save_to_cache(yt_id, ytdl(filename, { quality: 'highestaudio' }))
  }
  else
    media = `${ ASSETS_BUCKET_DOMAIN }/sounds/${ guild_id }/${ filename }.mp3`
  clearTimeout(LEAVE_TIMEOUT[guild_id])
  const connection = await LAST_VOICE_CHANNEL[guild_id].join()
  NOW_PLAYING[guild_id] = media_name
  const now_playing_text = `Now playing ${ NOW_PLAYING[guild_id] }\n${ queue_left_text(guild_id) }`
  console.log(now_playing_text)
  const last_message = (await latestMessages(LAST_TEXT_CHANNEL[guild_id], 1))[0]
  if (last_message.author.id === BOT_ID && last_message.content.match(/^Now playing/))
    last_message.edit(now_playing_text)
  else
    LAST_TEXT_CHANNEL[guild_id].send(now_playing_text)
  const dispatcher = connection.play(media)
  dispatcher.once('end', _ => play_next(guild_id))
}

const parse_media_name = async (attachment, filename) => {
  if (attachment) 
    return attachment.name
  if (ytdl.validateURL(filename)) {
    const basic_info = await ytdl.getBasicInfo(filename)
    return basic_info.title
  }
  return filename
}

exports.process = async msg => {
  const voice_channel = msg.member.voice.channel,
        text_channel = msg.channel,
        guild_id = text_channel.guild.id,
        filename = (msg.content.match(REGEX)[2] || '').trim(),
        attachment = getAttachments(msg)[0]
  if (!voice_channel) {
    text_channel.send(`You are not in a voice channel ${ emoji('pepothink') }`)
    return
  }
  if (!(attachment || filename)) {
    text_channel.send(`Missing media ${ emoji('pepothink') }`)
    return
  }
  const media_name = await parse_media_name(attachment, filename)
  QUEUE[guild_id] = QUEUE[guild_id] || []
  QUEUE[guild_id].push({
    attachment: attachment,
    filename: filename,
    media_name
  })
  LAST_TEXT_CHANNEL[guild_id] = text_channel
  LAST_VOICE_CHANNEL[guild_id] = voice_channel
  if (NOW_PLAYING[guild_id]) {
    const queued_text = `Queued ${ media_name }\n${ queue_left_text(guild_id) }`
    console.log(queued_text)
    text_channel.send(queued_text)
  }
  else
    await play_next(guild_id)
}