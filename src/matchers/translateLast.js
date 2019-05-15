const { translate } = require('../google')
const { previousMessage } = require('../utils')

const
  REGEX = /^\!translatelast\s*$/i,
  NAME = 'Translate Last'

exports.name = NAME

exports.regex = REGEX

exports.process = async msg => {
  let prev_message = await previousMessage(msg),
      translation = await translate(prev_message.content)
  msg.channel.send(translation)
}