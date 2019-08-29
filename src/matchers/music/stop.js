const { stopCurrent, onQueueEnd, setLastState } = require('./musicUtils')

const
  REGEX = /^\!s(top)?$/i,
  NAME = 'Music Stop'

exports.name = NAME

exports.regex = REGEX 

exports.process = async msg => {
  const guild_id = setLastState(msg)
  if (guild_id) {
    stopCurrent(guild_id)
    onQueueEnd(guild_id)
  }
}