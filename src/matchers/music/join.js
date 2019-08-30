const { joinVoice, setLastState } = require('./musicUtils')

const
  REGEX = /^\!join$/i,
  NAME = 'Music Join'

exports.name = NAME

exports.regex = REGEX 

exports.process = async msg => {
  const guild_id = setLastState(msg)
  if (guild_id)
    joinVoice(guild_id, true)
}