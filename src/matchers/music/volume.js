const { setVolume, setLastState } = require('./musicUtils')

const
  REGEX = /^\!v(olume)?(\s+([\d.]+))?$/i,
  NAME = 'Music Volume'

exports.name = NAME

exports.regex = REGEX 

exports.process = async msg => {
  const guild_id = setLastState(msg)
  if (guild_id) {
    const volume = msg.content.match(REGEX)[3]
    setVolume(guild_id, volume ? parseFloat(volume) : null)
  }
}