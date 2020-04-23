const { stopCurrent, playNext, setLastState } = require('./musicUtils')

const
  REGEX = /^\!(n(ext)?|s(kip)?)(\s+([\d.]+))?$/i,
  NAME = 'Music Next'

exports.name = NAME

exports.regex = REGEX 

exports.process = async msg => {
  const guild_id = setLastState(msg)
  if (guild_id) {
    const skip_amount = parseInt(msg.content.match(REGEX)[5] || '1')
    stopCurrent(guild_id)
    playNext(guild_id, skip_amount)
  }
}