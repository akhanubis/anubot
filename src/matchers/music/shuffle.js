const { shuffleQueue, setLastState } = require('./musicUtils')

const
  REGEX = /^\!shuffle$/i,
  NAME = 'Music Shuffle'

exports.name = NAME

exports.regex = REGEX 

exports.process = async msg => {
  const guild_id = setLastState(msg)
  if (guild_id)
    shuffleQueue(guild_id)
}