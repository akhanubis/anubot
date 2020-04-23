const { stopCurrent, onPlaybackEnd, setLastState } = require('./musicUtils')

const
  REGEX = /^\!leave$/i,
  NAME = 'Music Leave'

exports.name = NAME

exports.regex = REGEX 

exports.process = async msg => {
  const guild_id = setLastState(msg)
  if (guild_id) {
    stopCurrent(guild_id)
    onPlaybackEnd(guild_id, true)
  }
}