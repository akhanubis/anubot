const { pauseOrResume, setLastState } = require('./musicUtils')

const
  REGEX = /^\!pause$/i,
  NAME = 'Music Pause'

exports.name = NAME

exports.regex = REGEX 

exports.process = async msg => {
  const guild_id = setLastState(msg)
  if (guild_id) 
    pauseOrResume(guild_id, 'pause')
}