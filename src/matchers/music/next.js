const { stopCurrent, playNext, setLastState } = require('./musicUtils')

const
  REGEX = /^\!n(ext)?$/i,
  NAME = 'Music Next'

exports.name = NAME

exports.regex = REGEX 

exports.process = async msg => {
  const guild_id = setLastState(msg)
  if (guild_id) {
    stopCurrent(guild_id)
    playNext(guild_id)
  }
}