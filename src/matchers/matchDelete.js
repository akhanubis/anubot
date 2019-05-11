const { deleteMatchById } = require('../db')
const { delayedDelete } = require('../utils')

const
  REGEX = /^!deletematch\s+\#(\d+)/i,
  NAME = 'Delete match'

exports.name = NAME

exports.regex = REGEX

exports.process = msg => {
  let match_id = msg.content.match(REGEX)[1]
  deleteMatchById(match_id)
  .then(deleted_entries => msg.channel.fetchMessage(deleted_entries[0].message_id))
  .then(old_msg => {
    old_msg.delete()
    delayedDelete(msg)
  })
}