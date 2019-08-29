const { emoji } = require('../../utils')
const { state, setState, onPlaySound, setLastState } = require('./musicUtils')

const
  REGEX = /^\!sound\s+([^\n]+)$/i,
  NAME = 'Music Sound'

exports.name = NAME

exports.regex = REGEX 

exports.process = async msg => {
  const guild_id = setLastState(msg)
  if (!guild_id)
    return

  const text_channel = state(guild_id).last_text_channel,
        filename = (msg.content.match(REGEX)[1] || '').trim()

  if (!filename) {
    text_channel.send(`Missing media ${ emoji('pepothink') }`)
    return
  }
  const media_name = filename
  setState(guild_id, { queue: state(guild_id).queue || [] })
  state(guild_id).queue.push({
    filename,
    media_name
  })
  onPlaySound(guild_id)
}