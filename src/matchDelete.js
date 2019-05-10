const { deleteMatchByMessageId } = require('./db')
const { delayedDelete } = require('./utils')

const
  REGEX = /!deletematch\s+\#(\d+)/i,
  NAME = 'Delete match'

exports.name = NAME

exports.regex = REGEX

exports.process = msg => {
  let message_id = msg.content.match(REGEX)[1]
  deleteMatchByMessageId(message_id)
  .then(_ => msg.channel.fetchMessage(message_id))
  .then(old_msg => old_msg.delete())
  .then(_ => delayedDelete(msg))
}