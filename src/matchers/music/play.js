const ytdl = require('ytdl-core')
const { emoji, getAttachments } = require('../../utils')
const { state, setState, onPlaySound, setLastState, showQueue, queueFromSpotify, pauseOrResume } = require('./musicUtils')

const
  REGEX = /^\!(p(lay)?|q(ueue)?)(\s+([^\n]+))?$/i,
  NAME = 'Music Play'

exports.name = NAME

exports.regex = REGEX 

const parse_media_name = async (attachment, query) => {
  if (attachment) 
    return attachment.name
  if (ytdl.validateURL(query)) {
    const basic_info = await ytdl.getBasicInfo(query)
    return basic_info.title
  }
  return query
}

const spotify_url = q => q.match(/spotify\.com\/(artist|playlist|track|album)/)

exports.process = async msg => {
  const guild_id = setLastState(msg)
  if (!guild_id)
    return

  const query = (msg.content.match(REGEX)[5] || '').trim(),
        attachment = getAttachments(msg)[0],
        queue_command = (msg.content.match(REGEX)[1] || '').match(/^q/)

  if (!(attachment || query)) {
    if (queue_command) {
      console.log('Showing queue')
      showQueue(guild_id)
      return
    }
    else {
      pauseOrResume(guild_id, 'resume')
      return
    }
  }

  setState(guild_id, { queue: state(guild_id).queue || [] })
  if (spotify_url(query))
    queueFromSpotify(guild_id, query)
  else {
    const media_name = await parse_media_name(attachment, query)
    state(guild_id).queue.push({
      attachment,
      query,
      media_name
    })
    onPlaySound(guild_id)
  }
}