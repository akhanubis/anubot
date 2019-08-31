const ytdl = require('ytdl-core')
const cheerio = require('cheerio')
const { ASSETS_BUCKET_DOMAIN, ASSETS_BUCKET, BOT_ID, ON_VOICE_IDLE_TIMEOUT_IN_S, YOUTUBE_REGION_CODE } = require('../../env')
const { emoji, latestMessages, htmlUnescape, shuffle } = require('../../utils')
const { getSpotifyTracks } = require('../../spotify')
const axios = require('axios')

const VOLUME_MULTIPLIER = 10,
      DEFAULT_VOLUME = 10

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

const queue_left_text = guild_id => `${ state(guild_id).queue.length } song${ state(guild_id).queue.length === 1 ? '' : 's' } left in queue`

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

const current_volume = guild_id => state(guild_id).volume || DEFAULT_VOLUME

const reply = (guild_id, message, log = true) => {
  if (log)
    console.log(`[${ guild_id }]`, message)
  return state(guild_id).last_text_channel.send(message)
}

const state = guild_id => global.MUSIC_STATE[guild_id]

const setState = (guild_id, new_state) => {
  global.MUSIC_STATE[guild_id] = global.MUSIC_STATE[guild_id] || {}
  global.MUSIC_STATE[guild_id] = { ...global.MUSIC_STATE[guild_id], ...new_state }
}

const setLastState = msg => {
  const voice_channel = msg.member.voice.channel,
        text_channel = msg.channel,
        guild_id = text_channel.guild.id
  if (!voice_channel) {
    text_channel.send(`You are not in a voice channel ${ emoji('peperetarded') }`)
    return
  }
  setState(guild_id, {
    last_text_channel: text_channel,
    last_voice_channel: voice_channel
  })
  return guild_id
}

const stopCurrent = guild_id => {
  const current_stream = state(guild_id).stream
  if (current_stream)
    current_stream.destroy()
}

const joinVoice = async (guild_id, force) => {
  const current_vc = get_current_voice_connection(guild_id)
  if (force || !current_vc)
    return await state(guild_id).last_voice_channel.join()
  return current_vc
}

const playNext = async (guild_id, skip = 1) => {
  clearTimeout(state(guild_id).leave_timeout)
  const next_song = (state(guild_id).queue || []).splice(0, skip).pop()
  if (!next_song) {
    onPlaybackEnd(guild_id)
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
        reply(guild_id, `No matching video found for ${ query } ${ emoji('pepothink') }`, false)
        playNext(guild_id)
        return
      }
    }
  }
  const connection = await joinVoice(guild_id),
        dispatcher = connection.play(media)
  dispatcher.setVolume(current_volume(guild_id) / VOLUME_MULTIPLIER)
  dispatcher.once('end', _ => playNext(guild_id))
  media_name = htmlUnescape(media_name)
  setState(guild_id, { stream: dispatcher, media_name })

  const last_message = state(guild_id).last_now_playing_message,
        [new_message, _] = await Promise.all([
          reply(guild_id, `>>> Now playing ${ media_name }\n${ queue_left_text(guild_id) }`),
          last_message ? last_message.delete().catch(console.log) : Promise.resolve()
        ])
  setState(guild_id, { last_now_playing_message: new_message })
}

const onPlaybackEnd = (guild_id, force) => {
  setState(guild_id, {
    stream: null,
    media_name: null,
    queue: [],
    leave_timeout: setTimeout(_ => {
      const vc = get_current_voice_connection(guild_id)
      if (vc) {
        vc.channel.leave()
        if (!force)
          reply(guild_id, "Ok, it looks like I'm not needed anymore :( Anubot out", false)
      }
    }, force ? 0 : ON_VOICE_IDLE_TIMEOUT_IN_S * 1000)
  })
}

const showQueue = guild_id => {
  let output = queue_left_text(guild_id),
      q = state(guild_id).queue,
      now_playing = state(guild_id).media_name
  if (now_playing)
    output = `Now playing ${ now_playing }\n${ output }`
  if (q.length)
    output = `${ output }\n\`\`\`\n${ q.map(song => song.media_name).join("\n") }\n\`\`\``
  reply(guild_id, `>>> ${ output }`)
}

const onPlaySound = guild_id => {
  if (state(guild_id).stream) {
    const q = state(guild_id).queue,
          queued_text = `>>> Queued ${ q[q.length - 1].media_name }\n${ queue_left_text(guild_id) }`
    reply(guild_id, queued_text)
  }
  else
    playNext(guild_id)
}

const queueFromSpotify = async (guild_id, url) => {
  const songs = await getSpotifyTracks(url)
  for (let s of songs)
    state(guild_id).queue.push({
      query: s,
      media_name: s
    })

  if (state(guild_id).stream) {
    const queued_text = songs.length === 1 ? `Queued ${ songs[0] }\n${ queue_left_text(guild_id) }` : `Queued ${ songs.length } songs\n${ queue_left_text(guild_id) }`
    reply(guild_id, `>>> ${ queued_text }`)
  }
  else
    playNext(guild_id)
}

const setVolume = (guild_id, volume) => {
  const dispatcher = (get_current_voice_connection(guild_id) || {}).dispatcher
  if (volume !== null) {
    setState(guild_id, { volume: volume })
    if (dispatcher)
      dispatcher.setVolume(volume / VOLUME_MULTIPLIER)
    reply(guild_id, `Volume set to ${ volume }`)
  }
  else
    reply(guild_id, `Current volume is ${ current_volume(guild_id) }`)
}

const pauseOrResume = (guild_id, command) => {
  const dispatcher = (get_current_voice_connection(guild_id) || {}).dispatcher
  if (dispatcher)
    dispatcher[command]()
  else
    reply(guild_id, `I'm not playing anything ${ emoji('peperetarded') }`)
}

const getLyrics = async (artist, title) => {
  const path = `${ artist }-${ title }-lyrics`.toLowerCase().replace(/ñ/g, 'n').replace(/[\s-]+/g, '-').replace(/[^-a-z0-9]+/g, ''),
        result = await axios.get(`https://genius.com/${ path }`).catch(console.log)
  console.log('Fetching lyrics from ', path)
  if (!result)
    return
  const parser = cheerio.load(result.data)
  parser('.lyrics a').each(function() {
    parser(this).replaceWith(parser(this).html())
  })
  let html = parser('.lyrics').html()
  html = ['<!--sse-->', '<!--/sse-->', '<p>', '</p>'].reduce((out, to_remove) => out.replace(to_remove, ''), html)
  html = html.replace(/<\/?i>/g, '*').replace(/<\/?b>/g, '**').replace(/<br>/g, "\n").replace(/\n\n/g, "\n").trim()
  return htmlUnescape(html)
}

const shuffleQueue = guild_id => {
  shuffle(state(guild_id).queue)
  reply(guild_id, 'Queue shuffled', false)
}

module.exports = {
  reply: reply,
  state: state,
  setState: setState,
  setLastState: setLastState,
  stopCurrent: stopCurrent,
  joinVoice: joinVoice,
  playNext: playNext,
  onPlaybackEnd: onPlaybackEnd,
  showQueue: showQueue,
  onPlaySound: onPlaySound,
  queueFromSpotify: queueFromSpotify,
  setVolume: setVolume,
  pauseOrResume: pauseOrResume,
  getLyrics: getLyrics,
  shuffleQueue: shuffleQueue
}