const ytdl = require('ytdl-core')
const { ASSETS_BUCKET_DOMAIN, ASSETS_BUCKET, BOT_ID, ON_VOICE_IDLE_TIMEOUT_IN_S, YOUTUBE_REGION_CODE } = require('../../env')
const { emoji, latestMessages } = require('../../utils')
const { getSpotifyTracks } = require('../../spotify')

global.MUSIC_STATE = {}

const get_cached_video = async youtube_id => {
  const result = await global.s3.listObjectsV2({
    Bucket: ASSETS_BUCKET,
    Prefix: `ytdl_cache/${ youtube_id }`,
  }).promise()
  if (result.Contents.length)
    return `${ ASSETS_BUCKET_DOMAIN }/${ result.Contents[0].Key }`
}

const save_to_cache = (youtube_id, media, guild_id) => {
  /* bot just joined, skip saving */
  if (!get_current_voice_connection(guild_id))
    return media
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

const get_current_voice_connection = guild_id => global.client.voice.connections.get(guild_id)

const queue_left_text = guild_id => `${ exports.state(guild_id).queue.length } song${ exports.state(guild_id).queue.length === 1 ? '' : 's' } left in queue`

const get_video_by_id = async (guild_id, yt_id) => {
  const cached_video = await get_cached_video(yt_id)
  return cached_video || save_to_cache(yt_id, ytdl(yt_id, { quality: 'highestaudio' }), guild_id)
}

const search_yt_video = async query => {
  const response = await global.youtube.search.list({
          part: 'snippet',
          q: query,
          type: 'video',
          regionCode: YOUTUBE_REGION_CODE
        }),
        first_result = (response.data.items || [])[0]
  return first_result
}

exports.state = guild_id => global.MUSIC_STATE[guild_id]

exports.setState = (guild_id, new_state) => {
  global.MUSIC_STATE[guild_id] = global.MUSIC_STATE[guild_id] || {}
  global.MUSIC_STATE[guild_id] = { ...global.MUSIC_STATE[guild_id], ...new_state }
}

exports.setLastState = msg => {
  const voice_channel = msg.member.voice.channel,
        text_channel = msg.channel,
        guild_id = text_channel.guild.id
  if (!voice_channel) {
    text_channel.send(`You are not in a voice channel ${ emoji('pepothink') }`)
    return
  }
  exports.setState(guild_id, {
    last_text_channel: text_channel,
    last_voice_channel: voice_channel
  })
  return guild_id
}

exports.stopCurrent = guild_id => {
  const current_stream = exports.state(guild_id).stream
  if (current_stream)
    current_stream.destroy()
}

exports.joinVoice = async (guild_id, force) => {
  const current_vc = get_current_voice_connection(guild_id)
  if (force || !current_vc)
    return await exports.state(guild_id).last_voice_channel.join()
  return current_vc
}

exports.playNext = async guild_id => {
  clearTimeout(exports.state(guild_id).leave_timeout)
  const next_song = (exports.state(guild_id).queue || []).shift()
  if (!next_song) {
    exports.onPlaybackEnd(guild_id)
    return
  }
  let { attachment, filename, query, media_name } = next_song
  let media
  if (attachment)
    media = attachment.url
  else if (filename)
    media = `${ ASSETS_BUCKET_DOMAIN }/sounds/${ guild_id }/${ filename }.mp3`
  else {
    if (ytdl.validateURL(query)) {
      const yt_id = ytdl.getVideoID(query)
      media = await get_video_by_id(guild_id, yt_id)
    }
    else {
      const result = await search_yt_video(query)
      if (result) {
        media = await get_video_by_id(guild_id, result.id.videoId)
        media_name = result.snippet.title
      }
      else {
        exports.state(guild_id).last_text_channel.send(`No matching video found for ${ query } ${ emoji('pepothink') }`)
        exports.playNext(guild_id)
        return
      }
    }
  }
  const connection = await exports.joinVoice(guild_id),
        dispatcher = connection.play(media)
  dispatcher.once('end', _ => exports.playNext(guild_id))
  exports.setState(guild_id, { stream: dispatcher, media_name })

  const now_playing_text = `Now playing ${ media_name }\n${ queue_left_text(guild_id) }`
  console.log(now_playing_text)
  const last_message = (await latestMessages(exports.state(guild_id).last_text_channel, 1))[0]
  if (last_message.author.id === BOT_ID && last_message.content.match(/^Now playing/))
    last_message.edit(now_playing_text)
  else
    exports.state(guild_id).last_text_channel.send(now_playing_text)  
}

exports.onPlaybackEnd = (guild_id, force) => {
  exports.setState(guild_id, {
    stream: null,
    media_name: null,
    queue: [],
    leave_timeout: setTimeout(_ => {
      const vc = get_current_voice_connection(guild_id)
      if (vc) {
        vc.channel.leave()
        if (!force)
          exports.state(guild_id).last_text_channel.send("Ok, it looks like I'm not needed anymore :( Anubot out")
      }
    }, force ? 0 : ON_VOICE_IDLE_TIMEOUT_IN_S * 1000)
  })
}

exports.showQueue = guild_id => {
  let output = queue_left_text(guild_id),
      q = exports.state(guild_id).queue,
      now_playing = exports.state(guild_id).media_name
  if (now_playing)
    output = `Now playing ${ now_playing }\n${ output }`
  if (q.length)
    output = `${ output }\n\`\`\`\n${ q.map(song => song.media_name).join("\n") }\n\`\`\``
  console.log(output)
  exports.state(guild_id).last_text_channel.send(output)
}

exports.onPlaySound = guild_id => {
  if (exports.state(guild_id).stream) {
    const q = exports.state(guild_id).queue,
          queued_text = `Queued ${ q[q.length - 1].media_name }\n${ queue_left_text(guild_id) }`
    console.log(queued_text)
    exports.state(guild_id).last_text_channel.send(queued_text)
  }
  else
    exports.playNext(guild_id)
}

exports.queueFromSpotify = async (guild_id, url) => {
  const songs = await getSpotifyTracks(url)
  for (let s of songs)
    exports.state(guild_id).queue.push({
      query: s,
      media_name: s
    })

  if (exports.state(guild_id).stream) {
    const queued_text = songs.length === 1 ? `Queued ${ songs[0] }\n${ queue_left_text(guild_id) }` : `Queued ${ songs.length } songs\n${ queue_left_text(guild_id) }`
    console.log(queued_text)
    exports.state(guild_id).last_text_channel.send(queued_text)
  }
  else
    exports.playNext(guild_id)
}